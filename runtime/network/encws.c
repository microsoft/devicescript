#include "jd_network.h"
#include "jacdac/dist/c/azureiothubhealth.h"
#include "jacdac/dist/c/cloudadapter.h"
#include "jacscript.h"

#define SETTINGS_KEY "encws_connstr"

#define LOG(fmt, ...) DMESG("ENCWS: " fmt, ##__VA_ARGS__)
#define LOGV(...) ((void)0)
//#define LOGV LOG

struct srv_state {
    SRV_COMMON;

    // regs
    uint16_t conn_status;
    uint32_t push_period_ms;
    uint32_t push_watchdog_period_ms;

    // non-regs
    bool waiting_for_net;
    uint32_t reconnect_timer;
    uint32_t flush_timer;
    uint32_t watchdog_timer_ms;

    char *hub_name;
    char *device_id;
    uint8_t master_key[JD_AES_KEY_BYTES];
    uint16_t portnum;
};

STATIC_ASSERT(sizeof(char) == 1);
STATIC_ASSERT(sizeof(uint8_t) == 1);

static srv_t *_encws_state;

REG_DEFINITION(                                                //
    encws_regs,                                                //
    REG_SRV_COMMON,                                            //
    REG_U16(JD_AZURE_IOT_HUB_HEALTH_REG_CONNECTION_STATUS),    //
    REG_U32(JD_AZURE_IOT_HUB_HEALTH_REG_PUSH_PERIOD),          //
    REG_U32(JD_AZURE_IOT_HUB_HEALTH_REG_PUSH_WATCHDOG_PERIOD), //
)

#define CHD_SIZE 4

static bool wifi_is_connected(void) {
    return 1;
}

static const char *status_name(int st) {
    switch (st) {
    case JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED:
        return "CONNECTED";
    case JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED:
        return "DISCONNECTED";
    case JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTING:
        return "CONNECTING";
    case JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTING:
        return "DISCONNECTING";
    default:
        return "???";
    }
}

static void feed_watchdog(srv_t *state) {
    if (state->push_watchdog_period_ms)
        state->watchdog_timer_ms = now_ms + state->push_watchdog_period_ms;
}

static void set_status(srv_t *state, uint16_t status) {
    if (state->conn_status == status)
        return;
    LOG("status %d (%s)", status, status_name(status));
    state->conn_status = status;
    jd_send_event_ext(state, JD_AZURE_IOT_HUB_HEALTH_EV_CONNECTION_STATUS_CHANGE,
                      &state->conn_status, sizeof(state->conn_status));
}

static void clear_conn_string(srv_t *state) {
    jd_free(state->hub_name);
    jd_free(state->device_id);
    state->portnum = 80;
    memset(state->master_key, 0, sizeof(state->master_key));
    state->hub_name = NULL;
    state->device_id = NULL;
}

static void on_msg(srv_t *state, uint8_t *data, unsigned size) {
    if (size < CHD_SIZE)
        goto too_short;

    if (data[2] == 0) {
        // compressed packet
        uint16_t cmd = data[0] | (data[1] << 8);
        uint8_t *payload = data + CHD_SIZE;
        data[size] = 0; // force NUL-terminate
        if (cmd == JD_CLOUD_ADAPTER_CMD_ACK_CLOUD_COMMAND) {
            uint32_t ridval;
            memcpy(&ridval, payload, sizeof(ridval));
            uint8_t *label = payload + 4;
            uint8_t *dblptr = label + strlen((char *)label) + 1;
            unsigned numdbl = (size - (dblptr - data)) / sizeof(double);
            LOG("method: '%s' rid=%u numvals=%u", label, ridval, numdbl);
            double *vals = jd_alloc(numdbl * sizeof(double) + 1);
            memcpy(vals, dblptr, numdbl * sizeof(double));
            jacscloud_on_method((char *)label, ridval, numdbl, vals);
            jd_free(vals);
        } else {
            LOG("unknown cmd %x", cmd);
        }
    } else {
        // forwarded frame
        jd_frame_t *frame = (void *)data;
        unsigned fsz = JD_FRAME_SIZE(frame);
        if (fsz > size)
            goto too_short;
        frame = jd_alloc(fsz);
        memcpy(frame, data, fsz);
        jd_rx_frame_received_loopback(frame);
        jd_free(frame);
    }

too_short:
    LOG("too short frame: %d", size);
    return;
}

void jd_encsock_on_event(unsigned event, const void *data, unsigned size) {
    srv_t *state = _encws_state;

    LOGV("%s %-s", jd_websock_event_name(event), jd_json_escape(data, size));

    switch (event) {
    case JD_CONN_EV_OPEN:
        set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED);
        break;
    case JD_CONN_EV_MESSAGE:
        on_msg(state, (void *)data, size);
        break;
    case JD_CONN_EV_CLOSE:
        set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED);
        break;
    case JD_CONN_EV_ERROR:
        LOG("encsock error: %-s", jd_json_escape(data, size));
        set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED);
        break;
    }
}

