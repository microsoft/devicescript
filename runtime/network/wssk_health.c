#include "jd_network.h"
#include "jacdac/dist/c/azureiothubhealth.h"
#include "jacdac/dist/c/cloudadapter.h"
#include "devicescript.h"

#include "interfaces/jd_usb.h"            // jd_net_disable_fwd() proto
#include "services/interfaces/jd_flash.h" // jd_settings*

#define SETTINGS_KEY "wssk_connstr"

#define WATCHDOG_SECONDS 32

#define LOG(fmt, ...) DMESG("WSSK-H: " fmt, ##__VA_ARGS__)
#if 1
#define LOGV(...) ((void)0)
#else
#define LOGV LOG
#endif

struct srv_state {
    SRV_COMMON;

    // regs
    uint16_t conn_status;
    uint32_t push_period_ms;
    uint32_t push_watchdog_period_ms;

    // non-regs
    bool fwd_en;
    uint32_t fwd_timer;

    uint32_t glow_timer;
    uint32_t reconnect_timer;
    uint32_t flush_timer;
    uint32_t watchdog_timer_ms;
    uint32_t ping_timer;

    char *hub_name;
    char *device_id;
    uint8_t master_key[JD_AES_KEY_BYTES];
    uint16_t portnum;

    jd_queue_t fwdqueue;
};

STATIC_ASSERT(sizeof(char) == 1);
STATIC_ASSERT(sizeof(uint8_t) == 1);

static srv_t *_wsskhealth_state;

REG_DEFINITION(                                                //
    wsskhealth_regs,                                           //
    REG_SRV_COMMON,                                            //
    REG_U16(JD_AZURE_IOT_HUB_HEALTH_REG_CONNECTION_STATUS),    //
    REG_U32(JD_AZURE_IOT_HUB_HEALTH_REG_PUSH_PERIOD),          //
    REG_U32(JD_AZURE_IOT_HUB_HEALTH_REG_PUSH_WATCHDOG_PERIOD), //
)

#define CHD_SIZE 4

static int send_ping(void);
int wssk_publish(const void *msg, unsigned len);

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

static void feed_reconnect_watchdog(srv_t *state) {
    state->reconnect_timer = now + (WATCHDOG_SECONDS << 20);
    state->ping_timer = now + ((WATCHDOG_SECONDS / 2) << 20);
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

static void on_cmd_msg(srv_t *state, uint8_t *data, unsigned size);
static void on_msg(srv_t *state, uint8_t *data, unsigned size) {
    if (size < CHD_SIZE)
        goto too_short;

    if (data[2] == 0) {
        on_cmd_msg(state, data, size);
    } else {
        // forwarded frame
        jd_frame_t *frame = (void *)data;
        unsigned fsz = JD_FRAME_SIZE(frame);
        if (fsz > size)
            goto too_short;
        frame = jd_alloc(fsz);
        memcpy(frame, data, fsz);
        jd_send_frame_raw(frame);
        // jd_rx_frame_received_loopback(frame);
        jd_free(frame);
    }
    return;

too_short:
    LOG("too short frame: %d", size);
    return;
}

void jd_wssk_on_event(unsigned event, const void *data, unsigned size) {
    srv_t *state = _wsskhealth_state;

    LOGV("%s %-s", jd_websock_event_name(event), jd_json_escape(data, size));

    switch (event) {
    case JD_CONN_EV_OPEN:
        feed_reconnect_watchdog(state);
        set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED);
        break;
    case JD_CONN_EV_MESSAGE:
        feed_reconnect_watchdog(state);
        on_msg(state, (void *)data, size);
        break;
    case JD_CONN_EV_CLOSE:
        state->fwd_en = 0;
        set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED);
        break;
    case JD_CONN_EV_ERROR:
        LOG("encsock error: %-s", jd_json_escape(data, size));
        set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED);
        break;
    }
}

static void wsskhealth_disconnect(srv_t *state) {
    if (state->conn_status == JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED)
        return;

    set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTING);
    jd_wssk_close();
}

static void wsskhealth_reconnect(srv_t *state) {
    wsskhealth_disconnect(state);

    if (!state->hub_name || !jd_tcpsock_is_available())
        return;

    LOG("connecting to ws://%s:%d%s", state->hub_name, state->portnum, state->device_id);

    int r = jd_wssk_new(state->hub_name, state->portnum, state->device_id, state->master_key);
    if (r)
        return;

    set_status(state, JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTING);
    feed_reconnect_watchdog(state);
}

