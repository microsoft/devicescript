#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <pthread.h>
#include <assert.h>

#include "jd_sdk.h"
#include "jacscript/jacscript.h"

#define LOG(fmt, ...) printf("main: " fmt "\n", ##__VA_ARGS__)

typedef struct linked_frame {
    struct linked_frame *next;
    jd_frame_t frame;
} linked_frame_t;

static pthread_mutex_t frame_mut;
static linked_frame_t *rx_queue;
static void frame_cb_post(void);
static void frame_cb(void *userdata, jd_frame_t *frame) {
    linked_frame_t *lnk = jd_alloc(JD_FRAME_SIZE(frame) + sizeof(void *));
    memcpy(&lnk->frame, frame, JD_FRAME_SIZE(frame));
    lnk->next = NULL;
    pthread_mutex_lock(&frame_mut);
    if (rx_queue) {
        linked_frame_t *last = rx_queue;
        while (last->next)
            last = last->next;
        last->next = lnk;
    } else {
        rx_queue = lnk;
    }
    pthread_mutex_unlock(&frame_mut);
    frame_cb_post();
}

bool ends_with(const char *str, const char *suff) {
    if (!str)
        return false;
    int lstr = strlen(str);
    int lsuff = strlen(suff);
    if (lstr < lsuff)
        return false;
    return strcmp(str + lstr - lsuff, suff) == 0;
}

bool starts_with(const char *str, const char *pref) {
    if (!str)
        return false;
    return memcmp(str, pref, strlen(pref)) == 0;
}

void jd_rx_init() {
    pthread_mutex_init(&frame_mut, NULL);
}

void init_jacscript_manager(void);
void app_init_services() {
    jd_role_manager_init();
    init_jacscript_manager();
}

jd_frame_t *jd_rx_get_frame(void) {
    jd_frame_t *r = NULL;
    pthread_mutex_lock(&frame_mut);
    if (rx_queue) {
        r = &rx_queue->frame;
        rx_queue = rx_queue->next;
    }
    pthread_mutex_unlock(&frame_mut);
    return r;
}

void jd_rx_release_frame(jd_frame_t *frame) {
    jd_free((uint8_t *)frame - offsetof(linked_frame_t, frame));
}

void tx_init(const jd_transport_t *transport, jd_transport_ctx_t *ctx);

void app_client_event_handler(int event_id, void *arg0, void *arg1) {
    // jd_device_t *dev = arg0;
    // jd_device_service_t *serv = arg0;
    // jd_packet_t *pkt = arg1;
    // jd_register_query_t *reg = arg1;

    jacs_ctx_t *jacs_ctx = jacscriptmgr_get_ctx();
    jacs_client_event_handler(jacs_ctx, event_id, arg0, arg1);
}

int load_image(const char *name) {
    FILE *f = name ? fopen(name, "rb") : NULL;
    if (!f) {
        fprintf(stderr, "can't open image '%s'\n", name);
        return -1;
    }
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    if (size <= 0) {
        fprintf(stderr, "can't determine file size for` '%s'\n", name);
        return -2;
    }
    fseek(f, 0, SEEK_SET);
    uint8_t *img = jd_alloc(size);
    fread(img, size, 1, f);
    fclose(f);
    int r = jacs_verify(img, size);
    if (r) {
        fprintf(stderr, "verification error for '%s': %d\n", name, r);
        jd_free(img);
        return r;
    }

    if (jacscriptmgr_deploy(img, size)) {
        fprintf(stderr, "can't deploy '%s'\n", name);
        jd_free(img);
        return -3;
    }

    jd_free(img);
    return 0;
}

static void run_sample(const char *name) {
    if (load_image(name))
        return;

    for (;;) {
        jd_process_everything();
        if (!rx_queue)
            target_wait_us(10000);

        if (!jacscriptmgr_get_ctx())
            break;
    }

    jacscriptmgr_deploy(NULL, 0);
    jd_services_deinit();
}

static jd_transport_ctx_t *transport_ctx = NULL;

#ifdef __EMSCRIPTEN__
#include <emscripten/eventloop.h>
bool websock_is_connected(jd_transport_ctx_t *ctx);
static void em_process(void *dummy) {
    if (!websock_is_connected(transport_ctx))
        return;
    jd_process_everything();
    while (rx_queue)
        jd_process_everything();
}
static void frame_cb_post(void) {
    em_process(NULL);
}
void run_emscripten_loop(void) {
    emscripten_set_interval(em_process, 10, NULL);
    emscripten_unwind_to_js_event_loop();
}
#else
static void frame_cb_post(void) {}
#endif

int main(int argc, const char **argv) {
    const jd_transport_t *transport = NULL;
    const char *transport_arg = NULL;
    const char *jacs_img = NULL;

    for (int i = 1; i < argc; ++i) {
        const char *arg = argv[i];
        if (starts_with(arg, "/dev/")) {
            transport_arg = arg;
            transport = &hf2_transport;
        } else if (atoi(arg)) {
            transport_arg = arg;
            transport = &sock_transport;
        } else if (ends_with(arg, ".jacs")) {
            jacs_img = arg;
        } else {
            fprintf(stderr, "unknown arg: %s\n", arg);
            return 1;
        }
    }

    if (!transport && !jacs_img) {
        fprintf(stderr, "need transport and/or image\n");
        return 1;
    }

    if (transport) {
        transport_ctx = transport->alloc();
        transport->set_frame_callback(transport_ctx, frame_cb, NULL);
        if (transport->connect(transport_ctx, transport_arg) != 0)
            return 1;
    }

    tx_init(transport, transport_ctx);
    jd_rx_init();
    jd_services_init();

    char shortbuf[5];
    jd_device_short_id(shortbuf, jd_device_id());
    DMESG("self-device: %s", shortbuf);

    if (jacs_img) {
        run_sample(jacs_img);
    } else {
#ifdef __EMSCRIPTEN__
        run_emscripten_loop();
#else
        for (;;) {
            jd_process_everything();
            if (!rx_queue)
                target_wait_us(10000);
        }
#endif
    }

    return 0;
}
