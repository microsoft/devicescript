#include "devs_internal.h"
#include <math.h>

value_t fun_Math_ceil(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return v;
    return devs_value_from_double(ceil(devs_value_to_double(v)));
}

value_t fun_Math_floor(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return v;
    return devs_value_from_double(floor(devs_value_to_double(v)));
}

value_t fun_Math_round(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return v;
    return devs_value_from_double(round(devs_value_to_double(v)));
}

value_t fun_Math_random(devs_ctx_t *ctx) {
    return devs_value_from_double(jd_random() * (double)0x100000000);
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

value_t fun_Math_randomInt(devs_ctx_t *ctx, value_t lim) {
    return devs_value_from_int(random_max(devs_value_to_int(lim)));
}

value_t fun_Math_log(devs_ctx_t *ctx, value_t v) {
    return devs_value_from_double(log(devs_value_to_double(v)));
}

value_t fun_Math_pow(devs_ctx_t *ctx, value_t a, value_t b) {
    return devs_value_from_double(pow(devs_value_to_double(a), devs_value_to_double(b)));
}

value_t fun_Math_idiv(devs_ctx_t *ctx, value_t a, value_t b) {
    int32_t aa = devs_value_to_int(a);
    int32_t bb = devs_value_to_int(b);
    if (bb == 0)
        return devs_zero;
    return devs_value_from_int(aa / bb);
}

value_t fun_Math_imod(devs_ctx_t *ctx, value_t a, value_t b) {
    int32_t aa = devs_value_to_int(a);
    int32_t bb = devs_value_to_int(b);
    if (bb == 0)
        return devs_zero;
    return devs_value_from_int(aa % bb);
}

value_t fun_Math_imul(devs_ctx_t *ctx, value_t a, value_t b) {
    int32_t aa = devs_value_to_int(a);
    int32_t bb = devs_value_to_int(b);
    // avoid signed overflow, which is undefined
    // note that signed and unsigned multiplication result in the same bit patterns
    return devs_value_from_int((uint32_t)aa * (uint32_t)bb);
}

static value_t fun_minmax(devs_ctx_t *ctx, value_t a, value_t b, bool ismin) {
    if (devs_is_tagged_int(a) && devs_is_tagged_int(b)) {
        int32_t aa = devs_value_to_int(a);
        int32_t bb = devs_value_to_int(b);
        return (ismin ? aa < bb : aa > bb) ? a : b;
    }
    double af = devs_value_to_double(a);
    double bf = devs_value_to_double(b);
    if (isnan(af) || isnan(bf))
        return devs_nan;
    return (ismin ? af < bf : af > bf) ? a : b;
}

value_t fun_Math_min(devs_ctx_t *ctx, value_t a, value_t b) {
    return fun_minmax(ctx, a, b, true);
}

value_t fun_Math_max(devs_ctx_t *ctx, value_t a, value_t b) {
    return fun_minmax(ctx, a, b, false);
}
