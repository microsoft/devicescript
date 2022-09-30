#include "jacs_internal.h"

#define LOG JD_LOG

void jacs_fiber_yield(jacs_ctx_t *ctx) {
    if (ctx->curr_fn && jacs_trace_enabled(ctx)) {
        jacs_trace_ev_fiber_yield_t ev = {.pc = ctx->curr_fn->pc};
        jacs_trace(ctx, JACS_TRACE_EV_FIBER_YIELD, &ev, sizeof(ev));
    }

    ctx->curr_fn = NULL;
    ctx->curr_fiber = NULL;
}

static void jacs_fiber_activate(jacs_activation_t *act) {
    act->fiber->activation = act;
    act->fiber->ctx->curr_fn = act;
}

void jacs_fiber_copy_params(jacs_activation_t *frame) {
    JD_ASSERT(!frame->params_is_copy);
    value_t *tmp = jacs_try_alloc(frame->fiber->ctx, sizeof(value_t) * frame->func->num_args);
    memcpy(tmp, frame->params, sizeof(value_t) * frame->num_params);
    frame->num_params = frame->func->num_args;
    frame->params = tmp;
    frame->params_is_copy = 1;
}

void jacs_fiber_call_function(jacs_fiber_t *fiber, unsigned fidx, value_t *params,
                              unsigned numargs) {
    jacs_ctx_t *ctx = fiber->ctx;
    const jacs_function_desc_t *func = jacs_img_get_function(&ctx->img, fidx);

    jacs_activation_t *callee =
        jacs_try_alloc(ctx, sizeof(jacs_activation_t) + sizeof(value_t) * func->num_locals);
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
        jacs_fiber_activate(callee);
    } else {
        // otherwise, it's a fresh fiber, we need to copy arguments if any, as the caller will go
        // away
        if (numargs)
            jacs_fiber_copy_params(callee);
        fiber->activation = callee;
    }
}

void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, unsigned time) {
    fiber->wake_time = time;
}

void jacs_fiber_sleep(jacs_fiber_t *fiber, unsigned time) {
    jacs_fiber_set_wake_time(fiber, jacs_now(fiber->ctx) + time);
    jacs_fiber_yield(fiber->ctx);
}

static void free_fiber(jacs_fiber_t *fiber) {
    jacs_jd_clear_pkt_kind(fiber);
    jacs_ctx_t *ctx = fiber->ctx;
    if (ctx->fibers == fiber) {
        ctx->fibers = fiber->next;
    } else {
        jacs_fiber_t *f = ctx->fibers;
        while (f && f->next != fiber)
            f = f->next;
        if (!f)
            oops();
        f->next = fiber->next;
    }
    jacs_free(ctx, fiber);
}

static void free_activation(jacs_activation_t *act) {
    jacs_ctx_t *ctx = act->fiber->ctx;
    if (act->params_is_copy)
        jacs_free(ctx, act->params);
    jacs_free(ctx, act);
}

static void log_fiber_op(jacs_fiber_t *fiber, const char *op) {
    LOG("%s fiber %s_F%d", op, jacs_img_fun_name(&fiber->ctx->img, fiber->bottom_function_idx),
        fiber->bottom_function_idx);
}

void jacs_fiber_return_from_call(jacs_activation_t *act) {
    if (act->caller) {
        jacs_fiber_activate(act->caller);
        free_activation(act);
    } else {
        jacs_fiber_t *fiber = act->fiber;
        if (fiber->pending) {
            log_fiber_op(fiber, "re-run");
            fiber->pending = 0;
            act->pc = act->func->start;
        } else {
            log_fiber_op(fiber, "free");
            jacs_fiber_yield(fiber->ctx);
            free_activation(act);
            free_fiber(fiber);
        }
    }
}

void jacs_fiber_free_all_fibers(jacs_ctx_t *ctx) {
    jacs_fiber_t *f = ctx->fibers;
    while (f) {
        ctx->fibers = f->next;
        jacs_jd_clear_pkt_kind(f);
        jacs_activation_t *act = f->activation;
        while (act) {
            jacs_activation_t *n = act->caller;
            free_activation(act);
            act = n;
        }
        jacs_free(ctx, f);
        f = ctx->fibers;
    }
}

const char *jacs_img_fun_name(const jacs_img_t *img, unsigned fidx) {
    if (fidx >= jacs_img_num_functions(img))
        return "???";
    const jacs_function_desc_t *func = jacs_img_get_function(img, fidx);
    return jacs_img_get_string_ptr(img, func->name_idx);
}

