#include "devs_internal.h"

#if JD_LED_STRIP
static uint8_t is_done;
static void led_strip_done(void) {
    devs_fiber_await_done(&is_done);
}

static void throw_led_strip_error(devs_ctx_t *ctx, void *userdata) {
    int code = (int)(intptr_t)userdata;
    if (code == -100)
        devs_throw_range_error(ctx, "LED busy");
    else
        devs_throw_range_error(ctx, "LED error: %d", code);
}
#endif

void fun2_DeviceScript_ledStripSend(devs_ctx_t *ctx) {
#if JD_LED_STRIP
    int pin = devs_arg_int(ctx, 0);
    value_t tx = devs_arg(ctx, 1);

    unsigned tx_sz;
    const void *tx_ptr = devs_bufferish_data(ctx, tx, &tx_sz);

    if (!tx_ptr)
        devs_throw_expecting_error_ext(ctx, "TX buffer", tx);
    else {
        devs_fiber_t *fib = ctx->curr_fiber;
        devs_fiber_await(fib, &is_done);
        int r = devs_led_strip_send(ctx, pin, tx_ptr, tx_sz, led_strip_done);
        if (r) {
            // we've been already de-scheduled - arrange for exception on resume
            fib->resume_cb = throw_led_strip_error;
            fib->resume_data = (void *)r;
            devs_fiber_await_done(&is_done); // schedule resume
        }
    }
#else
    devs_throw_not_supported_error(ctx, "ledStripSend");
#endif
}
