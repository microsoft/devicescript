#include "devs_internal.h"

#define LOG_TAG "jdif"
#include "devs_logging.h"

#define RESUME_USER_CODE 1
#define KEEP_WAITING 0

void devs_jd_get_register(devs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
                          unsigned arg) {
    if (ctx->error_code)
        return;
    jd_device_service_t *serv = devs_role(ctx, role_idx)->service;
    if (serv != NULL) {
        devs_regcache_entry_t *cached = devs_regcache_lookup(&ctx->regcache, role_idx, code, arg);
        if (cached != NULL) {
            if (!timeout || timeout > DEVS_MAX_REG_VALIDITY)
                timeout = DEVS_MAX_REG_VALIDITY;
            // DMESG("cached cmd=%x %d < %d", code, cached->last_refresh_time + timeout,
            //      devs_now(ctx));
            if (cached->last_refresh_time + timeout < devs_now(ctx)) {
                devs_regcache_free(&ctx->regcache, cached);
            } else {
                cached = devs_regcache_mark_used(&ctx->regcache, cached);
                memset(&ctx->packet, 0, sizeof(ctx->packet));
                ctx->packet.service_command = cached->service_command;
                ctx->packet.service_size = cached->resp_size;
                ctx->packet.service_index = serv->service_index;
                ctx->packet.device_identifier = jd_service_parent(serv)->device_identifier;
                memcpy(ctx->packet.data, devs_regcache_data(cached), cached->resp_size);
                // DMESG("cached reg %x sz=%d cmd=%d", code, cached->resp_size,
                // cached->service_command);
                return;
            }
        }
    }

    devs_fiber_t *fib = ctx->curr_fiber;
    JD_ASSERT(fib != NULL);
    fib->role_idx = role_idx;
    fib->service_command = code;
    fib->pkt_kind = DEVS_PKT_KIND_REG_GET;
    fib->pkt_data.reg_get.string_idx = arg;
    fib->pkt_data.reg_get.resend_timeout = 20;

    // DMESG("wait reg %x", code);
    devs_fiber_sleep(fib, 0);
}

void devs_jd_clear_pkt_kind(devs_fiber_t *fib) {
    switch (fib->pkt_kind) {
    case DEVS_PKT_KIND_SEND_PKT:
    case DEVS_PKT_KIND_SEND_RAW_PKT:
        devs_free(fib->ctx, fib->pkt_data.send_pkt.data);
        break;
    default:
        break;
    }
    fib->pkt_data.v = devs_undefined;
    fib->pkt_kind = DEVS_PKT_KIND_NONE;
}

void devs_jd_send_cmd(devs_ctx_t *ctx, unsigned role_idx, unsigned code) {
    if (ctx->error_code)
        return;
    if (JD_IS_SET(code)) {
        devs_regcache_entry_t *cached = devs_regcache_lookup(
            &ctx->regcache, role_idx, (code & ~JD_CMD_SET_REGISTER) | JD_CMD_GET_REGISTER, 0);
        if (cached != NULL)
            devs_regcache_free(&ctx->regcache, cached);
    }

    devs_fiber_t *fib = ctx->curr_fiber;
    JD_ASSERT(fib != NULL);

    fib->role_idx = role_idx;
    fib->service_command = code;

    unsigned sz = ctx->packet.service_size;
    fib->pkt_kind = DEVS_PKT_KIND_SEND_PKT;
    fib->pkt_data.send_pkt.data = devs_try_alloc(ctx, sz);
    if (fib->pkt_data.send_pkt.data != NULL) {
        fib->pkt_data.send_pkt.size = sz;
        memcpy(fib->pkt_data.send_pkt.data, ctx->packet.data, sz);
    }
    devs_fiber_sleep(fib, 0);
}

