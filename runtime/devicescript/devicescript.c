#include "devs_internal.h"

#include "storage/jd_storage.h"

STATIC_ASSERT(sizeof(devs_img_section_t) == DEVS_SECTION_HEADER_SIZE);
STATIC_ASSERT(sizeof(devs_img_header_t) ==
              DEVS_FIX_HEADER_SIZE + DEVS_SECTION_HEADER_SIZE * DEVS_NUM_IMG_SECTIONS);
STATIC_ASSERT(sizeof(devs_function_desc_t) == DEVS_FUNCTION_HEADER_SIZE);

static void setup_ctx(devs_ctx_t *ctx, const uint8_t *img) {
    static uint32_t ctx_seq_no;

    ctx->img.data = img;
    ctx->ctx_seq_no = ++ctx_seq_no;

    ctx->gc = devs_gc_create();

    ctx->globals = devs_try_alloc(ctx, sizeof(value_t) * ctx->img.header->num_globals);

    devs_gc_set_ctx(ctx->gc, ctx);

    ctx->fn_protos = devs_short_map_try_alloc(ctx);
    ctx->spec_protos = devs_short_map_try_alloc(ctx);
    ctx->fn_values = devs_short_map_try_alloc(ctx);

    if (ctx->error_code)
        return;

    devs_fiber_sync_now(ctx);
    devs_jd_reset_packet(ctx);

    devs_jd_init_roles(ctx);
    devs_gpio_init_dcfg(ctx);

    if (ctx->error_code)
        return;

    DEVS_CHECK_CTX_FREE(ctx);

    // reference the "main" function (first function)
    ctx->the_stack[0] = devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION, 0);
    ctx->stack_top_for_gc = 1;
    // run it in bg
    devs_fiber_start(ctx, 0, DEVS_OPCALL_BG);
}

devs_ctx_t *devs_create_ctx(const uint8_t *img, uint32_t size, const devs_cfg_t *cfg) {
    if (size < sizeof(devs_img_header_t)) {
        DMESG("image too small");
        return NULL;
    }

    int error = devs_verify(img, size);
    devs_dump_versions(img);

    if (error != 0)
        return NULL;

    devs_ctx_t *ctx = jd_alloc(sizeof(*ctx));
    ctx->cfg = *cfg;

    if (!jd_lstore_is_enabled()) {
        ctx->flags |= DEVS_CTX_TRACE_DISABLED;
    } else {
        devs_trace_ev_init_t ev = {.image_hash = jd_hash_fnv1a(img, size)};
        devs_trace(ctx, DEVS_TRACE_EV_INIT, &ev, sizeof(ev));
    }

    jd_sha256_setup();
    jd_sha256_update(img, size);
    jd_sha256_finish(ctx->program_hash);

    DMESG("DevS-SHA256: %*p", JD_SHA256_HASH_BYTES, ctx->program_hash);

    setup_ctx(ctx, img);

    return ctx;
}

static void devs_enter(devs_ctx_t *ctx) {
    JD_ASSERT((ctx->flags & DEVS_CTX_FLAG_BUSY) == 0);
    ctx->flags |= DEVS_CTX_FLAG_BUSY;
}

static void devs_leave(devs_ctx_t *ctx) {
    JD_ASSERT((ctx->flags & DEVS_CTX_FLAG_BUSY) != 0);
    ctx->flags &= ~DEVS_CTX_FLAG_BUSY;
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

    if (ctx->flags & DEVS_CTX_PENDING_RESUME) {
        ctx->flags ^= DEVS_CTX_PENDING_RESUME;
        if (ctx->curr_fiber) {
            ctx->ignore_brk = true;
            // re-process throw if needed
            if (ctx->in_throw)
                devs_process_throw(ctx);
            if (ctx->curr_fiber) // throw might have killed the thread
                devs_fiber_run(ctx->curr_fiber);
            ctx->ignore_brk = false; // just in case
            devs_fiber_poke(ctx);
        }
    }

    // all bytecode execution is called from one of these event handlers
    switch (event_id) {
    case JD_CLIENT_EV_SERVICE_PACKET:
        devs_trace(ctx, DEVS_TRACE_EV_SERVICE_PACKET, pkt, pkt->service_size + 16);
        if (serv->service_class == JD_SERVICE_CLASS_TIMESERIES_AGGREGATOR &&
            pkt->service_command == JD_TIMESERIES_AGGREGATOR_CMD_STORED)
            jd_lstore_append(1, JD_LSTORE_TYPE_JD_FRAME, pkt, pkt->service_size + 16);
        devs_jd_process_pkt(ctx, serv, pkt);
        break;
    case JD_CLIENT_EV_BROADCAST_PACKET:
        devs_trace(ctx, DEVS_TRACE_EV_BROADCAST_PACKET, pkt, pkt->service_size + 16);
        break;
    case JD_CLIENT_EV_NON_SERVICE_PACKET:
        devs_trace(ctx, DEVS_TRACE_EV_NON_SERVICE_PACKET, pkt, pkt->service_size + 16);
        devs_jd_process_pkt(ctx, NULL, pkt);
        break;
    case JD_CLIENT_EV_ROLE_CHANGED:
        devs_jd_role_changed(ctx, role);
        break;
    case JD_CLIENT_EV_PROCESS:
        devs_fiber_poke(ctx);
        break;
    }

    // don't sleep too long!
    jd_set_max_sleep(devs_fiber_get_max_sleep(ctx));

    devs_leave(ctx);

    if (event_id == JD_CLIENT_EV_PROCESS)
        devs_jd_after_user(ctx);
}

static void clear_ctx(devs_ctx_t *ctx) {
    devs_jd_free_roles(ctx);
    devs_vm_clear_breakpoints(ctx);
    devs_enter(ctx);
    devs_regcache_free_all(&ctx->regcache);
    devs_fiber_free_all_fibers(ctx);
    devs_free(ctx, ctx->globals);
    for (unsigned i = 0; i < ctx->num_roles; ++i)
        devs_free(ctx, ctx->roles[i]);
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

#define DEVS_TRACE_LOG_IDX 0
void devs_trace(devs_ctx_t *ctx, unsigned evtype, const void *data, unsigned data_size) {
    if (!devs_trace_enabled(ctx))
        return;
    uint32_t n = devs_now(ctx);
    if (n != ctx->_logged_now) {
        ctx->_logged_now = n;
        jd_lstore_append(DEVS_TRACE_LOG_IDX, DEVS_TRACE_EV_NOW, &ctx->_logged_now,
                         sizeof(ctx->_logged_now));
    }
    jd_lstore_append(DEVS_TRACE_LOG_IDX, evtype, data, data_size);
}

void devs_oom(devs_ctx_t *ctx, unsigned size) {
    devs_dump_heap(ctx, 0, 30);
    devs_dump_heap(ctx, -1, 0);
    JD_LOG("devs: OOM (%u bytes)", (unsigned)size);
    devs_panic(ctx, DEVS_PANIC_OOM);
}

void devs_free(devs_ctx_t *ctx, void *ptr) {
    jd_gc_free(ctx->gc, ptr);
}
