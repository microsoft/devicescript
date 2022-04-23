// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "services/jd_services.h"
#include "services/interfaces/jd_flash.h"
#include "jd_client.h"
#include "jacdac/dist/c/jacscriptmanager.h"
#include "jacscript/jacscript.h"

#define JACSMGR_ALIGN 32

#define JACSMGR_PROG_MAGIC0 0x8d8abd53
#define JACSMGR_PROG_MAGIC1 0xb27c4b2b

#define LOGV JD_NOLOG

typedef struct {
    uint32_t magic0;
    uint32_t size;

    uint32_t magic1;
    uint32_t hash;

    uint32_t reserved2[28];

    uint8_t image[0];
} jacscriptmgr_program_header_t;

#define LOG JD_LOG

struct srv_state {
    SRV_COMMON;
    uint8_t running;
    uint8_t autostart;
    uint8_t logging;

    uint32_t next_restart;

    const jacscriptmgr_cfg_t *cfg;
    jacs_ctx_t *ctx;

    uint32_t write_offset;
    jd_ipipe_desc_t write_program_pipe;

    int32_t read_program_ptr;
    jd_opipe_desc_t read_program_pipe;
};
static srv_t *_state;

REG_DEFINITION(                                 //
    jacscriptmgr_regs,                          //
    REG_SRV_COMMON,                             //
    REG_U8(JD_JACSCRIPT_MANAGER_REG_RUNNING),   //
    REG_U8(JD_JACSCRIPT_MANAGER_REG_AUTOSTART), //
    REG_U8(JD_JACSCRIPT_MANAGER_REG_LOGGING),   //
)

static const jacscriptmgr_program_header_t *jacs_header(srv_t *state) {
    const jacscriptmgr_program_header_t *hd = state->cfg->program_base;
    if (hd->magic0 == JACSMGR_PROG_MAGIC0 && hd->magic1 == JACSMGR_PROG_MAGIC1)
        return hd;
    return NULL;
}

static uint32_t current_status(srv_t *state) {
    if (state->ctx)
        return JD_STATUS_CODES_READY;
    const jacscriptmgr_program_header_t *hd = jacs_header(state);
    if (hd && hd->size != 0)
        return JD_STATUS_CODES_SLEEPING;
    return JD_STATUS_CODES_WAITING_FOR_INPUT;
}

static void send_status(srv_t *state) {
    uint32_t st = current_status(state);
    state->running = st == JD_STATUS_CODES_READY;
    jd_send_event_ext(state, JD_EV_STATUS_CODE_CHANGED, &st, sizeof(st));
}

static void try_run(srv_t *state) {
    const jacscriptmgr_program_header_t *hd = jacs_header(state);
    if (hd && hd->size != 0 && jacs_verify(hd->image, hd->size) == 0) {
        if (state->ctx)
            jacs_free_ctx(state->ctx);
        jacs_cfg_t cfg = {.mgr_service_idx = state->service_index};
        state->ctx = jacs_create_ctx(hd->image, hd->size, &cfg);
        if (state->ctx)
            jacs_set_logging(state->ctx, state->logging);
    }
    send_status(state);
}

static void stop_program(srv_t *state) {
    jacs_free_ctx(state->ctx);
    state->ctx = NULL;
    send_status(state);
}

