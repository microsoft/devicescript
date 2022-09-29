#include "jacs_internal.h"

#include "storage/jd_storage.h"

STATIC_ASSERT(sizeof(jacs_img_section_t) == JACS_SECTION_HEADER_SIZE);
STATIC_ASSERT(sizeof(jacs_img_header_t) ==
              JACS_FIX_HEADER_SIZE + JACS_SECTION_HEADER_SIZE * JACS_NUM_IMG_SECTIONS);
STATIC_ASSERT(sizeof(jacs_function_desc_t) == JACS_FUNCTION_HEADER_SIZE);
STATIC_ASSERT(sizeof(jacs_role_desc_t) == JACS_ROLE_HEADER_SIZE);

static void setup_ctx(jacs_ctx_t *ctx, const uint8_t *img) {
    ctx->img.data = img;

    ctx->gc = jacs_gc_create();

    ctx->globals = jacs_try_alloc(ctx, sizeof(value_t) * ctx->img.header->num_globals);
    ctx->roles = jacs_try_alloc(ctx, sizeof(jd_role_t *) * jacs_img_num_roles(&ctx->img));

    if (ctx->error_code)
        return;

    jacs_fiber_sync_now(ctx);
    jacs_jd_reset_packet(ctx);

    jacs_jd_init_roles(ctx);

    if (ctx->error_code)
        return;

    jacs_fiber_start(ctx, 0, NULL, 0, JACS_OPCALL_BG);
}

jacs_ctx_t *jacs_create_ctx(const uint8_t *img, uint32_t size, const jacs_cfg_t *cfg) {
    if (jacs_verify(img, size))
        return NULL;
    jacs_ctx_t *ctx = jd_alloc(sizeof(*ctx));
    ctx->cfg = *cfg;

    if (!jd_lstore_is_enabled()) {
        ctx->flags |= JACS_CTX_TRACE_DISABLED;
    } else {
        jacs_trace_ev_init_t ev = {.image_hash = jd_hash_fnv1a(img, size)};
        jacs_trace(ctx, JACS_TRACE_EV_INIT, &ev, sizeof(ev));
    }

    setup_ctx(ctx, img);

    return ctx;
}

static void jacs_enter(jacs_ctx_t *ctx) {
    JD_ASSERT((ctx->flags & JACS_CTX_FLAG_BUSY) == 0);
    ctx->flags |= JACS_CTX_FLAG_BUSY;
}

static void jacs_leave(jacs_ctx_t *ctx) {
    JD_ASSERT((ctx->flags & JACS_CTX_FLAG_BUSY) != 0);
    ctx->flags &= ~JACS_CTX_FLAG_BUSY;
}

unsigned jacs_error_code(jacs_ctx_t *ctx, unsigned *pc) {
    if (pc)
        *pc = ctx->error_pc;
    return ctx->error_code;
}

void jacs_client_event_handler(jacs_ctx_t *ctx, int event_id, void *arg0, void *arg1) {
    if (!ctx)
        return;

    // jd_device_t *dev = arg0;
    jd_device_service_t *serv = arg0;
    jd_packet_t *pkt = arg1;
    jd_role_t *role = arg1;
    // jd_register_query_t *reg = arg1;

    jacs_enter(ctx);

    // sync time so we get it in trace;
    // jacs_fiber_poke() does this anyway, so optimize it out
    if (event_id != JD_CLIENT_EV_PROCESS)
        jacs_fiber_sync_now(ctx);

    switch (event_id) {
    case JD_CLIENT_EV_SERVICE_PACKET:
        jacs_trace(ctx, JACS_TRACE_EV_SERVICE_PACKET, pkt, pkt->service_size + 16);
        if (serv->service_class == JD_SERVICE_CLASS_TIMESERIES_AGGREGATOR &&
            pkt->service_command == JD_TIMESERIES_AGGREGATOR_CMD_STORED)
            jd_lstore_append(1, JD_LSTORE_TYPE_JD_FRAME, pkt, pkt->service_size + 16);
        jacs_jd_process_pkt(ctx, serv, pkt);
        break;
    case JD_CLIENT_EV_BROADCAST_PACKET:
        jacs_trace(ctx, JACS_TRACE_EV_BROADCAST_PACKET, pkt, pkt->service_size + 16);
        break;
    case JD_CLIENT_EV_NON_SERVICE_PACKET:
        jacs_trace(ctx, JACS_TRACE_EV_NON_SERVICE_PACKET, pkt, pkt->service_size + 16);
        break;
    case JD_CLIENT_EV_ROLE_CHANGED:
        jacs_jd_role_changed(ctx, role);
        break;
    case JD_CLIENT_EV_PROCESS:
        jacs_fiber_poke(ctx);
        break;
    }

    jacs_leave(ctx);
}

static void clear_ctx(jacs_ctx_t *ctx) {
    jacs_jd_free_roles(ctx);
    jacs_enter(ctx);
    jacs_regcache_free_all(&ctx->regcache);
    jacs_fiber_free_all_fibers(ctx);
    jacs_free(ctx, ctx->globals);
    jacs_free(ctx, ctx->roles);
    jacs_gc_destroy(ctx->gc);
    memset(ctx, 0, sizeof(*ctx));
}

void jacs_restart(jacs_ctx_t *ctx) {
    const uint8_t *img = ctx->img.data;
    clear_ctx(ctx);
    setup_ctx(ctx, img);
}

void jacs_free_ctx(jacs_ctx_t *ctx) {
    if (ctx) {
        clear_ctx(ctx);
        jd_free(ctx);
    }
}

#define JACS_TRACE_LOG_IDX 0
void jacs_trace(jacs_ctx_t *ctx, unsigned evtype, const void *data, unsigned data_size) {
    if (!jacs_trace_enabled(ctx))
        return;
    uint32_t n = jacs_now(ctx);
    if (n != ctx->_logged_now) {
        ctx->_logged_now = n;
        jd_lstore_append(JACS_TRACE_LOG_IDX, JACS_TRACE_EV_NOW, &ctx->_logged_now,
                         sizeof(ctx->_logged_now));
    }
    jd_lstore_append(JACS_TRACE_LOG_IDX, evtype, data, data_size);
}

void *jacs_try_alloc(jacs_ctx_t *ctx, uint32_t size) {
    void *r = jd_gc_try_alloc(ctx->gc, size);
    if (r == NULL) {
        JD_LOG("jacs: OOM (%u bytes)", (unsigned)size);
        // note that this will return after setting panic flags
        jacs_panic(ctx, JACS_PANIC_OOM);
    }
    return r;
}

void jacs_free(jacs_ctx_t *ctx, void *ptr) {
    jd_gc_free(ctx->gc, ptr);
}
