#include "services/jd_services.h"
#include "services/interfaces/jd_flash.h"
#include "devicescript.h"

#define LOG_TAG "wifi"
// #define VLOGGING 1
#include "devs_logging.h"

#define SCAN_SECONDS 5

static srv_t *_wifi_state;

struct srv_state {
    SRV_COMMON;

    uint8_t enabled;
    uint8_t mac[6];

    jd_opipe_desc_t scan_pipe;
    jd_wifi_results_t *scan_results;
    uint16_t scan_pipe_ptr;
    uint16_t scan_num;

    jd_opipe_desc_t networks_pipe;
    uint16_t networks_pipe_ptr;

    uint32_t next_scan;

    // currently only one network supported
    char *ssid;
    char *password;

    bool in_scan;
    bool is_connected;
    bool login_server;
    bool is_connecting;
    bool rescan_requested;
    uint32_t ipv4;
};

REG_DEFINITION(                       //
    wifi_regs,                        //
    REG_SRV_COMMON,                   //
    REG_U8(JD_WIFI_REG_ENABLED),      //
    REG_BYTES(JD_WIFI_REG_EUI_48, 6), //
)

static void stop_scan_pipe(srv_t *state) {
    jd_opipe_close(&state->scan_pipe);
    state->scan_pipe_ptr = 0;
}

static void stop_networks_pipe(srv_t *state) {
    jd_opipe_close(&state->networks_pipe);
    state->networks_pipe_ptr = 0;
}

static void wifi_scan(srv_t *state) {
    if (state->in_scan)
        return;
    state->in_scan = true;
    if (jd_wifi_start_scan() == 0) {
        LOG("start scan");
    } else {
        LOG("can't scan");
        state->in_scan = false;
    }
}

static void wifi_connect(srv_t *state) {
    if (state->is_connecting || !state->ssid)
        return;
    state->is_connecting = true;
    LOG("connecting to '%s'", state->ssid);
    if (jd_wifi_connect(state->ssid, state->password) != 0) {
        LOG("conn error");
        state->is_connecting = false;
    }
}

void jd_wifi_scan_done_cb(jd_wifi_results_t *res, unsigned num_res) {
    srv_t *state = _wifi_state;
    state->in_scan = false;

    LOG("scan done: %d results", num_res);

    int num_known_networks = 0;
    for (unsigned i = 0; i < num_res; ++i) {
        if (state->ssid && strcmp(res[i].ssid, state->ssid) == 0)
            num_known_networks++;
        LOG("%s [rssi:%d]", res[i].ssid, res[i].rssi);
    }

    stop_scan_pipe(state);

    jd_free(state->scan_results);
    state->scan_results = res;
    state->scan_num = num_res;

    jd_wifi_scan_complete_t evarg = {
        .num_networks = num_res,
        .num_known_networks = num_known_networks,
    };
    jd_send_event_ext(state, JD_WIFI_EV_SCAN_COMPLETE, &evarg, sizeof(evarg));

    if (!state->enabled)
        return;

    if (state->is_connecting)
        return;

    if (num_known_networks > 0) {
        wifi_connect(state);
    }
}

void jd_wifi_got_ip_cb(uint32_t ipv4) {
    srv_t *state = _wifi_state;
    state->is_connected = true;
    LOG("got ip %x", ipv4);
    state->ipv4 = ipv4;
    jd_send_event(state, JD_WIFI_EV_GOT_IP);
}

void jd_wifi_lost_ip_cb(void) {
    srv_t *state = _wifi_state;
    state->is_connected = false;
    state->is_connecting = false;
    if (state->rescan_requested) {
        state->rescan_requested = false;
        LOG("sta disconnect, rescan...");
        wifi_scan(state);
    } else if (state->enabled) {
        LOG("sta disconnect, reconnect...");
        state->is_connecting = false;
        wifi_connect(state);
    } else {
        LOG("sta disconnect");
    }
    jd_send_event(state, JD_WIFI_EV_LOST_IP);
}

static int wifi_cmd_add_network(srv_t *state, jd_packet_t *pkt) {
    if (pkt->service_size < 2 || pkt->data[0] == 0 || pkt->data[pkt->service_size - 1] != 0)
        return -1;

    const char *ssid = (char *)pkt->data;
    const char *pass = NULL;

    for (int i = 0; i < pkt->service_size; ++i) {
        if (!pkt->data[i] && i + 1 < pkt->service_size) {
            if (!pass)
                pass = (char *)&pkt->data[i + 1];
            else
                break;
        }
    }

    if (!pass)
        pass = "";

    state->ssid = jd_strdup(ssid);
    state->password = jd_strdup(pass);

    stop_networks_pipe(state);

    jd_settings_set("wifi_ssid", ssid);
    jd_settings_set("wifi_psk", pass);

    jd_send_event(state, JD_WIFI_EV_NETWORKS_CHANGED);
    wifi_connect(state);

    return true;
}

