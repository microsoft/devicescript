#ifndef __EMSCRIPTEN__

#include "jd_sdk.h"

#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <pthread.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <netdb.h>
#include <fcntl.h>

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
            if (!jd_frame_crc_ok(frame))
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
    if (!jd_frame_crc_ok(frame)) {
        LOG("bad send CRC");
    }
    // DMESG("S %x %x", frame->crc, frame->flags);
    memcpy(buf + 1, frame, len);
    pthread_mutex_lock(&ctx->talk_mutex);
    int r = forced_write(ctx->sockfd, buf, len + 1);
    CHK(r == len + 1);
    pthread_mutex_unlock(&ctx->talk_mutex);
    return 0;
}

int sock_connect(sock_t ctx, const char *port_num) {
    const char *hostname = is_docker() ? "host.docker.internal" : "localhost";

    CHK(ctx->sockfd == 0 && ctx->reading_thread == 0);

    struct addrinfo hints = {
        .ai_family = AF_UNSPEC,
        .ai_socktype = SOCK_STREAM,
    };
    struct addrinfo *result;

    int s = getaddrinfo(hostname, port_num, &hints, &result);
    if (s) {
        LOG("getaddrinfo %s:%s: %s", hostname, port_num, gai_strerror(s));
        return -1;
    }

    for (struct addrinfo *rp = result; rp != NULL; rp = rp->ai_next) {
        int sfd = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
        if (sfd == -1)
            continue;

        if (connect(sfd, rp->ai_addr, rp->ai_addrlen) != -1) {
            ctx->sockfd = sfd;
            break;
        }

        if (rp->ai_next == NULL)
            LOG("connect %s:%s: %s", hostname, port_num, strerror(errno));

        close(sfd);
    }

    freeaddrinfo(result);

    if (ctx->sockfd == 0)
        return -1;

    LOG("connected to %s:%s", hostname, port_num);

    pthread_mutex_init(&ctx->talk_mutex, NULL);
    CHK_ERR(pthread_create(&ctx->reading_thread, NULL, sock_read_loop, ctx));

    return 0;
}

void sock_free(sock_t ctx) {
    if (!ctx->sockfd)
        return;
    pthread_cancel(ctx->reading_thread);
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

#endif