#include "devs_internal.h"

static const devs_packet_spec_t *getspec(devs_ctx_t *ctx, value_t self) {
    unsigned roleidx;
    const devs_packet_spec_t *s = devs_decode_role_packet(ctx, self, &roleidx);
    if (!s || roleidx != DEVS_ROLE_INVALID)
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_SERVICESPEC, self);
    return s;
}

#define SELF()                                                                                     \
    const devs_packet_spec_t *spec = getspec(ctx, self);                                           \
    if (spec == NULL)                                                                              \
    return devs_undefined

value_t prop_DsPacketSpec_parent(devs_ctx_t *ctx, value_t self) {
    SELF();
    int idx = devs_packet_spec_parent(ctx, spec);
    if (idx < 0)
        return devs_undefined;
    return devs_value_from_service_spec_idx(ctx, idx);
}

value_t prop_DsPacketSpec_name(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_handle(DEVS_HANDLE_TYPE_IMG_BUFFERISH, spec->name_idx);
}

value_t prop_DsPacketSpec_code(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_int(spec->code);
}

value_t prop_DsPacketSpec_response(devs_ctx_t *ctx, value_t self) {
    SELF();

    unsigned tp = spec->code & DEVS_PACKETSPEC_CODE_MASK;

    if (tp == DEVS_PACKETSPEC_CODE_REGISTER)
        return self;

    if (tp == DEVS_PACKETSPEC_CODE_COMMAND) {
        int idx = devs_packet_spec_parent(ctx, spec);
        if (idx < 0)
            return devs_undefined;
        const devs_service_spec_t *srv = devs_img_get_service_spec(ctx->img, idx);
        const devs_packet_spec_t *resp = devs_pkt_spec_by_code(
            ctx, srv, (spec->code & ~DEVS_PACKETSPEC_CODE_MASK) | DEVS_PACKETSPEC_CODE_REPORT);
        return devs_value_from_packet_spec(ctx, resp);
    }

    return devs_undefined;
}

void methX_DsPacketSpec_encode(devs_ctx_t *ctx) {
    const devs_packet_spec_t *spec = getspec(ctx, devs_arg_self(ctx));
    if (spec == NULL)
        return;

    int idx = devs_packet_spec_parent(ctx, spec);
    if (idx < 0)
        return;

    memset(&ctx->frame, 0, sizeof(ctx->frame));

    unsigned tp = spec->code & DEVS_PACKETSPEC_CODE_MASK;
    ctx->packet.service_command = spec->code & 0x0fff;
    ctx->packet.device_identifier = devs_jd_server_device_id();
    if (tp == DEVS_PACKETSPEC_CODE_REGISTER)
        ctx->packet.service_command |= JD_CMD_GET_REGISTER;
    else if (tp == DEVS_PACKETSPEC_CODE_EVENT)
        TODO();

    devs_packet_encode(ctx, spec);
    devs_ret(ctx, devs_jd_pkt_capture(ctx, DEVS_ROLE_FIRST_SPEC + idx));
    
#if 0
    devs_packet_t *pkt = devs_value_to_gc_obj(ctx, ctx->ret_val);
    if (pkt) {
    }
#endif
}
