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
    return devs_value_to_int(ctx, pop_arg(ctx));
}

int32_t devs_vm_pop_arg_i32(devs_ctx_t *ctx) {
    return devs_value_to_int(ctx, pop_arg(ctx));
}

double devs_vm_pop_arg_f64(devs_ctx_t *ctx) {
    return devs_value_to_double(ctx, pop_arg(ctx));
}

value_t devs_vm_pop_arg_buffer(devs_ctx_t *ctx, int flags) {
    value_t tmp = pop_arg(ctx);
    if (!devs_is_buffer(ctx, tmp)) {
        if ((flags & DEVS_BUFFER_STRING_OK) && devs_is_string(ctx, tmp)) {
            // OK
        } else {
            devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_BUFFER, tmp);
            return devs_null;
        }
    }
    if ((flags & DEVS_BUFFER_RW) && !devs_buffer_is_writable(ctx, tmp)) {
        devs_throw_expecting_error_ext(ctx, "mutable Buffer", tmp);
        return devs_null;
    }
    return tmp;
}
