#include "jacs_internal.h"

void jacs_ctx_yield(jacs_ctx_t *ctx) {
    ctx->curr_fn = NULL;
    ctx->curr_fiber = NULL;
}

void jacs_act_activate(jacs_activation_t *act) {
    act->fiber->activation = act;
    act->fiber->ctx->curr_fn = act;
    jacs_act_restore_regs(act);
}

void jacs_fiber_call_function(jacs_fiber_t *fiber, unsigned fidx, unsigned numargs) {
    jacs_ctx_t *ctx = fiber->ctx;
    const jacs_function_desc_t *func = jacs_img_get_function(&ctx->img, fidx);

    int numregs = func->num_regs_and_args & 0xf;

    jacs_activation_t *callee = jd_alloc0(sizeof(jacs_activation_t) + sizeof(value_t) * (numregs + func->num_locals));
    memcpy(callee->locals, ctx->registers, numargs * sizeof(value_t));
    callee->pc = func->start >> 1;
    callee->caller = fiber->activation;
    callee->fiber = fiber;
    callee->func = func;
    callee->saved_regs = 0;

    // if fiber already activated, move the activation pointer
    if (fiber->activation)
        jacs_act_activate(callee);
}

void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, uint32_t time) {
    fiber->wake_time = time;
    fiber->ctx->wake_times_updated = 1;
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
    jacs_ctx_yield(ctx);
}

void jacs_act_return_from_call(jacs_activation_t *act) {
    if (act->caller)
        jacs_act_activate(act->caller);
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

void jacs_ctx_start_fiber(jacs_ctx_t *ctx, unsigned fidx, unsigned numargs, unsigned op) {
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

    jacs_fiber_set_wake_time(fiber, now);

    ctx->registers[0] = 1;
}

#ifdef NOT_YET

void jacs_ctx_send_cmd(jacs_ctx_t *ctx, uint16_t role_idx, uint16_t code) {
    jacs_role_desc_t *role = jacs_img_get_role(&ctx->img, role_idx);

    if ((code & 0xf000) == CMD_SET_REG) {
        const cached = ctx->regs.lookup(role, (code & ~CMD_SET_REG) | CMD_GET_REG);
        if (cached)
            cached.dead = true;
    }

    const fib = ctx->curr_fiber;
    if (role.isCondition()) {
        fib.sleep(0);
        DMESG("wake condition");
        log(`wake condition $ { role.info }`);
        ctx->wakeRole(role);
        return;
    }

    fib.role_idx = role;
    fib.service_command = code;
    fib.resend_timeout = 20;
    fib.cmdPayload = ctx->pkt.data.slice(); // hmmm...
    fib.sleep(0);
}

void jacs_ctx_get_jd_register(jacs_ctx_t *ctx, uint16_t role_idx, uint16_t code, uint32_t timeout,
                              uint16_t arg) {
    jacs_role_desc_t *role = jacs_img_get_role(&ctx->img, role_idx);

    if (role.device) {
        const cached = ctx->regs.lookup(role, code, arg);
        if (cached) {
            if (cached.expired(now, timeout)) {
                cached.dead = true;
            } else {
                ctx->regs.markUsed(cached);
                ctx->pkt = Packet.from(cached.code, cached.value);
                ctx->pkt.deviceIdentifier = role.device.deviceId;
                ctx->pkt.serviceIndex = role.serviceIndex;
                return;
            }
        }
    }

    const fib = ctx->curr_fiber;
    fib.role_idx = role;
    fib.service_command = code;
    fib.command_arg = arg;
    fib.resend_timeout = 20;
    fib.sleep(0);
}

static value_t fail(jacs_activation_t *frame, int code) {
    jacs_ctx_t *ctx = frame->fiber->ctx;
    if (!ctx->error_code) {
        DMESG("error %d at %x", code, frame->pc);
        ctx->error_code = code;
    }
    return 0;
}

static value_t fail_ctx(jacs_ctx_t *ctx, int code) {
    if (!ctx->error_code) {
        DMESG("error %d at %x", code, ctx->curr_fn ? ctx->curr_fn->pc : 0);
        ctx->error_code = code;
    }
    return 0;
}

void jacs_ctx_panic(jacs_ctx_t *ctx, unsigned code) {
    if (!code)
        code = RESTART_PANIC_CODE;
    if (!this->panicCode) {
        if (code == RESTART_PANIC_CODE)
            console.error(`RESTART requested`);
        else if (code == INTERNAL_ERROR_PANIC_CODE)
            console.error(`INTERNAL ERROR`);
        else
            console.error(`PANIC $ { code }`);
        this->panicCode = code;
    }
    this->clearwake_timer();
    if (!exn)
        exn = new Error("Panic");
    (exn as any).panicCode = this->panicCode;
    throw exn;
}

#endif
