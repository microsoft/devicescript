#include "jd_network.h"

#define ST_OPENING 0x00
#define ST_REQ_SENT 0x01
#define ST_GOT_101 0x02
#define ST_HEADERS_DONE 0x03
#define ST_CLOSED 0x04

#define MAX_SHORT_SIZE 125

#define ST_ERROR 0xff

#define NONCE_SIZE (3 * 8)

#define MAX_MESSAGE 270

#define FRAME_CONT 0x0
#define FRAME_TEXT 0x1
#define FRAME_BIN 0x2
#define FRAME_CTRL_CLOSE 0x8
#define FRAME_CTRL_PING 0x9
#define FRAME_CTRL_PONG 0xA

STATIC_ASSERT(NONCE_SIZE <= JD_AES_KEY_BYTES);

typedef struct {
    char *hostname;
    uint8_t state;
    uint16_t msgptr;
    uint16_t framestart;
    uint8_t keybuf[JD_AES_KEY_BYTES];
    uint8_t msg[MAX_MESSAGE + 1];
} jd_websock_t;
static jd_websock_t _websock;

int jd_conn_new(const char *hostname) {
    jd_websock_t *ws = &_websock;
    ws->msgptr = 0;
    ws->framestart = 0;
    jd_free(ws->hostname);
    ws->hostname = jd_strdup(hostname);
    return jd_sock_new(hostname);
}

static int send_message(jd_websock_t *ws, const void *data, unsigned size, int tp) {
    JD_ASSERT(size < 0xf000);
    int hdsize = 2 + 4;
    if (size > MAX_SHORT_SIZE)
        hdsize += 2;
    uint8_t *d = jd_alloc(hdsize + size);
    d[0] = (tp << 4) | 1;
    uint8_t *mp = d + 2;
    if (size > MAX_SHORT_SIZE) {
        d[1] = MAX_SHORT_SIZE + 1;
        d[2] = size >> 8;
        d[3] = size & 0xff;
        mp += 2;
    } else {
        d[1] = size;
    }
    d[1] = (d[1] << 1) | 1; // masking ON
    uint32_t rnd = jd_random();
    memcpy(mp, &rnd, sizeof(rnd));
    uint8_t *dp = mp + 4;
    for (unsigned i = 0; i < size; ++i) {
        dp[i] = ((const uint8_t *)data)[i] ^ mp[i & 3];
    }
    int r = jd_sock_write(d, hdsize + size);
    jd_free(d);
    return r;
}

int jd_conn_send_message(const void *data, unsigned size) {
    jd_websock_t *ws = &_websock;
    return send_message(ws, data, size, FRAME_BIN);
}

static void raise_error(jd_websock_t *ws, const char *msg) {
    if (ws->state == ST_ERROR)
        return; // double error?
    ws->state = ST_ERROR;
    memset(ws->keybuf, 0xff, sizeof(ws->keybuf));
    jd_conn_on_event(JD_CONN_EV_ERROR, msg, strlen(msg));
}

static const char *websock_start =             //
    "GET /jacdac-ws0 HTTP/1.1\r\n"             //
    "Host: %s\r\n"                             // host
    "Origin: http://%s\r\n"                    // host
    "Sec-WebSocket-Key: %s==\r\n"              // key 22 chars
    "Sec-WebSocket-Protocol: jacdac-ws-%s\r\n" // nonce
    "User-Agent: jacdac-c/%s"                  // version
    "Pragma: no-cache\r\n"
    "Cache-Control: no-cache\r\n"
    "Upgrade: websocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Version: 13\r\n"
    "\r\n";

static void start_conn(jd_websock_t *ws) {
    if (ws->state != ST_OPENING)
        return; // ???

    ws->state = ST_REQ_SENT;
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
        raise_error(ws, "sock write error");
    }
}

static void shift_msg(jd_websock_t *ws, unsigned n) {
    if (n == 0)
        return;
    JD_ASSERT(n <= ws->msgptr);
    ws->msgptr -= n;
    memmove(ws->msg, ws->msg + n, ws->msgptr);
}