void devs_jd_send_raw(devs_ctx_t *ctx) {
    if (ctx->error_code)
        return;

    devs_fiber_t *fib = ctx->curr_fiber;
    JD_ASSERT(fib != NULL);

    jd_packet_t *pkt = &ctx->packet;

    fib->role_idx = DEVS_ROLE_INVALID;
    fib->service_command = pkt->service_command;

    unsigned sz = pkt->service_size + JD_SERIAL_FULL_HEADER_SIZE;
    fib->pkt_kind = DEVS_PKT_KIND_SEND_RAW_PKT;
    fib->pkt_data.send_pkt.data = devs_try_alloc(ctx, sz);
    if (fib->pkt_data.send_pkt.data != NULL) {
        fib->pkt_data.send_pkt.size = sz;
        memcpy(fib->pkt_data.send_pkt.data, pkt, sz);
    }
    devs_fiber_sleep(fib, 0);
}

void devs_jd_send_logmsg(devs_ctx_t *ctx, char lev, value_t str) {
    if (ctx->error_code)
        return;

    unsigned sz;
    const char *ptr = devs_string_get_utf8(ctx, str, &sz);

    if (strchr(ptr, '\n')) {
        char *tmp = jd_strdup(ptr);
        char *sp = tmp, *ep = tmp;
        while (*ep) {
            if (*ep == '\n') {
                *ep++ = 0;
                DMESG("%c %s", lev, sp);
                sp = ep;
            } else {
                ep++;
            }
        }
        if (*sp)
            DMESG("%c %s", lev, sp);
        jd_free(tmp);
    } else {
        if (lev == '#')
            DMESG("# %u %s", (unsigned)ctx->_now_long, ptr);
        else
            DMESG("%c %s", lev, ptr);
    }
}

static void devs_jd_set_packet(devs_ctx_t *ctx, unsigned role_idx, unsigned service_command,
                               const void *payload, unsigned sz) {
    jd_packet_t *pkt = &ctx->packet;
    pkt->_size = (sz + 4 + 3) & ~3;
    pkt->flags = JD_FRAME_FLAG_COMMAND;
    jd_device_t *dev = jd_service_parent(devs_role(ctx, role_idx)->service);
    pkt->device_identifier = dev->device_identifier;
    pkt->service_size = sz;
    pkt->service_index = devs_role(ctx, role_idx)->service->service_index;
    pkt->service_command = service_command;
    if (payload)
        memcpy(pkt->data, payload, sz);
}

value_t devs_jd_pkt_capture(devs_ctx_t *ctx, unsigned role_idx) {
    if (ctx->packet.service_index == 0xff)
        return devs_undefined;
    devs_packet_t *pkt = devs_any_try_alloc(ctx, DEVS_GC_TAG_PACKET, sizeof(*pkt));
    if (pkt == NULL)
        return devs_undefined;

    value_t r = devs_value_from_gc_obj(ctx, pkt);
    devs_value_pin(ctx, r);

    pkt->payload = devs_buffer_try_alloc(ctx, ctx->packet.service_size);
    if (pkt->payload == NULL) {
        devs_value_unpin(ctx, r);
        return devs_undefined;
    }
    memcpy(pkt->payload->data, ctx->packet.data, pkt->payload->length);
    pkt->device_id = ctx->packet.device_identifier;
    pkt->service_index = ctx->packet.service_index;
    pkt->service_command = ctx->packet.service_command;
    pkt->flags = ctx->packet.flags;
    pkt->roleidx = role_idx;

    devs_value_unpin(ctx, r);
    return r;
}

static void start_pkt_handler(devs_ctx_t *ctx, value_t fn, unsigned role_idx) {
    if (devs_is_undefined(fn))
        return;

    ctx->stack_top_for_gc = 2;
    ctx->the_stack[0] = fn;
    // null it out first, in case devs_jd_pkt_capture() triggers GC
    ctx->the_stack[1] = devs_undefined;
    ctx->the_stack[1] = devs_jd_pkt_capture(ctx, role_idx);
    devs_fiber_t *fiber = devs_fiber_start(ctx, 1, DEVS_OPCALL_BG);
    if (fiber)
        fiber->role_wkp = 1;
}

