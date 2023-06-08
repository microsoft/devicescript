#include "devs_internal.h"

#define LOG JD_LOG
#define VLOG JD_NOLOG

void devs_fiber_yield(devs_ctx_t *ctx) {
    if (ctx->curr_fn && devs_trace_enabled(ctx)) {
        devs_trace_ev_fiber_yield_t ev = {.pc = ctx->curr_fn->pc};
        devs_trace(ctx, DEVS_TRACE_EV_FIBER_YIELD, &ev, sizeof(ev));
    }

    ctx->curr_fn = NULL;
    ctx->curr_fiber = NULL;
}

static void devs_fiber_activate(devs_fiber_t *fiber, devs_activation_t *act) {
    devs_ctx_t *ctx = fiber->ctx;
    fiber->activation = act;
    if (!devs_is_suspended(ctx)) {
        ctx->curr_fn = act;
        JD_ASSERT(act->maxpc > 0);
    }
}

STATIC_ASSERT(DEVS_MAX_CALL_DEPTH + 10 < 1ULL << (sizeof(((devs_fiber_t *)NULL)->stack_depth) * 8));

int devs_fiber_call_function(devs_fiber_t *fiber, unsigned numparams, devs_array_t *rest) {
    devs_ctx_t *ctx = fiber->ctx;

    value_t *argp = ctx->the_stack;
    JD_ASSERT(numparams + 1 == ctx->stack_top_for_gc);

    value_t fn = *argp;
    devs_activation_t *closure;
    int fidx = devs_get_fnidx(ctx, fn, argp, &closure);
    if (fidx < 0) {
        devs_throw_type_error(ctx, "%s called", devs_show_value(ctx, fn));
        return -1;
    }

    // devs_log_value(ctx, "fn", fn);
    // devs_log_value(ctx, "self", *argp);

    int bltin = fidx - DEVS_FIRST_BUILTIN_FUNCTION;
    if (bltin >= 0) {
        JD_ASSERT(bltin < devs_num_builtin_functions);
        const devs_builtin_function_t *h = &devs_builtin_functions[bltin];
        if (rest) {
            numparams = rest->length;
            if (numparams > DEVS_MAX_STACK_DEPTH - 1) {
                devs_throw_not_supported_error(ctx, "large parameters array");
                return -3;
            } else {
                ctx->stack_top_for_gc = numparams + 1;
                memcpy(ctx->the_stack + 1, rest->data, numparams * sizeof(value_t));
            }
        }
        if (numparams < h->num_args) {
            unsigned num = h->num_args - numparams;
            memset(argp + 1 + numparams, 0, num * sizeof(value_t));
        }
        JD_ASSERT(!(h->flags & DEVS_BUILTIN_FLAG_IS_PROPERTY));
        fiber->ret_val = devs_undefined;
        if (h->flags & DEVS_BUILTIN_FLAG_IS_CTOR) {
            if (devs_is_map(devs_value_to_gc_obj(ctx, *argp))) {
                // devs_log_value(ctx, "no attach", *argp);
            } else {
                // __proto__ to be set by the built-in function
                devs_map_t *m = devs_map_try_alloc(ctx, NULL);
                *argp = devs_value_from_gc_obj(ctx, m);
                // devs_log_value(ctx, "do attach", *argp);
            }
        }
        h->handler.meth(ctx);
        return 0;
    }

    if (fiber->stack_depth > DEVS_MAX_CALL_DEPTH) {
        devs_panic(ctx, DEVS_PANIC_STACK_OVERFLOW);
        return -3;
    }
    fiber->stack_depth++;

    const devs_function_desc_t *func = devs_img_get_function(ctx->img, fidx);
    devs_activation_t *callee =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_ACTIVATION,
                           sizeof(devs_activation_t) + sizeof(value_t) * func->num_slots +
                               sizeof(devs_pc_t) * func->num_try_frames);

    if (callee == NULL)
        return -2;

    // note that callee is not pinned - do not allocate until connected to fiber
    callee->pc = func->start;
    callee->closure = closure;
    callee->maxpc = func->start + func->length;
    callee->caller = fiber->activation;
    callee->func = func;

    devs_activation_t *caller = fiber->activation;

    // if fiber already activated, move the activation pointer
    if (caller) {
        devs_fiber_activate(fiber, callee);
    } else {
        fiber->activation = callee;
    }

    unsigned num_formals = func->num_args;

    // argp==ctx->the_stack
    // *argp == this (if any)

    value_t *params;
    value_t *slots = callee->slots;

    if (func->flags & DEVS_FUNCTIONFLAG_NEEDS_THIS) {
        *slots++ = *argp;
        num_formals--;
    }

    if (rest) {
        params = rest->data;
        numparams = rest->length;
    } else {
        params = argp + 1;
    }

    if (func->flags & DEVS_FUNCTIONFLAG_HAS_REST_ARG) {
        unsigned num_regular = num_formals - 1;
        if (num_regular > numparams)
            num_regular = numparams;
        memcpy(slots, params, num_regular * sizeof(value_t));
        if (rest) {
            devs_array_insert(ctx, rest, 0, -num_regular);
        } else {
            unsigned arrsz = numparams - num_regular;
            rest = devs_array_try_alloc(ctx, arrsz);
            if (rest)
                memcpy(rest->data, params + num_regular, arrsz * sizeof(value_t));
        }
        slots[num_formals - 1] = devs_value_from_gc_obj(ctx, rest);
    } else {
        if (num_formals > numparams)
            num_formals = numparams;
        memcpy(slots, params, num_formals * sizeof(value_t));
    }

    if ((func->flags & DEVS_FUNCTIONFLAG_IS_CTOR) && devs_is_undefined(callee->slots[0])) {
        devs_map_t *m = devs_map_try_alloc(ctx, devs_get_prototype_field(ctx, fn));
        callee->slots[0] = devs_value_from_gc_obj(ctx, m);
        // devs_log_value(ctx, "ctor", callee->slots[0]);
    }

    if (ctx->dbg_en && ctx->step_fn == caller && (ctx->step_flags & DEVS_CTX_STEP_IN)) {
        devs_vm_suspend(ctx, JD_DEVS_DBG_SUSPENSION_TYPE_STEP);
    }

    return 0;
}

