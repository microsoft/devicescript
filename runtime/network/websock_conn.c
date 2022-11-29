#include "jd_network.h"

#if JD_WEBSOCK_IMPL

#define LOG(fmt, ...) DMESG("WS: " fmt, ##__VA_ARGS__)
#define LOGV(...) ((void)0)
//#define LOGV LOG

#define ST_OPENING 0x00
#define ST_REQ_SENT 0x01
#define ST_GOT_101 0x02
#define ST_HEADERS_DONE 0x03
#define ST_CLOSED 0x04

#define MAX_SHORT_SIZE 125

#define ST_ERROR 0xff

#define MAX_MESSAGE 270

#define FRAME_CONT 0x0
#define FRAME_TEXT 0x1
#define FRAME_BIN 0x2
#define FRAME_CTRL_CLOSE 0x8
#define FRAME_CTRL_PING 0x9
#define FRAME_CTRL_PONG 0xA

#define FRAME_FIN 0x80
#define LEN_MASK 0x80

typedef struct {
    uint8_t state;
    uint16_t msgptr;
    uint16_t framestart;
    __attribute__((aligned(sizeof(void *)))) uint8_t msg[MAX_MESSAGE + 1];
} jd_websock_t;
static jd_websock_t _websock;

int jd_websock_new(const char *hostname, int port, const char *path, const char *proto) {
    jd_websock_t *ws = &_websock;
    ws->msgptr = 0;
    ws->framestart = 0;

    // save hostname and proto for later
    // we use msg[] buffer, since it won't be used until the socket is open
    unsigned hn_sz = strlen(hostname);
    unsigned pr_sz = strlen(proto);
    unsigned pt_sz = strlen(path);
    if (hn_sz + pr_sz + pt_sz + 5 > MAX_MESSAGE)
        JD_PANIC();

    memcpy(ws->msg, hostname, hn_sz);
    ws->msg[hn_sz] = 0;
    memcpy(ws->msg + hn_sz + 1, proto, pr_sz);
    ws->msg[hn_sz + 1 + pr_sz] = 0;
    memcpy(ws->msg + hn_sz + 1 + pr_sz + 1, path, pt_sz);
    ws->msg[hn_sz + 1 + pr_sz + 1 + pt_sz] = 0;

    return jd_tcpsock_new(hostname, port);
}

static int send_message(jd_websock_t *ws, const void *data, unsigned size, int tp) {
    JD_ASSERT(size < 0xf000);
    int hdsize = 2 + 4;
    if (size > MAX_SHORT_SIZE)
        hdsize += 2;
    uint8_t *d = jd_alloc(hdsize + size);
    d[0] = tp | FRAME_FIN;
    uint8_t *mp = d + 2;
    if (size > MAX_SHORT_SIZE) {
        d[1] = MAX_SHORT_SIZE + 1;
        d[2] = size >> 8;
        d[3] = size & 0xff;
        mp += 2;
    } else {
        d[1] = size;
    }
    d[1] |= LEN_MASK;
    uint32_t rnd = jd_random(); // see comment on WebSocket-Key
    memcpy(mp, &rnd, sizeof(rnd));
    uint8_t *dp = mp + 4;
    for (unsigned i = 0; i < size; ++i) {
        dp[i] = ((const uint8_t *)data)[i] ^ mp[i & 3];
    }
    int r = jd_tcpsock_write(d, hdsize + size);
    jd_free(d);
    return r;
}

int jd_websock_send_message(const void *data, unsigned size) {
    jd_websock_t *ws = &_websock;
    return send_message(ws, data, size, FRAME_BIN);
}

static void raise_error(jd_websock_t *ws, const char *msg) {
    if (ws->state == ST_ERROR)
        return; // double error?
    LOG("error: %s", msg);
    ws->state = ST_ERROR;
    jd_websock_on_event(JD_CONN_EV_ERROR, msg, strlen(msg));
    jd_tcpsock_close();
}