void devs_jd_wake_role(devs_ctx_t *ctx, unsigned role_idx) {
    for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
        if (fiber->role_idx == role_idx) {
            fiber->role_wkp = 1;
        }
    }

    value_t role = devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, role_idx);
    value_t fn = devs_function_bind(
        ctx, role, devs_object_get_built_in_field(ctx, role, DEVS_BUILTIN_STRING__ONPACKET));

    start_pkt_handler(ctx, fn, role_idx);

    int runsome = 1;
    while (runsome) {
        runsome = 0;
        for (devs_fiber_t *fiber = ctx->fibers; fiber; fiber = fiber->next) {
            if (fiber->role_wkp) {
                fiber->role_wkp = 0;
                devs_fiber_run(fiber);
                runsome = 1;
                break; // can't go to next - fiber might be gone
            }
        }
    }
}

static int devs_jd_reg_arg_length(devs_ctx_t *ctx, unsigned command_arg) {
    JD_ASSERT(command_arg != 0);
    jd_packet_t *pkt = &ctx->packet;
    unsigned slen;
    const char *ptr = devs_get_static_utf8(ctx, command_arg, &slen);
    if (pkt->service_size >= (int)slen + 1 && pkt->data[slen] == 0 &&
        memcmp(ptr, pkt->data, slen) == 0) {
        return slen + 1;
    } else {
        return 0;
    }
}

static devs_regcache_entry_t *devs_jd_update_regcache(devs_ctx_t *ctx, unsigned role_idx,
                                                      unsigned command_arg) {
    jd_packet_t *pkt = &ctx->packet;

    int resp_size = pkt->service_size;
    uint8_t *dp = pkt->data;
    if (command_arg) {
        int slen = devs_jd_reg_arg_length(ctx, command_arg);
        if (!slen)
            return NULL;
        dp += slen;
        resp_size -= slen;
    }

    devs_regcache_entry_t *q =
        devs_regcache_lookup(&ctx->regcache, role_idx, pkt->service_command, command_arg);
    if (q && q->resp_size != resp_size) {
        devs_regcache_free(&ctx->regcache, q);
        q = NULL;
    }

    if (!q) {
        q = devs_regcache_alloc(&ctx->regcache, role_idx, pkt->service_command, resp_size);
        q->argument = command_arg;
    }

    memcpy(devs_regcache_data(q), dp, resp_size);
    q->last_refresh_time = devs_now(ctx);

    return q;
}

static bool devs_jd_pkt_matches_role(devs_ctx_t *ctx, unsigned role_idx) {
    jd_packet_t *pkt = &ctx->packet;
    jd_device_service_t *serv = devs_role(ctx, role_idx)->service;
    return serv &&
           ((pkt->service_index == 0 && pkt->service_command == 0) ||
            serv->service_index == pkt->service_index) &&
           jd_service_parent(serv)->device_identifier == pkt->device_identifier;
}

static bool retry_soon(devs_fiber_t *fiber) {
    devs_fiber_sleep(fiber, 3);
    return KEEP_WAITING;
}

static bool role_missing(devs_fiber_t *fiber) {
    devs_ctx_t *ctx = fiber->ctx;
    jd_device_service_t *serv = devs_role(ctx, fiber->role_idx)->service;

    if (serv == NULL) {
        // role unbound, keep waiting, no timeout
        devs_fiber_set_wake_time(fiber, 0);
        return 1;
    }

    return 0;
}

