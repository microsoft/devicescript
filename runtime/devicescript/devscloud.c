#include "devs_internal.h"
#include "jacdac/dist/c/cloudadapter.h"

#define LOG(msg, ...) DMESG("devscloud: " msg, ##__VA_ARGS__)

struct srv_state {
    SRV_COMMON;
    const devscloud_api_t *api;
};

static srv_t *_devscloud_state;

void devscloud_process(srv_t *state) {}

static void devscloud_upload(srv_t *state, jd_packet_t *pkt) {
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

void devscloud_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_CLOUD_ADAPTER_CMD_UPLOAD:
        devscloud_upload(state, pkt);
        return;

    case JD_CLOUD_ADAPTER_CMD_UPLOAD_BIN:
        if (state->api->bin_upload(pkt->data, pkt->service_size))
            LOG("failed bin upload");
        return;

    case JD_CLOUD_ADAPTER_CMD_ACK_CLOUD_COMMAND: {
        jd_cloud_adapter_ack_cloud_command_t *arg = (void *)pkt->data;
        int numvals = (pkt->service_size >> 3) - 1;
        if (numvals >= 0)
            state->api->respond_method(arg->seq_no, arg->status, numvals, arg->result);
        break;
    }

    case JD_GET(JD_CLOUD_ADAPTER_REG_CONNECTED):
        jd_respond_u8(pkt, state->api->is_connected());
        return;

    default:
        jd_send_not_implemented(pkt);
        return;
    }
}

void devscloud_on_method(const char *label, uint32_t method_id, int numvals, const double *vals) {
    srv_t *state = _devscloud_state;
    int lblsize = strlen(label) + 1;
    int sz = 4 + lblsize + 8 * numvals;
    uint8_t *data = jd_alloc(sz);
    memcpy(data, &method_id, 4);
    memcpy(data + 4, label, lblsize);
    memcpy(data + 4 + lblsize, vals, 8 * numvals);
    jd_send_event_ext(state, JD_CLOUD_ADAPTER_EV_CLOUD_COMMAND, data, sz);
    jd_free(data);
}

SRV_DEF(devscloud, JD_SERVICE_CLASS_CLOUD_ADAPTER);
void devscloud_init(const devscloud_api_t *cloud_api) {
    SRV_ALLOC(devscloud);
    state->api = cloud_api;
    _devscloud_state = state;
}

static int upload(const char *label, int numvals, double *vals) {
    return 0;
}

static int bin_upload(const void *data, unsigned datasize) {
    return 0;
}
static int agg_upload(const char *label, jd_device_service_t *service,
                      jd_timeseries_aggregator_stored_report_t *data) {
    return 0;
}
static int is_connected(void) {
    return 1;
}
size_t max_bin_upload_size;

const devscloud_api_t noop_cloud = {
    .upload = upload,
    .bin_upload = bin_upload,
    .agg_upload = agg_upload,
    .is_connected = is_connected,
    .max_bin_upload_size = 1024,
};
