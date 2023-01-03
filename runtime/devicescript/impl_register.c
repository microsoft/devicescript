#include "devs_internal.h"

static const devs_packet_spec_t *devs_arg_self_reg(devs_ctx_t *ctx, unsigned *role) {
    const devs_packet_spec_t *pkt = devs_decode_role_packet(ctx, devs_arg_self(ctx), role);
    if (pkt == NULL) {
        devs_runtime_failure(ctx, 60173);
        return NULL;
    }
    if (*role == DEVS_ROLE_INVALID) {
        devs_runtime_failure(ctx, 60174);
        return NULL;
    }
    return pkt;
}

static void DsRegister_read_cont(devs_ctx_t *ctx, void *data) {
    const devs_packet_spec_t *pkt = data;

    if (pkt->flags & DEVS_PACKETSPEC_FLAG_MULTI_FIELD) {
        devs_array_t *arr = devs_array_try_alloc(ctx, 0);
        if (!arr)
            return;
        value_t res = devs_value_from_gc_obj(ctx, arr);
        devs_value_pin(ctx, res);

        uint8_t *ep = ctx->packet.data + ctx->packet.service_size;
        uint8_t *dp = ctx->packet.data;

        const devs_field_spec_t *fld = devs_img_get_field_spec(ctx->img, pkt->numfmt_or_offset);
        const devs_field_spec_t *rep = NULL;

        for (;;) {
            intptr_t sz = ep - dp;
            if (sz < 0)
                break;
            uint8_t *dp0 = dp;
            value_t tmp = devs_buffer_decode(ctx, fld->numfmt, &dp, sz);
            if (devs_is_null(tmp))
                break;
            devs_value_pin(ctx, tmp);
            devs_array_set(ctx, arr, arr->length, tmp);
            devs_value_unpin(ctx, tmp);
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
        devs_ret(ctx, res);
    } else {
        uint8_t *dp = ctx->packet.data;
        value_t tmp = devs_buffer_decode(ctx, pkt->numfmt_or_offset, &dp, ctx->packet.service_size);
        devs_ret(ctx, tmp);
    }
}

void meth0_DsRegister_read(devs_ctx_t *ctx) {
    unsigned role;
    const devs_packet_spec_t *pkt = devs_arg_self_reg(ctx, &role);
    if (pkt == NULL)
        return;

    devs_fiber_t *f = ctx->curr_fiber;

    devs_jd_get_register(ctx, role, pkt->code, 1000, 0);
    devs_setup_resume(f, DsRegister_read_cont, (void *)pkt);
}
