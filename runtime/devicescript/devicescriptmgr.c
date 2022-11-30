// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "services/jd_services.h"
#include "services/interfaces/jd_flash.h"
#include "jd_client.h"
#include "jacdac/dist/c/devicescriptmanager.h"
#include "devicescript/devicescript.h"

#define JACSMGR_ALIGN 32

#define JACSMGR_PROG_MAGIC0 0x8d8abd53
#define JACSMGR_PROG_MAGIC1 0xb27c4b2b

#define LOGV JD_NOLOG

#define SECONDS(n) (uint32_t)((n)*1024 * 1024)

typedef struct {
    uint32_t magic0;
    uint32_t size;

    uint32_t magic1;
    uint32_t hash;

    uint32_t reserved2[28];

    uint8_t image[0];
} devicescriptmgr_program_header_t;

#define LOG JD_LOG

struct srv_state {
    SRV_COMMON;
    uint8_t running;
    uint8_t autostart;
    uint8_t logging;

    uint32_t next_restart;

    const devicescriptmgr_cfg_t *cfg;
    devs_ctx_t *ctx;

    uint32_t write_offset;
    jd_ipipe_desc_t write_program_pipe;

    int32_t read_program_ptr;
    jd_opipe_desc_t read_program_pipe;
};
static srv_t *_state;

REG_DEFINITION(                                 //
    devicescriptmgr_regs,                          //
    REG_SRV_COMMON,                             //
    REG_U8(JD_DEVICE_SCRIPT_MANAGER_REG_RUNNING),   //
    REG_U8(JD_DEVICE_SCRIPT_MANAGER_REG_AUTOSTART), //
    REG_U8(JD_DEVICE_SCRIPT_MANAGER_REG_LOGGING),   //
)

