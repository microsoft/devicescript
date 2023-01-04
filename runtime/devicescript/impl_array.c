#include "devs_internal.h"

value_t prop_Array_length(devs_ctx_t *ctx, value_t self) {
    if (!devs_is_array(ctx, self)) {
        devs_runtime_failure(ctx, 60164);
        return devs_undefined;
    }
    devs_array_t *arr = devs_handle_ptr_value(ctx, self);
    return devs_value_from_int(arr->length);
}

static devs_array_t *devs_arg_self_array(devs_ctx_t *ctx) {
    value_t s = devs_arg_self(ctx);
    if (devs_is_array(ctx, s))
        return (devs_array_t *)devs_handle_ptr_value(ctx, s);
    devs_runtime_failure(ctx, 60164);
    return NULL;
}

void meth2_Array_insert(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    uint32_t idx = devs_arg_int(ctx, 0);
    int32_t count = devs_arg_int(ctx, 1);
    if (devs_array_insert(ctx, self, idx, count))
        devs_runtime_failure(ctx, 60138);
}