void devs_fiber_set_wake_time(devs_fiber_t *fiber, unsigned time) {
    fiber->wake_time = time;
}

void devs_fiber_sleep(devs_fiber_t *fiber, unsigned time) {
    unsigned wake = 0;
    if (time != 0xffffffff) {
        unsigned now = devs_now(fiber->ctx);
        wake = now + time;
        if (wake < now) // avoid overflow
            wake = 0xffffffff;
    }
    devs_fiber_set_wake_time(fiber, wake);
    devs_fiber_yield(fiber->ctx);
}

void devs_fiber_await(devs_fiber_t *fib, uint8_t *awaiting) {
    *awaiting = 0;
    fib->pkt_kind = DEVS_PKT_KIND_AWAITING;
    fib->pkt_data.awaiting = awaiting;
    devs_fiber_sleep(fib, 0xffffffff);
}

void devs_fiber_await_done(uint8_t *awaiting) {
    *awaiting = 1;
    JD_WAKE_MAIN();
}

static void free_fiber(devs_fiber_t *fiber) {
    devs_jd_clear_pkt_kind(fiber);
    devs_ctx_t *ctx = fiber->ctx;
    if (ctx->fibers == fiber) {
        ctx->fibers = fiber->next;
    } else {
        devs_fiber_t *f = ctx->fibers;
        while (f && f->next != fiber)
            f = f->next;
        JD_ASSERT(f != NULL);
        f->next = fiber->next;
    }
    devs_free(ctx, fiber);
}

static void log_fiber_op(devs_fiber_t *fiber, const char *op) {
    VLOG("%s fiber %s_F%d", op, devs_img_fun_name(fiber->ctx->img, fiber->bottom_function_idx),
         fiber->bottom_function_idx);
}

void devs_fiber_return_from_call(devs_fiber_t *fiber, devs_activation_t *act) {
    devs_ctx_t *ctx = fiber->ctx;
    if (act->caller) {
        if (devs_is_undefined(fiber->ret_val) && (act->func->flags & DEVS_FUNCTIONFLAG_IS_CTOR))
            fiber->ret_val = act->slots[0];
        devs_fiber_activate(fiber, act->caller);
        fiber->stack_depth--;
        act->maxpc = 0; // protect against re-activation
        // act may survive as a closure past the caller intended lifetime
        act->caller = NULL;
    } else {
        if (fiber->pending) {
            log_fiber_op(fiber, "re-run");
            fiber->pending = 0;
            act->pc = act->func->start;
        } else {
            log_fiber_op(fiber, "free");
            devs_fiber_yield(ctx);
            free_fiber(fiber);
            return;
        }
    }
}