static const char *websock_start =   //
    "GET %s HTTP/1.1\r\n"            // path
    "Host: %s\r\n"                   // host
    "Origin: http://%s\r\n"          // host
    "Sec-WebSocket-Key: %s==\r\n"    // key 22 chars
    "Sec-WebSocket-Protocol: %s\r\n" // proto
    "User-Agent: jacdac-c/%s"        // version
    "Pragma: no-cache\r\n"
    "Cache-Control: no-cache\r\n"
    "Upgrade: websocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Version: 13\r\n"
    "\r\n";

static void start_conn(jd_websock_t *ws) {
    ws->state = ST_REQ_SENT;

    // We don't really care about this one.
    // By RFC6455 it should be base64 encoded and we should check
    // Sec-WebSocket-Accept but it only really matters for web browsers
    // trying to protect against untrusted websites.
    // Same for masking key in send_message().
    uint8_t wskey[11];
    jd_crypto_get_random(wskey, sizeof(wskey));
    char *websock_key = jd_to_hex_a(wskey, sizeof(wskey));

    const char *host = (char *)ws->msg;
    const char *proto = host + strlen(host) + 1;
    const char *path = proto + strlen(proto) + 1;

    char *msg =
        jd_sprintf_a(websock_start, path, host, host, websock_key, proto, app_get_fw_version());
    jd_free(websock_key);

    if (jd_tcpsock_write(msg, strlen(msg)) < 0) {
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

static void on_data(jd_websock_t *ws, const uint8_t *data, unsigned size) {
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
                LOG("got 101");
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
                    shift_msg(ws, i + 2);
                    ws->state = ST_HEADERS_DONE;
                    break;
                } else if (ws->msg[i + 1] == '\r' && ws->msg[i + 2] == '\n') {
                    shift_msg(ws, i + 3);
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
        } else if (ws->state == ST_HEADERS_DONE) {
            LOG("headers done; %d", ws->msgptr);
            jd_websock_on_event(JD_CONN_EV_OPEN, NULL, 0);
        }
    }

    while (ws->state == ST_HEADERS_DONE) {
        int framebytes = ws->msgptr - ws->framestart;
        if (framebytes < 2)
            return; // not enough data yet

        uint8_t *frame = ws->msg + ws->framestart;
        int frametype = frame[0];
        int framelen = frame[1];
        if (framelen & LEN_MASK) {
            raise_error(ws, "masked server pkt");
            return;
        }
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

        int isfin = (frametype & FRAME_FIN) != 0;
        frametype &= 0x7f;

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
                LOG("close frame");
                jd_websock_on_event(JD_CONN_EV_CLOSE, ws->msg + datastart, framelen);
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
                jd_websock_on_event(JD_CONN_EV_MESSAGE, ws->msg, full_len);
                shift_msg(ws, full_len);
                ws->framestart = 0;
            }
        }
    }
}

void jd_tcpsock_on_event(unsigned event, const void *data, unsigned size) {
    jd_websock_t *ws = &_websock;
    switch (event) {
    case JD_CONN_EV_OPEN:
        start_conn(ws);
        break;
    case JD_CONN_EV_MESSAGE:
        // DMESG("msg '%-s'", jd_json_escape(data, size));
        on_data(ws, data, size);
        break;
    case JD_CONN_EV_CLOSE:
        jd_websock_on_event(event, data, size);
        break;
    case JD_CONN_EV_ERROR:
        ws->state = ST_ERROR;
        jd_tcpsock_close();
        jd_websock_on_event(event, data, size);
        break;
    }
}

void jd_websock_close(void) {
    jd_websock_t *ws = &_websock;
    if (ws->state != ST_ERROR && ws->state != ST_CLOSED) {
        ws->state = ST_CLOSED;
        jd_tcpsock_close();
        jd_websock_on_event(JD_CONN_EV_CLOSE, NULL, 0);
    }
}

#endif

static const char *event_names[] = {
    [JD_CONN_EV_OPEN] = "open",
    [JD_CONN_EV_CLOSE] = "close",
    [JD_CONN_EV_ERROR] = "error",
    [JD_CONN_EV_MESSAGE] = "message",
};
const char *jd_websock_event_name(unsigned event) {
    if (event < sizeof(event_names) / sizeof(event_names[0]))
        return event_names[event];
    return "???";
}