static void encws_disconnect(srv_t *state) {
    if (state->conn_status == JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED)
        return;

    set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTING);
    jd_encsock_close();
}

static void encws_reconnect(srv_t *state) {
    if (!state->hub_name || !wifi_is_connected()) {
        encws_disconnect(state);
        return;
    }

    LOG("connecting to ws://%s:%d%s", state->hub_name, state->portnum, state->device_id);

    int r = jd_encsock_new(state->hub_name, state->portnum, state->device_id, state->master_key);
    if (r)
        return;

    set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTING);
}

static int set_conn_string(srv_t *state, const char *conn_str, unsigned conn_sz, int save) {
    if (!conn_sz) {
        LOG("clear connection string");
        clear_conn_string(state);
        if (save)
            jd_settings_set(SETTINGS_KEY, NULL);
        encws_reconnect(state);
        return 0;
    }

    char *conn = jd_alloc(conn_sz + 1);
    memcpy(conn, conn_str, conn_sz);

    char *path = NULL;
    char *host = NULL;
    uint8_t master_key[JD_AES_KEY_BYTES];
    int portnum = 80;

    // ws://df1...64@foobar.example.com:7011/jacdac-ws0/f70e6b97713cdaee
    if (strlen(conn) < JD_AES_KEY_BYTES * 2 + 6)
        goto fail_parse;

    if (memcmp(conn, "ws://", 5) != 0)
        goto fail_parse;

    char *keybeg = conn + 5;
    char *at_pos = strchr(keybeg, '@');
    char *colon_pos = strchr(keybeg, ':');
    char *slash_pos = strchr(keybeg, '/');

    if (!at_pos || !slash_pos)
        goto fail_parse;
    if (!(at_pos < slash_pos))
        goto fail_parse;
    if (colon_pos && !(at_pos < colon_pos && colon_pos < slash_pos))
        goto fail_parse;

    if (at_pos - keybeg != JD_AES_KEY_BYTES * 2)
        goto fail_parse;

    *at_pos = 0;
    if (jd_from_hex(master_key, keybeg) != JD_AES_KEY_BYTES)
        goto fail_parse;

    if (colon_pos) {
        *colon_pos = 0;
        portnum = jd_atoi(colon_pos + 1);
        if (portnum <= 1 || portnum > 0xffff)
            goto fail_parse;
    }

    *slash_pos = 0;
    host = jd_strdup(at_pos + 1);

    *slash_pos = '/';
    path = jd_strdup(slash_pos);

    clear_conn_string(state);

    state->hub_name = host;
    state->device_id = path;
    state->portnum = portnum;
    memcpy(state->master_key, master_key, JD_AES_KEY_BYTES);

    if (save) {
        memcpy(conn, conn_str, conn_sz); // restore
        jd_settings_set(SETTINGS_KEY, conn);
    }

    encws_reconnect(state);

    jd_free(conn);

    return 0;

fail_parse:
    LOG("failed parsing conn string: %s", conn_str);
    jd_free(path);
    jd_free(host);
    jd_free(conn);
    return -1;
}

#if 1
static const uint32_t glows[] = {
    [JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED] = JD_GLOW_CLOUD_CONNECTED_TO_CLOUD,
    [JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED] = JD_GLOW_CLOUD_NOT_CONNECTED_TO_CLOUD,
    [JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTING] = JD_GLOW_CLOUD_CONNECTING_TO_CLOUD,
    [JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTING] =
        JD_GLOW_CLOUD_NOT_CONNECTED_TO_CLOUD,
};
#endif

void encws_process(srv_t *state) {
    if (state->push_watchdog_period_ms && in_past_ms(state->watchdog_timer_ms)) {
        DMESG("cloud watchdog reset");
        target_reset();
    }

    if (jd_should_sample(&state->reconnect_timer, 500000)) {
#if 1
        if (!wifi_is_connected())
            jd_glow(JD_GLOW_CLOUD_CONNECTING_TO_NETWORK);
        else
            jd_glow(glows[state->conn_status]);
#endif

        if (wifi_is_connected() &&
            state->conn_status == JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED &&
            state->hub_name && state->waiting_for_net) {
            state->waiting_for_net = false;
            encws_reconnect(state);
        }
    }

    if (jd_should_sample_ms(&state->flush_timer, state->push_period_ms)) {
        aggbuffer_flush();
    }
}

