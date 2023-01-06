#include "devs_internal.h"

value_t prop_Role_isConnected(devs_ctx_t *ctx, value_t self) {
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60163);
        return devs_undefined;
    }

    uint32_t roleidx = devs_handle_value(self);
    return devs_value_from_bool(devs_role(ctx, roleidx)->service != NULL);
}

void meth2_Role_sendCommand(devs_ctx_t *ctx) {
    value_t self = devs_arg_self(ctx);
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60189);
    } else {
        unsigned role = devs_handle_value(self);
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
}
