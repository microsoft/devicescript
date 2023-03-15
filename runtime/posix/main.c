#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <pthread.h>
#include <assert.h>

#include "jd_sdk.h"
#include "devicescript.h"
#include "storage/jd_storage.h"
#include "services/interfaces/jd_flash.h"

#define LOG_TAG "main"
#include "devs_logging.h"

extern uint64_t cached_devid;

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

void app_init_services() {
    flash_init();

    jd_role_manager_init();
    devsmgr_init(NULL);
    devsdbg_init();
    wsskhealth_init();
    devscloud_init(&wssk_cloud);
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

#ifndef __EMSCRIPTEN__
void devs_deploy_handler(int exitcode) {
    flush_dmesg();
    exit(0);
}
#endif

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
            LOG("closed deploy pipe");
            deploy.isopen = false;
            deploy.finished = true;
            devs_deploy_handler(0);
        }
    }
}

#ifndef __EMSCRIPTEN__
void devs_panic_handler(int exitcode) {
    if (test_mode && exitcode) {
        flush_dmesg();
        fprintf(stderr, "test failed\n");
        exit(10);
    }
}
#endif

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
        if (deploy.img && serv && deploy.serv == serv) {
            if (jd_is_report(pkt) &&
                pkt->service_command == JD_DEVICE_SCRIPT_MANAGER_CMD_DEPLOY_BYTECODE) {
                LOG("opening deploy pipe");
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
            deploy.serv = jd_device_lookup_service(dev, JD_SERVICE_CLASS_DEVICE_SCRIPT_MANAGER);
            if (deploy.serv) {
                char id[5];
                jd_device_short_id(id, dev->device_identifier);
                LOG("asking for deploy: %s", id);
                jd_service_send_cmd(deploy.serv, JD_DEVICE_SCRIPT_MANAGER_CMD_DEPLOY_BYTECODE,
                                    &deploy.size, 4);
            }
        }
        break;
    }
}

int devs_client_deploy(const void *img, unsigned imgsize) {
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
    int r = devs_verify(img, size);
    if (r) {
        fprintf(stderr, "verification error for '%s': %d\n", name, r);
        jd_free(img);
        return r;
    }

    if (remote_deploy) {
        devs_client_deploy(img, size);
        // don't free - it is lazy
        return 0;
    }

    if (devsmgr_deploy(img, size)) {
        fprintf(stderr, "can't deploy '%s'\n", name);
        jd_free(img);
        return -3;
    }

    jd_free(img);
    return 0;
}

#ifndef __EMSCRIPTEN__
void app_print_dmesg(const char *ptr) {
    printf("    %s\n", ptr);
    fflush(stdout);
}
#endif

void flush_dmesg(void) {
    static uint32_t dmesg_ptr;
    static char linebuf[JD_DMESG_LINE_BUFFER + 20];
    while (jd_dmesg_read_line(linebuf, sizeof(linebuf), &dmesg_ptr) != 0)
        app_print_dmesg(linebuf);
}

void app_dmesg(const char *format, ...) {
    va_list arg;
    va_start(arg, format);
    jd_vdmesg(format, arg);
    va_end(arg);
    flush_dmesg();
}

void jd_tcpsock_process(void);
void app_process(void) {
    tx_process();
    jd_tcpsock_process();

    flush_dmesg();

#if 0
    static uint32_t uptime_cnt;
    if (jd_should_sample_ms(&uptime_cnt, 5000))
        tsagg_update("uptime", (double)now_ms_long / 1000);
#endif
}

static void client_process(void) {
    jd_process_everything();
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
                flush_dmesg();
                exit(9);
            }
        }
        client_process();
        target_wait_us(10000);

        if (!keepgoing && iter > 15 && !devsmgr_get_ctx() && the_end == 0x1000000000) {
            // if the script ended, we shall exit soon, but not exactly now
            the_end = iter + 15;
        }
    }

    LOG("terminating program");

    devsmgr_deploy(NULL, 0);
    jd_lstore_force_flush();
    jd_services_deinit();
}

static jd_transport_ctx_t *transport_ctx = NULL;
extern int settings_in_files;

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
    const char *devs_img = NULL;

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
    int test_settings = 0;

    for (int i = 1; i < argc; ++i) {
        const char *arg = argv[i];
        if (starts_with(arg, "/dev/")) {
            transport_arg = arg;
            transport = &hf2_transport;
            remote_deploy = 1;
        } else if (atoi(arg)) {
            transport_arg = arg;
            transport = &sock_transport;
        } else if (ends_with(arg, ".devs")) {
            devs_img = arg;
        } else if (strcmp(arg, "-l") == 0) {
            enable_lstore = 1;
        } else if (strcmp(arg, "-X") == 0) {
            devs_set_global_flags(DEVS_FLAG_GC_STRESS);
        } else if (strcmp(arg, "-w") == 0) {
            websock = 1;
        } else if (strcmp(arg, "-n") == 0) {
            settings_in_files = 0;
        } else if (strcmp(arg, "-T") == 0) {
            test_settings = 1;
        } else if (strncmp(arg, "-d:", 3) == 0) {
            cached_devid = jd_device_id_from_string(arg + 3);
        } else {
            fprintf(stderr, "unknown arg: %s\n", arg);
            return 1;
        }
    }

    if (test_settings) {
        flash_init();
        jd_settings_test();
        return 0;
    }

    if (!transport && !devs_img && !websock) {
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
        LOG("self-device: %-s %s", jd_device_short_id_a(jd_device_id()), hexbuf);
    }

    if (devs_img && remote_deploy) {
        load_image(devs_img);
        devs_img = NULL;
    }

    jd_client_subscribe(client_event_handler, NULL);

    if (devs_img) {
        run_sample(devs_img, websock);
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
