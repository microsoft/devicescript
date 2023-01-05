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
    if (self) {
        uint32_t idx = devs_arg_int(ctx, 0);
        int32_t count = devs_arg_int(ctx, 1);
        if (devs_array_insert(ctx, self, idx, count))
            devs_runtime_failure(ctx, 60138);
    }
}

void fun1_Array_isArray(devs_ctx_t *ctx) {
    devs_ret_bool(ctx, devs_is_array(ctx, devs_arg(ctx, 0)));
}

void methX_Array_slice(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    unsigned numargs = ctx->stack_top_for_gc - 1;
    int32_t len = self->length;
    int32_t start = numargs > 0 ? devs_arg_int(ctx, 0) : 0;
    if (start < 0)
        start = len + start;
    if (start < 0)
        start = 0;

    int32_t end = numargs > 1 && !devs_is_null(devs_arg(ctx, 1)) ? devs_arg_int(ctx, 1) : len;

    if (end < 0)
        end = len + end;
    if (end > len)
        end = len;

    if (start > end)
        start = end;

    devs_array_t *res = devs_array_try_alloc(ctx, end - start);
    if (res)
        memcpy(res->data, self->data + start, (end - start) * sizeof(value_t));

    devs_ret_gc_ptr(ctx, res);
}
