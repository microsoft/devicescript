#include "devs_internal.h"

void fun2_Object_assign(devs_ctx_t *ctx) {
    value_t dst0 = devs_arg(ctx, 0);
    value_t src0 = devs_arg(ctx, 1);

    if (!devs_is_null(src0)) {
        devs_map_t *dst = devs_object_get_attached_rw(ctx, dst0);
        const devs_map_or_proto_t *src = devs_object_get_attached_enum(ctx, src0);
        if (src && dst) {
            devs_map_copy_into(ctx, dst, src);
            if (devs_gc_tag(src) == DEVS_GC_TAG_HALF_STATIC_MAP) {
                devs_map_copy_into(ctx, dst, ((devs_map_t *)src)->proto);
            }
        }
    }

    devs_ret(ctx, dst0);
}
