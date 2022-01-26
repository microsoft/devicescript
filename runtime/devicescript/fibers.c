#include "jacs_internal.h"

void jacs_fiber_yield(jacs_ctx_t *ctx) {
    ctx->curr_fn = NULL;
    ctx->curr_fiber = NULL;
}

static void jacs_fiber_activate(jacs_activation_t *act) {
    act->fiber->activation = act;
    act->fiber->ctx->curr_fn = act;
    jacs_act_restore_regs(act);
}

void jacs_fiber_call_function(jacs_fiber_t *fiber, unsigned fidx, unsigned numargs) {
    jacs_ctx_t *ctx = fiber->ctx;
    const jacs_function_desc_t *func = jacs_img_get_function(&ctx->img, fidx);

    int numregs = func->num_regs_and_args & 0xf;

    jacs_activation_t *callee =
        jd_alloc0(sizeof(jacs_activation_t) + sizeof(value_t) * (numregs + func->num_locals));
    memcpy(callee->locals, ctx->registers, numargs * sizeof(value_t));
    callee->pc = func->start >> 1;
    callee->caller = fiber->activation;
    callee->fiber = fiber;
    callee->func = func;
    callee->saved_regs = 0;

    // if fiber already activated, move the activation pointer
    if (fiber->activation)
        jacs_fiber_activate(callee);
}

void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, unsigned time) {
    fiber->wake_time = time;
    fiber->ctx->wake_times_updated = 1;
}

void jacs_fiber_sleep(jacs_fiber_t *fiber, unsigned time) {
    jacs_fiber_set_wake_time(fiber, jacs_now(fiber->ctx) + time);
    jacs_fiber_yield(fiber->ctx);
}

static void free_fiber(jacs_fiber_t *fiber) {
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
    jd_free(fiber);
    jacs_fiber_yield(ctx);
}

void jacs_fiber_return_from_call(jacs_activation_t *act) {
    if (act->caller)
        jacs_fiber_activate(act->caller);
    else {
        jacs_fiber_t *fiber = act->fiber;
        if (fiber->flags & JACS_FIBER_FLAG_PENDING) {
            DMESG("re-run fiber %d ", fiber->bottom_function_idx);
            fiber->flags &= ~JACS_FIBER_FLAG_PENDING;
            act->pc = act->func->start >> 1;
        } else {
            DMESG("free fiber %d", fiber->bottom_function_idx);
            free_fiber(fiber);
        }
    }
}

void jacs_fiber_start(jacs_ctx_t *ctx, unsigned fidx, unsigned numargs, unsigned op) {
    jacs_fiber_t *fiber;

    if (op != JACS_OPCALL_BG)
        for (fiber = ctx->fibers; fiber; fiber = fiber->next) {
            if (fiber->bottom_function_idx == fidx) {
                if (op == JACS_OPCALL_BG_MAX1_PEND1) {
                    if (fiber->flags & JACS_FIBER_FLAG_PENDING) {
                        ctx->registers[0] = 3;
                    } else {
                        fiber->flags |= JACS_FIBER_FLAG_PENDING;
                        ctx->registers[0] = 2;
                    }
                } else {
                    ctx->registers[0] = 0;
                }
                return;
            }
        }

    DMESG("start fiber %d", fidx);

    fiber = jd_alloc0(sizeof(*fiber));
    fiber->ctx = ctx;
    fiber->bottom_function_idx = fidx;

    jacs_fiber_call_function(fiber, fidx, numargs);

    fiber->next = ctx->fibers;
    ctx->fibers = fiber;

    jacs_fiber_set_wake_time(fiber, jacs_now(ctx));

    ctx->registers[0] = 1;
}

void jacs_fiber_run(jacs_fiber_t *fiber) {
    jacs_ctx_t *ctx = fiber->ctx;
    if (ctx->error_code)
        return;

    if (!jacs_jd_should_run(fiber))
        return;

    fiber->role_idx = JACS_NO_ROLE;
    jacs_fiber_set_wake_time(fiber, 0);

    ctx->a = ctx->b = ctx->c = ctx->d = 0;

    ctx->curr_fiber = fiber;
    jacs_fiber_activate(fiber->activation);

    unsigned maxsteps = JACS_MAX_STEPS;
    while (ctx->curr_fn && --maxsteps)
        jacs_act_step(ctx->curr_fn);

    if (maxsteps == 0)
        jacs_panic(ctx, JACS_PANIC_TIMEOUT);
}

void jacs_panic(jacs_ctx_t *ctx, unsigned code) {
    if (!code)
        code = JACS_PANIC_REBOOT;
    if (!ctx->error_code) {
        if (code == JACS_PANIC_REBOOT) {
            DMESG("RESTART requested");
        } else {
            DMESG("PANIC %d at %x", code, ctx->curr_fn ? ctx->curr_fn->pc : 0);
        }
        ctx->error_code = code;
    }
    // clear wake timer?
}