void devs_fiber_free_all_fibers(devs_ctx_t *ctx) {
    devs_fiber_t *f = ctx->fibers;
    while (f) {
        ctx->fibers = f->next;
        devs_jd_clear_pkt_kind(f);
        devs_free(ctx, f);
        f = ctx->fibers;
    }
}

const char *devs_img_fun_name(devs_img_t img, unsigned fidx) {
    if (fidx >= DEVS_FIRST_BUILTIN_FUNCTION) {
        fidx -= DEVS_FIRST_BUILTIN_FUNCTION;
        if (fidx >= devs_num_builtin_functions)
            return "???b";
        return devs_builtin_string_by_idx(devs_builtin_functions[fidx].builtin_string_id);
    }
    if (fidx >= devs_img_num_functions(img))
        return "???";
    const devs_function_desc_t *func = devs_img_get_function(img, fidx);
    const char *name = devs_img_get_utf8(img, func->name_idx, NULL);
    return name ? name : "???";
}

devs_fiber_t *devs_fiber_by_fidx(devs_ctx_t *ctx, unsigned fidx) {
    for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next)
        if (fiber->bottom_function_idx == fidx)
            return fiber;
    return NULL;
}

devs_fiber_t *devs_fiber_by_tag(devs_ctx_t *ctx, unsigned tag) {
    for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next)
        if (fiber->handle_tag == tag)
            return fiber;
    return NULL;
}

devs_fiber_t *devs_fiber_start(devs_ctx_t *ctx, unsigned numargs, unsigned op) {
    if (ctx->error_code)
        return NULL;

    devs_fiber_t *fiber;

    devs_activation_t *closure;
    value_t this_val;
    int fidx = devs_get_fnidx(ctx, devs_arg_self(ctx), &this_val, &closure);
    if (fidx < 0)
        return NULL;
    if (fidx >= DEVS_FIRST_BUILTIN_FUNCTION) {
        devs_throw_type_error(ctx, "fiber started with a builtin function");
        return NULL;
    }

    if (op != DEVS_OPCALL_BG) {
        fiber = devs_fiber_by_fidx(ctx, fidx);
        if (fiber) {
            if (op == DEVS_OPCALL_BG_MAX1_REPLACE) {
                devs_fiber_termiante(fiber);
            } else if (op == DEVS_OPCALL_BG_MAX1_PEND1) {
                fiber->pending = 1;
                return fiber;
            } else if (op == DEVS_OPCALL_BG_MAX1) {
                return fiber;
            } else {
                JD_PANIC();
            }
        }
    }

    fiber = devs_try_alloc(ctx, sizeof(*fiber));
    if (fiber == NULL)
        return NULL;
    fiber->ctx = ctx;
    fiber->bottom_function_idx = fidx;
    fiber->handle_tag = ++ctx->fiber_handle_tag;

    log_fiber_op(fiber, "start");

    // link fiber first, so activation linked to it are marked in GC
    // also link it last
    devs_fiber_t *last = ctx->fibers;
    if (last) {
        while (last->next)
            last = last->next;
        last->next = fiber;
    } else {
        ctx->fibers = fiber;
    }

    devs_fiber_call_function(fiber, numargs, NULL);

    devs_fiber_set_wake_time(fiber, devs_now(ctx));

    return fiber;
}

void devs_fiber_termiante(devs_fiber_t *f) {
    log_fiber_op(f, "terminate");
    if (f->ctx->curr_fiber == f)
        devs_fiber_yield(f->ctx);
    free_fiber(f);
}

void devs_fiber_run(devs_fiber_t *fiber) {
    devs_ctx_t *ctx = fiber->ctx;
    if (devs_is_suspended(ctx))
        return;

    devs_fiber_sync_now(ctx);

    if (!devs_jd_should_run(fiber))
        return;

    devs_jd_clear_pkt_kind(fiber);
    fiber->role_idx = DEVS_NO_ROLE;
    devs_fiber_set_wake_time(fiber, 0);

    ctx->curr_fiber = fiber;
    devs_fiber_activate(fiber, fiber->activation);

    if (devs_trace_enabled(ctx)) {
        devs_trace_ev_fiber_run_t ev = {.pc = fiber->activation->pc};
        devs_trace(ctx, DEVS_TRACE_EV_FIBER_RUN, &ev, sizeof(ev));
    }

    devs_resume_cb_t cb = fiber->resume_cb;
    if (cb) {
        void *data = fiber->resume_data;
        fiber->resume_cb = NULL;
        fiber->resume_data = NULL;
        cb(ctx, data);
    }

    devs_vm_exec_opcodes(ctx);
}

