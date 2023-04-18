#include "devs_internal.h"

value_t prop_DsRole_isBound(devs_ctx_t *ctx, value_t self) {
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE)
        return devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ROLE, self);

    uint32_t roleidx = devs_handle_value(self);
    return devs_value_from_bool(devs_role(ctx, roleidx)->service != NULL);
}

value_t prop_DsRole_spec(devs_ctx_t *ctx, value_t self) {
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE)
        return devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ROLE, self);

    uint32_t roleidx = devs_handle_value(self);
    const devs_service_spec_t *spec = devs_role_spec(ctx, roleidx);

    return devs_value_from_service_spec(ctx, spec);
}

static unsigned devs_arg_self_role(devs_ctx_t *ctx) {
    value_t self = devs_arg_self(ctx);
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ROLE, self);
        return DEVS_ROLE_INVALID;
    } else {
        return devs_handle_value(self);
    }
}

void meth2_DsRole_sendCommand(devs_ctx_t *ctx) {
    unsigned role = devs_arg_self_role(ctx);
    if (role == DEVS_ROLE_INVALID)
        return;

    unsigned cmd = devs_arg_int(ctx, 0);
    value_t payload = devs_arg(ctx, 1);
    unsigned sz;
    const void *data = devs_bufferish_data(ctx, payload, &sz);
    if (cmd > 0xffff)
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_SERVICECOMMAND);
    else if (sz > JD_SERIAL_PAYLOAD_SIZE)
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_PAYLOAD);
    else {
        ctx->packet.service_size = sz;
        memcpy(ctx->packet.data, data, sz);
        devs_jd_send_cmd(ctx, role, cmd);
    }
}
