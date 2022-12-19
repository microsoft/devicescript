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

