// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "jd_sdk.h"

static jd_frame_t *sendFrame;
static uint8_t bufferPtr, isSending;
static jd_transport_ctx_t *transport_ctx;
static const jd_transport_t *transport;

int jd_tx_is_idle() {
    return !isSending && sendFrame[bufferPtr].size == 0;
}

void tx_init(const jd_transport_t *transport_, jd_transport_ctx_t *ctx) {
    transport_ctx = ctx;
    transport = transport_;
    if (!sendFrame)
        sendFrame = (jd_frame_t *)jd_alloc(sizeof(jd_frame_t) * 2);
}

int jd_send_frame(jd_frame_t *f) {
    if (!transport)
        return -1;
    return transport->send_frame(transport_ctx, f);
}

int jd_send(unsigned service_num, unsigned service_cmd, const void *data, unsigned service_size) {
    void *trg = jd_push_in_frame(&sendFrame[bufferPtr], service_num, service_cmd, service_size);
    if (!trg) {
        ERROR("send ovf");
        return -1;
    }
    if (data)
        memcpy(trg, data, service_size);

    return 0;
}

void jd_tx_flush() {
    if (isSending)
        return;
    jd_frame_t *to_send = &sendFrame[bufferPtr];
    if (to_send->size == 0)
        return;
    to_send->device_identifier = jd_device_id();
    jd_compute_crc(to_send);
    bufferPtr ^= 1;
    jd_services_packet_queued();
    jd_reset_frame(&sendFrame[bufferPtr]);

    isSending = true;
    if (transport)
        transport->send_frame(transport_ctx, to_send);
    isSending = false;
}