__attribute__((aligned(sizeof(void *)))) static const uint8_t devs_empty_program[224] = {
    0x4a, 0x61, 0x63, 0x53, 0x0a, 0x7e, 0x6a, 0x9a, 0x02, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x70, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x90, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00,
    0xa8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xa8, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0xc0, 0x00, 0x00, 0x00, 0x1c, 0x00, 0x00, 0x00,
    0x90, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xa0, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00,
    0x4c, 0xf9, 0x00, 0x06, 0x90, 0x4b, 0x90, 0x5a, 0x01, 0x92, 0x4a, 0x00, 0x4c, 0xfc, 0x08, 0x00,
    0x04, 0xf9, 0x02, 0x09, 0x40, 0x4c, 0xfc, 0x05, 0xc0, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00,
    0xc5, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0xcb, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00,
    0x6d, 0x61, 0x69, 0x6e, 0x00, 0x63, 0x6c, 0x6f, 0x75, 0x64, 0x00, 0x5f, 0x61, 0x75, 0x74, 0x6f,
    0x52, 0x65, 0x66, 0x72, 0x65, 0x73, 0x68, 0x5f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

static const devicescriptmgr_program_header_t *devs_header(srv_t *state) {
    const devicescriptmgr_program_header_t *hd = state->cfg->program_base;
    if (hd->magic0 == JACSMGR_PROG_MAGIC0 && hd->magic1 == JACSMGR_PROG_MAGIC1)
        return hd;
    return NULL;
}

static uint32_t current_status(srv_t *state) {
    if (state->ctx)
        return JD_STATUS_CODES_READY;
    const devicescriptmgr_program_header_t *hd = devs_header(state);
    if (hd && hd->size != 0)
        return JD_STATUS_CODES_SLEEPING;
    return JD_STATUS_CODES_WAITING_FOR_INPUT;
}

static void send_status(srv_t *state) {
    uint32_t st = current_status(state);
    state->running = st == JD_STATUS_CODES_READY;
    jd_send_event_ext(state, JD_EV_STATUS_CODE_CHANGED, &st, sizeof(st));
}

static void run_img(srv_t *state, const void *img, unsigned size) {
    if (state->ctx)
        devs_free_ctx(state->ctx);
    devs_cfg_t cfg = {.mgr_service_idx = state->service_index};
    state->ctx = devs_create_ctx(img, size, &cfg);
    if (state->ctx)
        devs_set_logging(state->ctx, state->logging);
}

static void try_run(srv_t *state) {
    const devicescriptmgr_program_header_t *hd = devs_header(state);
    if (hd && hd->size != 0 && devs_verify(hd->image, hd->size) == 0) {
        run_img(state, hd->image, hd->size);
    } else {
        run_img(state, devs_empty_program, sizeof(devs_empty_program));
    }
    send_status(state);
}

static void stop_program(srv_t *state) {
    devs_free_ctx(state->ctx);
    state->ctx = NULL;
    send_status(state);
}

void devicescriptmgr_process(srv_t *state) {
    if (state->read_program_ptr >= 0) {
        const devicescriptmgr_program_header_t *hd = devs_header(state);
        int sz = hd ? hd->size : 0;
        if (state->read_program_ptr >= sz) {
            jd_opipe_close(&state->read_program_pipe);
            state->read_program_ptr = -1;
        } else {
            if (sz > JD_SERIAL_PAYLOAD_SIZE)
                sz = JD_SERIAL_PAYLOAD_SIZE;
            int r =
                jd_opipe_write(&state->read_program_pipe, hd->image + state->read_program_ptr, sz);
            if (r == JD_PIPE_OK) {
                state->read_program_ptr += sz;
            } else if (r == JD_PIPE_TRY_AGAIN) {
                // OK, will try again
            } else {
                state->read_program_ptr = -1;
                jd_opipe_close(&state->read_program_pipe);
            }
        }
    }

    if (jd_should_sample(&state->next_restart, SECONDS(8))) {
        if (state->autostart && !state->ctx) {
            try_run(state);
        }
    }

    if (!state->ctx)
        return;

    unsigned pc;
    unsigned code = devs_error_code(state->ctx, &pc);
    if (code) {
        jd_device_script_manager_program_panic_t args = {
            .panic_code = code == JACS_PANIC_REBOOT ? 0 : code,
            .program_counter = pc,
        };
        jd_send_event_ext(state, JD_DEVICE_SCRIPT_MANAGER_EV_PROGRAM_PANIC, &args, sizeof(args));
        stop_program(state);
        state->next_restart = now + SECONDS(code == JACS_PANIC_REBOOT ? 1 : 5);
    }
}

int devicescriptmgr_deploy_start(uint32_t sz) {
    srv_t *state = _state;

    devicescriptmgr_program_header_t hd;

    DMESG("deploy %d b", (int)sz);

    if (sz >= state->cfg->max_program_size - sizeof(hd) || (sz & (JACSMGR_ALIGN - 1)))
        return -1;

    stop_program(state);

    flash_erase(state->cfg->program_base);

    if (sz == 0)
        return 0;

    hd.magic0 = JACSMGR_PROG_MAGIC0;
    hd.size = sz;
    flash_program(state->cfg->program_base, &hd, 8);

    state->write_offset = sizeof(hd);

    send_status(state); // this will send JD_STATUS_CODES_WAITING_FOR_INPUT

    return 0;
}

int devicescriptmgr_deploy_write(const void *buf, unsigned size) {
    srv_t *state = _state;

    if (state->write_offset == 0)
        return -1;

    if (buf == NULL) {
        // pipe closed
        devicescriptmgr_program_header_t *hdf = state->cfg->program_base;
        devicescriptmgr_program_header_t hd = {
            .magic1 = JACSMGR_PROG_MAGIC1,
            .hash = jd_hash_fnv1a(hdf->image, hdf->size),
        };
        unsigned endp = hdf->size + sizeof(hd);
        if (state->write_offset != endp) {
            DMESG("missing %d bytes (of %d)", (int)(endp - state->write_offset), (int)hdf->size);
            return -1;
        } else {
            flash_program(&hdf->magic1, &hd.magic1, sizeof(hd) - 8);
            flash_sync();
            DMESG("program written");
            stop_program(state);
            jd_send_event(state, JD_EV_CHANGE);
            state->next_restart = now; // make it more responsive
            return 0;
        }
    }

    uint8_t *dst = state->cfg->program_base;
    uint32_t endp =
        ((devicescriptmgr_program_header_t *)dst)->size + sizeof(devicescriptmgr_program_header_t);
    if (size & (JACSMGR_ALIGN - 1) || state->write_offset + size > endp ||
        size >= JD_FLASH_PAGE_SIZE) {
        DMESG("invalid pkt size: %d (off=%d endp=%d)", size, (int)state->write_offset, (int)endp);
        state->write_offset = 0;
        return -1;
    }

    if (state->write_offset / JD_FLASH_PAGE_SIZE !=
        (state->write_offset + size) / JD_FLASH_PAGE_SIZE) {
        unsigned page_off = (state->write_offset + size) & ~(JD_FLASH_PAGE_SIZE - 1);
        LOGV("erase %p %u", dst + page_off, page_off);
        flash_erase(dst + page_off);
    }

    dst += state->write_offset;

    LOGV("wr %p (%u) sz=%d", dst, (unsigned)state->write_offset, size);
    flash_program(dst, buf, size);
    state->write_offset += size;

    return 0;
}

static void deploy_handler(jd_ipipe_desc_t *istr, jd_packet_t *pkt) {
    srv_t *state = (srv_t *)((uint8_t *)istr - offsetof(srv_t, write_program_pipe));
    JD_ASSERT(state == _state);
    if (devicescriptmgr_deploy_write(pkt->data, pkt->service_size)) {
        jd_ipipe_close(istr);
    }
}

static void deploy_meta_handler(jd_ipipe_desc_t *istr, jd_packet_t *pkt) {
    srv_t *state = (srv_t *)((uint8_t *)istr - offsetof(srv_t, write_program_pipe));
    JD_ASSERT(state == _state);
    if (pkt == NULL) {
        // pipe closed
        devicescriptmgr_deploy_write(NULL, 0);
    }
}

static void deploy_bytecode(srv_t *state, jd_packet_t *pkt) {
    uint32_t sz = *(uint32_t *)pkt->data;

    if (devicescriptmgr_deploy_start(sz))
        return; // just ignore it

    int port = jd_ipipe_open(&state->write_program_pipe, deploy_handler, deploy_meta_handler);
    jd_respond_u16(pkt, port);
}

int devicescriptmgr_get_hash(uint8_t hash[JD_SHA256_HASH_BYTES]) {
    srv_t *state = _state;
    const devicescriptmgr_program_header_t *hd = devs_header(state);
    if (hd) {
        jd_sha256_setup();
        jd_sha256_update(hd->image, hd->size);
        jd_sha256_finish(hash);
        return 0;
    } else {
        memset(hash, 0, JD_SHA256_HASH_BYTES);
        return -1;
    }
}

static void hash_program(srv_t *state, jd_packet_t *pkt) {
    uint8_t hash[JD_SHA256_HASH_BYTES];
    devicescriptmgr_get_hash(hash);
    jd_send(pkt->service_index, pkt->service_command, hash, JD_SHA256_HASH_BYTES);
}

void devicescriptmgr_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_DEVICE_SCRIPT_MANAGER_CMD_DEPLOY_BYTECODE:
        deploy_bytecode(state, pkt);
        break;

    case JD_DEVICE_SCRIPT_MANAGER_CMD_READ_BYTECODE:
        if (jd_opipe_open_cmd(&state->read_program_pipe, pkt) == 0)
            state->read_program_ptr = 0;
        break;

    case JD_GET(JD_DEVICE_SCRIPT_MANAGER_REG_PROGRAM_SIZE):
        jd_respond_u32(pkt, devs_header(state) ? devs_header(state)->size : 0);
        break;

    case JD_GET(JD_DEVICE_SCRIPT_MANAGER_REG_PROGRAM_HASH):
        jd_respond_u32(pkt, devs_header(state) ? devs_header(state)->hash : 0);
        break;

    case JD_GET(JD_DEVICE_SCRIPT_MANAGER_REG_PROGRAM_SHA256):
        hash_program(state, pkt);
        break;

    case JD_GET(JD_REG_STATUS_CODE):
        jd_respond_u32(pkt, current_status(state));
        break;

    default:
        switch (service_handle_register_final(state, pkt, devicescriptmgr_regs)) {
        case JD_DEVICE_SCRIPT_MANAGER_REG_RUNNING:
            if (state->running && !state->ctx) {
                state->running = 0; // not running yet
                try_run(state);
            } else if (!state->running && state->ctx) {
                stop_program(state);
            }
            break;
        case JD_DEVICE_SCRIPT_MANAGER_REG_AUTOSTART:
            if (state->autostart) {
                state->next_restart = now; // make it more responsive
            }
            break;
        case JD_DEVICE_SCRIPT_MANAGER_REG_LOGGING:
            if (state->ctx)
                devs_set_logging(state->ctx, state->logging);
            break;
        }
        break;
    }
}

