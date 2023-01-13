#include "devs_internal.h"

#include <math.h>
#include <stdlib.h>
#include <limits.h>

const value_t devs_zero = {.exp_sign = DEVS_INT_TAG, .val_int32 = 0};
const value_t devs_one = {.exp_sign = DEVS_INT_TAG, .val_int32 = 1};
const value_t devs_int_min = {.exp_sign = DEVS_INT_TAG, .val_int32 = INT_MIN};
const value_t devs_max_int_1 = {._f = 0x80000000U};

#define SPECIAL(n)                                                                                 \
    { .exp_sign = DEVS_HANDLE_TAG + DEVS_HANDLE_TYPE_SPECIAL, .val_int32 = n }

const value_t devs_true = SPECIAL(DEVS_SPECIAL_TRUE);
const value_t devs_false = SPECIAL(DEVS_SPECIAL_FALSE);
const value_t devs_nan = SPECIAL(DEVS_SPECIAL_NAN);
const value_t devs_inf = SPECIAL(DEVS_SPECIAL_INF);
const value_t devs_minf = SPECIAL(DEVS_SPECIAL_MINF);

value_t devs_value_from_double(double v) {
    switch (fpclassify(v)) {
    case FP_NAN:
        return devs_nan;
    case FP_INFINITE:
        return v > 0 ? devs_inf : devs_minf;
    case FP_SUBNORMAL:
    case FP_ZERO: // this is both 0.0 and -0.0
        return devs_zero;
    default:
        break;
    }

    value_t t;
    value_t r;
    t._f = v;
    int m32z = t.mantissa32 == 0;

    r.exp_sign = DEVS_INT_TAG;

    if (m32z && t.exp_sign == 0)
        return devs_zero;

    int e = t.exponent - 0x3ff;
    if (e >= 0) {
        if (e <= 20) {
            if (m32z && (e == 20 || (t.mantissa20 << (e + 12)) == 0)) {
                r.val_int32 = (t.mantissa20 | (1 << 20)) >> (20 - e);
                goto int_sign;
            }
        } else {
            if (e > 30) {
                if (m32z && t.exp_sign == 0xc1e00000)
                    return devs_int_min;
            } else {
                if ((t.mantissa32 << (e - 20)) == 0) {
                    r.val_int32 =
                        ((t.mantissa20 | (1 << 20)) << (e - 20)) | (t.mantissa32 >> (32 - (e - 20)));
                    goto int_sign;
                }
            }
        }
    }

    return t;

int_sign:
    if (t.sign)
        r.val_int32 = -r.val_int32;
    return r;
}

value_t devs_value_from_int(int v) {
    value_t r;
    r.exp_sign = DEVS_INT_TAG;
    r.val_int32 = v;
    return r;
}

value_t devs_value_from_bool(int v) {
    return v ? devs_true : devs_false;
}

value_t devs_value_from_pointer(devs_ctx_t *ctx, int type, void *ptr) {
    uint32_t v;

    if (ptr == NULL)
        return devs_null;

    JD_ASSERT(devs_handle_type_is_ptr(type));

#if JD_64
    v = (uintptr_t)ptr - (uintptr_t)devs_gc_base_addr(ctx->gc);
    JD_ASSERT((v >> 24) == 0);
#else
    v = (uintptr_t)ptr;
#endif

    return devs_value_from_handle(type, v);
}

#if JD_64
void *devs_handle_ptr_value(devs_ctx_t *ctx, value_t t) {
    if (devs_handle_is_ptr(t))
        return (void *)((uintptr_t)devs_gc_base_addr(ctx->gc) + t.mantissa32);

    JD_PANIC();
    return NULL;
}
#endif

double devs_value_to_double(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return (double)v.val_int32;

    if (devs_handle_type(v) == DEVS_HANDLE_TYPE_FLOAT64)
        return v._f;

    if (devs_is_special(v))
        switch (devs_handle_value(v)) {
        case DEVS_SPECIAL_NULL:
        case DEVS_SPECIAL_FALSE:
            return 0;
        case DEVS_SPECIAL_TRUE:
            return 1;
        case DEVS_SPECIAL_INF:
            return INFINITY;
        case DEVS_SPECIAL_MINF:
            return -INFINITY;
        default:
            return NAN;
        }

    if (devs_is_string(ctx, v)) {
        unsigned sz;
        const char *data = devs_string_get_utf8(ctx, v, &sz);
        char *endp;
        double d = strtod(data, &endp);
        if (data != endp)
            return d;
    }

    return NAN;
}

