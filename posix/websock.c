#ifdef __EMSCRIPTEN__

#include "jd_sdk.h"

#include <stdio.h>
#include <string.h>
#include <pthread.h>
#include <stdlib.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <emscripten/emscripten.h>
#include <emscripten/websocket.h>

#define LOG(fmt, ...) DMESG("WS: " fmt, ##__VA_ARGS__)
#define LOGV(...) ((void)0)
//#define LOGV LOG

#define CHK(cond)                                                                                  \
    if (!(cond))                                                                                   \
    abort()
#define CHK_ERR(call)                                                                              \
    if (0 != (call))                                                                               \
    abort()

struct jd_transport_ctx {
    int sockfd;
    volatile int isopen;
    pthread_t reading_thread;
    void *frame_cb_data;
    void (*frame_cb)(void *userdata, jd_frame_t *frame);
    pthread_mutex_t talk_mutex;
};
typedef struct jd_transport_ctx *websock_t;

int is_docker(void) {
    static int cached;
    if (cached == 0) {
        int fd = open("/.dockerenv", O_RDONLY);
        if (fd < 0)
            cached = 1;
        else
            cached = 2;
        close(fd);
    }
    return cached - 1;
}

websock_t websock_alloc(void) {
    return (websock_t)jd_alloc(sizeof(struct jd_transport_ctx));
}

void websock_set_frame_callback(websock_t ctx, void (*cb)(void *userdata, jd_frame_t *frame),
                                void *userdata) {
    ctx->frame_cb_data = userdata;
    ctx->frame_cb = cb;
}

int websock_send_frame(websock_t ctx, jd_frame_t *frame) {
    int len = JD_FRAME_SIZE(frame);
    LOGV("send %db", len);
    pthread_mutex_lock(&ctx->talk_mutex);
    int r = emscripten_websocket_send_binary(ctx->sockfd, frame, len);
    CHK(r == 0);
    pthread_mutex_unlock(&ctx->talk_mutex);
    return 0;
}

static int onopen(int ev_type, const EmscriptenWebSocketOpenEvent *ev, void *userdata) {
    LOG("connected");
    websock_t ctx = userdata;
    ctx->isopen = true;
    return EM_TRUE;
}
static int onerror(int ev_type, const EmscriptenWebSocketErrorEvent *ev, void *userdata) {
    LOG("error!");
    exit(1);
    return EM_TRUE;
}
static int onclose(int ev_type, const EmscriptenWebSocketCloseEvent *ev, void *userdata) {
    LOG("close");
    exit(1);
    return EM_TRUE;
}
static int onmessage(int ev_type, const EmscriptenWebSocketMessageEvent *ev, void *userdata) {
    websock_t ctx = userdata;
    if (ev->isText) {
        LOG("text message?! '%s'", ev->data);
    } else if (ev->numBytes < 16) {
        LOG("short frame: %d bytes", ev->numBytes);
    } else {
        jd_frame_t *frame = (jd_frame_t *)ev->data;
        if (JD_FRAME_SIZE(frame) > ev->numBytes || JD_FRAME_SIZE(frame) + 3 < ev->numBytes)
            LOG("frame size mismatch exp: %d got: %d", JD_FRAME_SIZE(frame), ev->numBytes);
        if (!jd_frame_crc_ok(frame))
            LOG("invalid CRC");
        LOGV("JDPKT %d", frame->size);
        if (ctx->frame_cb)
            ctx->frame_cb(ctx->frame_cb_data, frame);
    }
    return true;
}

static void *sock_read_loop(void *ctx_) {
    emscripten_unwind_to_js_event_loop();
}

int websock_connect(websock_t ctx, const char *port_num) {
    if (!emscripten_websocket_is_supported()) {
        LOG("websockets not supported");
        return -1;
    }

    const char *hostname = is_docker() ? "host.docker.internal" : "localhost";

    CHK(ctx->sockfd == 0 && ctx->reading_thread == 0);

    char hostbuf[100];
    snprintf(hostbuf, sizeof hostbuf, "ws://%s:%s", hostname, port_num);

    EmscriptenWebSocketCreateAttributes ws_attrs = {
        .url = hostbuf,
        .protocols = NULL,
        .createOnMainThread = true,
    };

    EMSCRIPTEN_WEBSOCKET_T ws = emscripten_websocket_new(&ws_attrs);
    CHK(ws > 0);

    emscripten_websocket_set_onopen_callback(ws, ctx, onopen);
    emscripten_websocket_set_onerror_callback(ws, ctx, onerror);
    emscripten_websocket_set_onclose_callback(ws, ctx, onclose);
    emscripten_websocket_set_onmessage_callback(ws, ctx, onmessage);
    ctx->sockfd = ws;

    LOG("connecting to %s", hostbuf);

    pthread_mutex_init(&ctx->talk_mutex, NULL);

    return 0;
}

void websock_free(websock_t ctx) {
    if (!ctx->sockfd)
        return;

    emscripten_websocket_close(ctx->sockfd, 0, "");
    ctx->sockfd = 0;
}

bool websock_is_connected(websock_t ctx) {
    return ctx->isopen;
}


const jd_transport_t sock_transport = {
    .alloc = websock_alloc,
    .set_frame_callback = websock_set_frame_callback,
    .connect = websock_connect,
    .send_frame = websock_send_frame,
    .free = websock_free,
};

#endif