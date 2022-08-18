#pragma once

bool jacs_vm_role_ok(jacs_ctx_t *ctx, uint16_t a);
bool jacs_vm_args_ok(jacs_activation_t *frame, uint32_t localidx, uint32_t numargs);
int32_t jacs_vm_fetch_int(jacs_activation_t *frame, jacs_ctx_t *ctx);
static inline uint8_t jacs_vm_fetch_byte(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (frame->pc < frame->maxpc)
        return ctx->img.data[frame->pc++];
    jacs_runtime_failure(ctx);
    return 0;
}
value_t jacs_vm_exec_expr(jacs_activation_t *frame);
uint32_t jacs_vm_exec_expr_u32(jacs_activation_t *frame);
uint32_t jacs_vm_exec_expr_i32(jacs_activation_t *frame);
double jacs_vm_exec_expr_f64(jacs_activation_t *frame);
