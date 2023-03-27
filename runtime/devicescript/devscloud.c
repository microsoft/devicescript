#include "devs_internal.h"
#include "jacdac/dist/c/cloudadapter.h"
#include "jacdac/dist/c/wssk.h"

#define LOG_TAG "devscloud"
#include "devs_logging.h"

struct srv_state {
    SRV_COMMON;
    const devscloud_api_t *api;
};

static srv_t *_devscloud_state;

void devscloud_process(srv_t *state) {}

static void devscloud_upload(srv_t *state, int type, jd_packet_t *pkt) {
    int ep = 0;
    while (ep < pkt->service_size && pkt->data[ep])
        ep++;
    ep++;
    if (ep > pkt->service_size) {
        LOG("invalid cloud upload format");
        return;
    }
    int r =
        state->api->send_message(type, (char *)pkt->data, pkt->data + ep, pkt->service_size - ep);
    if (r)
        LOG("failed upload");
}

void devscloud_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_CLOUD_ADAPTER_CMD_UPLOAD_JSON:
        devscloud_upload(state, JD_WSSK_DATA_TYPE_JSON, pkt);
        return;
    case JD_CLOUD_ADAPTER_CMD_UPLOAD_BINARY:
        devscloud_upload(state, JD_WSSK_DATA_TYPE_BINARY, pkt);
        return;

    case JD_GET(JD_CLOUD_ADAPTER_REG_CONNECTED):
        jd_respond_u8(pkt, state->api->is_connected());
        return;

    default:
        if (state->api->service_query && state->api->service_query(pkt) > 0)
            return;
        jd_send_not_implemented(pkt);
        return;
    }
}

void devscloud_on_message(int data_type, const void *data, unsigned datasize) {
    srv_t *state = _devscloud_state;
    if (data_type == JD_WSSK_DATA_TYPE_JSON)
        jd_send_event_ext(state, JD_CLOUD_ADAPTER_EV_ON_JSON, data, datasize);
    else if (data_type == JD_WSSK_DATA_TYPE_BINARY)
        jd_send_event_ext(state, JD_CLOUD_ADAPTER_EV_ON_BINARY, data, datasize);
}

SRV_DEF(devscloud, JD_SERVICE_CLASS_CLOUD_ADAPTER);
void devscloud_init(const devscloud_api_t *cloud_api) {
    SRV_ALLOC(devscloud);
    state->api = cloud_api;
    _devscloud_state = state;
}

static int send_message(int data_type, const char *topic, const void *data, unsigned datasize) {
    return 0;
}

static int is_connected(void) {
    return 1;
}

const devscloud_api_t noop_cloud = {
    .send_message = send_message,
    .is_connected = is_connected,
    .max_bin_upload_size = 1024,
};

void devs_track_exception(devs_ctx_t *ctx) {
    if (_devscloud_state && _devscloud_state->api && _devscloud_state->api->track_exception)
        _devscloud_state->api->track_exception(ctx);
}
