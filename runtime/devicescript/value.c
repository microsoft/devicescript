#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

const value_t jacs_zero = {.exp_sign = JACS_INT_TAG, .val_int32 = 0};
const value_t jacs_one = {.exp_sign = JACS_INT_TAG, .val_int32 = 1};
const value_t jacs_nan = {.exp_sign = JACS_NAN_TAG, .val_int32 = 0};
const value_t jacs_int_min = {.exp_sign = JACS_INT_TAG, .val_int32 = INT_MIN};
const value_t jacs_max_int_1 = {._f = 0x80000000U};

value_t jacs_value_from_double(double v) {
    value_t t;
    value_t r;
    t._f = v;
    int m32z = t.mantisa32 == 0;

    if (isnan(v)) {
        // normalize NaNs -- they are very likely all already normalized
        return jacs_nan;
    }

    r.exp_sign = JACS_INT_TAG;

    if (m32z && t.exp_sign == 0)
        return jacs_zero;

    int e = t.exponent - 0x3ff;
    if (e >= 0) {
        if (e <= 20) {
            if (m32z && (e == 20 || (t.mantisa20 << (e + 12)) == 0)) {
                r.val_int32 = (t.mantisa20 | (1 << 20)) >> (20 - e);
                goto int_sign;
            }
        } else {
            if (e > 30) {
                if (m32z && t.exp_sign == 0xc1e00000)
                    return jacs_int_min;
            } else {
                if ((t.mantisa32 << (e - 20)) == 0) {
                    r.val_int32 =
                        ((t.mantisa20 | (1 << 20)) << (e - 20)) | (t.mantisa32 >> (32 - (e - 20)));
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

value_t jacs_value_from_int(int v) {
    value_t r;
    r.exp_sign = JACS_INT_TAG;
    r.val_int32 = v;
    return r;
}

value_t jacs_value_from_bool(int v) {
    value_t r;
    r.exp_sign = JACS_INT_TAG;
    r.val_int32 = v ? 1 : 0;
    return r;
}

value_t jacs_value_from_pointer(jacs_ctx_t *ctx, int type, void *ptr) {
    uint32_t v;

    JD_ASSERT(type & (JACS_HANDLE_IS_GC_POINTER_MASK | JACS_HANDLE_IS_HEAP_POINTER_MASK));

#if JD_64
    if (ptr)
        v = (uintptr_t)ptr - (uintptr_t)jacs_gc_base_addr(ctx->gc);
    else
        v = 0;
    JD_ASSERT((v >> 24) == 0);
#else
    v = (uintptr_t)ptr;
#endif

    return jacs_value_from_handle(type, v);
}

#if JD_64
void *jacs_handle_ptr_value(jacs_ctx_t *ctx, value_t t) {
    return (void *)((uintptr_t)jacs_gc_base_addr(ctx->gc) + t.mantisa32);
}
#endif

int32_t jacs_value_to_int(value_t v) {
    if (jacs_is_tagged_int(v))
        return v.val_int32;
    if (jacs_is_handle(v))
        return 0;
    // TODO check semantics
    return (int32_t)v._f;
}

double jacs_value_to_double(value_t v) {
    if (jacs_is_tagged_int(v))
        return (double)v.val_int32;
    if (jacs_is_handle(v))
        return NAN;
    return v._f;
}

int jacs_value_to_bool(value_t v) {
    if (jacs_is_tagged_int(v))
        return !!v.val_int32;
    if (jacs_is_nan(v) || jacs_is_handle(v))
        return 0;
    return v._f ? 1 : 0;
}
