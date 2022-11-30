#include "devs_internal.h"
#include "jacdac/dist/c/cloudadapter.h"

typedef struct {
    jd_device_service_t *cloud_serv;
    uint32_t conn_query_timer;
    bool is_connected;
} extcloud_ctx_t;

static extcloud_ctx_t *extcloud_ctx;

static void ask_connected(extcloud_ctx_t *ctx) {
    jd_service_send_cmd(ctx->cloud_serv, JD_GET(JD_CLOUD_ADAPTER_REG_CONNECTED), NULL, 0);
}

static void dev_created(extcloud_ctx_t *ctx, jd_device_t *dev) {
    if (ctx->cloud_serv)
        return;

    for (unsigned i = 1; i < dev->num_services; ++i) {
        if (dev->services[i].service_class == JD_SERVICE_CLASS_CLOUD_ADAPTER) {
            ctx->cloud_serv = &dev->services[i];
            ctx->is_connected = 0; // we don't know yet
            ask_connected(ctx);
            break;
        }
    }
}

static void dev_destroyed(extcloud_ctx_t *ctx, jd_device_t *dev) {
    if (ctx->cloud_serv && jd_service_parent(ctx->cloud_serv) == dev) {
        ctx->cloud_serv = NULL;
        ctx->is_connected = false;
        // try to assign something else
        for (jd_device_t *d = jd_devices; d; d = d->next)
            dev_created(ctx, dev);
    }
}

static void dev_packet(extcloud_ctx_t *ctx, jd_device_service_t *serv, jd_packet_t *pkt) {
    if (!serv || serv != ctx->cloud_serv)
        return;

    if (!jd_is_report(pkt))
        return;

    if (jd_event_code(pkt) == JD_CLOUD_ADAPTER_EV_CHANGE) {
        ctx->is_connected = !ctx->is_connected; // this is what likely happened
        ask_connected(ctx);                     // but we ask anyways
    } else if (pkt->service_command == JD_GET(JD_CLOUD_ADAPTER_REG_CONNECTED)) {
        ctx->is_connected = !!pkt->data[0];
    }
}

static void extcloud_process(extcloud_ctx_t *ctx) {
    if (jd_should_sample(&ctx->conn_query_timer, 1 << 20)) {
        if (ctx->cloud_serv)
            ask_connected(ctx);
    }
}

static void extcloud_client_ev(void *_state, int event_id, void *arg0, void *arg1) {
    extcloud_ctx_t *ctx = _state;

    switch (event_id) {
    case JD_CLIENT_EV_DEVICE_CREATED:
        dev_created(ctx, arg0);
        break;

    case JD_CLIENT_EV_DEVICE_DESTROYED:
        dev_destroyed(ctx, arg0);
        break;

    case JD_CLIENT_EV_SERVICE_PACKET:
        dev_packet(ctx, arg0, arg1);
        break;

    case JD_CLIENT_EV_PROCESS:
        extcloud_process(ctx);
        break;
    }
}

int extcloud_publish_values(const char *label, int numvals, double *vals) {
    extcloud_ctx_t *ctx = extcloud_ctx;
    if (!ctx->cloud_serv)
        return -10;

    int len = strlen(label) + 1;
    int sz = len + numvals * sizeof(double);
    char *data = jd_alloc(sz);
    memcpy(data, label, len);
    memcpy(data + len, vals, sz - len);
    int r = jd_service_send_cmd(ctx->cloud_serv, JD_CLOUD_ADAPTER_CMD_UPLOAD, data, sz);
    jd_free(data);

    return r;
}

int extcloud_publish_bin(const void *data, unsigned datasize) {
    extcloud_ctx_t *ctx = extcloud_ctx;
    if (!ctx->cloud_serv)
        return -10;
    return jd_service_send_cmd(ctx->cloud_serv, JD_CLOUD_ADAPTER_CMD_UPLOAD_BIN, data, datasize);
}

int extcloud_is_connected(void) {
    extcloud_ctx_t *ctx = extcloud_ctx;
    return ctx->cloud_serv != NULL && ctx->is_connected;
}

const devscloud_api_t extcloud = {
    .upload = extcloud_publish_values,
    .agg_upload = aggbuffer_upload,
    .bin_upload = extcloud_publish_bin,
    .is_connected = extcloud_is_connected,
    .max_bin_upload_size = JD_SERIAL_PAYLOAD_SIZE,
};

void extcloud_init(void) {
    extcloud_ctx_t *ctx = jd_alloc(sizeof(extcloud_ctx_t));
    extcloud_ctx = ctx;
    jd_client_subscribe(extcloud_client_ev, ctx);
    aggbuffer_init(&extcloud);
}
