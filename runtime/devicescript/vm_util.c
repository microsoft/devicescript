#include "devs_internal.h"
#include "devs_vm_internal.h"

//
// Pop utils
//

static inline value_t pop_arg(devs_ctx_t *ctx) {
    if (ctx->stack_top == 0)
        return devs_runtime_failure(ctx, 60108);

    return ctx->the_stack[--ctx->stack_top];
}

value_t devs_vm_pop_arg(devs_ctx_t *ctx) {
    return pop_arg(ctx);
}

uint32_t devs_vm_pop_arg_u32(devs_ctx_t *ctx) {
    // TODO int vs uint?
    return devs_value_to_int(pop_arg(ctx));
}

uint32_t devs_vm_pop_arg_i32(devs_ctx_t *ctx) {
    return devs_value_to_int(pop_arg(ctx));
}

uint32_t devs_vm_pop_arg_func(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) == DEVS_HANDLE_TYPE_STATIC_FUNCTION)
        return devs_handle_value(tmp);
    devs_runtime_failure(ctx, 60136);
    return 0;
}

double devs_vm_pop_arg_f64(devs_ctx_t *ctx) {
    return devs_value_to_double(pop_arg(ctx));
}

value_t devs_vm_pop_arg_buffer(devs_ctx_t *ctx, int flags) {
    value_t tmp = pop_arg(ctx);
    if (!devs_is_buffer(ctx, tmp)) {
        if ((flags & DEVS_BUFFER_STRING_OK) && devs_is_string(ctx, tmp)) {
            // OK
        } else {
            devs_runtime_failure(ctx, 60125);
            return devs_pkt_buffer;
        }
    }
    if ((flags & DEVS_BUFFER_RW) && !devs_buffer_is_writable(ctx, tmp)) {
        devs_runtime_failure(ctx, 60148);
        return devs_pkt_buffer;
    }
    return tmp;
}

void *devs_vm_pop_arg_buffer_data(devs_ctx_t *ctx, unsigned *sz, int flags) {
    value_t tmp = devs_vm_pop_arg_buffer(ctx, flags);
    if ((flags & DEVS_BUFFER_STRING_OK) && devs_is_string(ctx, tmp))
        return (void *)devs_string_get_utf8(ctx, tmp, sz);
    return devs_buffer_data(ctx, tmp, sz);
}

const char *devs_vm_pop_arg_string_data(devs_ctx_t *ctx, unsigned *sz) {
    value_t tmp = pop_arg(ctx);
    if (!devs_is_string(ctx, tmp)) {
        devs_runtime_failure(ctx, 60147);
        *sz = 0;
        return "";
    }
    return devs_string_get_utf8(ctx, tmp, sz);
}

unsigned devs_vm_pop_arg_stridx(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) != DEVS_HANDLE_TYPE_IMG_BUFFERISH) {
        devs_runtime_failure(ctx, 60127);
        return 0;
    }
    return devs_handle_value(tmp);
}

unsigned devs_vm_pop_arg_role(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) != DEVS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60126);
        return 0;
    }
    return devs_handle_value(tmp);
}

devs_map_t *devs_vm_pop_arg_map(devs_ctx_t *ctx, bool create) {
    value_t tmp = pop_arg(ctx);
    void *m = devs_object_get_attached(ctx, tmp, create);
    return devs_is_map(m) ? m : NULL;
}
