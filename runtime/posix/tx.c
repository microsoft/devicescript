// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "jd_sdk.h"

static jd_transport_ctx_t *transport_ctx;
static const jd_transport_t *transport;
static bool packet_ready;

void tx_init(const jd_transport_t *transport_, jd_transport_ctx_t *ctx) {
    transport_ctx = ctx;
    transport = transport_;
    jd_tx_init();
}

void jd_packet_ready(void) {
    packet_ready = 1;
}

void tx_process(void) {
    // just empty the queue - we do not have SWS
    while (packet_ready) {
        packet_ready = 0;
        jd_frame_t *f = jd_tx_get_frame();
        if (f)
            jd_tx_frame_sent(f);
    }
}

int tx_send_frame(void *frame) {
    // the real transport is plugged in place of USB
    if (transport)
        return transport->send_frame(transport_ctx, frame);
    return -1;
}
