#include "devs_internal.h"

#include "storage/jd_storage.h"

STATIC_ASSERT(sizeof(devs_img_section_t) == JACS_SECTION_HEADER_SIZE);
STATIC_ASSERT(sizeof(devs_img_header_t) ==
              JACS_FIX_HEADER_SIZE + JACS_SECTION_HEADER_SIZE * JACS_NUM_IMG_SECTIONS);
STATIC_ASSERT(sizeof(devs_function_desc_t) == JACS_FUNCTION_HEADER_SIZE);
STATIC_ASSERT(sizeof(devs_role_desc_t) == JACS_ROLE_HEADER_SIZE);

static void setup_ctx(devs_ctx_t *ctx, const uint8_t *img) {
    ctx->img.data = img;

    ctx->gc = devs_gc_create();

    ctx->globals = devs_try_alloc(ctx, sizeof(value_t) * ctx->img.header->num_globals);
    ctx->roles = devs_try_alloc(ctx, sizeof(jd_role_t *) * devs_img_num_roles(&ctx->img));

    if (ctx->error_code)
        return;

    devs_fiber_sync_now(ctx);
    devs_jd_reset_packet(ctx);

    devs_jd_init_roles(ctx);

    if (ctx->error_code)
        return;

    devs_gc_set_ctx(ctx->gc, ctx);

    devs_fiber_start(ctx, 0, NULL, 0, JACS_OPCALL_BG);
}

devs_ctx_t *devs_create_ctx(const uint8_t *img, uint32_t size, const devs_cfg_t *cfg) {
    if (devs_verify(img, size))
        return NULL;
    devs_ctx_t *ctx = jd_alloc(sizeof(*ctx));
    ctx->cfg = *cfg;

    if (!jd_lstore_is_enabled()) {
        ctx->flags |= JACS_CTX_TRACE_DISABLED;
    } else {
        devs_trace_ev_init_t ev = {.image_hash = jd_hash_fnv1a(img, size)};
        devs_trace(ctx, JACS_TRACE_EV_INIT, &ev, sizeof(ev));
    }

    setup_ctx(ctx, img);

    return ctx;
}

static void devs_enter(devs_ctx_t *ctx) {
    JD_ASSERT((ctx->flags & JACS_CTX_FLAG_BUSY) == 0);
    ctx->flags |= JACS_CTX_FLAG_BUSY;
}

static void devs_leave(devs_ctx_t *ctx) {
    JD_ASSERT((ctx->flags & JACS_CTX_FLAG_BUSY) != 0);
    ctx->flags &= ~JACS_CTX_FLAG_BUSY;
}

unsigned devs_error_code(devs_ctx_t *ctx, unsigned *pc) {
    if (pc)
        *pc = ctx->error_pc;
    return ctx->error_code;
}

void devs_client_event_handler(devs_ctx_t *ctx, int event_id, void *arg0, void *arg1) {
    if (!ctx)
        return;

    // jd_device_t *dev = arg0;
    jd_device_service_t *serv = arg0;
    jd_packet_t *pkt = arg1;
    jd_role_t *role = arg1;
    // jd_register_query_t *reg = arg1;

    devs_enter(ctx);

    // sync time so we get it in trace;
    // devs_fiber_poke() does this anyway, so optimize it out
    if (event_id != JD_CLIENT_EV_PROCESS)
        devs_fiber_sync_now(ctx);

    switch (event_id) {
    case JD_CLIENT_EV_SERVICE_PACKET:
        devs_trace(ctx, JACS_TRACE_EV_SERVICE_PACKET, pkt, pkt->service_size + 16);
        if (serv->service_class == JD_SERVICE_CLASS_TIMESERIES_AGGREGATOR &&
            pkt->service_command == JD_TIMESERIES_AGGREGATOR_CMD_STORED)
            jd_lstore_append(1, JD_LSTORE_TYPE_JD_FRAME, pkt, pkt->service_size + 16);
        devs_jd_process_pkt(ctx, serv, pkt);
        break;
    case JD_CLIENT_EV_BROADCAST_PACKET:
        devs_trace(ctx, JACS_TRACE_EV_BROADCAST_PACKET, pkt, pkt->service_size + 16);
        break;
    case JD_CLIENT_EV_NON_SERVICE_PACKET:
        devs_trace(ctx, JACS_TRACE_EV_NON_SERVICE_PACKET, pkt, pkt->service_size + 16);
        break;
    case JD_CLIENT_EV_ROLE_CHANGED:
        devs_jd_role_changed(ctx, role);
        break;
    case JD_CLIENT_EV_PROCESS:
        devs_fiber_poke(ctx);
        break;
    }

    devs_leave(ctx);
}

static void clear_ctx(devs_ctx_t *ctx) {
    devs_jd_free_roles(ctx);
    devs_enter(ctx);
    devs_regcache_free_all(&ctx->regcache);
    devs_fiber_free_all_fibers(ctx);
    devs_free(ctx, ctx->globals);
    devs_free(ctx, ctx->roles);
    devs_gc_destroy(ctx->gc);
    memset(ctx, 0, sizeof(*ctx));
}

void devs_restart(devs_ctx_t *ctx) {
    const uint8_t *img = ctx->img.data;
    clear_ctx(ctx);
    setup_ctx(ctx, img);
}

void devs_free_ctx(devs_ctx_t *ctx) {
    if (ctx) {
        clear_ctx(ctx);
        jd_free(ctx);
    }
}

#define JACS_TRACE_LOG_IDX 0
void devs_trace(devs_ctx_t *ctx, unsigned evtype, const void *data, unsigned data_size) {
    if (!devs_trace_enabled(ctx))
        return;
    uint32_t n = devs_now(ctx);
    if (n != ctx->_logged_now) {
        ctx->_logged_now = n;
        jd_lstore_append(JACS_TRACE_LOG_IDX, JACS_TRACE_EV_NOW, &ctx->_logged_now,
                         sizeof(ctx->_logged_now));
    }
    jd_lstore_append(JACS_TRACE_LOG_IDX, evtype, data, data_size);
}

void *devs_try_alloc(devs_ctx_t *ctx, uint32_t size) {
    void *r = jd_gc_try_alloc(ctx->gc, size);
    if (r == NULL) {
        // note that this will return after setting panic flags
        devs_oom(ctx, size);
    }
    return r;
}

void devs_oom(devs_ctx_t *ctx, unsigned size) {
    JD_LOG("devs: OOM (%u bytes)", (unsigned)size);
    devs_panic(ctx, JACS_PANIC_OOM);
}

void devs_free(devs_ctx_t *ctx, void *ptr) {
    jd_gc_free(ctx->gc, ptr);
}
