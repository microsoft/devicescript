#include "jd_sdk.h"

#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <pthread.h>
#include <assert.h>

#include "uf2hid.h"

#define LOG(fmt, ...) DMESG("HF2: " fmt, ##__VA_ARGS__)
#define LOGV(...) ((void)0)

#define CHK(cond)                                                                                  \
    if (!(cond))                                                                                   \
    abort()
#define CHK_ERR(call)                                                                              \
    if (0 != (call))                                                                               \
    abort()

#define HF2_FRAGMENT_SIZE 64
#define HF2_MAX_PKT 300
#define HF2_STATUS_EVENT 0x80

struct jd_transport_ctx {
    int serialfd;
    uint32_t num_resp;
    uint16_t cmd_seq;
    pthread_t reading_thread;
    void *frame_cb_data;
    void (*frame_cb)(void *userdata, jd_frame_t *frame);
    pthread_mutex_t talk_outer_mutex;
    pthread_mutex_t talk_mutex;
    pthread_cond_t talk_awaiter;
    union {
        uint8_t frame[HF2_MAX_PKT];
        HF2_Response response;
    };
    union {
        uint8_t talk_frame[HF2_MAX_PKT];
        HF2_Response talk_response;
    };
};

typedef struct jd_transport_ctx *hf2_t;

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

static void *hf2_read_loop(void *ctx_) {
    hf2_t ctx = ctx_;
    uint8_t buf[HF2_FRAGMENT_SIZE + 1];
    int frameptr = 0;
    for (;;) {
        int r = forced_read(ctx->serialfd, buf, HF2_FRAGMENT_SIZE);
        if (r <= 0) {
            LOG("read loop stopped");
            break;
        }
        if (r != HF2_FRAGMENT_SIZE) {
            LOG("read sz: %d", r);
            abort();
        }
        int tp = buf[0] & HF2_FLAG_MASK;
        int len = buf[0] & HF2_SIZE_MASK;
        if (tp & HF2_FLAG_SERIAL_OUT) {
            // TODO probably want to concat stuff
            buf[len + 1] = 0; // NUL-terminate
            LOG("serial-%s: %s", tp == HF2_FLAG_SERIAL_ERR ? "err" : "out", buf + 1);
            continue;
        }
        if (frameptr >= 0) {
            if (frameptr + len <= HF2_MAX_PKT) {
                memcpy(ctx->frame + frameptr, buf + 1, len);
                frameptr += len;
            } else {
                LOG("pkt overflow");
                frameptr = -1;
            }
        }
        if (tp == HF2_FLAG_CMDPKT_BODY)
            continue;
        assert(tp == HF2_FLAG_CMDPKT_LAST);
        if (frameptr < 4) {
            frameptr = 0;
            continue;
        }
        if (ctx->response.eventId == HF2_EV_JDS_PACKET) {
            int pktlen = ctx->response.data8[2] + 12;
            if (4 + pktlen <= frameptr) {
                jd_frame_t *frame = (jd_frame_t *)ctx->response.data8;
                if (!jd_frame_crc_ok(frame))
                    LOG("invalid CRC");
                LOGV("JDPKT %d", frame->size);
                if (ctx->frame_cb)
                    ctx->frame_cb(ctx->frame_cb_data, frame);
            } else {
                LOG("too short JDPKT");
            }
        } else if (ctx->response.status & HF2_STATUS_EVENT) {
            LOG("unhandled event 0x%x", ctx->response.eventId);
        } else {
            pthread_mutex_lock(&ctx->talk_mutex);
            ctx->num_resp++;
            memcpy(ctx->talk_frame, ctx->frame, frameptr);
            pthread_cond_signal(&ctx->talk_awaiter);
            pthread_mutex_unlock(&ctx->talk_mutex);
        }
        frameptr = 0;
    }
    return NULL;
}

hf2_t hf2_alloc(void) {
    return (hf2_t)jd_alloc(sizeof(struct jd_transport_ctx));
}

void hf2_set_frame_callback(hf2_t ctx, void (*cb)(void *userdata, jd_frame_t *frame),
                            void *userdata) {
    ctx->frame_cb_data = userdata;
    ctx->frame_cb = cb;
}