int32_t devs_value_to_int(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return v.val_int32;
    if (devs_is_special(v))
        return devs_handle_value(v) >= DEVS_SPECIAL_TRUE ? 1 : 0;

    double vv = devs_value_to_double(ctx, v);
    if (isnan(vv))
        return 0;
    double rem = fmod(trunc(vv), 4294967296.0);
    if (rem < 0.0)
        rem += 4294967296.0;
    return (int32_t)((uint32_t)rem);
}

bool devs_value_to_bool(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return !!v.val_int32;
    if (devs_is_special(v))
        return devs_handle_value(v) >= DEVS_SPECIAL_TRUE;
    if (devs_is_string(ctx, v)) {
        unsigned sz;
        devs_string_get_utf8(ctx, v, &sz);
        return sz > 0;
    }
    if (devs_is_handle(v))
        return 1;
    return v._f == 0.0 ? true : false;
}

bool devs_is_buffer(devs_ctx_t *ctx, value_t v) {
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        return devs_gc_tag(devs_handle_ptr_value(ctx, v)) == DEVS_GC_TAG_BUFFER;
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        return devs_bufferish_is_buffer(v);
    default:
        return false;
    }
}

bool devs_buffer_is_writable(devs_ctx_t *ctx, value_t v) {
    return devs_is_buffer(ctx, v) && devs_handle_type(v) != DEVS_HANDLE_TYPE_IMG_BUFFERISH;
}

void *devs_buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    JD_ASSERT(devs_is_buffer(ctx, v));
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_GC_OBJECT: {
        devs_buffer_t *buf = devs_handle_ptr_value(ctx, v);
        if (sz)
            *sz = buf->length;
        return buf->data;
    }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH: {
        // TODO optimize - we know it's a buffer in range
        unsigned idx = devs_handle_value(v);
        return (void *)devs_get_static_utf8(ctx, idx, sz);
    }
    default:
        JD_PANIC();
        return NULL;
    }
}

const void *devs_bufferish_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (devs_is_buffer(ctx, v))
        return devs_buffer_data(ctx, v, sz);
    else if (devs_is_string(ctx, v))
        return devs_string_get_utf8(ctx, v, sz);
    else {
        if (sz)
            *sz = 0;
        return NULL;
    }
}

void *devs_value_to_gc_obj(devs_ctx_t *ctx, value_t v) {
    if (devs_handle_type(v) == DEVS_HANDLE_TYPE_GC_OBJECT)
        return devs_handle_ptr_value(ctx, v);
    return NULL;
}

bool devs_is_array(devs_ctx_t *ctx, value_t v) {
    return devs_gc_tag(devs_value_to_gc_obj(ctx, v)) == DEVS_GC_TAG_ARRAY;
}