static void forget_all_networks(srv_t *state) {
    if (state->ssid) {
        jd_free(state->ssid);
        jd_free(state->password);
        state->ssid = NULL;
        state->password = NULL;
        jd_send_event(state, JD_WIFI_EV_NETWORKS_CHANGED);
    }
}

static void wifi_disconnect(srv_t *state) {
    if (state->is_connecting)
        jd_wifi_disconnect();
}

static int8_t wifi_rssi(srv_t *state) {
    if (!state->is_connected)
        return -128;
    return jd_wifi_rssi();
}

void wifi_process(srv_t *state) {
    if (jd_should_sample_ms(&state->next_scan, SCAN_SECONDS << 10)) {
        tsagg_update("wifi", wifi_rssi(state));
        tsagg_update("uptime", (double)now_ms_long / 1000);
        if (!state->is_connected)
            wifi_scan(state);
    }

    if (state->networks_pipe_ptr) {
        if (state->ssid == NULL)
            stop_networks_pipe(state);
        else {
            int len = strlen(state->ssid);
            char *tmp = jd_alloc(4 + len);
            memset(tmp, 0, 4);
            memcpy(tmp + 4, state->ssid, len);
            int err = jd_opipe_write(&state->networks_pipe, tmp, 4 + len);
            jd_free(tmp);
            if (err != JD_PIPE_TRY_AGAIN) {
                stop_networks_pipe(state);
            }
        }
    }

    while (state->scan_pipe_ptr) {
        unsigned idx = state->scan_pipe_ptr - 1;
        if (idx >= state->scan_num) {
            stop_scan_pipe(state);
            break;
        }
        int err = jd_opipe_write(&state->scan_pipe, &state->scan_results[idx],
                                 sizeof(state->scan_results[idx]));
        if (err == JD_PIPE_TRY_AGAIN)
            break;
        if (err != 0) {
            stop_scan_pipe(state);
            break;
        }
        state->scan_pipe_ptr++;
    }
}

void wifi_handle_packet(srv_t *state, jd_packet_t *pkt) {
    // LOG("wifi cmd: 0x%x", pkt->service_command);
    switch (pkt->service_command) {
    case JD_WIFI_CMD_LAST_SCAN_RESULTS:
        if (jd_opipe_open_cmd(&state->scan_pipe, pkt) == 0)
            state->scan_pipe_ptr = 1;
        return;

    case JD_WIFI_CMD_LIST_KNOWN_NETWORKS:
        if (jd_opipe_open_cmd(&state->networks_pipe, pkt) == 0)
            state->networks_pipe_ptr = 1;
        return;

    case JD_WIFI_CMD_ADD_NETWORK:
        wifi_cmd_add_network(state, pkt);
        return;

    case JD_WIFI_CMD_FORGET_ALL_NETWORKS:
        forget_all_networks(state);
        return;

    case JD_WIFI_CMD_SCAN:
        wifi_scan(state);
        return;

    case JD_WIFI_CMD_FORGET_NETWORK:
        if (state->ssid && strlen(state->ssid) == pkt->service_size &&
            memcmp(state->ssid, pkt->data, pkt->service_size) == 0)
            forget_all_networks(state);
        return;

    case JD_WIFI_CMD_SET_NETWORK_PRIORITY:
        // ignore
        return;

    case JD_WIFI_CMD_RECONNECT:
        state->rescan_requested = true;
        wifi_disconnect(state);
        return;

    case JD_GET(JD_WIFI_REG_RSSI):
        jd_respond_u8(pkt, wifi_rssi(state));
        return;

    case JD_GET(JD_WIFI_REG_IP_ADDRESS): {
        if (state->is_connected)
            jd_respond_u32(pkt, state->ipv4);
        else
            jd_respond_empty(pkt);
    }
        return;

    case JD_GET(JD_WIFI_REG_SSID): {
        if (state->is_connected)
            jd_respond_string(pkt, state->ssid);
        else
            jd_respond_empty(pkt);
        return;
    }
    }

    int preven = state->enabled;

    switch (service_handle_register_final(state, pkt, wifi_regs)) {
    case JD_WIFI_REG_ENABLED:
        if (preven != state->enabled) {
            if (state->enabled)
                wifi_scan(state);
            else
                wifi_disconnect(state);
        }
        break;
    }
}

bool jd_tcpsock_is_available(void) {
    return _wifi_state->is_connected;
}

SRV_DEF(wifi, JD_SERVICE_CLASS_WIFI);
void wifi_init(void) {
    SRV_ALLOC(wifi);

    state->ssid = jd_settings_get("wifi_ssid");
    state->password = jd_settings_get("wifi_psk");

    state->enabled = 1;

    _wifi_state = state;

    jd_wifi_init(state->mac);
    wifi_scan(state);
}
