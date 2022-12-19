#include "devs_internal.h"

void fun_DeviceScript_sleepMs(devs_ctx_t *ctx, value_t ms) {
    int time = devs_value_to_int(ms);
    if (time >= 0)
        devs_fiber_sleep(ctx->curr_fiber, time);
}

void fun_DeviceScript_panic(devs_ctx_t *ctx, value_t v) {
    unsigned code = devs_value_to_int(v);
    if (code == 0 || code > 0xffff)
        code = 127;
    devs_panic(ctx, code);
}

void fun_DeviceScript_reboot(devs_ctx_t *ctx) {
    devs_panic(ctx, 0);
}

