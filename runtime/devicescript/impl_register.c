#include "devs_internal.h"

DEVS_DERIVE(DsRegister_prototype, DsPacketInfo_prototype)
DEVS_DERIVE(DsCommand_prototype, DsPacketInfo_prototype)
DEVS_DERIVE(DsEvent_prototype, DsPacketInfo_prototype)

static const devs_packet_spec_t *getrolepkt(devs_ctx_t *ctx, unsigned *role, value_t self) {
    const devs_packet_spec_t *pkt = devs_decode_role_packet(ctx, self, role);
    if (pkt == NULL) {
        devs_throw_expecting_error_ext(ctx, "role member", self);
        return NULL;
    }
    return pkt;
}

static const devs_packet_spec_t *devs_arg_self_reg(devs_ctx_t *ctx, unsigned *role) {
    value_t self = devs_arg_self(ctx);
    const devs_packet_spec_t *pkt = getrolepkt(ctx, role, self);
    if (pkt && *role == DEVS_ROLE_INVALID) {
        devs_throw_expecting_error_ext(ctx, "instantiated role member", self);
        return NULL;
    }
    return pkt;
}

value_t devs_packet_decode(devs_ctx_t *ctx, const devs_packet_spec_t *pkt, uint8_t *dp,
                           unsigned len) {
    uint8_t *ep = dp + len;

    if (pkt->flags & DEVS_PACKETSPEC_FLAG_MULTI_FIELD) {
        devs_array_t *arr = devs_array_try_alloc(ctx, 0);
        if (!arr)
            return devs_undefined;
        value_t res = devs_value_from_gc_obj(ctx, arr);
        devs_value_pin(ctx, res);

        const devs_field_spec_t *fld = devs_img_get_field_spec(ctx->img, pkt->numfmt_or_offset);
        const devs_field_spec_t *rep = NULL;

        for (;;) {
            intptr_t sz = ep - dp;
            if (sz < 0)
                break;
            uint8_t *dp0 = dp;
            value_t tmp = devs_buffer_decode(ctx, fld->numfmt, &dp, sz);
            if (devs_is_undefined(tmp))
                break;
            devs_array_pin_push(ctx, arr, tmp);
            if (dp == dp0)
                break;

            if (!rep && fld->flags & DEVS_FIELDSPEC_FLAG_STARTS_REPEATS)
                rep = fld;
            fld++;
            if (!fld->name_idx) {
                if (rep)
                    fld = rep;
                else
                    break;
            }
        }

        devs_value_unpin(ctx, res);
        return res;
    } else {
        return devs_buffer_decode(ctx, pkt->numfmt_or_offset, &dp, ep - dp);
    }
}

static void DsRegister_read_cont(devs_ctx_t *ctx, void *userdata) {
    devs_ret(ctx, devs_packet_decode(ctx, userdata, ctx->packet.data, ctx->packet.service_size));
}

void meth0_DsRegister_read(devs_ctx_t *ctx) {
    unsigned role;
    const devs_packet_spec_t *pkt = devs_arg_self_reg(ctx, &role);
    if (pkt == NULL)
        return;

    devs_fiber_t *f = ctx->curr_fiber;

    // TODO delay 500 for regular
    // TODO delay 0 (none) for const
    devs_jd_get_register(ctx, role, pkt->code, 500, 0);
    devs_setup_resume(f, DsRegister_read_cont, (void *)pkt);
}

