#include "devs_internal.h"

static devs_packet_t *getpkt(devs_ctx_t *ctx, value_t self) {
    devs_packet_t *pkt;
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_GC_OBJECT ||
        devs_gc_tag((pkt = devs_handle_ptr_value(ctx, self))) != DEVS_GC_TAG_PACKET) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_PACKET, self);
        return NULL;
    }
    return pkt;
}

#define SELF()                                                                                     \
    devs_packet_t *pkt = getpkt(ctx, self);                                                        \
    if (pkt == NULL)                                                                               \
    return devs_undefined

value_t prop_Packet_role(devs_ctx_t *ctx, value_t self) {
    SELF();
    if (devs_vm_role_ok(ctx, pkt->roleidx))
        return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, pkt->roleidx);
    return devs_undefined;
}

value_t prop_Packet_deviceIdentifier(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_string_sprintf(ctx, "%-s", jd_to_hex_a(&pkt->device_id, 8));
}

value_t prop_Packet_shortId(devs_ctx_t *ctx, value_t self) {
    SELF();
    char shortId[5];
    jd_device_short_id(shortId, pkt->device_id);
    return devs_string_sprintf(ctx, "%s", shortId);
}

value_t prop_Packet_serviceIndex(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_int(pkt->service_index);
}

value_t prop_Packet_serviceCommand(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_int(pkt->service_command);
}

value_t prop_Packet_flags(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_int(pkt->flags);
}

value_t prop_Packet_isCommand(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_bool(pkt->flags & JD_FRAME_FLAG_COMMAND);
}

value_t prop_Packet_isReport(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_bool(!(pkt->flags & JD_FRAME_FLAG_COMMAND));
}

value_t prop_Packet_payload(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_gc_obj(ctx, pkt->payload);
}

static bool is_event(devs_packet_t *pkt) {
    return !(pkt->flags & JD_FRAME_FLAG_COMMAND) &&
           pkt->service_index <= JD_SERVICE_INDEX_MAX_NORMAL &&
           (pkt->service_command & JD_CMD_EVENT_MASK) != 0;
}

value_t prop_Packet_isEvent(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_bool(is_event(pkt));
}

value_t prop_Packet_eventCode(devs_ctx_t *ctx, value_t self) {
    SELF();
    return is_event(pkt) ? devs_value_from_int(pkt->service_command & JD_CMD_EVENT_CODE_MASK)
                         : devs_undefined;
}

value_t prop_Packet_isRegSet(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_bool(JD_IS_SET(pkt->service_command));
}

value_t prop_Packet_isRegGet(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_bool(JD_IS_GET(pkt->service_command));
}

value_t prop_Packet_regCode(devs_ctx_t *ctx, value_t self) {
    SELF();
    if (!JD_IS_GET(pkt->service_command) && !JD_IS_SET(pkt->service_command))
        return devs_undefined;
    return devs_value_from_int(JD_REG_CODE(pkt->service_command));
}

value_t prop_Packet_isAction(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_bool((pkt->service_command & 0xf000) == 0);
}

const devs_packet_spec_t *devs_pkt_spec_by_code(devs_ctx_t *ctx, const devs_service_spec_t *spec,
                                                uint16_t code) {
    if (code == 0xffff)
        return NULL;
    const devs_packet_spec_t *pkts = devs_img_get_packet_spec(ctx->img, spec->packets_offset);
    unsigned num_packets = spec->num_packets;
    for (unsigned i = 0; i < num_packets; ++i) {
        if (pkts[i].code == code)
            return &pkts[i];
    }

    return NULL;
}

uint16_t devs_get_spec_code(uint8_t frame_flags, uint16_t service_command) {
    uint16_t top = service_command & 0xf000;

    if (frame_flags & JD_FRAME_FLAG_COMMAND) {
        if (top == JD_CMD_SET_REGISTER)
            return (service_command & 0x0fff) | DEVS_PACKETSPEC_CODE_REGISTER;
        if (top == 0)
            return service_command;
    } else {
        if (service_command & JD_CMD_EVENT_MASK)
            return (service_command & JD_CMD_EVENT_CODE_MASK) | DEVS_PACKETSPEC_CODE_EVENT;

        if (top == JD_CMD_GET_REGISTER)
            return (service_command & 0x0fff) | DEVS_PACKETSPEC_CODE_REGISTER;

        if (top == 0)
            return service_command | DEVS_PACKETSPEC_CODE_REPORT;
    }

    return 0xffff;
}

static uint16_t devs_pkt_get_spec_code(devs_packet_t *pkt) {
    return devs_get_spec_code(pkt->flags, pkt->service_command);
}

static const devs_packet_spec_t *devs_pkt_get_spec(devs_ctx_t *ctx, devs_packet_t *pkt) {
    if (pkt == NULL)
        return NULL;

    const devs_service_spec_t *spec = devs_role_spec(ctx, pkt->roleidx);
    if (spec == NULL)
        return NULL;

    return devs_pkt_spec_by_code(ctx, spec, devs_pkt_get_spec_code(pkt));
}

void meth0_Packet_decode(devs_ctx_t *ctx) {
    devs_packet_t *pkt = getpkt(ctx, devs_arg_self(ctx));
    const devs_packet_spec_t *pspec = devs_pkt_get_spec(ctx, pkt);
    if (pspec)
        devs_ret(ctx, devs_packet_decode(ctx, pspec, pkt->payload->data, pkt->payload->length));
}