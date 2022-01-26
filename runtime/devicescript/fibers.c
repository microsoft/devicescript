#include "jacs_internal.h"

#define NO_ROLE 0xffff

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
        jacs_act_activate(callee);
}

void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, unsigned time) {
    fiber->wake_time = time;
    fiber->ctx->wake_times_updated = 1;
}

void jacs_fiber_sleep(jacs_fiber_t *fiber, unsigned time) {
    jacs_fiber_set_wake_time(fiber, jacs_now(fiber->ctx) + time);
    jacs_ctx_yield(fiber->ctx);
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

    jacs_fiber_set_wake_time(fiber, jacs_now(ctx));

    ctx->registers[0] = 1;
}

void jacs_ctx_get_jd_register(jacs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
                              unsigned arg) {
    jd_device_service_t *serv = ctx->roles[role_idx].service;
    if (serv != NULL) {
        jacs_regcache_entry_t *cached = jacs_regcache_lookup(&ctx->regcache, role_idx, code, arg);
        if (cached != NULL) {
            if (!timeout || timeout > JACS_MAX_REG_VALIDITY)
                timeout = JACS_MAX_REG_VALIDITY;
            if (cached->last_refresh_time + timeout < jacs_now(ctx)) {
                jacs_regcache_free(&ctx->regcache, cached);
            } else {
                jacs_regcache_mark_used(&ctx->regcache, cached);
                memset(&ctx->packet, 0, sizeof(ctx->packet));
                ctx->packet.service_command = cached->service_command;
                ctx->packet.service_size = cached->resp_size;
                ctx->packet.service_index = serv->service_index;
                ctx->packet.device_identifier = jd_service_parent(serv)->device_identifier;
                memcpy(ctx->packet.data, jacs_regcache_data(cached), cached->resp_size);
                return;
            }
        }
    }

    jacs_fiber_t *fib = ctx->curr_fiber;
    fib->role_idx = role_idx;
    fib->service_command = code;
    fib->command_arg = arg;
    fib->resend_timeout = 20;

    jacs_fiber_sleep(fib, 0);
}

void jacs_ctx_send_cmd(jacs_ctx_t *ctx, unsigned role_idx, unsigned code) {
    if (JD_IS_SET(code)) {
        jacs_regcache_entry_t *cached = jacs_regcache_lookup(
            &ctx->regcache, role_idx, (code & ~JD_CMD_SET_REGISTER) | JD_CMD_GET_REGISTER, 0);
        if (cached != NULL)
            jacs_regcache_free(&ctx->regcache, cached);
    }

    const jacs_role_desc_t *role = jacs_img_get_role(&ctx->img, role_idx);
    jacs_fiber_t *fib = ctx->curr_fiber;

    if (role->service_class == JD_SERVICE_CLASS_JACSCRIPT_CONDITION) {
        jacs_fiber_sleep(fib, 0);
        DMESG("wake condition");
        jacs_wake_role(ctx, role_idx);
        return;
    }

    fib->role_idx = role_idx;
    fib->service_command = code;
    fib->resend_timeout = 20;

    unsigned sz = ctx->packet.service_size;
    fib->payload = jd_alloc(sz);
    fib->payload_size = sz;
    memcpy(fib->payload, ctx->packet.data, sz);
    jacs_fiber_sleep(fib, 0);
}

void jacs_set_packet(jacs_ctx_t *ctx, unsigned role_idx, unsigned service_command,
                     const void *payload, unsigned sz) {
    jd_packet_t *pkt = &ctx->packet;
    pkt->_size = (sz + 4 + 3) & ~3;
    pkt->flags = JD_FRAME_FLAG_COMMAND;
    jd_device_t *dev = jd_service_parent(ctx->roles[role_idx].service);
    pkt->device_identifier = dev->device_identifier;
    pkt->service_size = sz;
    pkt->service_index = ctx->roles[role_idx].service->service_index;
    pkt->service_command = service_command;
    if (payload)
        memcpy(pkt->data, payload, sz);
}

#define RESUME_USER_CODE 0
#define KEEP_WAITING 1

