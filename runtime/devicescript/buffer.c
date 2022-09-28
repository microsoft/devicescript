#include "jacs_internal.h"
#include <limits.h>
#include <math.h>

void *jacs_buffer_ptr(jacs_ctx_t *ctx, unsigned idx) {
    if (idx == 0)
        return ctx->packet.data;
    return ctx->buffers + ctx->buffers[idx - 1];
}

unsigned jacs_buffer_size(jacs_ctx_t *ctx, unsigned idx) {
    if (idx == 0)
        return ctx->packet.service_size;
    return jacs_img_get_buffer(&ctx->img, idx)->size;
}

// shift_val(10) = 1024
// shift_val(0) = 1
// shift_val(-10) = 1/1024
static inline double shift_val(int shift) {
    value_t t = {0};
    t.exponent = 0x3ff + shift;
    return t._f;
}

static int clamp_int(value_t v, int l, int h) {
    int vv = jacs_value_to_int(v);
    if (vv < l)
        return l;
    if (vv > h)
        return h;
    return vv;
}

static double clamp_double(value_t v, double l, double h) {
    double vv = jacs_value_to_double(v);
    if (vv < l)
        return l;
    if (vv > h)
        return h;
    return vv;
}

#define SET_VAL(SZ, l, h)                                                                          \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = clamp_int(q, l, h);                                                                   \
        memcpy(data, &SZ, sizeof(SZ));                                                             \
        break

#define SET_VAL_U(SZ, l, h)                                                                        \
    case JACS_NUMFMT_##SZ:                                                                         \
        if (jacs_is_tagged_int(q) && q.val_int32 > 0)                                              \
            SZ = q.val_int32;                                                                      \
        else                                                                                       \
            SZ = clamp_double(q, l, h);                                                            \
        memcpy(data, &SZ, sizeof(SZ));                                                             \
        break

#define SET_VAL_R(SZ)                                                                              \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = jacs_value_to_double(q);                                                              \
        memcpy(data, &SZ, sizeof(SZ));                                                             \
        break

#define GET_VAL_INT(SZ)                                                                            \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, data, sizeof(SZ));                                                             \
        I32 = SZ;                                                                                  \
        break;

#define GET_VAL_UINT(SZ)                                                                           \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, data, sizeof(SZ));                                                             \
        if (SZ <= INT_MAX)                                                                         \
            I32 = SZ;                                                                              \
        else {                                                                                     \
            is_float = 1;                                                                          \
            F64 = SZ;                                                                              \
        }                                                                                          \
        break;

#define GET_VAL_DBL(SZ)                                                                            \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, data, sizeof(SZ));                                                             \
        is_float = 1;                                                                              \
        F64 = SZ;                                                                                  \
        break;

value_t jacs_buffer_op(jacs_activation_t *frame, uint32_t fmt0, uint32_t offset, uint32_t buffer,
                       value_t *setv) {
    int is_float = 0;

    uint8_t U8;
    uint16_t U16;
    uint32_t U32;
    uint64_t U64;
    int8_t I8;
    int16_t I16;
    int32_t I32;
    int64_t I64;
    float F32;
    double F64;

    unsigned fmt = fmt0 & 0xf;
    unsigned shift = fmt0 >> 4;
    unsigned sz = 1 << (fmt & 0b11);

    // if (!setv)
    //     DMESG("GET @%d fmt=%x buf=%d", offset, fmt0, buffer);

    jacs_ctx_t *ctx = frame->fiber->ctx;

    if (fmt == 0b1000 || fmt == 0b1001)
        return jacs_runtime_failure(ctx, 60100);

    if (shift > sz * 8)
        return jacs_runtime_failure(ctx, 60101);

    if (buffer >= jacs_img_num_buffers(&ctx->img))
        return jacs_runtime_failure(ctx, 60102);

    unsigned bufsz = jacs_buffer_size(ctx, buffer);

    if (offset + sz > bufsz) {
        // DMESG("gv NAN at pc=%d sz=%d %x", frame->pc, pkt->service_size, pkt->service_command);
        if (setv)
            return jacs_runtime_failure(ctx, 60103);
        else
            return jacs_nan;
    }

    uint8_t *data = jacs_buffer_ptr(ctx, buffer) + offset;

    if (setv) {
        value_t q = *setv;
        if (shift || !jacs_is_tagged_int(q)) {
            double qq = jacs_value_to_double(q) * shift_val(shift);
            if (!(fmt & 0b1000))
                qq += 0.5; // proper rounding
            q = jacs_value_from_double(qq);
        }

        switch (fmt) {
            SET_VAL(U8, 0, 0xff);
            SET_VAL(U16, 0, 0xffff);
            SET_VAL_U(U32, 0, 0xffffffff);
            SET_VAL_U(U64, 0, (double)0xffffffffffffffff);
            SET_VAL(I8, -0x80, 0x7f);
            SET_VAL(I16, -0x8000, 0x7fff);
            SET_VAL(I32, -0x80000000, 0x7fffffff);
            SET_VAL_U(I64, -0x8000000000000000, (double)0x7fffffffffffffff);
            SET_VAL_R(F32);
            SET_VAL_R(F64);
        default:
            oops();
            break;
        }

        return jacs_nan;

    } else {
        switch (fmt) {
            GET_VAL_INT(U8);
            GET_VAL_INT(U16);
            GET_VAL_UINT(U32);
            GET_VAL_UINT(U64);
            GET_VAL_INT(I8);
            GET_VAL_INT(I16);
            GET_VAL_INT(I32);
            GET_VAL_DBL(I64);
            GET_VAL_DBL(F32);
            GET_VAL_DBL(F64);
        default:
            oops();
        }

        if (!shift && !is_float)
            return jacs_value_from_int(I32);

        if (!is_float)
            F64 = I32;

        if (shift)
            F64 *= shift_val(-shift);

        return jacs_value_from_double(F64);
    }
}

double jacs_read_number(void *data, unsigned bufsz, uint16_t fmt0) {
    uint8_t U8;
    uint16_t U16;
    uint32_t U32;
    uint64_t U64;
    int8_t I8;
    int16_t I16;
    int32_t I32;
    int64_t I64;
    float F32;
    double F64;
    int is_float = 0;

    unsigned fmt = fmt0 & 0xf;
    unsigned shift = fmt0 >> 4;
    unsigned sz = 1 << (fmt & 0b11);

    if (sz > bufsz)
        return NAN;

    switch (fmt) {
        GET_VAL_INT(U8);
        GET_VAL_INT(U16);
        GET_VAL_UINT(U32);
        GET_VAL_UINT(U64);
        GET_VAL_INT(I8);
        GET_VAL_INT(I16);
        GET_VAL_INT(I32);
        GET_VAL_DBL(I64);
        GET_VAL_DBL(F32);
        GET_VAL_DBL(F64);
    default:
        oops();
    }

    if (!is_float)
        F64 = I32;

    if (shift)
        F64 *= shift_val(-shift);

    return F64;
}