static void on_data(jd_websock_t *ws, uint8_t *data, unsigned size) {
    for (;;) {
        if (ws->state == ST_ERROR)
            return;

        int space = MAX_MESSAGE - ws->msgptr;
        if (space >= (int)size)
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
    ws->msg[ws->msgptr] = 0; // needed by \r\n\r\n checking below and logging

    if (ws->state == ST_REQ_SENT) {
        if (ws->msgptr >= 12) {
            if (memcmp(ws->msg, "HTTP/1.1 101", 12) == 0) {
                ws->state = ST_GOT_101;
            } else {
                DMESG("bad resp: %s", ws->msg);
                raise_error(ws, "websock response");
            }
        }
    }

    if (ws->state == ST_GOT_101) {
        int lastLF = -1;
        for (unsigned i = 0; i < ws->msgptr; ++i) {
            if (ws->msg[i] == '\n') {
                lastLF = i;
                // note that ws->msg[] is '\0'-terminated, so no chance of overflow
                if (ws->msg[i + 1] == '\n') {
                    shift_msg(ws, i + 1);
                    ws->state = ST_HEADERS_DONE;
                    break;
                } else if (ws->msg[i + 1] == '\r' && ws->msg[i + 2] == '\n') {
                    shift_msg(ws, i + 2);
                    ws->state = ST_HEADERS_DONE;
                    break;
                }
            }
        }
        if (ws->state == ST_GOT_101) {
            if (lastLF == -1)
                ws->msgptr = 0; // just drop the whole thing
            else
                shift_msg(ws, lastLF);
        }
    }

    while (ws->state == ST_HEADERS_DONE) {
        int framebytes = ws->msgptr - ws->framestart;
        if (framebytes < 2)
            return; // not enough data yet

        uint8_t *frame = ws->msg + ws->framestart;
        int frametype = frame[0];
        int framelen = frame[1];
        if (framelen & 1)
            raise_error(ws, "masked server pkt");
        framelen >>= 1;
        int datastart = ws->framestart + 2;
        if (framelen == 127) {
            raise_error(ws, "packet 64k+");
            return;
        } else if (framelen == MAX_SHORT_SIZE + 1) {
            if (framebytes >= 4) {
                framelen = (frame[2] << 8) | frame[3];
                datastart += 2;
                if (framelen <= MAX_SHORT_SIZE) {
                    raise_error(ws, "non-minimal");
                    return;
                }
            } else {
                return;
            }
        }

        int endptr = datastart + framelen;
        if (ws->msgptr < endptr)
            return;

        int isfin = frametype & 1;
        frametype >>= 4;

        if (frametype >= FRAME_CTRL_CLOSE) {
            if (!isfin) {
                raise_error(ws, "non-fin ctrl");
                return;
            }
            if (framelen > MAX_SHORT_SIZE) {
                raise_error(ws, "too large ctrl");
                return;
            }
            if (frametype == FRAME_CTRL_CLOSE) {
                ws->state = ST_CLOSED;
                jd_conn_on_event(JD_CONN_EV_CLOSE, ws->msg + datastart, framelen);
            } else if (frametype == FRAME_CTRL_PING) {
                int r = send_message(ws, frame, framelen, FRAME_CTRL_PONG);
                if (r) {
                    raise_error(ws, "can't pong");
                    return;
                }
            } else if (frametype == FRAME_CTRL_PONG) {
                // do nothing
            } else {
                raise_error(ws, "unknown ctrl"); // maybe ignore?
                return;
            }

            int left = ws->msgptr - endptr;
            memmove(frame, ws->msg + endptr, left);
            ws->msgptr = ws->framestart + left;
        } else {
            if (ws->framestart > 0 && frametype != FRAME_CONT) {
                raise_error(ws, "expecting CONT");
                return;
            }
            if (ws->framestart == 0 && frametype != FRAME_BIN) {
                raise_error(ws, "expecting BIN");
                return;
            }
            // eat the header
            int hdsize = datastart - ws->framestart;
            ws->msgptr -= hdsize;
            memmove(frame, frame + hdsize, framebytes - hdsize);
            ws->framestart += framelen;

            if (isfin) {
                unsigned full_len = ws->framestart;
                jd_conn_on_event(JD_CONN_EV_MESSAGE, ws->msg, full_len);
                shift_msg(ws, full_len);
                ws->framestart = 0;
            }
        }
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

static const char *event_names[] = {
    [JD_CONN_EV_OPEN] = "open",
    [JD_CONN_EV_CLOSE] = "close",
    [JD_CONN_EV_ERROR] = "error",
    [JD_CONN_EV_MESSAGE] = "message",
};
const char *jd_conn_event_name(unsigned event) {
    if (event < sizeof(event_names) / sizeof(event_names[0]))
        return event_names[event];
    return "???";
}

__attribute__((weak)) void jd_conn_on_event(unsigned event, const void *data, unsigned size) {
    char *arg = NULL;
    if (data) {
        arg = jd_alloc(size + 1);
        memcpy(arg, data, size);
    }
    DMESG("CONN %s '%s'", jd_conn_event_name(event), arg ? arg : "");
    jd_free(arg);
}