jacs_fiber_t *jacs_fiber_by_fidx(jacs_ctx_t *ctx, unsigned fidx) {
    for (jacs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next)
        if (fiber->bottom_function_idx == fidx)
            return fiber;
    return NULL;
}

jacs_fiber_t *jacs_fiber_by_tag(jacs_ctx_t *ctx, unsigned tag) {
    for (jacs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next)
        if (fiber->handle_tag == tag)
            return fiber;
    return NULL;
}

jacs_fiber_t *jacs_fiber_start(jacs_ctx_t *ctx, unsigned fidx, value_t *params, unsigned numargs,
                               unsigned op) {
    if (ctx->error_code)
        return NULL;

    jacs_fiber_t *fiber;

    if (op != JACS_OPCALL_BG) {
        fiber = jacs_fiber_by_fidx(ctx, fidx);
        if (fiber) {
            if (op == JACS_OPCALL_BG_MAX1_PEND1) {
                if (fiber->pending) {
                    // LOG("fiber already pending %d", fidx);
                } else {
                    fiber->pending = 1;
                    // LOG("pend fiber %d", fidx);
                }
            }
            return fiber;
        }
    }

    fiber = jacs_try_alloc(ctx, sizeof(*fiber));
    if (fiber == NULL)
        return NULL;
    fiber->ctx = ctx;
    fiber->bottom_function_idx = fidx;
    fiber->handle_tag = ++ctx->fiber_handle_tag;

    log_fiber_op(fiber, "start");

    jacs_fiber_call_function(fiber, fidx, params, numargs);

    fiber->next = ctx->fibers;
    ctx->fibers = fiber;

    jacs_fiber_set_wake_time(fiber, jacs_now(ctx));

    return fiber;
}

void jacs_fiber_termiante(jacs_fiber_t *f) {
    log_fiber_op(f, "terminate");
    jacs_activation_t *act = f->activation;
    while (act) {
        jacs_activation_t *n = act->caller;
        free_activation(act);
        act = n;
    }
    free_fiber(f);
}

void jacs_fiber_run(jacs_fiber_t *fiber) {
    jacs_ctx_t *ctx = fiber->ctx;
    if (ctx->error_code)
        return;

    jacs_fiber_sync_now(ctx);

    if (!jacs_jd_should_run(fiber))
        return;

    jacs_jd_clear_pkt_kind(fiber);
    fiber->role_idx = JACS_NO_ROLE;
    jacs_fiber_set_wake_time(fiber, 0);

    ctx->curr_fiber = fiber;
    jacs_fiber_activate(fiber->activation);

    if (jacs_trace_enabled(ctx)) {
        jacs_trace_ev_fiber_run_t ev = {.pc = fiber->activation->pc};
        jacs_trace(ctx, JACS_TRACE_EV_FIBER_RUN, &ev, sizeof(ev));
    }

    unsigned maxsteps = JACS_MAX_STEPS;
    while (ctx->curr_fn && --maxsteps)
        jacs_vm_exec_stmt(ctx->curr_fn);

    if (maxsteps == 0)
        jacs_panic(ctx, JACS_PANIC_TIMEOUT);
}

void jacs_panic(jacs_ctx_t *ctx, unsigned code) {
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
            for (jacs_activation_t *fn = ctx->curr_fn; fn; fn = fn->caller) {
                int idx = fn->func - jacs_img_get_function(&ctx->img, 0);
                DMESG("  pc=%d @ %s_F%d", (int)(fn->pc - fn->func->start),
                      jacs_img_fun_name(&ctx->img, idx), idx);
            }
    }
    jacs_fiber_yield(ctx);
}

value_t _jacs_runtime_failure(jacs_ctx_t *ctx, unsigned code) {
    if (code < 100)
        code = 100;
    jacs_panic(ctx, 60000 + code);
    return jacs_undefined;
}

void jacs_fiber_sync_now(jacs_ctx_t *ctx) {
    jd_refresh_now();
    ctx->_now_long = now_ms_long;
}

static int jacs_fiber_wake_some(jacs_ctx_t *ctx) {
    if (ctx->error_code)
        return 0;
    uint32_t now_ = jacs_now(ctx);
    for (jacs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->wake_time && fiber->wake_time <= now_) {
            jacs_jd_reset_packet(ctx);
            jacs_fiber_run(fiber);
            // we can't continue with the fiber loop - the fiber might be gone by now
            return 1;
        }
    }
    return 0;
}

void jacs_fiber_poke(jacs_ctx_t *ctx) {
    jacs_fiber_sync_now(ctx);
    while (jacs_fiber_wake_some(ctx))
        ;
}