void encws_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_AZURE_IOT_HUB_HEALTH_CMD_SET_CONNECTION_STRING:
        set_conn_string(state, (char *)pkt->data, pkt->service_size, 1);
        return;

    case JD_AZURE_IOT_HUB_HEALTH_CMD_CONNECT:
        encws_reconnect(state);
        return;

    case JD_AZURE_IOT_HUB_HEALTH_CMD_DISCONNECT:
        encws_disconnect(state);
        return;

    case JD_GET(JD_AZURE_IOT_HUB_HEALTH_REG_HUB_NAME):
        jd_respond_string(pkt, state->hub_name);
        return;

    case JD_GET(JD_AZURE_IOT_HUB_HEALTH_REG_HUB_DEVICE_ID):
        jd_respond_string(pkt, state->device_id);
        return;
    }

    switch (service_handle_register_final(state, pkt, encws_regs)) {
    case JD_AZURE_IOT_HUB_HEALTH_REG_PUSH_PERIOD:
    case JD_AZURE_IOT_HUB_HEALTH_REG_PUSH_WATCHDOG_PERIOD:
        if (state->push_period_ms < 1000)
            state->push_period_ms = 1000;
        if (state->push_period_ms > 24 * 3600 * 1000)
            state->push_period_ms = 24 * 3600 * 1000;

        if (state->push_watchdog_period_ms) {
            if (state->push_watchdog_period_ms < state->push_period_ms * 3)
                state->push_watchdog_period_ms = state->push_period_ms * 3;
            feed_watchdog(state);
        }
        break;
    }
}

SRV_DEF(encws, JD_SERVICE_CLASS_AZURE_IOT_HUB_HEALTH);
void encws_init(void) {
    SRV_ALLOC(encws);

    aggbuffer_init(&encws_cloud);

    state->conn_status = JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED;
    state->waiting_for_net = true;
    state->push_period_ms = 5000;

    char *conn = jd_settings_get(SETTINGS_KEY);
    if (conn) {
        set_conn_string(state, conn, strlen(conn), 0);
        jd_free(conn);
    }

    _encws_state = state;
}

static uint8_t *prep_msg(uint16_t cmd, unsigned payload_size) {
    uint8_t *r = jd_alloc(4 + payload_size);
    r[0] = cmd & 0xff;
    r[1] = cmd >> 8;
    return r;
}

int encws_publish(const void *msg, unsigned len) {
    srv_t *state = _encws_state;
    if (state->conn_status != JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED)
        return -1;

    if (jd_encsock_send_message(msg, len) != 0)
        return -2;

    feed_watchdog(state);

    const uint8_t *data = msg;
    unsigned cmd = data[0] | (data[1] << 8);
    if (data[2] == 0) {
        LOG("send compressed: cmd=%x", cmd);
        jd_blink(JD_BLINK_CLOUD_UPLOADED);
    } else {
        LOGV("fwd; CRC=%x", cmd);
    }

    return 0;
}

static int publish_and_free(void *msg, unsigned payload_size) {
    int r = encws_publish(msg, CHD_SIZE + payload_size);
    jd_free(msg);
    return r;
}

int encws_publish_values(const char *label, int numvals, double *vals) {
    unsigned llen = strlen(label);
    unsigned payload_size = llen + 1 + sizeof(double) * numvals;

    uint8_t *msg = prep_msg(JD_CLOUD_ADAPTER_CMD_UPLOAD, payload_size);
    memcpy(msg + CHD_SIZE, label, llen);
    memcpy(msg + CHD_SIZE + llen + 1, vals, numvals * sizeof(double));

    return publish_and_free(msg, payload_size);
}

int encws_publish_bin(const void *data, unsigned datasize) {
    uint8_t *msg = prep_msg(JD_CLOUD_ADAPTER_CMD_UPLOAD_BIN, datasize);
    memcpy(msg + CHD_SIZE, data, datasize);
    return publish_and_free(msg, datasize);
}

int encws_is_connected(void) {
    srv_t *state = _encws_state;
    return state->conn_status == JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED;
}

int encws_respond_method(uint32_t method_id, uint32_t status, int numvals, double *vals) {
    srv_t *state = _encws_state;
    if (state->conn_status != JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED)
        return -1;

    unsigned payload_size = 4 + sizeof(double) * numvals;
    uint8_t *msg = prep_msg(JD_CLOUD_ADAPTER_CMD_ACK_CLOUD_COMMAND, payload_size);
    jd_cloud_adapter_ack_cloud_command_t *resp = (void *)(msg + CHD_SIZE);
    resp->seq_no = method_id;
    resp->status = status;
    memcpy(resp->result, vals, numvals * sizeof(double));
    return publish_and_free(msg, payload_size);
}

const jacscloud_api_t encws_cloud = {
    .upload = encws_publish_values,
    .agg_upload = aggbuffer_upload,
    .bin_upload = encws_publish_bin,
    .is_connected = encws_is_connected,
    .max_bin_upload_size = 1024, // just a guess
    .respond_method = encws_respond_method,
};