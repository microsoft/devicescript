#include "devs_internal.h"

#define LOG JD_LOG

void devs_fiber_yield(devs_ctx_t *ctx) {
    if (ctx->curr_fn && devs_trace_enabled(ctx)) {
        devs_trace_ev_fiber_yield_t ev = {.pc = ctx->curr_fn->pc};
        devs_trace(ctx, JACS_TRACE_EV_FIBER_YIELD, &ev, sizeof(ev));
    }

    ctx->curr_fn = NULL;
    ctx->curr_fiber = NULL;
}

static void devs_fiber_activate(devs_activation_t *act) {
    devs_ctx_t *ctx = act->fiber->ctx;
    act->fiber->activation = act;
    if (ctx->error_code == 0)
        ctx->curr_fn = act;
}

void devs_fiber_copy_params(devs_activation_t *frame) {
    JD_ASSERT(!frame->params_is_copy);
    value_t *tmp = devs_try_alloc(frame->fiber->ctx, sizeof(value_t) * frame->func->num_args);
    memcpy(tmp, frame->params, sizeof(value_t) * frame->num_params);
    frame->num_params = frame->func->num_args;
    frame->params = tmp;
    frame->params_is_copy = 1;
}

void devs_fiber_call_function(devs_fiber_t *fiber, unsigned fidx, value_t *params,
                              unsigned numargs) {
    devs_ctx_t *ctx = fiber->ctx;
    const devs_function_desc_t *func = devs_img_get_function(&ctx->img, fidx);

    devs_activation_t *callee =
        devs_try_alloc(ctx, sizeof(devs_activation_t) + sizeof(value_t) * func->num_locals);
    if (callee == NULL)
        return;
    callee->params = params;
    callee->num_params = numargs;
    callee->pc = func->start;
    callee->maxpc = func->start + func->length;
    callee->caller = fiber->activation;
    callee->fiber = fiber;
    callee->func = func;

    // if fiber already activated, move the activation pointer
    if (fiber->activation) {
        devs_fiber_activate(callee);
    } else {
        // otherwise, it's a fresh fiber, we need to copy arguments if any, as the caller will go
        // away
        if (numargs)
            devs_fiber_copy_params(callee);
        fiber->activation = callee;
    }
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

static void free_activation(devs_activation_t *act) {
    devs_ctx_t *ctx = act->fiber->ctx;
    if (act->params_is_copy)
        devs_free(ctx, act->params);
    devs_free(ctx, act);
}

static void log_fiber_op(devs_fiber_t *fiber, const char *op) {
    LOG("%s fiber %s_F%d", op, devs_img_fun_name(&fiber->ctx->img, fiber->bottom_function_idx),
        fiber->bottom_function_idx);
}

void devs_fiber_return_from_call(devs_activation_t *act) {
    if (act->caller) {
        devs_fiber_activate(act->caller);
        free_activation(act);
    } else {
        devs_fiber_t *fiber = act->fiber;
        if (fiber->pending) {
            log_fiber_op(fiber, "re-run");
            fiber->pending = 0;
            act->pc = act->func->start;
        } else {
            log_fiber_op(fiber, "free");
            devs_fiber_yield(fiber->ctx);
            free_activation(act);
            free_fiber(fiber);
        }
    }
}

void devs_fiber_free_all_fibers(devs_ctx_t *ctx) {
    devs_fiber_t *f = ctx->fibers;
    while (f) {
        ctx->fibers = f->next;
        devs_jd_clear_pkt_kind(f);
        devs_activation_t *act = f->activation;
        while (act) {
            devs_activation_t *n = act->caller;
            free_activation(act);
            act = n;
        }
        devs_free(ctx, f);
        f = ctx->fibers;
    }
}

const char *devs_img_fun_name(const devs_img_t *img, unsigned fidx) {
    if (fidx >= devs_img_num_functions(img))
        return "???";
    const devs_function_desc_t *func = devs_img_get_function(img, fidx);
    return devs_img_get_string_ptr(img, func->name_idx);
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

devs_fiber_t *devs_fiber_start(devs_ctx_t *ctx, unsigned fidx, value_t *params, unsigned numargs,
                               unsigned op) {
    if (ctx->error_code)
        return NULL;

    devs_fiber_t *fiber;

    if (op != JACS_OPCALL_BG) {
        fiber = devs_fiber_by_fidx(ctx, fidx);
        if (fiber) {
            if (op == JACS_OPCALL_BG_MAX1_REPLACE) {
                devs_fiber_termiante(fiber);
            } else if (op == JACS_OPCALL_BG_MAX1_PEND1) {
                fiber->pending = 1;
                return fiber;
            } else if (op == JACS_OPCALL_BG_MAX1) {
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

    devs_fiber_call_function(fiber, fidx, params, numargs);

    fiber->next = ctx->fibers;
    ctx->fibers = fiber;

    devs_fiber_set_wake_time(fiber, devs_now(ctx));

    return fiber;
}

void devs_fiber_termiante(devs_fiber_t *f) {
    log_fiber_op(f, "terminate");
    if (f->ctx->curr_fiber == f)
        devs_fiber_yield(f->ctx);
    devs_activation_t *act = f->activation;
    while (act) {
        devs_activation_t *n = act->caller;
        free_activation(act);
        act = n;
    }
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
    fiber->role_idx = JACS_NO_ROLE;
    devs_fiber_set_wake_time(fiber, 0);

    ctx->curr_fiber = fiber;
    devs_fiber_activate(fiber->activation);

    if (devs_trace_enabled(ctx)) {
        devs_trace_ev_fiber_run_t ev = {.pc = fiber->activation->pc};
        devs_trace(ctx, JACS_TRACE_EV_FIBER_RUN, &ev, sizeof(ev));
    }

    devs_vm_exec_opcodes(ctx);
}

void devs_panic(devs_ctx_t *ctx, unsigned code) {
    if (!code)
        code = JACS_PANIC_REBOOT;
    if (!ctx->error_code) {
        ctx->error_pc = ctx->curr_fn ? ctx->curr_fn->pc : 0;
        // using DMESG here since this logging should never be disabled
        if (code == JACS_PANIC_REBOOT) {
            DMESG("RESTART requested");
        } else {
            DMESG("PANIC %d at pc=%d", code, ctx->error_pc);
        }
        ctx->error_code = code;

        if (code != JACS_PANIC_REBOOT)
            for (devs_activation_t *fn = ctx->curr_fn; fn; fn = fn->caller) {
                int idx = fn->func - devs_img_get_function(&ctx->img, 0);
                DMESG("  pc=%d @ %s_F%d", (int)(fn->pc - fn->func->start),
                      devs_img_fun_name(&ctx->img, idx), idx);
            }
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