static void hf2_send(hf2_t ctx, const void *data, size_t size) {
    uint8_t buf[HF2_FRAGMENT_SIZE] = {0};
    const uint8_t *ptr = data;
    for (;;) {
        int s;
        if (size <= HF2_FRAGMENT_SIZE - 1) {
            s = size;
            buf[0] = HF2_FLAG_CMDPKT_LAST | size;
        } else {
            s = HF2_FRAGMENT_SIZE - 1;
            buf[0] = HF2_FLAG_CMDPKT_BODY | (HF2_FRAGMENT_SIZE - 1);
        }
        memcpy(buf + 1, ptr, s);
        int sz = write(ctx->serialfd, buf, HF2_FRAGMENT_SIZE);
        if (sz != HF2_FRAGMENT_SIZE) {
            LOG("write error");
            abort();
        }
        ptr += s;
        size -= s;
        if (!size)
            break;
    }
}

static int hf2_talk(hf2_t ctx, uint32_t cmd, const void *data, size_t datalen) {
    pthread_mutex_lock(&ctx->talk_outer_mutex);
    size_t sz = 8 + datalen;
    int ret;

    HF2_Command *req = alloca(sz);
    req->command_id = cmd;
    req->tag = ++ctx->cmd_seq;
    req->reserved0 = 0;
    req->reserved1 = 0;
    if (datalen)
        memcpy(req->data8, data, datalen);
    ctx->talk_response.tag = ~req->tag;
    hf2_send(ctx, req, sz);

    pthread_mutex_lock(&ctx->talk_mutex);
    if (ctx->talk_response.tag != req->tag) {
        uint32_t limit = ctx->num_resp + 3;
        while (ctx->num_resp < limit) {
            struct timespec t;
            clock_gettime(CLOCK_REALTIME, &t);
            t.tv_sec += 1;
            int r = pthread_cond_timedwait(&ctx->talk_awaiter, &ctx->talk_mutex, &t);
            if (r != 0) {
                LOG("timeout, %s", strerror(r));
                break;
            }
            if (ctx->talk_response.tag == req->tag)
                break;
            LOG("message out of sync; %d - %d", ctx->talk_response.tag, req->tag);
        }
    }
    if (ctx->talk_response.tag == req->tag) {
        switch (ctx->talk_response.status) {
        case HF2_STATUS_OK:
            ret = 0;
            break;
        default:
            LOG("HF2 status: %d (%d) for %x", ctx->talk_response.status,
                ctx->talk_response.status_info, cmd);
            ret = -ctx->talk_response.status;
            break;
        }
    } else {
        ret = -100;
        LOG("no response for %x", cmd);
    }
    pthread_mutex_unlock(&ctx->talk_mutex);
    pthread_mutex_unlock(&ctx->talk_outer_mutex);

    return ret;
}

int hf2_send_frame(hf2_t ctx, jd_frame_t *frame) {
    LOGV("send %db", JD_FRAME_SIZE(frame));
    return hf2_talk(ctx, HF2_CMD_JDS_SEND, frame, JD_FRAME_SIZE(frame));
}

int hf2_connect(hf2_t ctx, const char *address) {
    CHK(ctx->cmd_seq == 0);

    ctx->cmd_seq = 0xd00d;
    ctx->serialfd = open(address, O_RDWR);
    if (ctx->serialfd < 0) {
        LOG("can't open serial '%s'; %s", address, strerror(errno));
        return -1;
    }
    pthread_mutex_init(&ctx->talk_outer_mutex, NULL);
    pthread_mutex_init(&ctx->talk_mutex, NULL);
    pthread_cond_init(&ctx->talk_awaiter, NULL);

    CHK_ERR(pthread_create(&ctx->reading_thread, NULL, hf2_read_loop, ctx));

    int r = hf2_talk(ctx, HF2_CMD_INFO, NULL, 0);
    if (r == 0) {
        LOG("connected to: '%s'", ctx->talk_response.data8);
        r = hf2_talk(ctx, HF2_CMD_JDS_CONFIG, "\x01", 1);
        LOG("JDS config -> %d", r);
    }
    return r;
}

void hf2_free(hf2_t ctx) {
    if (!ctx->serialfd)
        return;
    pthread_cancel(ctx->reading_thread);
    close(ctx->serialfd);
    ctx->serialfd = 0;
}

const jd_transport_t hf2_transport = {
    .alloc = hf2_alloc,
    .set_frame_callback = hf2_set_frame_callback,
    .connect = hf2_connect,
    .send_frame = hf2_send_frame,
    .free = hf2_free,
};