static int set_conn_string(srv_t *state, const char *conn_str, unsigned conn_sz, int save) {
    if (!conn_sz) {
        LOG("clear connection string");
        clear_conn_string(state);
        if (save)
            jd_settings_set(SETTINGS_KEY, NULL);
        wsskhealth_reconnect(state);
        return 0;
    }

    char *conn = jd_alloc(conn_sz + 1);
    memcpy(conn, conn_str, conn_sz);

    char *path = NULL;
    char *host = NULL;
    uint8_t master_key[JD_AES_KEY_BYTES];
    int portnum = 80;

    // ws://wssk:df1...64@foobar.example.com:7011/jacdac-ws0/f70e6b97713cdaee
    if (strlen(conn) < JD_AES_KEY_BYTES * 2 + 6)
        goto fail_parse;

    if (memcmp(conn, "ws://", 5) != 0)
        goto fail_parse;

    char *keybeg = conn + 5;
    char *at_pos = strchr(keybeg, '@');
    char *user_colon_pos = strchr(keybeg, ':');
    if (user_colon_pos > at_pos)
        user_colon_pos = NULL;
    char *colon_pos = strchr(at_pos, ':');
    char *slash_pos = strchr(at_pos, '/');

    if (!at_pos || !slash_pos)
        goto fail_parse;
    if (colon_pos && !(at_pos < colon_pos && colon_pos < slash_pos))
        goto fail_parse;

    if (user_colon_pos) {
        if (memcmp(keybeg, "wssk:", 5) != 0)
            goto fail_parse;
        keybeg = user_colon_pos + 1;
    }

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

    wsskhealth_reconnect(state);

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

void wsskhealth_process(srv_t *state) {
    if (state->push_watchdog_period_ms && in_past_ms(state->watchdog_timer_ms)) {
        DMESG("cloud watchdog reset");
        target_reset();
    }

    if (jd_should_sample(&state->fwd_timer, 16 << 20)) {
        // fwd_en expires after around 16s
        state->fwd_en = 0;
    }

    if (state->fwdqueue) {
        for (;;) {
            jd_frame_t *f = jd_queue_front(state->fwdqueue);
            if (!f)
                break;
            if (state->fwd_en) {
                if (wssk_publish(f, JD_FRAME_SIZE(f)) != 0)
                    break; // wait for next round
            }
            jd_queue_shift(state->fwdqueue);
        }
    }

    if (jd_should_sample(&state->ping_timer, 4 << 20)) {
        send_ping();
    }

    if (jd_should_sample(&state->glow_timer, 512 << 10)) {
        if (!jd_tcpsock_is_available())
            jd_glow(JD_GLOW_CLOUD_CONNECTING_TO_NETWORK);
        else
            jd_glow(glows[state->conn_status]);
    }

    // the ~512ms period is only used when we're waiting for network or there is no hub
    if (jd_should_sample(&state->reconnect_timer, 512 << 10)) {
        wsskhealth_reconnect(state);
    }

    if (jd_should_sample_ms(&state->flush_timer, state->push_period_ms)) {
        aggbuffer_flush();
    }
}

void wsskhealth_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_AZURE_IOT_HUB_HEALTH_CMD_SET_CONNECTION_STRING:
        set_conn_string(state, (char *)pkt->data, pkt->service_size, 1);
        return;

    case JD_AZURE_IOT_HUB_HEALTH_CMD_CONNECT:
        wsskhealth_reconnect(state);
        return;

    case JD_AZURE_IOT_HUB_HEALTH_CMD_DISCONNECT:
        wsskhealth_disconnect(state);
        return;

    case JD_GET(JD_AZURE_IOT_HUB_HEALTH_REG_HUB_NAME):
        jd_respond_string(pkt, state->hub_name);
        return;

    case JD_GET(JD_AZURE_IOT_HUB_HEALTH_REG_HUB_DEVICE_ID): {
        const char *id = state->device_id;
        if (id && memcmp(id, "/wssk/", 6) == 0)
            id += 6;
        jd_respond_string(pkt, id);
        return;
    }
    }

    switch (service_handle_register_final(state, pkt, wsskhealth_regs)) {
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

SRV_DEF(wsskhealth, JD_SERVICE_CLASS_AZURE_IOT_HUB_HEALTH);
void wsskhealth_init(void) {
    SRV_ALLOC(wsskhealth);

    aggbuffer_init(&wssk_cloud);

    state->conn_status = JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_DISCONNECTED;
    state->push_period_ms = 5000;

    char *conn = jd_settings_get(SETTINGS_KEY);
    if (conn) {
        set_conn_string(state, conn, strlen(conn), 0);
        jd_free(conn);
    }

    _wsskhealth_state = state;
}

static uint8_t *prep_msg(uint16_t cmd, unsigned payload_size) {
    uint8_t *r = jd_alloc(4 + payload_size);
    r[0] = cmd & 0xff;
    r[1] = cmd >> 8;
    return r;
}

int wssk_publish(const void *msg, unsigned len) {
    srv_t *state = _wsskhealth_state;
    if (state->conn_status != JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED)
        return -1;

    if (jd_wssk_send_message(msg, len) != 0)
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
    int r = wssk_publish(msg, CHD_SIZE + payload_size);
    jd_free(msg);
    return r;
}

int wssk_publish_values(const char *label, int numvals, double *vals) {
    unsigned llen = strlen(label);
    unsigned payload_size = llen + 1 + sizeof(double) * numvals;

    uint8_t *msg = prep_msg(JD_CLOUD_ADAPTER_CMD_UPLOAD, payload_size);
    memcpy(msg + CHD_SIZE, label, llen);
    memcpy(msg + CHD_SIZE + llen + 1, vals, numvals * sizeof(double));

    return publish_and_free(msg, payload_size);
}

int wssk_publish_bin(const void *data, unsigned datasize) {
    uint8_t *msg = prep_msg(JD_CLOUD_ADAPTER_CMD_UPLOAD_BIN, datasize);
    memcpy(msg + CHD_SIZE, data, datasize);
    return publish_and_free(msg, datasize);
}

int wssk_is_connected(void) {
    srv_t *state = _wsskhealth_state;
    return state->conn_status == JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED;
}

int wssk_respond_method(uint32_t method_id, uint32_t status, int numvals, double *vals) {
    srv_t *state = _wsskhealth_state;
    if (state->conn_status != JD_AZURE_IOT_HUB_HEALTH_CONNECTION_STATUS_CONNECTED)
        return -1;

    unsigned payload_size = 8 + sizeof(double) * numvals;
    uint8_t *msg = prep_msg(JD_CLOUD_ADAPTER_CMD_ACK_CLOUD_COMMAND, payload_size);
    jd_cloud_adapter_ack_cloud_command_t *resp = (void *)(msg + CHD_SIZE);
    resp->seq_no = method_id;
    resp->status = status;
    memcpy(resp->result, vals, numvals * sizeof(double));
    return publish_and_free(msg, payload_size);
}

static int send_empty(uint16_t cmd) {
    uint8_t *msg = prep_msg(cmd, 0);
    return publish_and_free(msg, 0);
}

static int send_ping(void) {
    return send_empty(0x92);
}

static void on_cmd_msg(srv_t *state, uint8_t *data, unsigned size) {
    // compressed packet
    uint16_t cmd = data[0] | (data[1] << 8);
    uint8_t *payload = data + CHD_SIZE;
    data[size] = 0; // force NUL-terminate
    unsigned payload_size = size - CHD_SIZE;
    if (cmd == JD_CLOUD_ADAPTER_CMD_ACK_CLOUD_COMMAND) {
        uint32_t ridval;
        memcpy(&ridval, payload, sizeof(ridval));
        uint8_t *label = payload + 4;
        uint8_t *dblptr = label + strlen((char *)label) + 1;
        unsigned numdbl = (size - (dblptr - data)) / sizeof(double);
        LOG("method: '%s' rid=%u numvals=%u", label, (unsigned)ridval, numdbl);
        double *vals = jd_alloc(numdbl * sizeof(double) + 1);
        memcpy(vals, dblptr, numdbl * sizeof(double));
        devscloud_on_method((char *)label, ridval, numdbl, vals);
        jd_free(vals);
    } else if (cmd == 0x90) {
        if (payload[0] && !state->fwdqueue) {
            state->fwdqueue = jd_queue_alloc(JD_USB_QUEUE_SIZE);
        }
        state->fwd_en = payload[0];
        state->fwd_timer = (16 << 20) + now;
    } else if (cmd == 0x91) {
        send_empty(0x91);
    } else if (cmd == 0x92) {
        // the only effect of PONG we need is feeding the reconnect watchdog which was already
        // done
        LOGV("pong");
    } else if (cmd == 0x93) {
        uint8_t *msg = prep_msg(0x93, JD_SHA256_HASH_BYTES);
        devicescriptmgr_get_hash(msg + CHD_SIZE);
        publish_and_free(msg, JD_SHA256_HASH_BYTES);
    } else if (cmd == 0x94) {
        if (devicescriptmgr_deploy_start(*(uint32_t *)payload) == 0)
            send_empty(0x94);
        else
            send_empty(0xff);
    } else if (cmd == 0x95) {
        if (devicescriptmgr_deploy_write(payload, payload_size) == 0)
            send_empty(0x95);
        else
            send_empty(0xff);
    } else if (cmd == 0x96) {
        if (devicescriptmgr_deploy_write(NULL, 0) == 0)
            send_empty(0x96);
        else
            send_empty(0xff);
    } else {
        LOG("unknown cmd %x", cmd);
    }
}

void jd_net_disable_fwd() {
    srv_t *state = _wsskhealth_state;
    if (state)
        state->fwd_en = 0;
}

int jd_net_send_frame(void *frame) {
    srv_t *state = _wsskhealth_state;
    if (!state || !state->fwd_en)
        return 0;
    jd_frame_t *f = frame;
    if (f->size == 0)
        return -1;
    return jd_queue_push(state->fwdqueue, f);
}

const devscloud_api_t wssk_cloud = {
    .upload = wssk_publish_values,
    .agg_upload = aggbuffer_upload,
    .bin_upload = wssk_publish_bin,
    .is_connected = wssk_is_connected,
    .max_bin_upload_size = 1024, // just a guess
    .respond_method = wssk_respond_method,
};

__attribute__((weak)) bool jd_tcpsock_is_available(void) {
    return 1;
}
