#pragma once

value_t jacs_vm_pop_arg(jacs_ctx_t *ctx);
uint32_t jacs_vm_pop_arg_u32(jacs_ctx_t *ctx);
uint32_t jacs_vm_pop_arg_i32(jacs_ctx_t *ctx);
uint32_t jacs_vm_pop_arg_func(jacs_ctx_t *ctx);
double jacs_vm_pop_arg_f64(jacs_ctx_t *ctx);
value_t jacs_vm_pop_arg_buffer(jacs_ctx_t *ctx);
void *jacs_vm_pop_arg_buffer_data(jacs_ctx_t *ctx, unsigned *sz);
unsigned jacs_vm_pop_arg_stridx(jacs_ctx_t *ctx);
unsigned jacs_vm_pop_arg_role(jacs_ctx_t *ctx);
jacs_map_t *jacs_vm_pop_arg_map(jacs_ctx_t *ctx, bool create);

extern const void *jacs_vm_op_handlers[];

typedef void (*jacs_vm_stmt_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);
typedef value_t (*jacs_vm_expr_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);
