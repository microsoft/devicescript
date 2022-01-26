#include "jacs_internal.h"

static void setup_ctx(jacs_ctx_t *ctx, const uint8_t *img) {
    ctx->img.data = img;

    ctx->globals = jd_alloc0(sizeof(value_t) * ctx->img.header->num_globals);
    ctx->roles = jd_alloc0(sizeof(jacs_role_t) * jacs_img_num_roles(&ctx->img));

    jacs_fiber_sync_now(ctx);
    jacs_jd_reset_packet(ctx);

    jacs_fiber_start(ctx, 0, 0, JACS_OPCALL_BG);
}

jacs_ctx_t *jacs_create_ctx(const uint8_t *img, uint32_t size) {
    if (jacs_verify(img, size))
        return NULL;
    jacs_ctx_t *ctx = jd_alloc0(sizeof(*ctx));
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

unsigned jacs_error_code(jacs_ctx_t *ctx) {
    return ctx->error_code;
}

void jacs_process(jacs_ctx_t *ctx) {
    jacs_enter(ctx);
    jacs_fiber_poke(ctx);
    jacs_leave(ctx);
}

void jacs_handle_packet(jacs_ctx_t *ctx, jd_packet_t *pkt) {
    jacs_enter(ctx);
    jacs_jd_process_pkt(ctx, pkt);
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
    clear_ctx(ctx);
    jd_free(ctx);
}