SRV_DEF(devicescriptmgr, JD_SERVICE_CLASS_DEVICE_SCRIPT_MANAGER);

devs_ctx_t *devicescriptmgr_get_ctx(void) {
    return _state ? _state->ctx : NULL;
}

int devicescriptmgr_deploy(const void *img, unsigned imgsize) {
    srv_t *state = _state;

    if (devicescriptmgr_deploy_start(imgsize))
        return -1;

    if (imgsize == 0)
        return -2;

    for (unsigned sz, soff = 0; soff < imgsize; soff += sz) {
        sz = imgsize - soff;
        if (sz > 128)
            sz = 128;
        if (devicescriptmgr_deploy_write((const uint8_t *)img + soff, sz))
            return -3;
    }

    if (devicescriptmgr_deploy_write(NULL, 0))
        return -4;

    const devicescriptmgr_program_header_t *hdx = devs_header(state);
    if (hdx == NULL)
        return -5; // ???
    return devs_verify(hdx->image, hdx->size);
}

static void devicescriptmgr_client_ev(void *state0, int event_id, void *arg0, void *arg1) {
    srv_t *state = state0;
    if (state->ctx)
        devs_client_event_handler(state->ctx, event_id, arg0, arg1);
}

void devicescriptmgr_init(const devicescriptmgr_cfg_t *cfg) {
    SRV_ALLOC(devicescriptmgr);
    state->cfg = cfg;
    state->read_program_ptr = -1;
    state->autostart = 1;
    state->logging = 1;
    // first start 1.5s after brain boot up - allow devices to enumerate
    state->next_restart = now + SECONDS(1.5);

    JD_ASSERT(devs_verify(devs_empty_program, sizeof(devs_empty_program)) == 0);

    jd_client_subscribe(devicescriptmgr_client_ev, state);
    _state = state;
}