#include "devs_internal.h"

void fun2_Object_assign(devs_ctx_t *ctx) {
    value_t dst0 = devs_arg(ctx, 0);
    value_t src0 = devs_arg(ctx, 1);

    if (!devs_is_nullish(src0)) {
        devs_map_t *dst = devs_object_get_attached_rw(ctx, dst0);
        devs_maplike_t *src = devs_object_get_attached_enum(ctx, src0);
        if (src && dst)
            devs_map_copy_into(ctx, dst, src);
    }

    devs_ret(ctx, dst0);
}

static void fun1_keys_or_values(devs_ctx_t *ctx, bool keys) {
    value_t src0 = devs_arg(ctx, 0);

    devs_maplike_t *src = devs_object_get_attached_enum(ctx, src0);
    if (!src)
        return;

    devs_array_t *arr = devs_array_try_alloc(ctx, 0);
    if (!arr)
        return;

    value_t ret = devs_value_from_gc_obj(ctx, arr);
    devs_value_pin(ctx, ret);

    devs_maplike_keys_or_values(ctx, src, arr, keys);

    devs_value_unpin(ctx, ret);
    devs_ret(ctx, ret);
}

void fun1_Object_keys(devs_ctx_t *ctx) {
    fun1_keys_or_values(ctx, 1);
}

void fun1_Object_values(devs_ctx_t *ctx) {
    fun1_keys_or_values(ctx, 0);
}

void fun2_Object_setPrototypeOf(devs_ctx_t *ctx) {
    value_t trg = devs_arg(ctx, 0);
    value_t src = devs_arg(ctx, 1);

    devs_map_t *m = devs_value_to_gc_obj(ctx, trg);
    if (!devs_is_map(m)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_OBJECT, trg);
        return;
    }

    devs_maplike_t *p = devs_object_get_attached_enum(ctx, src);
    if (!p) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_PROTOTYPE, src);
        return;
    }

    m->proto = p;

    devs_ret(ctx, trg);
}
