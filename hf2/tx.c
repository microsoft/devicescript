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
    while (packet_ready) {
        jd_frame_t *f = jd_tx_get_frame();
        packet_ready = 0;
        if (f) {
            if (transport)
                transport->send_frame(transport_ctx, f);
            jd_rx_frame_received(f); // loop-back processing
            jd_tx_frame_sent(f);
        }
    }
}
