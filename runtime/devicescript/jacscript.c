#include "jacs_internal.h"

static void setup_ctx(jacs_ctx_t *ctx, const uint8_t *img) {
    ctx->img.data = img;

    ctx->globals = jd_alloc(sizeof(value_t) * ctx->img.header->num_globals);
    ctx->roles = jd_alloc(sizeof(jd_role_t *) * jacs_img_num_roles(&ctx->img));

    jacs_fiber_sync_now(ctx);
    jacs_jd_reset_packet(ctx);

    jacs_jd_init_roles(ctx);

    jacs_fiber_start(ctx, 0, 0, JACS_OPCALL_BG);
}

jacs_ctx_t *jacs_create_ctx(const uint8_t *img, uint32_t size, const jacs_cfg_t *cfg) {
    if (jacs_verify(img, size))
        return NULL;
    jacs_ctx_t *ctx = jd_alloc(sizeof(*ctx));
    ctx->cfg = *cfg;
    setup_ctx(ctx, img);
    return ctx;
}

static void jacs_enter(jacs_ctx_t *ctx) {
    assert((ctx->flags & JACS_CTX_FLAG_BUSY) == 0);
    ctx->flags |= JACS_CTX_FLAG_BUSY;
}

static void jacs_leave(jacs_ctx_t *ctx) {
    assert((ctx->flags & JACS_CTX_FLAG_BUSY) != 0);
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
    switch (event_id) {
    case JD_CLIENT_EV_SERVICE_PACKET:
        jacs_jd_process_pkt(ctx, serv, pkt);
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
    jacs_enter(ctx);
    jacs_regcache_free_all(&ctx->regcache);
    jacs_fiber_free_all_fibers(ctx);
    jd_free(ctx->globals);
    jd_free(ctx->roles);
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
