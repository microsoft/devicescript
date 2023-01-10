#include "devs_internal.h"

static void meth1_error_ctor(devs_ctx_t *ctx, unsigned blt, unsigned str) {
    devs_map_t *m = devs_arg_self_map(ctx);
    if (!m)
        return;
    if (m->proto == NULL)
        m->proto = devs_object_get_built_in(ctx, blt);
    value_t msg = devs_arg(ctx, 0);
    if (devs_is_null(msg))
        msg = devs_builtin_string(DEVS_BUILTIN_STRING_ERROR);
    devs_map_set_string_field(ctx, m, str, msg);
    devs_ret_gc_ptr(ctx, m);
}

void meth1_Error___ctor__(devs_ctx_t *ctx) {
    meth1_error_ctor(ctx, DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE, DEVS_BUILTIN_STRING_ERROR);
}

void meth1_RangeError___ctor__(devs_ctx_t *ctx) {
    meth1_error_ctor(ctx, DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE, DEVS_BUILTIN_STRING_RANGEERROR);
}

void meth1_TypeError___ctor__(devs_ctx_t *ctx) {
    meth1_error_ctor(ctx, DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE, DEVS_BUILTIN_STRING_TYPEERROR);
}
