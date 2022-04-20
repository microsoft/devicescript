#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

value_t jacs_step_unop(int op, value_t v) {
    switch (op) {
    case JACS_OPUN_ID:
        return v;
    case JACS_OPUN_NOT:
        return jacs_value_from_int(!jacs_value_to_bool(v));
    case JACS_OPUN_BIT_NOT:
        return jacs_value_from_int(~jacs_value_to_int(v));
    case JACS_OPUN_TO_BOOL:
        return jacs_value_from_int(jacs_value_to_bool(v));
    }

    if (jacs_is_tagged_int(v)) {
        int q = v.val_int32;
        switch (op) {
        case JACS_OPUN_NEG:
            if (q == INT_MIN)
                return jacs_max_int_1;
            else
                return jacs_value_from_int(-q);
        case JACS_OPUN_ABS:
            if (q < 0) {
                if (q == INT_MIN)
                    return jacs_max_int_1;
                else
                    return jacs_value_from_int(-q);
            } else {
                return v;
            }
        case JACS_OPUN_IS_NAN:
            return jacs_zero;
        default:
            oops();
        }
    } else {
        switch (op) {
        case JACS_OPUN_NEG:
            return jacs_value_from_double(-v.f);
        case JACS_OPUN_ABS:
            return v.f < 0 ? jacs_value_from_double(-v.f) : v;
        case JACS_OPUN_IS_NAN:
            return jacs_value_from_bool(isnan(v.f));
        default:
            oops();
        }
    }
}

