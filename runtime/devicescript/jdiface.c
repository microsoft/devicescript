#include "jacs_internal.h"

void jacs_jd_get_register(jacs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
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

void jacs_jd_send_cmd(jacs_ctx_t *ctx, unsigned role_idx, unsigned code) {
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
        jacs_jd_wake_role(ctx, role_idx);
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

void jacs_jd_wake_role(jacs_ctx_t *ctx, unsigned role_idx) {
    for (jacs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->role_idx == role_idx) {
            jacs_fiber_run(fiber);
        }
    }
}

#define RESUME_USER_CODE 1
#define KEEP_WAITING 0

bool jacs_jd_should_run(jacs_fiber_t *fiber) {
    if (!fiber->service_command) {
        return RESUME_USER_CODE;
    }

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
                memcmp(jacs_img_get_string_ptr(&ctx->img, fiber->command_arg), pkt->data, slen) ==
                    0) {
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
