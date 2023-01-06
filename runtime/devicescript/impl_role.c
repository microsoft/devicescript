#include "devs_internal.h"

value_t prop_Role_isConnected(devs_ctx_t *ctx, value_t self) {
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60163);
        return devs_undefined;
    }

    uint32_t roleidx = devs_handle_value(self);
    return devs_value_from_bool(devs_role(ctx, roleidx)->service != NULL);
}

static unsigned devs_arg_self_role(devs_ctx_t *ctx) {
    value_t self = devs_arg_self(ctx);
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60189);
        return DEVS_ROLE_INVALID;
    } else {
        return devs_handle_value(self);
    }
}

void meth2_Role_sendCommand(devs_ctx_t *ctx) {
    unsigned role = devs_arg_self_role(ctx);
    if (role == DEVS_ROLE_INVALID)
        return;

    unsigned cmd = devs_arg_int(ctx, 0);
    value_t payload = devs_arg(ctx, 1);
    unsigned sz;
    const void *data = devs_bufferish_data(ctx, payload, &sz);
    if (cmd > 0xffff)
        devs_runtime_failure(ctx, 60190);
    else if (sz > JD_SERIAL_PAYLOAD_SIZE)
        devs_runtime_failure(ctx, 60191);
    else {
        ctx->packet.service_size = sz;
        memcpy(ctx->packet.data, data, sz);
        devs_jd_send_cmd(ctx, role, cmd);
    }
}

void meth0_Role_wait(devs_ctx_t *ctx) {
    unsigned role = devs_arg_self_role(ctx);
    if (role == DEVS_ROLE_INVALID)
        return;

    ctx->curr_fiber->pkt_kind = DEVS_PKT_KIND_ROLE_WAIT;
    ctx->curr_fiber->role_idx = role;
    devs_fiber_set_wake_time(ctx->curr_fiber, 0);
    devs_fiber_yield(ctx);
}