value_t jacs_step_binop(int op, value_t a, value_t b) {
    switch (op) {
    case JACS_OPBIN_BIT_AND:
        return jacs_value_from_int(jacs_value_to_int(a) & jacs_value_to_int(b));
    case JACS_OPBIN_BIT_OR:
        return jacs_value_from_int(jacs_value_to_int(a) | jacs_value_to_int(b));
    case JACS_OPBIN_BIT_XOR:
        return jacs_value_from_int(jacs_value_to_int(a) ^ jacs_value_to_int(b));
    case JACS_OPBIN_SHIFT_LEFT:
        return jacs_value_from_int(jacs_value_to_int(a) << (jacs_value_to_int(b) & 31));
    case JACS_OPBIN_SHIFT_RIGHT:
        return jacs_value_from_int(jacs_value_to_int(a) >> (jacs_value_to_int(b) & 31));
    case JACS_OPBIN_SHIFT_RIGHT_UNSIGNED: {
        uint32_t tmp = (uint32_t)jacs_value_to_int(a) >> (jacs_value_to_int(b) & 31);
        if (tmp >> 31)
            return jacs_value_from_double(tmp);
        else
            return jacs_value_from_int(tmp);
    }
    }

    if (jacs_is_tagged_int(a) && jacs_is_tagged_int(b)) {
        int aa = a.val_int32;
        int bb = b.val_int32;
        int r;

        switch (op) {
        case JACS_OPBIN_ADD:
            if (__builtin_sadd_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_SUB:
            if (__builtin_ssub_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_DIV:
            // not sure this is worth it on M0+; it definitely is on M4
            if (bb == 0 || (bb == -1 && aa == INT_MIN) || ((r = aa / bb)) * bb != aa)
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_MUL:
            if (__builtin_smul_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_LT:
            return jacs_value_from_bool(aa < bb);
        case JACS_OPBIN_LE:
            return jacs_value_from_bool(aa <= bb);
        case JACS_OPBIN_EQ:
            return jacs_value_from_bool(aa == bb);
        case JACS_OPBIN_NE:
            return jacs_value_from_bool(aa != bb);

        default:
            oops();
        }
    }

    double af = jacs_value_to_double(a);
    double bf = jacs_value_to_double(b);

    switch (op) {
    case JACS_OPBIN_ADD:
        return jacs_value_from_double(af + bf);
    case JACS_OPBIN_SUB:
        return jacs_value_from_double(af - bf);
    case JACS_OPBIN_DIV:
        return jacs_value_from_double(af / bf);
    case JACS_OPBIN_MUL:
        return jacs_value_from_double(af * bf);
    case JACS_OPBIN_LT:
        return jacs_value_from_bool(af < bf);
    case JACS_OPBIN_LE:
        return jacs_value_from_bool(af <= bf);
    case JACS_OPBIN_EQ:
        return jacs_value_from_bool(af == bf);
    case JACS_OPBIN_NE:
        return jacs_value_from_bool(af != bf);

    default:
        oops();
    }
}

static uint32_t random_max(uint32_t mx) {
    uint32_t mask = 1;
    while (mask < mx)
        mask = (mask << 1) | 1;
    for (;;) {
        uint32_t r = jd_random() & mask;
        if (r <= mx)
            return r;
    }
}

value_t jacs_step_opmath1(int op, value_t a) {
    if (jacs_is_tagged_int(a)) {
        switch (op) {
        case JACS_OPMATH1_FLOOR:
        case JACS_OPMATH1_ROUND:
        case JACS_OPMATH1_CEIL:
            return a;
        }
    }

    double af = jacs_value_to_double(a);

    switch (op) {
    case JACS_OPMATH1_FLOOR:
        return jacs_value_from_double(floor(af));
    case JACS_OPMATH1_ROUND:
        return jacs_value_from_double(round(af));
    case JACS_OPMATH1_CEIL:
        return jacs_value_from_double(ceil(af));
    case JACS_OPMATH1_LOG_E:
        return jacs_value_from_double(log(af));
    case JACS_OPMATH1_RANDOM:
        return jacs_value_from_double(jd_random() * af / (double)0x100000000);
    case JACS_OPMATH1_RANDOM_INT:
        return jacs_value_from_int(random_max(jacs_value_to_int(a)));
    default:
        oops();
    }
}

value_t jacs_step_opmath2(int op, value_t a, value_t b) {
    if (op == JACS_OPMATH2_IDIV || op == JACS_OPMATH2_IMUL ||
        (jacs_is_tagged_int(a) && jacs_is_tagged_int(b))) {
        int aa = jacs_value_to_int(a);
        int bb = jacs_value_to_int(b);
        switch (op) {
        case JACS_OPMATH2_MIN:
            return aa < bb ? a : b;
        case JACS_OPMATH2_MAX:
            return aa > bb ? a : b;
        case JACS_OPMATH2_IDIV:
            if (bb == 0)
                return jacs_zero;
            return jacs_value_from_int(aa / bb);
        case JACS_OPMATH2_IMUL:
            // avoid signed overflow, which is undefined
            // note that signed and unsigned multiplication result in the same bit patterns
            return jacs_value_from_int((uint32_t)aa * (uint32_t)bb);
        }
    }

    double af = jacs_value_to_double(a);
    double bf = jacs_value_to_double(b);

    switch (op) {
    case JACS_OPMATH2_MIN:
        return af < bf ? a : b;
    case JACS_OPMATH2_MAX:
        return af > bf ? a : b;
    case JACS_OPMATH2_POW:
        return jacs_value_from_double(pow(af, bf));
    default:
        oops();
    }
}

// shift_val(10) = 1024
// shift_val(0) = 1
// shift_val(-10) = 1/1024
static inline double shift_val(int shift) {
    value_t t = {0};
    t.exponent = 0x3ff + shift;
    return t.f;
}

#define BAD_FMT() ((fmt == 0b1000 || fmt == 0b1001) || shift > sz * 8)

value_t jacs_step_buffer_op(jacs_activation_t *frame, uint16_t offset, uint16_t fmt0,
                          uint16_t buffer) {
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

    jacs_ctx_t *ctx = frame->fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;

    if (BAD_FMT())
        jacs_runtime_failure(ctx);

    if (offset + sz > pkt->service_size) {
        // DMESG("gv NAN at pc=%d sz=%d %x", frame->pc, pkt->service_size, pkt->service_command);
        return jacs_nan;
    }

#define GET_VAL_INT(SZ)                                                                            \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        I32 = SZ;                                                                                  \
        break;

#define GET_VAL_UINT(SZ)                                                                           \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        if (SZ <= INT_MAX)                                                                         \
            I32 = SZ;                                                                              \
        else {                                                                                     \
            is_float = 1;                                                                          \
            F64 = SZ;                                                                              \
        }                                                                                          \
        break;

#define GET_VAL_DBL(SZ)                                                                            \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        is_float = 1;                                                                              \
        F64 = SZ;                                                                                  \
        break;

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

void jacs_step_set_val(jacs_activation_t *frame, uint16_t offset, uint16_t fmt0, uint16_t buffer,
                       value_t q) {
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

    jacs_ctx_t *ctx = frame->fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;

    if (BAD_FMT())
        jacs_runtime_failure(ctx);

select right buffer and check offset

    if (offset + sz > pkt->service_size) {
        jacs_runtime_failure(ctx);
        return;
    }

    if (shift || !jacs_is_tagged_int(q)) {
        double qq = jacs_value_to_double(q) * shift_val(shift);
        if (!(fmt & 0b1000))
            qq += 0.5; // proper rounding
        q = jacs_value_from_double(qq);
    }

#define SET_VAL(SZ, l, h)                                                                          \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = clamp_int(q, l, h);                                                                   \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

#define SET_VAL_U(SZ, l, h)                                                                        \
    case JACS_NUMFMT_##SZ:                                                                         \
        if (jacs_is_tagged_int(q) && q.val_int32 > 0)                                              \
            SZ = q.val_int32;                                                                      \
        else                                                                                       \
            SZ = clamp_double(q, l, h);                                                            \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

#define SET_VAL_R(SZ)                                                                              \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = jacs_value_to_double(q);                                                              \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

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
}
