#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <pthread.h>
#include <assert.h>

#include "jd_sdk.h"
#include "jacscript/jacscript.h"
#include "storage/jd_storage.h"

#define LOG(fmt, ...) DMESG("main: " fmt, ##__VA_ARGS__)

static bool test_mode;
static bool remote_deploy;

static void frame_cb_post(void);
static void frame_cb(void *userdata, jd_frame_t *frame) {
    jd_rx_frame_received(frame);
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

void init_jacscript_manager(void);
void app_init_services() {
    jd_role_manager_init();
    init_jacscript_manager();

    wsskhealth_init();
    jacscloud_init(&wssk_cloud);
    tsagg_init(&wssk_cloud);
}

struct {
    const void *img;
    uint32_t size;
    uint32_t offset;
    uint8_t isopen;
    uint8_t finished;
    jd_device_service_t *serv;
    jd_opipe_desc_t pipe;
} deploy;

static void process_deploy(void) {
    if (!deploy.isopen)
        return;

    int to_write = deploy.size - deploy.offset;
    if (to_write > 224)
        to_write = 224;
    int r = to_write == 0
                ? jd_opipe_close(&deploy.pipe)
                : jd_opipe_write(&deploy.pipe, (uint8_t *)deploy.img + deploy.offset, to_write);
    if (r == 0) {
        deploy.offset += to_write;
        if (to_write == 0) {
            DMESG("closed deploy pipe");
            deploy.isopen = false;
            deploy.finished = true;
            exit(0); // TODO?
        }
    }
}

static void client_event_handler(void *dummy, int event_id, void *arg0, void *arg1) {
    jd_device_t *dev = arg0;
    // jd_register_query_t *reg = arg1;
    // jd_role_t *role = arg1;
    // jd_register_query_t *reg = arg1;
    jd_device_service_t *serv = arg0;
    jd_packet_t *pkt = arg1;

    switch (event_id) {
    case JD_CLIENT_EV_PROCESS:
        process_deploy();
        break;

    case JD_CLIENT_EV_SERVICE_PACKET:
        if (test_mode && serv->service_class == JD_SERVICE_CLASS_JACSCRIPT_MANAGER &&
            jd_event_code(pkt) == JD_JACSCRIPT_MANAGER_EV_PROGRAM_PANIC) {
            jd_jacscript_manager_program_panic_t *ev = (void *)pkt->data;
            if (ev->panic_code) {
                fprintf(stderr, "test failed\n");
                exit(10);
            }
        }
        if (deploy.img && serv && deploy.serv == serv) {
            if (jd_is_report(pkt) &&
                pkt->service_command == JD_JACSCRIPT_MANAGER_CMD_DEPLOY_BYTECODE) {
                DMESG("opening deploy pipe");
                if (jd_opipe_open_report(&deploy.pipe, pkt) == 0)
                    deploy.isopen = true;
            }
            // we process deploy on every incoming packet - this include ACKs, so should be as fast
            // as possible
            process_deploy();
        }
        break;

    case JD_CLIENT_EV_DEVICE_DESTROYED:
        if (deploy.serv && jd_service_parent(deploy.serv) == dev) {
            fprintf(stderr, "deploy device lost\n");
            deploy.serv = NULL;
        }
        break;

    case JD_CLIENT_EV_DEVICE_CREATED:
        if (deploy.img && !deploy.serv && dev->device_identifier != jd_device_id()) {
            deploy.serv = jd_device_lookup_service(dev, JD_SERVICE_CLASS_JACSCRIPT_MANAGER);
            if (deploy.serv) {
                char id[5];
                jd_device_short_id(id, dev->device_identifier);
                DMESG("asking for deploy: %s", id);
                jd_service_send_cmd(deploy.serv, JD_JACSCRIPT_MANAGER_CMD_DEPLOY_BYTECODE,
                                    &deploy.size, 4);
            }
        }
        break;
    }
}

int jacs_client_deploy(const void *img, unsigned imgsize) {
    deploy.img = img;
    deploy.size = imgsize;
#ifdef __EMSCRIPTEN__
    jd_client_subscribe(client_event_handler, NULL);
#endif
    return 0;
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
    uint8_t *img = jd_alloc(size + 1);
    fread(img, size, 1, f);
    fclose(f);
    if (memcmp("4a6163530a", img, 10) == 0)
        size = jd_from_hex(img, (const char *)img);
    int r = jacs_verify(img, size);
    if (r) {
        fprintf(stderr, "verification error for '%s': %d\n", name, r);
        jd_free(img);
        return r;
    }

    if (remote_deploy) {
        jacs_client_deploy(img, size);
        // don't free - it is lazy
        return 0;
    }

    if (jacscriptmgr_deploy(img, size)) {
        fprintf(stderr, "can't deploy '%s'\n", name);
        jd_free(img);
        return -3;
    }

    jd_free(img);
    return 0;
}

void jd_tcpsock_process(void);

static void client_process(void) {
    jd_process_everything();
    tx_process();
    jd_lstore_process();
    jd_tcpsock_process();
}

static void run_sample(const char *name, int keepgoing) {
    test_mode = true;

    jd_packet_t ask_ann;
    jd_pkt_setup_broadcast(&ask_ann, 0, 0);
    jd_send_pkt(&ask_ann); // ask everyone for announce

    uint64_t the_end = 0x1000000000;

    for (uint64_t iter = 0; iter < the_end; iter++) {
        if (iter == 10) { // give it some time to get announce etc
            if (load_image(name)) {
                exit(9);
            }
        }
        client_process();
        target_wait_us(10000);

        if (!keepgoing && iter > 15 && !jacscriptmgr_get_ctx() && the_end == 0x1000000000) {
            // if the script ended, we shall exit soon, but not exactly now
            the_end = iter + 15;
        }
    }

    jacscriptmgr_deploy(NULL, 0);
    jd_lstore_force_flush();
    jd_services_deinit();
}

static jd_transport_ctx_t *transport_ctx = NULL;

#ifdef __EMSCRIPTEN__
#include <emscripten/eventloop.h>
bool websock_is_connected(jd_transport_ctx_t *ctx);
static void em_process(void *dummy) {
    if (!websock_is_connected(transport_ctx))
        return;
    client_process();
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

#ifndef __EMSCRIPTEN__

int main(int argc, const char **argv) {
    const jd_transport_t *transport = NULL;
    const char *transport_arg = NULL;
    const char *jacs_img = NULL;

#if 0
    uint64_t devid;
    jd_from_hex(&devid, "1989f4ee00000000");
    for (;;) {
        devid += 0x71000000000;
        char s[30];
        jd_device_short_id(s, devid);
        if (strcmp(s, "WS42") == 0) {
            jd_to_hex(s, &devid, sizeof(devid));
            printf("%s 0x%llx\n", s, devid);
            return 0;
        }
    }
#endif
    int enable_lstore = 0;
    int websock = 0;

    for (int i = 1; i < argc; ++i) {
        const char *arg = argv[i];
        if (starts_with(arg, "/dev/")) {
            transport_arg = arg;
            transport = &hf2_transport;
            remote_deploy = 1;
        } else if (atoi(arg)) {
            transport_arg = arg;
            transport = &sock_transport;
        } else if (ends_with(arg, ".jacs")) {
            jacs_img = arg;
        } else if (strcmp(arg, "-l") == 0) {
            enable_lstore = 1;
        } else if (strcmp(arg, "-X") == 0) {
            jacs_set_global_flags(JACS_FLAG_GC_STRESS);
        } else if (strcmp(arg, "-w") == 0) {
            websock = 1;
        } else {
            fprintf(stderr, "unknown arg: %s\n", arg);
            return 1;
        }
    }

    if (!transport && !jacs_img && !websock) {
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
    if (enable_lstore)
        jd_lstore_init();
    jd_services_init();

    {
        uint64_t devid = jd_device_id();
        char hexbuf[17];
        jd_to_hex(hexbuf, &devid, 8);
        DMESG("self-device: %-s %s", jd_device_short_id_a(jd_device_id()), hexbuf);
    }

    if (jacs_img && remote_deploy) {
        load_image(jacs_img);
        jacs_img = NULL;
    }

    jd_client_subscribe(client_event_handler, NULL);

    if (jacs_img) {
        run_sample(jacs_img, websock);
    } else {
#ifdef __EMSCRIPTEN__
        run_emscripten_loop();
#else
        for (;;) {
            client_process();
            target_wait_us(10000);
        }
#endif
    }

    return 0;
}

#endif
