#include "devs_internal.h"
#include <math.h>
#include <limits.h>

static void fun1_to_int(devs_ctx_t *ctx, double (*fn)(double)) {
    value_t v = devs_arg(ctx, 0);
    if (devs_is_tagged_int(v))
        devs_ret(ctx, v);
    else
        devs_ret_double(ctx, fn(devs_value_to_double(v)));
}

void fun1_Math_ceil(devs_ctx_t *ctx) {
    fun1_to_int(ctx, ceil);
}

void fun1_Math_floor(devs_ctx_t *ctx) {
    fun1_to_int(ctx, floor);
}

void fun1_Math_round(devs_ctx_t *ctx) {
    fun1_to_int(ctx, round);
}

void fun1_Math_abs(devs_ctx_t *ctx) {
    value_t v = devs_arg(ctx, 0);
    if (devs_is_tagged_int(v) && v.val_int32 != INT_MIN)
        devs_ret(ctx, v.val_int32 >= 0 ? v : devs_value_from_int(-v.val_int32));
    else {
        double q = devs_value_to_double(v);
        if (q < 0)
            devs_ret_double(ctx, -q);
        else
            devs_ret(ctx, v);
    }
}

void fun0_Math_random(devs_ctx_t *ctx) {
    devs_ret_double(ctx, jd_random() * (1.0 / 0x100000000));
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

void fun1_Math_randomInt(devs_ctx_t *ctx) {
    devs_ret_int(ctx, random_max(devs_arg_int(ctx, 0)));
}

void fun1_Math_log(devs_ctx_t *ctx) {
    devs_ret_double(ctx, log(devs_arg_double(ctx, 0)));
}

void fun2_Math_pow(devs_ctx_t *ctx) {
    double x = devs_arg_double(ctx, 0);
    double y = devs_arg_double(ctx, 1);
    devs_ret_double(ctx, pow(x, y));
}

void fun2_Math_idiv(devs_ctx_t *ctx) {
    int32_t aa = devs_arg_int(ctx, 0);
    int32_t bb = devs_arg_int(ctx, 1);
    devs_ret_int(ctx, bb == 0 ? 0 : aa / bb);
}

void fun2_Math_imod(devs_ctx_t *ctx) {
    int32_t aa = devs_arg_int(ctx, 0);
    int32_t bb = devs_arg_int(ctx, 1);
    devs_ret_int(ctx, bb == 0 ? 0 : aa % bb);
}

void fun2_Math_imul(devs_ctx_t *ctx) {
    int32_t aa = devs_arg_int(ctx, 0);
    int32_t bb = devs_arg_int(ctx, 1);
    // avoid signed overflow, which is undefined
    // note that signed and unsigned multiplication result in the same bit patterns
    devs_ret_int(ctx, (uint32_t)aa * (uint32_t)bb);
}

static void fun2_minmax(devs_ctx_t *ctx, bool ismin) {
    value_t a = devs_arg(ctx, 0);
    value_t b = devs_arg(ctx, 1);
    if (devs_is_tagged_int(a) && devs_is_tagged_int(b)) {
        int32_t aa = devs_value_to_int(a);
        int32_t bb = devs_value_to_int(b);
        devs_ret(ctx, (ismin ? aa < bb : aa > bb) ? a : b);
    }
    double af = devs_value_to_double(a);
    double bf = devs_value_to_double(b);
    if (isnan(af) || isnan(bf))
        devs_ret(ctx, devs_nan);
    devs_ret(ctx, (ismin ? af < bf : af > bf) ? a : b);
}

void fun2_Math_min(devs_ctx_t *ctx) {
    return fun2_minmax(ctx, true);
}

void fun2_Math_max(devs_ctx_t *ctx) {
    return fun2_minmax(ctx, false);
}