static int jacs_fiber_prelude(jacs_fiber_t *fiber) {
    if (!fiber->service_command)
        return RESUME_USER_CODE;

    jacs_ctx_t *ctx = fiber->ctx;
    jd_device_service_t *serv = ctx->roles[fiber->role_idx].service;

    if (serv == NULL) {
        // role unbound, keep waiting, no timeout
        jacs_fiber_set_wake_time(fiber, 0);
        return KEEP_WAITING;
    }

    if (fiber->payload) {
        jacs_set_packet(ctx, fiber->role_idx, fiber->service_command, fiber->payload,
                        fiber->payload_size);
        jd_send_pkt(&ctx->packet);
        DMESG("send pkt");
        fiber->service_command = 0;
        jd_free(fiber->payload);
        fiber->payload = 0;
        return RESUME_USER_CODE;
    }

    jd_packet_t *pkt = &ctx->packet;

    if (jd_is_report(pkt) && pkt->service_command == fiber->service_command &&
        serv->service_index == pkt->service_index &&
        jd_service_parent(serv)->device_identifier == pkt->device_identifier) {
        int resp_size = pkt->service_size;
        uint8_t *dp = pkt->data;
        if (fiber->command_arg) {
            int slen = jacs_img_get_string_len(&ctx->img, fiber->command_arg);
            if (resp_size >= slen + 1 && pkt->data[slen] == 0 &&
                memcmp(jacs_img_get_string_ptr(&ctx->img, fiber->command_arg), pkt->data, slen) == 0) {
                resp_size -= slen + 1;
                dp += slen + 1;
            } else {
                dp = NULL;
            }
        }

        if (dp) {
            jacs_regcache_entry_t *q = jacs_regcache_lookup(
                &ctx->regcache, fiber->role_idx, fiber->service_command, fiber->command_arg);
            if (q && q->resp_size != resp_size) {
                jacs_regcache_free(&ctx->regcache, q);
                q = NULL;
            }

            if (!q) {
                q = jacs_regcache_alloc(&ctx->regcache, fiber->role_idx, fiber->service_command,
                                        resp_size);
                q->argument = fiber->command_arg;
            }

            memcpy(jacs_regcache_data(q), dp, resp_size);
            jacs_regcache_mark_used(&ctx->regcache, q);

            return RESUME_USER_CODE;
        }
    }

    if (jacs_now(ctx) >= fiber->wake_time) {
        int arglen = 0;
        const void *argp = NULL;
        if (fiber->command_arg) {
            arglen = jacs_img_get_string_len(&ctx->img, fiber->command_arg);
            argp = jacs_img_get_string_ptr(&ctx->img, fiber->command_arg);
        }

        jacs_set_packet(ctx, fiber->role_idx, fiber->service_command, argp, arglen);
        jd_send_pkt(&ctx->packet);
        DMESG("re-send pkt (%d)", fiber->resend_timeout);

        if (fiber->resend_timeout < 1000)
            fiber->resend_timeout *= 2;
        jacs_fiber_sleep(fiber, fiber->resend_timeout);
    }

    return KEEP_WAITING;
}

void jacs_run_fiber(jacs_fiber_t *fiber) {
    jacs_ctx_t *ctx = fiber->ctx;
    if (ctx->error_code)
        return;

    if (jacs_fiber_prelude(fiber) == KEEP_WAITING)
        return;

    jacs_fiber_set_wake_time(fiber, 0);
    fiber->role_idx = NO_ROLE;

    ctx->a = ctx->b = ctx->c = ctx->d = 0;

    ctx->curr_fiber = fiber;
    jacs_act_activate(fiber->activation);

    unsigned maxsteps = JACS_MAX_STEPS;
    while (ctx->curr_fn && --maxsteps)
        jacs_act_step(ctx->curr_fn);

    if (maxsteps == 0)
        jacs_ctx_panic(ctx, JACS_PANIC_TIMEOUT);
}

void jacs_wake_role(jacs_ctx_t *ctx, unsigned role_idx) {
    for (jacs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->role_idx == role_idx) {
            jacs_run_fiber(fiber);
        }
    }
}

void jacs_ctx_panic(jacs_ctx_t *ctx, unsigned code) {
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