static bool handle_reg_get(devs_fiber_t *fiber) {
    if (role_missing(fiber))
        return KEEP_WAITING;

    devs_ctx_t *ctx = fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;
    if (jd_is_report(pkt) && pkt->service_command &&
        pkt->service_command == fiber->service_command &&
        devs_jd_pkt_matches_role(ctx, fiber->role_idx)) {
        devs_regcache_entry_t *q =
            devs_jd_update_regcache(ctx, fiber->role_idx, fiber->pkt_data.reg_get.string_idx);
        if (q) {
            q = devs_regcache_mark_used(&ctx->regcache, q);
            return RESUME_USER_CODE;
        }
    }

    if (devs_now(ctx) >= fiber->wake_time) {
        unsigned arglen = 0;
        const void *argp = NULL;
        if (fiber->pkt_data.reg_get.string_idx) {
            argp = devs_get_static_utf8(ctx, fiber->pkt_data.reg_get.string_idx, &arglen);
        }

        devs_jd_set_packet(ctx, fiber->role_idx, fiber->service_command, argp, arglen);
        if (jd_send_pkt(&ctx->packet) != 0) {
            LOGV("(re)send pkt FAILED cmd=%x", fiber->service_command);
            return retry_soon(fiber);
        } else {
            LOGV("(re)send pkt cmd=%x", fiber->service_command);
            if (fiber->pkt_data.reg_get.resend_timeout < 1000)
                fiber->pkt_data.reg_get.resend_timeout *= 2;
            devs_fiber_sleep(fiber, fiber->pkt_data.reg_get.resend_timeout);
        }
    }
    return KEEP_WAITING;
}

static bool handle_send_pkt(devs_fiber_t *fiber) {
    if (role_missing(fiber))
        return KEEP_WAITING;

    devs_ctx_t *ctx = fiber->ctx;
    devs_jd_set_packet(ctx, fiber->role_idx, fiber->service_command, fiber->pkt_data.send_pkt.data,
                       fiber->pkt_data.send_pkt.size);
    if (jd_send_pkt(&ctx->packet) == 0) {
        LOGV("send pkt cmd=%x sz=%d", fiber->service_command, ctx->packet.service_size);
        // jd_log_packet(&ctx->packet);
        return RESUME_USER_CODE;
    } else {
        LOGV("send pkt FAILED cmd=%x", fiber->service_command);
        return retry_soon(fiber);
    }
}

static bool handle_send_raw_pkt(devs_fiber_t *fiber) {
    if (jd_send_pkt((void *)fiber->pkt_data.send_pkt.data) == 0) {
        LOGV("send raw pkt cmd=%x", fiber->service_command);
        // jd_log_packet(&ctx->packet);
        return RESUME_USER_CODE;
    } else {
        LOGV("send raw pkt FAILED cmd=%x", fiber->service_command);
        return retry_soon(fiber);
    }
}

bool devs_jd_should_run(devs_fiber_t *fiber) {
    if (fiber->pkt_kind == DEVS_PKT_KIND_NONE || fiber->pkt_kind == DEVS_PKT_KIND_SUSPENDED)
        return RESUME_USER_CODE;

    switch (fiber->pkt_kind) {
    case DEVS_PKT_KIND_ROLE_WAIT:
        fiber->ret_val = devs_jd_pkt_capture(fiber->ctx, fiber->role_idx);
        return RESUME_USER_CODE;

    case DEVS_PKT_KIND_REG_GET:
        return handle_reg_get(fiber);

    case DEVS_PKT_KIND_SEND_PKT:
        return handle_send_pkt(fiber);

    case DEVS_PKT_KIND_SEND_RAW_PKT:
        return handle_send_raw_pkt(fiber);

    default:
        JD_PANIC();
    }
}

static void devs_jd_update_all_regcache(devs_ctx_t *ctx, unsigned role_idx) {
    devs_regcache_entry_t *q = NULL;
    jd_packet_t *pkt = &ctx->packet;

    if (jd_is_command(pkt))
        return;

    if (jd_is_event(pkt) && (pkt->service_command & JD_CMD_EVENT_CODE_MASK) == JD_EV_CHANGE) {
        devs_regcache_age(&ctx->regcache, role_idx, devs_now(ctx) - 10000);
        return;
    }

    for (;;) {
        q = devs_regcache_next(&ctx->regcache, role_idx, pkt->service_command, q);
        if (!q)
            break;
        if (devs_jd_update_regcache(ctx, q->role_idx, q->argument))
            break; // we only allow for one update
    }
}