void jacscriptmgr_process(srv_t *state) {
    if (state->read_program_ptr >= 0) {
        const jacscriptmgr_program_header_t *hd = jacs_header(state);
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

    if (jd_should_sample(&state->next_restart, 8 * 1024 * 1024)) {
        if (state->autostart && !state->ctx) {
            try_run(state);
        }
    }

    if (!state->ctx)
        return;

    unsigned pc;
    unsigned code = jacs_error_code(state->ctx, &pc);
    if (code) {
        jd_jacscript_manager_program_panic_t args = {
            .panic_code = code == JACS_PANIC_REBOOT ? 0 : code,
            .program_counter = pc,
        };
        jd_send_event_ext(state, JD_JACSCRIPT_MANAGER_EV_PROGRAM_PANIC, &args, sizeof(args));
        stop_program(state);
        int delay = code == JACS_PANIC_REBOOT ? 1 : 5;
        state->next_restart = now + delay * 1024 * 1024;
    }
}

static void deploy_handler(jd_ipipe_desc_t *istr, jd_packet_t *pkt) {
    srv_t *state = (srv_t *)((uint8_t *)istr - offsetof(srv_t, write_program_pipe));
    JD_ASSERT(state == _state);
    if (state->write_offset == 0)
        return; // shouldn't happen

    uint8_t *dst = state->cfg->program_base;
    uint32_t endp =
        ((jacscriptmgr_program_header_t *)dst)->size + sizeof(jacscriptmgr_program_header_t);
    if (pkt->service_size & (JACSMGR_ALIGN - 1) || state->write_offset + pkt->service_size > endp) {
        DMESG("invalid pkt size: %d (off=%d endp=%d)", pkt->service_size, (int)state->write_offset,
              (int)endp);
        state->write_offset = 0;
        jd_ipipe_close(istr);
        return;
    }

    dst += state->write_offset;
    if ((state->write_offset & (JD_FLASH_PAGE_SIZE - 1)) == 0) {
        LOGV("erase %p", dst);
        flash_erase(dst);
    }

    LOGV("wr %p sz=%d", dst, pkt->service_size);
    flash_program(dst, pkt->data, pkt->service_size);
    state->write_offset += pkt->service_size;
}

static void flashing_done(srv_t *state) {
    send_status(state);
    jd_send_event(state, JD_EV_CHANGE);
    state->next_restart = now; // make it more responsive
}

static void deploy_meta_handler(jd_ipipe_desc_t *istr, jd_packet_t *pkt) {
    srv_t *state = (srv_t *)((uint8_t *)istr - offsetof(srv_t, write_program_pipe));
    JD_ASSERT(state == _state);
    if (pkt == NULL) {
        // pipe closed
        jacscriptmgr_program_header_t *hdf = state->cfg->program_base;
        jacscriptmgr_program_header_t hd = {
            .magic1 = JACSMGR_PROG_MAGIC1,
            .hash = jd_hash_fnv1a(hdf->image, hdf->size),
        };
        unsigned endp = hdf->size + sizeof(hd);
        if (state->write_offset != endp) {
            DMESG("missing %d bytes (of %d)", (int)(endp - state->write_offset), endp);
        } else {
            flash_program(&hdf->magic1, &hd.magic1, sizeof(hd) - 8);
            DMESG("program written");
            flashing_done(state);
        }
    }
}

static void deploy_bytecode(srv_t *state, jd_packet_t *pkt) {
    uint32_t sz = *(uint32_t *)pkt->data;

    jacscriptmgr_program_header_t hd;

    DMESG("deploy %d b", (int)sz);

    if (sz > state->cfg->max_program_size - sizeof(hd) || (sz & (JACSMGR_ALIGN - 1)))
        return; // just ignore it

    stop_program(state);

    flash_erase(state->cfg->program_base);

    hd.magic0 = JACSMGR_PROG_MAGIC0;
    hd.size = sz;
    flash_program(state->cfg->program_base, &hd, 8);

    state->write_offset = sizeof(hd);
    int port = jd_ipipe_open(&state->write_program_pipe, deploy_handler, deploy_meta_handler);
    jd_respond_u16(pkt, port);

    send_status(state); // this will send JD_STATUS_CODES_WAITING_FOR_INPUT
}

void jacscriptmgr_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_JACSCRIPT_MANAGER_CMD_DEPLOY_BYTECODE:
        deploy_bytecode(state, pkt);
        break;

    case JD_JACSCRIPT_MANAGER_CMD_READ_BYTECODE:
        if (jd_opipe_open_cmd(&state->read_program_pipe, pkt) == 0)
            state->read_program_ptr = 0;
        break;

    case JD_GET(JD_JACSCRIPT_MANAGER_REG_PROGRAM_SIZE):
        jd_respond_u32(pkt, jacs_header(state) ? jacs_header(state)->size : 0);
        break;

    case JD_GET(JD_JACSCRIPT_MANAGER_REG_PROGRAM_HASH):
        jd_respond_u32(pkt, jacs_header(state) ? jacs_header(state)->hash : 0);
        break;

    case JD_GET(JD_REG_STATUS_CODE):
        jd_respond_u32(pkt, current_status(state));
        break;

    default:
        switch (service_handle_register_final(state, pkt, jacscriptmgr_regs)) {
        case JD_JACSCRIPT_MANAGER_REG_RUNNING:
            if (state->running && !state->ctx) {
                state->running = 0; // not running yet
                try_run(state);
            } else if (!state->running && state->ctx) {
                stop_program(state);
            }
            break;
        case JD_JACSCRIPT_MANAGER_REG_AUTOSTART:
            if (state->autostart) {
                state->next_restart = now; // make it more responsive
            }
            break;
        case JD_JACSCRIPT_MANAGER_REG_LOGGING:
            if (state->ctx)
                jacs_set_logging(state->ctx, state->logging);
            break;
        }
        break;
    }
}

