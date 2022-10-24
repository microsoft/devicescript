#include "jd_network.h"

#define FL_OPEN 0x01
#define FL_ERROR 0x02
#define FL_GOT_101 0x04
#define FL_HEADERS_DONE 0x08

#define NONCE_SIZE (3 * 8)

#define MAX_MESSAGE 270

STATIC_ASSERT(NONCE_SIZE <= JD_AES_KEY_BYTES);

typedef struct {
    char *hostname;
    unsigned flags;
    uint16_t msgptr;
    uint8_t keybuf[JD_AES_KEY_BYTES];
    uint8_t msg[MAX_MESSAGE];
} jd_websock_t;
static jd_websock_t _websock;

int jd_conn_new(const char *hostname) {
    jd_websock_t *ws = &_websock;
    ws->flags = 0;
    ws->msgptr = 0;
    jd_free(ws->hostname);
    ws->hostname = jd_strdup(hostname);
    return jd_sock_new(hostname);
}

int jd_conn_send_message(const void *data, unsigned size) {}

static void raise_error(jd_websock_t *ws, const char *msg) {
    ws->flags |= FL_ERROR;
    memset(ws->keybuf, 0xff, sizeof(ws->keybuf));
    jd_conn_on_event(JD_CONN_EV_ERROR, msg, strlen(msg));
}

static const char *websock_start = //
    "GET /jacdac-ws0 HTTP/1.1\r\n" //
    "Host: %s\r\n"                 // host
    "Origin: http://%s\r\n"        // host
    "Sec-WebSocket-Key: %s==\r\n"  // key 22 chars
    "X-Jacdac-Nonce: %s\r\n"       // nonce
    "User-Agent: jacdac-c/%s"      // version
    "Pragma: no-cache\r\n"
    "Cache-Control: no-cache\r\n"
    "Upgrade: websocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Version: 13\r\n"
    "Sec-WebSocket-Protocol: jacdac-ws0\r\n"
    "\r\n";

static void start_conn(jd_websock_t *ws) {
    if (ws->flags & FL_OPEN)
        return; // ???

    ws->flags |= FL_OPEN;
    uint8_t *nonce = ws->keybuf;

    jd_crypto_get_random(nonce, 11);
    char *websock_key = jd_to_hex_a(nonce, 11);

    jd_crypto_get_random(nonce, NONCE_SIZE);
    char *nonce_key = jd_to_hex_a(nonce, NONCE_SIZE);

    char *msg = jd_sprintf_a(websock_start, ws->hostname, ws->hostname, websock_key, nonce,
                             app_get_fw_version());
    jd_free(websock_key);
    jd_free(nonce_key);

    if (jd_sock_write(msg, strlen(msg)) < 0) {
        raise_error("sock write error")
    }
}

static void on_data(jd_websock_t *ws, uint8_t *data, unsigned size) {
    for (;;) {
        int space = MAX_MESSAGE - ws->msgptr;
        if (space >= size)
            break; // OK to handle

        if (space <= 0) {
            raise_error(ws, "chunk overflow");
            return;
        }

        // otherwise, split
        on_data(ws, data, space);
        data += space;
        size -= space;
    }

    memcpy(ws->msg + ws->msgptr, data, size);
    ws->msgptr += size;
    JD_ASSERT(ws->msgptr <= MAX_MESSAGE);

    if (ws->flags & FL_GOT_101) {
        
    }
}

void jd_sock_on_event(unsigned event, void *data, unsigned size) {
    jd_websock_t *ws = &_websock;
    switch (event) {
    case JD_CONN_EV_OPEN:
        start_conn(ws);
        break;
    case JD_CONN_EV_MESSAGE:
        on_data(ws, data, size);
        break;
    case JD_CONN_EV_CLOSE:
    case JD_CONN_EV_ERROR:
        jd_conn_on_event(event, data, size);
        break;
    }
}
