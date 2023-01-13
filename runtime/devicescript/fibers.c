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
    if (ctx->error_code == 0) {
        ctx->curr_fn = act;
        JD_ASSERT(act->maxpc > 0);
    }
}

int devs_fiber_call_function(devs_fiber_t *fiber, unsigned numparams) {
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

    int bltin = fidx - DEVS_FIRST_BUILTIN_FUNCTION;
    if (bltin >= 0) {
        JD_ASSERT(bltin < devs_num_builtin_functions);
        const devs_builtin_function_t *h = &devs_builtin_functions[bltin];
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
            }
        }
        h->handler.meth(ctx);
        return 0;
    }

    const devs_function_desc_t *func = devs_img_get_function(ctx->img, fidx);
    devs_activation_t *callee =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_ACTIVATION,
                           sizeof(devs_activation_t) + sizeof(value_t) * func->num_slots +
                               sizeof(devs_pc_t) * func->num_try_frames);

    if (callee == NULL)
        return -2;

    // note that callee is not pinned - do not allocate until connected to fiber
    unsigned num_formals = func->num_args;
    value_t *params;
    if (func->flags & DEVS_FUNCTIONFLAG_NEEDS_THIS) {
        params = argp;
        numparams++; // count the this/fn parameter
    } else
        params = argp + 1;
    if (num_formals > numparams)
        num_formals = numparams;
    memcpy(callee->slots, params, num_formals * sizeof(value_t));

    callee->pc = func->start;
    callee->closure = closure;
    callee->maxpc = func->start + func->length;
    callee->caller = fiber->activation;
    callee->func = func;

    // if fiber already activated, move the activation pointer
    if (fiber->activation) {
        devs_fiber_activate(fiber, callee);
    } else {
        fiber->activation = callee;
    }

    if ((func->flags & DEVS_FUNCTIONFLAG_IS_CTOR) && devs_is_null(callee->slots[0])) {
        devs_map_t *m = devs_map_try_alloc(ctx, devs_get_prototype_field(ctx, fn));
        callee->slots[0] = devs_value_from_gc_obj(ctx, m);
    }

    return 0;
}

void devs_fiber_set_wake_time(devs_fiber_t *fiber, unsigned time) {
    fiber->wake_time = time;
}

void devs_fiber_sleep(devs_fiber_t *fiber, unsigned time) {
    devs_fiber_set_wake_time(fiber, devs_now(fiber->ctx) + time);
    devs_fiber_yield(fiber->ctx);
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
    act->maxpc = 0; // protect against re-activation
    if (act->caller) {
        if (devs_is_null(fiber->ret_val) && (act->func->flags & DEVS_FUNCTIONFLAG_IS_CTOR))
            fiber->ret_val = act->slots[0];
        devs_fiber_activate(fiber, act->caller);
    } else {
        if (fiber->pending) {
            log_fiber_op(fiber, "re-run");
            fiber->pending = 0;
            act->pc = act->func->start;
        } else {
            log_fiber_op(fiber, "free");
            devs_fiber_yield(ctx);
            free_fiber(fiber);
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

const char *devs_img_role_name(devs_img_t img, unsigned idx) {
    if (idx >= devs_img_num_roles(img))
        return "???";
    const devs_role_desc_t *role = devs_img_get_role(img, idx);
    return devs_img_get_utf8(img, role->name_idx, NULL);
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
                devs_fiber_terminate(fiber);
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
    fiber->next = ctx->fibers;
    ctx->fibers = fiber;

    devs_fiber_call_function(fiber, numargs);

    devs_fiber_set_wake_time(fiber, devs_now(ctx));

    return fiber;
}

void devs_fiber_terminate(devs_fiber_t *f) {
    log_fiber_op(f, "terminate");
    if (f->ctx->curr_fiber == f)
        devs_fiber_yield(f->ctx);
    free_fiber(f);
}

void devs_fiber_run(devs_fiber_t *fiber) {
    devs_ctx_t *ctx = fiber->ctx;
    if (ctx->error_code)
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
            DMESG("RESTART requested");
        } else {
            DMESG("PANIC %d at pc=%d", code, ctx->error_pc);
        }
        ctx->error_code = code;

        if (code != DEVS_PANIC_REBOOT)
            for (devs_activation_t *fn = ctx->curr_fn; fn; fn = fn->caller) {
                int idx = fn->func - devs_img_get_function(ctx->img, 0);
                DMESG("  pc=%d @ %s_F%d", (int)(fn->pc - fn->func->start),
                      devs_img_fun_name(ctx->img, idx), idx);
            }

        devs_panic_handler(orig_code);
    }
    devs_fiber_yield(ctx);
}

value_t _devs_runtime_failure(devs_ctx_t *ctx, unsigned code) {
    if (code < 100)
        code = 100;
    devs_panic(ctx, 60000 + code);
    return devs_undefined;
}

void devs_fiber_sync_now(devs_ctx_t *ctx) {
    jd_refresh_now();
    ctx->_now_long = now_ms_long;
}

static int devs_fiber_wake_some(devs_ctx_t *ctx) {
    if (ctx->error_code)
        return 0;
    uint32_t now_ = devs_now(ctx);
    for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->wake_time && fiber->wake_time <= now_) {
            devs_jd_reset_packet(ctx);
            devs_fiber_run(fiber);
            // we can't continue with the fiber loop - the fiber might be gone by now
            return 1;
        }
    }
    return 0;
}

void devs_fiber_poke(devs_ctx_t *ctx) {
    devs_fiber_sync_now(ctx);
    while (devs_fiber_wake_some(ctx))
        ;
}