unsigned devs_value_typeof(devs_ctx_t *ctx, value_t v) {
    uint32_t hv;

    if (devs_is_tagged_int(v))
        return DEVS_OBJECT_TYPE_NUMBER;

    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_FLOAT64:
        return DEVS_OBJECT_TYPE_NUMBER;
    case DEVS_HANDLE_TYPE_SPECIAL:
        switch ((hv = devs_handle_value(v))) {
        case DEVS_SPECIAL_NULL:
            return DEVS_OBJECT_TYPE_NULL;
        case DEVS_SPECIAL_FALSE:
        case DEVS_SPECIAL_TRUE:
            return DEVS_OBJECT_TYPE_BOOL;
        case DEVS_SPECIAL_INF:
        case DEVS_SPECIAL_MINF:
        case DEVS_SPECIAL_NAN:
            return DEVS_OBJECT_TYPE_NUMBER;
        default:
            if (devs_handle_is_builtin(hv))
                return DEVS_OBJECT_TYPE_MAP;
            else if (devs_handle_is_throw_jmp(hv))
                return DEVS_OBJECT_TYPE_EXOTIC;
            else
                JD_PANIC();
        }
    case DEVS_HANDLE_TYPE_FIBER:
        return DEVS_OBJECT_TYPE_FIBER;
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION:
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC:
    case DEVS_HANDLE_TYPE_CLOSURE:
    case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        return DEVS_OBJECT_TYPE_FUNCTION;
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        switch (devs_gc_tag(devs_handle_ptr_value(ctx, v))) {
        case DEVS_GC_TAG_STRING:
            return DEVS_OBJECT_TYPE_STRING;
        case DEVS_GC_TAG_PACKET:
            return DEVS_OBJECT_TYPE_PACKET;
        case DEVS_GC_TAG_SHORT_MAP:
        case DEVS_GC_TAG_HALF_STATIC_MAP:
        case DEVS_GC_TAG_MAP:
            return DEVS_OBJECT_TYPE_MAP;
        case DEVS_GC_TAG_ARRAY:
            return DEVS_OBJECT_TYPE_ARRAY;
        case DEVS_GC_TAG_BUFFER:
            return DEVS_OBJECT_TYPE_BUFFER;
        case DEVS_GC_TAG_BOUND_FUNCTION:
            return DEVS_OBJECT_TYPE_FUNCTION;
        case DEVS_GC_TAG_BUILTIN_PROTO:
        default:
            JD_PANIC();
            return 0;
        }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        return devs_bufferish_is_buffer(v) ? DEVS_OBJECT_TYPE_BUFFER : DEVS_OBJECT_TYPE_STRING;
    case DEVS_HANDLE_TYPE_ROLE_MEMBER:
        return (devs_decode_role_packet(ctx, v, NULL)->code & DEVS_PACKETSPEC_CODE_MASK) ==
                       DEVS_PACKETSPEC_CODE_COMMAND
                   ? DEVS_OBJECT_TYPE_FUNCTION
                   : DEVS_OBJECT_TYPE_MAP;
    case DEVS_HANDLE_TYPE_ROLE:
        return DEVS_OBJECT_TYPE_ROLE;
    default:
        JD_PANIC();
        return 0;
    }
}

bool devs_is_nullish(value_t t) {
    if (devs_is_special(t))
        switch (devs_handle_value(t)) {
        case DEVS_SPECIAL_FALSE:
        case DEVS_SPECIAL_NULL:
        case DEVS_SPECIAL_NAN:
            return true;
        }

    return false;
}

bool devs_value_ieee_eq(devs_ctx_t *ctx, value_t a, value_t b) {
    if (devs_is_nan(a) && devs_is_nan(b))
        return false;
    return devs_value_eq(ctx, a, b);
}

// Values are equal if they share the exact same representation,
// or if they are both strings and have the same contents.
// NaN is handled in devs_value_ieee_eq().
bool devs_value_eq(devs_ctx_t *ctx, value_t a, value_t b) {
    if (a.u64 == b.u64)
        return true;

    if (devs_is_string(ctx, a) && devs_is_string(ctx, b)) {
        unsigned alen, blen;
        const char *aptr = devs_string_get_utf8(ctx, a, &alen);
        const char *bptr = devs_string_get_utf8(ctx, b, &blen);
        return alen == blen && memcmp(aptr, bptr, alen) == 0;
    }

    return false;

#if 0
    int ta = devs_handle_type(a);
    int tb = devs_handle_type(b);

    if (ta != tb)
        return false;
#endif
}

value_t devs_value_encode_throw_jmp_pc(int pc, unsigned lev) {
    JD_ASSERT(lev <= DEVS_SPECIAL_THROW_JMP_LEVEL_MAX);
    JD_ASSERT(pc && pc <= DEVS_SPECIAL_THROW_JMP_PC_MAX);
    uint32_t hv = (pc << DEVS_SPECIAL_THROW_JMP_LEVEL_SHIFT) | lev;
    return devs_value_from_handle(DEVS_HANDLE_TYPE_SPECIAL, DEVS_SPECIAL_THROW_JMP_OFF + hv);
}