void devs_panic(devs_ctx_t *ctx, unsigned code) {
    unsigned orig_code = code;
    if (!code)
        code = DEVS_PANIC_REBOOT;
    if (!ctx->error_code) {
        ctx->error_pc = ctx->curr_fn ? ctx->curr_fn->pc : 0;
        // using DMESG here since this logging should never be disabled
        if (code == DEVS_PANIC_REBOOT) {
            DMESG("* RESTART requested");
        } else if (code == DEVS_PANIC_TIMEOUT) {
            DMESG("! Exception: InfiniteLoop");
        } else if (code == DEVS_PANIC_OOM) {
            DMESG("! Exception: OutOfMemory");
        } else if (code == DEVS_PANIC_STACK_OVERFLOW) {
            DMESG("! Exception: StackOverflow");
        } else if (code == DEVS_PANIC_UNHANDLED_EXCEPTION) {
            DMESG("! Unhandled exception");
        } else {
            DMESG("! Exception: Panic_%d at (gpc:%d)", code, ctx->error_pc);
        }
        ctx->error_code = code;

        if (code != DEVS_PANIC_REBOOT && code != DEVS_PANIC_UNHANDLED_EXCEPTION) {
            int limit = 30;
            for (devs_activation_t *fn = ctx->curr_fn; fn; fn = fn->caller) {
                int idx = fn->func - devs_img_get_function(ctx->img, 0);
                DMESG("!  at %s_F%d (pc:%d)", devs_img_fun_name(ctx->img, idx), idx,
                      (int)(fn->pc - fn->func->start));
                if (limit-- < 0) {
                    DMESG("!  ...");
                    break;
                }
            }
        }

        // TODO for OOM we probably want to free up some memory first...
        ctx->suspension = JD_DEVS_DBG_SUSPENSION_TYPE_PANIC;

        devs_panic_handler(orig_code);

        if (code != DEVS_PANIC_REBOOT)
            devs_track_exception(ctx);
    }
    devs_fiber_yield(ctx);
}

value_t _devs_invalid_program(devs_ctx_t *ctx, unsigned code) {
    if (code < 100)
        code = 100;
    devs_panic(ctx, 60000 + code);
    return devs_undefined;
}

void devs_fiber_sync_now(devs_ctx_t *ctx) {
    jd_refresh_now();
    ctx->_now_long = now_ms_long;
}

unsigned devs_fiber_get_max_sleep(devs_ctx_t *ctx) {
    devs_fiber_sync_now(ctx);
    int min_ms = 100;
    uint32_t now_ = devs_now(ctx);

    for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->wake_time) {
            int d = fiber->wake_time - now_;
            if (d < 0)
                d = 0;
            if (d < min_ms)
                min_ms = d;
        }
    }
    return min_ms * 1000;
}

static int devs_fiber_wake_some(devs_ctx_t *ctx) {
    if (devs_is_suspended(ctx))
        return 0;
    uint32_t now_ = devs_now(ctx);
    devs_fiber_t *fibmin = NULL;

    for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->role_wkp ||
            (fiber->pkt_kind == DEVS_PKT_KIND_AWAITING && *fiber->pkt_data.awaiting)) {
            fibmin = fiber;
            break;
        }

        if (fiber->wake_time && fiber->wake_time <= now_) {
            if (fibmin == NULL || fibmin->wake_time > fiber->wake_time)
                fibmin = fiber;
        }
    }

    if (!fibmin)
        return 0;

    devs_jd_reset_packet(ctx);
    devs_fiber_run(fibmin);

    // we can't continue with the fiber loop - the fiber might be gone by now
    return 1;
}

static void devs_print_warnings(devs_ctx_t *ctx) {
    if (ctx->num_throttled_pkts) {
        DMESG("%u packets throttled", (unsigned)ctx->num_throttled_pkts);
        ctx->num_throttled_pkts = 0;
    }
}

void devs_fiber_poke(devs_ctx_t *ctx) {
    devs_fiber_sync_now(ctx);
    while (devs_fiber_wake_some(ctx))
        ;

    if (devs_now(ctx) > ctx->last_warning + 5 * 1024) {
        ctx->last_warning = devs_now(ctx);
        devs_print_warnings(ctx);
    }
}
