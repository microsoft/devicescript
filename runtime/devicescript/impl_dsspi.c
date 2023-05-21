#include "devs_internal.h"
#include "services/interfaces/jd_spi.h"

void fun5_DeviceScript_spiConfigure(devs_ctx_t *ctx) {
#if JD_SPI
    jd_spi_cfg_t cfg = {
        .miso = devs_arg_int(ctx, 0),
        .mosi = devs_arg_int(ctx, 1),
        .sck = devs_arg_int(ctx, 2),
        .mode = devs_arg_int(ctx, 3),
        .hz = devs_arg_int(ctx, 4),
    };

    int r = jd_spi_init(&cfg);
    if (r)
        devs_throw_range_error(ctx, "SPI init failed: %d", r);
#else
    devs_throw_not_supported_error(ctx, "SPI");
#endif
}

#if JD_SPI
static uint8_t is_done;
static void spi_done(void) {
    devs_fiber_await_done(&is_done);
}

void throw_spi_error(devs_ctx_t *ctx, void *userdata) {
    devs_throw_range_error(ctx, "SPI error: %d", (int)(intptr_t)userdata);
}
#endif

void fun2_DeviceScript_spiXfer(devs_ctx_t *ctx) {
#if JD_SPI
    value_t tx = devs_arg(ctx, 0);
    value_t rx = devs_arg(ctx, 1);

    unsigned tx_sz;
    const void *tx_ptr = devs_bufferish_data(ctx, tx, &tx_sz);
    unsigned rx_sz;
    const void *rx_ptr = devs_bufferish_data(ctx, rx, &rx_sz);

    if (!jd_spi_is_ready())
        devs_throw_range_error(ctx, "SPI busy");
    else if (!tx_ptr && !rx_ptr)
        devs_throw_expecting_error_ext(ctx, "at least one of TX/RX buffers", tx);
    else if (tx_ptr && rx_ptr && tx_sz != rx_sz)
        devs_throw_expecting_error_ext(ctx, "same size TX/RX buffers", tx);
    else if (rx_ptr && !devs_buffer_is_writable(ctx, rx))
        devs_throw_expecting_error_ext(ctx, "mutable Buffer", rx);
    else {
        if (!tx_sz)
            tx_sz = rx_sz;
        devs_fiber_t *fib = ctx->curr_fiber;
        devs_fiber_await(fib, &is_done);
        int r = jd_spi_xfer(tx_ptr, (void *)rx_ptr, tx_sz, spi_done);
        if (r) {
            // we've been already de-scheduled - arrange for exception on resume
            fib->resume_cb = throw_spi_error;
            fib->resume_data = (void *)r;
            devs_fiber_await_done(&is_done); // schedule resume
        }
    }

#else
    devs_throw_not_supported_error(ctx, "SPI");
#endif
}
