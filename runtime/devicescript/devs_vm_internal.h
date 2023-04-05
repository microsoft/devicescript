#pragma once

#define DEVS_BUFFER_RO 0
#define DEVS_BUFFER_RW 1
#define DEVS_BUFFER_STRING_OK 2

value_t devs_vm_pop_arg(devs_ctx_t *ctx);
uint32_t devs_vm_pop_arg_u32(devs_ctx_t *ctx);
int32_t devs_vm_pop_arg_i32(devs_ctx_t *ctx);
double devs_vm_pop_arg_f64(devs_ctx_t *ctx);
value_t devs_vm_pop_arg_buffer(devs_ctx_t *ctx, int flags);

extern const void *const devs_vm_op_handlers[];

typedef void (*devs_vm_stmt_handler_t)(devs_activation_t *frame, devs_ctx_t *ctx);
typedef value_t (*devs_vm_expr_handler_t)(devs_activation_t *frame, devs_ctx_t *ctx);
