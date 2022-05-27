#include "jacs_internal.h"
#include "jacdac/dist/c/jacscriptcloud.h"

#define LOG(msg, ...) DMESG("jacscloud: " msg, ##__VA_ARGS__)

struct srv_state {
    SRV_COMMON;
    const jacscloud_api_t *api;
};

void jacscloud_process(srv_t *state) {}

static void jacscloud_upload(srv_t *state, jd_packet_t *pkt) {
    int ptr = 0;
    while (ptr < pkt->service_size && pkt->data[ptr])
        ptr++;
    ptr++;
    if (ptr >= pkt->service_size)
        return;
    int numvals = (pkt->service_size - ptr) / sizeof(double);
    double *vals = jd_alloc(numvals * sizeof(double) + 1);
    memcpy(vals, pkt->data + ptr, numvals * sizeof(double));
    int r = state->api->upload((char *)pkt->data, numvals, vals);
    jd_free(vals);
    if (r)
        LOG("failed upload");
}

void jacscloud_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_JACSCRIPT_CLOUD_CMD_UPLOAD:
        jacscloud_upload(state, pkt);
        return;

    case JD_JACSCRIPT_CLOUD_CMD_UPLOAD_BIN:
        if (state->api->bin_upload(pkt->data, pkt->service_size))
            LOG("failed bin upload");
        return;

    case JD_GET(JD_JACSCRIPT_CLOUD_REG_CONNECTED):
        jd_respond_u8(pkt, state->api->is_connected());
        return;

    default:
        jd_send_not_implemented(pkt);
        return;
    }
}

SRV_DEF(jacscloud, JD_SERVICE_CLASS_JACSCRIPT_CLOUD);
void jacscloud_init(const jacscloud_api_t *cloud_api) {
    SRV_ALLOC(jacscloud);
    state->api = cloud_api;
}
