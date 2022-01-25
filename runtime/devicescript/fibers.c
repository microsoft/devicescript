#ifdef NOT_YET

void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, uint32_t time) {
    fiber->wake_time = time;
    fiber->ctx->wake_time_updated = 1;
}

void jacs_ctx_yield(jacs_ctx_t *ctx) {
    // TODO
}

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
    const now = ctx->now();

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

void jacs_act_call_function(jacs_activation_t *act, unsigned fidx, unsigned numargs) {
    const callee = new Activation(this->fiber, info, this, numargs);
    this->fiber.activate(callee);
}

void jacs_act_return_from_call(jacs_activation_t *act) {
    if (this->caller)
        this->fiber.activate(this->caller);
    else
        this->fiber.finish();
}

void jacs_ctx_start_fiber(jacs_ctx_t *ctx, unsigned fidx, unsigned numargs, unsigned op) {
    if (op != JACS_OPCALL_BG)
        for (const f of ctx->fibers) {
            if (f.bottom_function_idx == info) {
                if (op == JACS_OPCALL_BG_MAX1_PEND1) {
                    f.pending = true;
                    ctx->registers[0] = 2;
                } else {
                    ctx->registers[0] = 0;
                }
                return;
            }
        }
    log(`start fiber : ${info} $ { ctx->pkt ? printPacket(ctx->pkt) : "" }`);
    const fiber = new Fiber(ctx);
    fiber.activation = new Activation(fiber, info, null, numargs);
    fiber.bottom_function_idx = info;
    fiber.setwake_time(ctx->now());
    ctx->fibers.push(fiber);
    ctx->registers[0] = 1;
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