void devs_packet_encode(devs_ctx_t *ctx, const devs_packet_spec_t *pkt) {
    unsigned argc = ctx->stack_top_for_gc - 1;
    value_t *argv = ctx->the_stack + 1;
    if (argc == 1 && devs_is_array(ctx, argv[0])) {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, argv[0]);
        argv = arr->data;
        argc = arr->length;
    }

    uint8_t *ep = ctx->packet.data + JD_SERIAL_PAYLOAD_SIZE;
    uint8_t *dp = ctx->packet.data;

    if (pkt->flags & DEVS_PACKETSPEC_FLAG_MULTI_FIELD) {
        const devs_field_spec_t *fld = devs_img_get_field_spec(ctx->img, pkt->numfmt_or_offset);
        const devs_field_spec_t *rep = NULL;

        for (unsigned argp = 0; argp < argc; argp++) {
            intptr_t sz = ep - dp;
            if (sz < 0)
                break;

            int off = devs_buffer_encode(ctx, fld->numfmt, dp, ep - dp, argv[argp]);

            if (off == 0)
                break;
            dp += off;

            if (!rep && fld->flags & DEVS_FIELDSPEC_FLAG_STARTS_REPEATS)
                rep = fld;
            fld++;
            if (!fld->name_idx) {
                if (rep)
                    fld = rep;
                else
                    break;
            }
        }
    } else {
        if (argc >= 1) {
            if (argc > 1) {
                devs_throw_range_error(ctx, "only one value expected; got %d", argc);
            } else {
                int off = devs_buffer_encode(ctx, pkt->numfmt_or_offset, dp, ep - dp, argv[0]);
                dp += off;
            }
        }
    }

    ctx->packet.service_size = dp - ctx->packet.data;
}

void methX_DsRegister_write(devs_ctx_t *ctx) {
    unsigned role;
    const devs_packet_spec_t *pkt = devs_arg_self_reg(ctx, &role);
    if (pkt == NULL)
        return;

    devs_packet_encode(ctx, pkt);
    devs_jd_send_cmd(ctx, role, JD_SET(pkt->code & 0x0fff));
}

#define SELF()                                                                                     \
    unsigned role;                                                                                 \
    const devs_packet_spec_t *pkt = getrolepkt(ctx, &role, self);                                  \
    if (pkt == NULL)                                                                               \
    return devs_undefined

value_t prop_DsPacketInfo_role(devs_ctx_t *ctx, value_t self) {
    SELF();
    if (role == DEVS_ROLE_INVALID)
        return devs_undefined;
    return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, role);
}

value_t prop_DsPacketInfo_name(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_handle(DEVS_HANDLE_TYPE_IMG_BUFFERISH, pkt->name_idx);
}

value_t prop_DsPacketInfo_code(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_int(pkt->code & 0xfff);
}

void methX_DsCommand___func__(devs_ctx_t *ctx) {
    unsigned role;
    const devs_packet_spec_t *pkt = devs_arg_self_reg(ctx, &role);
    if (pkt == NULL)
        return;

    devs_packet_encode(ctx, pkt);

    const devs_service_spec_t *spec = devs_role_spec(ctx, role);
    uint16_t report_code = devs_get_spec_code(0, pkt->code);
    const devs_packet_spec_t *rep_spec = devs_pkt_spec_by_code(ctx, spec, report_code);
    if (rep_spec) {
        // if there is a report, we need to wait for it - tail call to Role._commandResponse()
        ctx->stack_top_for_gc = 3;
        ctx->the_stack[2] =
            devs_value_from_handle(DEVS_HANDLE_TYPE_FIBER, ctx->curr_fiber->handle_tag);
        ctx->the_stack[0] = devs_undefined;
        ctx->the_stack[1] = devs_undefined;
        value_t roleval = devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, role);
        // the next line may allocate so we have to have our stack in order (thus the undefined
        // assignments above)
        ctx->the_stack[0] = devs_function_bind(
            ctx, roleval,
            devs_object_get_built_in_field(ctx, roleval, DEVS_BUILTIN_STRING__COMMANDRESPONSE));
        // service_index is not used, except it cannot be 0xff - we only care about the payload and role anyways
        ctx->packet.service_index = 1;
        ctx->packet.service_command = pkt->code;
        ctx->the_stack[1] = devs_jd_pkt_capture(ctx, role);
        // call the _commandResponse() which will send the packet and wait for response
        devs_fiber_call_function(ctx->curr_fiber, 2, NULL);
    } else {
        // no report - just send the packet
        devs_jd_send_cmd(ctx, role, pkt->code);
    }
}
