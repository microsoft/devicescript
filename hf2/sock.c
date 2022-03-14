#include "jd_sdk.h"

#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <pthread.h>
#include <stdlib.h>
#include <errno.h>

#define HOST_IP "127.0.0.1"

#define LOG(fmt, ...) printf("SOCK: " fmt "\n", ##__VA_ARGS__)
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
    pthread_t reading_thread;
    void *frame_cb_data;
    void (*frame_cb)(void *userdata, jd_frame_t *frame);
    pthread_mutex_t talk_mutex;
};
typedef struct jd_transport_ctx *sock_t;

static int forced_read(int fd, void *buf, size_t nbytes) {
    int numread = 0;
    while ((int)nbytes > numread) {
        int r = read(fd, (uint8_t *)buf + numread, nbytes - numread);
        if (r <= 0)
            return r;
        numread += r;
        if ((int)nbytes > numread)
            LOGV("short read: %d", r);
    }
    return numread;
}

static int forced_write(int fd, void *buf, size_t nbytes) {
    int numread = 0;
    while ((int)nbytes > numread) {
        int r = write(fd, (uint8_t *)buf + numread, nbytes - numread);
        if (r <= 0)
            return r;
        numread += r;
        if ((int)nbytes > numread)
            LOGV("short write: %d", r);
    }
    return numread;
}

static void *sock_read_loop(void *ctx_) {
    sock_t ctx = ctx_;
    uint8_t buf[256];
    for (;;) {
        int r = read(ctx->sockfd, buf, 1);
        if (r != 1) {
            LOG("read loop stopped");
            break;
        }
        int len = buf[0];
        r = forced_read(ctx->sockfd, buf, len);
        if (r != len) {
            LOG("read loop dropped");
            break;
        }

        int pktlen = buf[2] + 12;
        if (pktlen <= len) {
            jd_frame_t *frame = (jd_frame_t *)buf;
            if (jd_crc16((uint8_t *)frame + 2, JD_FRAME_SIZE(frame) - 2) != frame->crc)
                LOG("invalid CRC");
            LOGV("JDPKT %d", frame->size);
            if (ctx->frame_cb)
                ctx->frame_cb(ctx->frame_cb_data, frame);
            if (len - pktlen > 3)
                LOG("too long JDPKT: %d vs %d", pktlen, len);
        } else {
            LOG("too short JDPKT: %d > %d", pktlen, len);
        }
    }
    return NULL;
}

sock_t sock_alloc(void) {
    return (sock_t)jd_alloc(sizeof(struct jd_transport_ctx));
}

void sock_set_frame_callback(sock_t ctx, void (*cb)(void *userdata, jd_frame_t *frame),
                             void *userdata) {
    ctx->frame_cb_data = userdata;
    ctx->frame_cb = cb;
}

int sock_send_frame(sock_t ctx, jd_frame_t *frame) {
    int len = JD_FRAME_SIZE(frame);
    LOGV("send %db", len);
    uint8_t buf[257];
    buf[0] = len;
    memcpy(buf + 1, frame, len);
    pthread_mutex_lock(&ctx->talk_mutex);
    int r = forced_write(ctx->sockfd, buf, len + 1);
    CHK(r == len + 1);
    pthread_mutex_unlock(&ctx->talk_mutex);
    return 0;
}

int sock_connect(sock_t ctx, const char *port_num) {
    struct sockaddr_in server;

    CHK(ctx->sockfd == 0 && ctx->reading_thread == 0);
    ctx->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    CHK(ctx->sockfd != -1);

    int port = atoi(port_num);

    server.sin_addr.s_addr = inet_addr(HOST_IP);
    server.sin_family = AF_INET;
    server.sin_port = htons(port);

    if (connect(ctx->sockfd, (struct sockaddr *)&server, sizeof(server)) < 0) {
        LOG("can't connect to %s:%d: %s", HOST_IP, port, strerror(errno));
        return -1;
    }

    LOG("connected to %s:%d", HOST_IP, port);

    pthread_mutex_init(&ctx->talk_mutex, NULL);
    CHK_ERR(pthread_create(&ctx->reading_thread, NULL, sock_read_loop, ctx));

    return 0;
}

void sock_free(sock_t ctx) {
    if (!ctx->sockfd)
        return;
    pthread_kill(ctx->reading_thread, 0);
    close(ctx->sockfd);
    ctx->sockfd = 0;
}

const jd_transport_t sock_transport = {
    .alloc = sock_alloc,
    .set_frame_callback = sock_set_frame_callback,
    .connect = sock_connect,
    .send_frame = sock_send_frame,
    .free = sock_free,
};