void devs_jd_process_pkt(devs_ctx_t *ctx, jd_device_service_t *serv, jd_packet_t *pkt) {
    if (devs_is_suspended(ctx))
        return;

    memcpy(&ctx->packet, pkt, pkt->service_size + 16);
    pkt = &ctx->packet;

    unsigned numroles = devs_img_num_roles(ctx->img);

    if (jd_is_command(pkt) && pkt->device_identifier == devs_jd_server_device_id()) {
        value_t fn = devs_maplike_get_no_bind(
            ctx, devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_DEVICESCRIPT),
            devs_builtin_string(DEVS_BUILTIN_STRING__ONSERVERPACKET));
        start_pkt_handler(ctx, fn, DEVS_ROLE_INVALID);
    }

    // DMESG("pkt %d %x / %d", pkt->service_index, pkt->service_command, pkt->service_size);
    // jd_log_packet(&ctx->packet);

    for (unsigned idx = 0; idx < numroles; ++idx) {
        if (devs_jd_pkt_matches_role(ctx, idx)) {
#if 0
            DMESG("wake pkt s=%d %x / %d r=%s", pkt->service_index, pkt->service_command,
                  pkt->service_size, devs_role(ctx, idx)->name);
#endif
            devs_fiber_sync_now(ctx);
            devs_jd_update_all_regcache(ctx, idx);
            devs_jd_wake_role(ctx, idx);
        }
    }

    devs_fiber_poke(ctx);
}

void devs_jd_role_changed(devs_ctx_t *ctx, jd_role_t *role) {
    if (ctx->flags & DEVS_CTX_FREEING_ROLES)
        return;

    if (devs_trace_enabled(ctx)) {
        unsigned sz = rolemgr_serialized_role_size(role);
        void *data = rolemgr_serialize_role(role);
        devs_trace(ctx, DEVS_TRACE_EV_ROLE_CHANGED, data, sz);
    }

    unsigned numroles = devs_img_num_roles(ctx->img);
    for (unsigned idx = 0; idx < numroles; ++idx) {
        if (devs_role(ctx, idx) == role) {
            devs_regcache_free_role(&ctx->regcache, idx);
            devs_jd_reset_packet(ctx);
            devs_jd_wake_role(ctx, idx);
            break;
        }
    }
    devs_fiber_poke(ctx);
}

void devs_jd_reset_packet(devs_ctx_t *ctx) {
    memset(&ctx->packet, 0xff, 32);
}

void devs_jd_init_roles(devs_ctx_t *ctx) {
    devs_jd_free_roles(ctx); // free any previous roles
    unsigned numroles = devs_img_num_roles(ctx->img);
    for (unsigned idx = 0; idx < numroles; ++idx) {
        const devs_role_desc_t *role = devs_img_get_role(ctx->img, idx);
        ctx->roles[idx].role =
            jd_role_alloc(devs_img_role_name(ctx->img, idx), role->service_class);
    }
    jd_role_force_autobind();
}

void devs_jd_free_roles(devs_ctx_t *ctx) {
    ctx->flags |= DEVS_CTX_FREEING_ROLES;
    jd_role_free_all();
    ctx->flags &= ~DEVS_CTX_FREEING_ROLES;
}

uint32_t devs_global_flags;
void devs_set_global_flags(uint32_t global_flags) {
    devs_global_flags |= global_flags;
}
void devs_reset_global_flags(uint32_t global_flags) {
    devs_global_flags &= ~global_flags;
}
uint32_t devs_get_global_flags(void) {
    return devs_global_flags;
}

__attribute__((weak)) uint64_t devs_jd_server_device_id(void) {
    return jd_device_id() ^ 0xdb2249a7751b53f8;
}