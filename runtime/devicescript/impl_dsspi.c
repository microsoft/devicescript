#include "devs_internal.h"
#include "services/interfaces/jd_spi.h"

void fun5_DeviceScript_spiConfigure(devs_ctx_t *ctx) {
#if JD_SPI
    static jd_spi_cfg_t last_spi_cfg;
    static uint32_t last_ctx_no;

    jd_spi_cfg_t cfg = {
        .miso = devs_arg_int(ctx, 0),
        .mosi = devs_arg_int(ctx, 1),
        .sck = devs_arg_int(ctx, 2),
        .mode = devs_arg_int(ctx, 3),
        .hz = devs_arg_int(ctx, 4),
    };

    if (last_ctx_no == ctx->ctx_seq_no && memcmp(&cfg, &last_spi_cfg, sizeof(cfg)) == 0)
        return;

    last_ctx_no = ctx->ctx_seq_no;
    last_spi_cfg = cfg;

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

static void throw_spi_error(devs_ctx_t *ctx, void *userdata) {
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

#if JD_SPI
static uint32_t image_ctx_seq_no;
static devs_gimage_xfer_state_t *xfer_state;
static void spi_image_done(void) {
    devs_ctx_t *ctx = devsmgr_get_ctx();
    if (ctx && !ctx->error_code && ctx->ctx_seq_no == image_ctx_seq_no) {
        int sz = devs_gimage_compute_xfer(ctx, xfer_state);
        if (sz <= 0) {
            if (sz < 0)
                DMESG("! xfer error %d", sz);
            goto free;
        }

        int r = jd_spi_xfer(xfer_state->data + xfer_state->buffer_offset, NULL, sz, spi_image_done);
        if (r < 0) {
            DMESG("! image xfer error %d", r);
            goto free;
        }
    } else {
        xfer_state = NULL;
    }
    return;

free:
    devs_free(ctx, xfer_state);
    xfer_state = NULL;
    devs_fiber_await_done(&is_done);
}
#endif

void fun3_DeviceScript_spiSendImage(devs_ctx_t *ctx) {
#if JD_SPI
    devs_gimage_t *img = devs_to_gimage(ctx, devs_arg(ctx, 0));
    value_t pal = devs_arg(ctx, 1);
    unsigned flags = devs_arg_int(ctx, 2);

    if (!img)
        return;

    if (!jd_spi_is_ready()) {
        devs_throw_range_error(ctx, "SPI busy");
        return;
    }

    devs_gimage_xfer_state_t *state =
        devs_gimage_prep_xfer(ctx, img, pal, flags, jd_spi_max_block_size());
    if (!state)
        return;

    image_ctx_seq_no = ctx->ctx_seq_no;
    xfer_state = state;

    devs_fiber_t *fib = ctx->curr_fiber;
    devs_fiber_await(fib, &is_done);

    spi_image_done();

#else
    devs_throw_not_supported_error(ctx, "SPI");
#endif
}
