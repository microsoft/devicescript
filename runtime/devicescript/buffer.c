#include "devs_internal.h"
#include "jd_numfmt.h"
#include <limits.h>
#include <math.h>

static value_t invalid_numfmt(devs_ctx_t *ctx) {
    return devs_throw_range_error(ctx, "buffer numfmt invalid");
}

value_t devs_buffer_op(devs_ctx_t *ctx, uint32_t fmt0, uint32_t offset, value_t buffer,
                       value_t *setv) {

    unsigned sz = jd_numfmt_bytes(fmt0);

    if (!jd_numfmt_is_valid(fmt0))
        return invalid_numfmt(ctx);

    unsigned bufsz;
    uint8_t *data = (void *)devs_bufferish_data(ctx, buffer, &bufsz);

    JD_ASSERT(data != NULL);

    if (offset + sz > bufsz) {
        // DMESG("gv NAN at pc=%d sz=%d %x", frame->pc, pkt->service_size, pkt->service_command);
        if (setv)
            devs_throw_range_error(ctx, "buffer store out of range");
        return devs_undefined;
    }

    data += offset;

    if (setv) {
        JD_ASSERT(devs_buffer_is_writable(ctx, buffer));
        value_t q = *setv;
        if (devs_is_tagged_int(q)) {
            jd_numfmt_write_i32(data, fmt0, q.val_int32);
        } else {
            jd_numfmt_write_float(data, fmt0, devs_value_to_double(ctx, q));
        }

        return devs_void;
    } else {
        if (jd_numfmt_is_plain_int(fmt0)) {
            int32_t q = jd_numfmt_read_i32(data, fmt0);
            // if it was out of range, it would get clamped
            if (INT_MIN < q && q < INT_MAX)
                return devs_value_from_int(q);
        }

        return devs_value_from_double(jd_numfmt_read_float(data, fmt0));
    }
}

double devs_read_number(void *data, unsigned bufsz, uint16_t fmt0) {
    unsigned sz = jd_numfmt_bytes(fmt0);

    if (sz > bufsz)
        return NAN;

    return jd_numfmt_read_float(data, fmt0);
}

value_t devs_buffer_decode(devs_ctx_t *ctx, uint32_t fmt0, uint8_t **buf, unsigned len) {
    int sp = jd_numfmt_special_idx(fmt0);

    const uint8_t *data = *buf;
    unsigned p;

    switch (sp) {
    case -1: {
        if (!jd_numfmt_is_valid(fmt0))
            return invalid_numfmt(ctx);

        unsigned sz = jd_numfmt_bytes(fmt0);
        if (sz > len)
            return devs_undefined;

        *buf += sz;

        if (jd_numfmt_is_plain_int(fmt0)) {
            int32_t q = jd_numfmt_read_i32(data, fmt0);
            // if it was out of range, it would get clamped
            if (INT_MIN < q && q < INT_MAX)
                return devs_value_from_int(q);
        }

        return devs_value_from_double(jd_numfmt_read_float(data, fmt0));
    }

    case DEVS_NUMFMT_SPECIAL_BOOL:
        if (len == 0)
            return devs_undefined;
        *buf += 1;
        return *data ? devs_true : devs_false;

    case DEVS_NUMFMT_SPECIAL_EMPTY:
        return devs_undefined;

    case DEVS_NUMFMT_SPECIAL_BYTES: {
        devs_buffer_t *block = devs_buffer_try_alloc(ctx, len);
        if (block == NULL)
            return devs_undefined;
        *buf += len;
        memcpy(block->data, data, len);
        return devs_value_from_gc_obj(ctx, block);
    }

    case DEVS_NUMFMT_SPECIAL_STRING0:
        p = 0;
        while (p < len && data[p])
            p++;
        *buf += p;
        if (p < len)
            *buf += 1; // final '\0'
        return devs_value_from_gc_obj(ctx, devs_string_try_alloc_init(ctx, data, p));

    case DEVS_NUMFMT_SPECIAL_STRING:
        *buf += len;
        return devs_value_from_gc_obj(ctx, devs_string_try_alloc_init(ctx, data, len));

    case DEVS_NUMFMT_SPECIAL_PIPE:
    case DEVS_NUMFMT_SPECIAL_PIPE_PORT:
        return devs_throw_not_supported_error(ctx, "pipes in specs");

    default:
        return devs_throw_not_supported_error(ctx, "this numfmt");
    }
}

unsigned devs_buffer_encode(devs_ctx_t *ctx, uint32_t fmt0, uint8_t *data, unsigned len,
                            value_t v) {
    int sp = jd_numfmt_special_idx(fmt0);

    switch (sp) {
    case -1: {
        if (!jd_numfmt_is_valid(fmt0)) {
            invalid_numfmt(ctx);
            return 0;
        }

        unsigned sz = jd_numfmt_bytes(fmt0);
        if (sz <= len) {
            if (devs_is_tagged_int(v)) {
                jd_numfmt_write_i32(data, fmt0, v.val_int32);
            } else {
                jd_numfmt_write_float(data, fmt0, devs_value_to_double(ctx, v));
            }
        }
        return sz;
    }

    case DEVS_NUMFMT_SPECIAL_BOOL:
        if (1 <= len)
            *data = devs_value_to_bool(ctx, v) ? 0xff : 0;
        return 1;

    case DEVS_NUMFMT_SPECIAL_EMPTY:
        return 0;

    case DEVS_NUMFMT_SPECIAL_STRING0:
    case DEVS_NUMFMT_SPECIAL_STRING:
    case DEVS_NUMFMT_SPECIAL_BYTES: {
        unsigned sz;
        const void *d = devs_bufferish_data(ctx, v, &sz);
        if (d == NULL) {
            v = devs_value_to_string(ctx, v);
            d = devs_bufferish_data(ctx, v, &sz);
            if (d == NULL)
                return 0; // ???
        }

        if (sz > len)
            sz = len;
        memcpy(data, d, sz);
        if (sp == DEVS_NUMFMT_SPECIAL_STRING0 && sz < len) {
            data[sz] = 0;
            sz++;
        }
        return sz;
    }

    case DEVS_NUMFMT_SPECIAL_PIPE:
    case DEVS_NUMFMT_SPECIAL_PIPE_PORT:
        devs_throw_not_supported_error(ctx, "pipes in specs");
        return 0;

    default:
        devs_throw_not_supported_error(ctx, "this numfmt");
        return 0;
    }
}