SRV_DEF(jacscriptmgr, JD_SERVICE_CLASS_JACSCRIPT_MANAGER);

#if 0
void app_client_event_handler(int event_id, void *arg0, void *arg1) {
    jacs_client_event_handler(jacscriptmgr_get_ctx(), event_id, arg0, arg1);

    // ...
}
#endif

jacs_ctx_t *jacscriptmgr_get_ctx(void) {
    return _state ? _state->ctx : NULL;
}

int jacscriptmgr_deploy(const void *img, unsigned imgsize) {
    srv_t *state = _state;
    jacscriptmgr_program_header_t hd = {
        .magic0 = JACSMGR_PROG_MAGIC0,
        .size = imgsize,
        .magic1 = JACSMGR_PROG_MAGIC1,
        .hash = jd_hash_fnv1a(img, imgsize),
    };

    if (imgsize > state->cfg->max_program_size - sizeof(hd) || (imgsize & (JACSMGR_ALIGN - 1)))
        return -1;

    stop_program(state);

    uint8_t *dst = state->cfg->program_base;
    flash_erase(dst);

    if (imgsize == 0)
        return -2;

    flash_program(dst, &hd, 8);

    unsigned doff = sizeof(hd);
    unsigned soff = 0;

    while (soff < imgsize) {
        unsigned sz = imgsize - soff;
        unsigned pageoff = doff & (JD_FLASH_PAGE_SIZE - 1);
        unsigned maxsz = JD_FLASH_PAGE_SIZE - pageoff;
        if (sz > maxsz)
            sz = maxsz;
        if (pageoff == 0)
            flash_erase(dst + doff);
        flash_program(dst + doff, (const uint8_t *)img + soff, sz);
        doff += sz;
        soff += sz;
    }

    jacscriptmgr_program_header_t *hdf = state->cfg->program_base;
    flash_program(&hdf->magic1, &hd.magic1, sizeof(hd) - 8);

    flashing_done(state);

    const jacscriptmgr_program_header_t *hdx = jacs_header(state);
    if (!hdx || hdx->size == 0)
        return -3;

    return jacs_verify(hdx->image, hdx->size);
}

void jacscriptmgr_init(const jacscriptmgr_cfg_t *cfg) {
    SRV_ALLOC(jacscriptmgr);
    state->cfg = cfg;
    state->read_program_ptr = -1;
    state->autostart = 1;
    state->logging = 1;
    state->next_restart = now;
    _state = state;
}