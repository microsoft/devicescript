#include "devs_internal.h"

DEVS_DERIVE(TypeError_prototype, Error_prototype)
DEVS_DERIVE(RangeError_prototype, Error_prototype)

static void meth1_error_ctor(devs_ctx_t *ctx, unsigned blt, unsigned str) {
    devs_map_t *m = devs_arg_self_map(ctx);
    if (!m)
        return;
    if (m->proto == NULL)
        m->proto = devs_get_builtin_object(ctx, blt);
    value_t msg = devs_arg(ctx, 0);
    if (devs_is_null(msg))
        msg = devs_builtin_string(str);
    devs_map_set_string_field(ctx, m, DEVS_BUILTIN_STRING_MESSAGE, msg);
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

value_t prop_Error_name(devs_ctx_t *ctx, value_t self) {
    value_t ctor = devs_object_get_built_in_field(ctx, self, DEVS_BUILTIN_STRING_CONSTRUCTOR);
    if (devs_is_null(ctor))
        return devs_undefined;
    return devs_object_get_built_in_field(ctx, ctor, DEVS_BUILTIN_STRING_NAME);
}

void meth0_Error_print(devs_ctx_t *ctx) {
    value_t exn = devs_arg_self(ctx);
    devs_dump_exception(ctx, exn);
}
