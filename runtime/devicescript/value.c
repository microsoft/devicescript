#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

const value_t jacs_zero = {.exp_sign = JACS_INT_TAG, .val_int32 = 0};
const value_t jacs_one = {.exp_sign = JACS_INT_TAG, .val_int32 = 1};
const value_t jacs_nan = {.exp_sign = JACS_NAN_TAG, .val_int32 = 0};
const value_t jacs_int_min = {.exp_sign = JACS_INT_TAG, .val_int32 = INT_MIN};
const value_t jacs_max_int_1 = {.f = 0x80000000U};

value_t jacs_value_from_double(double v) {
    value_t t;
    value_t r;
    t.f = v;
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

int32_t jacs_value_to_int(value_t v) {
    if (jacs_is_tagged_int(v))
        return v.val_int32;
    // TODO check semantics
    return (int32_t)v.f;
}

double jacs_value_to_double(value_t v) {
    if (jacs_is_tagged_int(v))
        return (double)v.val_int32;
    return v.f;
}

int jacs_value_to_bool(value_t v) {
    if (jacs_is_tagged_int(v))
        return !!v.val_int32;
    if (isnan(v.f))
        return 0;
    return v.f ? 1 : 0;
}
