#include "jd_sdk.h"

#if defined(__EMSCRIPTEN__) && JD_EM_WEBSOCKET

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <emscripten/emscripten.h>
#include <emscripten/websocket.h>

#define LOG_TAG "WSn"
#define VLOGGING 0
#include "devs_logging.h"

#define CHK(cond)                                                                                  \
    if (!(cond)) {                                                                                 \
        DMESG("fail: %s", #cond);                                                                  \
        abort();                                                                                   \
    }

#define CHK_ERR(call)                                                                              \
    if (0 != (call)) {                                                                             \
        DMESG("call failed: %s", #call);                                                           \
        abort();                                                                                   \
    }

struct jd_transport_ctx {
    int sockfd;
    volatile int isopen;
};
typedef struct jd_transport_ctx *websock_t;

static websock_t ws_ctx;

int jd_websock_send_message(const void *data, unsigned size) {
    LOGV("send %u b", size);
    websock_t ctx = ws_ctx;
    if (!ctx)
        return -1;
    return emscripten_websocket_send_binary(ctx->sockfd, (void *)data, size);
}

#define CHECK_CURRENT()                                                                            \
    if (userdata != ws_ctx)                                                                        \
    return EM_TRUE

static int onopen(int ev_type, const EmscriptenWebSocketOpenEvent *ev, void *userdata) {
    CHECK_CURRENT();
    LOG("connected");
    websock_t ctx = userdata;
    ctx->isopen = true;
    jd_websock_on_event(JD_CONN_EV_OPEN, NULL, 0);
    return EM_TRUE;
}
static int onerror(int ev_type, const EmscriptenWebSocketErrorEvent *ev, void *userdata) {
    CHECK_CURRENT();
    LOG("error!");
    jd_websock_on_event(JD_CONN_EV_ERROR, NULL, 0);
    return EM_TRUE;
}
static int onclose(int ev_type, const EmscriptenWebSocketCloseEvent *ev, void *userdata) {
    CHECK_CURRENT();
    LOG("close");
    websock_t ctx = userdata;
    ctx->isopen = false;
    jd_websock_on_event(JD_CONN_EV_CLOSE, NULL, 0);
    return EM_TRUE;
}
static int onmessage(int ev_type, const EmscriptenWebSocketMessageEvent *ev, void *userdata) {
    CHECK_CURRENT();
    websock_t ctx = userdata;
    if (ev->isText) {
        LOG("text message?! '%s'", ev->data);
    } else {
        jd_websock_on_event(JD_CONN_EV_MESSAGE, ev->data, ev->numBytes);
    }
    return true;
}

int jd_websock_new(const char *hostname, int port, const char *path, const char *protokey) {
    if (!emscripten_websocket_is_supported()) {
        LOG("websockets not supported");
        return -1;
    }

    jd_websock_close();

    websock_t ctx = jd_alloc(sizeof(*ctx));
    ws_ctx = ctx;

    CHK(ctx->sockfd == 0);

    char *hostbuf;
    if (strcmp(hostname, "localhost") == 0 || strcmp(hostname, "127.0.0.1") == 0) {
        hostbuf = jd_sprintf_a("ws://%s:%d%s", hostname, port, path);
    } else {
        // drop port, since we did ws: -> wss:
        hostbuf = jd_sprintf_a("wss://%s%s", hostname, path);
    }

    EmscriptenWebSocketCreateAttributes ws_attrs = {
        .url = hostbuf,
        .protocols = protokey,
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
    jd_free(hostbuf);

    return 0;
}

void jd_websock_close(void) {
    websock_t ctx = ws_ctx;

    if (!ctx || !ctx->sockfd)
        return;

    if (ctx->isopen)
        emscripten_websocket_close(ctx->sockfd, 1000, NULL);
    // emscripten_websocket_delete(ctx->sockfd); - memleak
    ctx->sockfd = 0;
    ctx->isopen = false;
    // jd_free(ctx); - memleak...

    ws_ctx = NULL;
}

#endif