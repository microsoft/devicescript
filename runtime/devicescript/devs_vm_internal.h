#pragma once

value_t devs_vm_pop_arg(devs_ctx_t *ctx);
uint32_t devs_vm_pop_arg_u32(devs_ctx_t *ctx);
uint32_t devs_vm_pop_arg_i32(devs_ctx_t *ctx);
uint32_t devs_vm_pop_arg_func(devs_ctx_t *ctx);
double devs_vm_pop_arg_f64(devs_ctx_t *ctx);
value_t devs_vm_pop_arg_buffer(devs_ctx_t *ctx);
void *devs_vm_pop_arg_buffer_data(devs_ctx_t *ctx, unsigned *sz);
unsigned devs_vm_pop_arg_stridx(devs_ctx_t *ctx);
unsigned devs_vm_pop_arg_role(devs_ctx_t *ctx);
devs_map_t *devs_vm_pop_arg_map(devs_ctx_t *ctx, bool create);

extern const void *devs_vm_op_handlers[];

typedef void (*devs_vm_stmt_handler_t)(devs_activation_t *frame, devs_ctx_t *ctx);
typedef value_t (*devs_vm_expr_handler_t)(devs_activation_t *frame, devs_ctx_t *ctx);
