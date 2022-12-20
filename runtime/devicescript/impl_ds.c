#include "devs_internal.h"

void fun1_DeviceScript_sleepMs(devs_ctx_t *ctx) {
    int time = devs_arg_int(ctx, 0);
    if (time >= 0)
        devs_fiber_sleep(ctx->curr_fiber, time);
}

void fun1_DeviceScript_panic(devs_ctx_t *ctx) {
    unsigned code = devs_arg_int(ctx, 0);
    if (code == 0 || code > 0xffff)
        code = 127;
    devs_panic(ctx, code);
}

void fun0_DeviceScript_reboot(devs_ctx_t *ctx) {
    devs_panic(ctx, 0);
}

void funX_DeviceScript_format(devs_ctx_t *ctx) {
    if (ctx->stack_top_for_gc < 2)
        return;

    value_t fmtv = devs_arg(ctx, 0);
    unsigned len;
    const char *fmt = devs_string_get_utf8(ctx, fmtv, &len);
    if (fmt == NULL)
        return;

    unsigned numargs = ctx->stack_top_for_gc - 2;
    value_t *argp = ctx->the_stack + 2;

    char tmp[64];
    unsigned sz = devs_strformat(ctx, fmt, len, tmp, sizeof(tmp), argp, numargs, 0);
    devs_string_t *str = devs_string_try_alloc(ctx, sz - 1);
    if (str == NULL)
        return;
    if (sz > sizeof(tmp))
        devs_strformat(ctx, fmt, len, str->data, sz, argp, numargs, 0);
    else
        memcpy(str->data, tmp, sz - 1);
    devs_ret_gc_ptr(ctx, str);
}

void fun1_DeviceScript_log(devs_ctx_t *ctx) {
    value_t s = devs_arg(ctx, 0);
    s = devs_value_to_string(ctx, s);
    devs_jd_send_logmsg(ctx, s);
}
