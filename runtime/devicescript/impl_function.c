#include "devs_internal.h"

void methX_Function_start(devs_ctx_t *ctx) {
    if (ctx->stack_top_for_gc < 2) {
        devs_throw_range_error(ctx, "need flag arg");
        return;
    }

    unsigned flag = devs_arg_int(ctx, 0);
    if (flag == 0 || flag > DEVS_OPCALL_BG_MAX1_REPLACE) {
        devs_throw_range_error(ctx, "invalid flag arg");
        return;
    }

    ctx->stack_top_for_gc--;
    unsigned numargs = ctx->stack_top_for_gc - 1;
    memmove(ctx->the_stack + 1, ctx->the_stack + 2, numargs * sizeof(value_t));
    devs_fiber_t *fib = devs_fiber_start(ctx, numargs, flag);

    if (fib != NULL)
        devs_ret(ctx, devs_value_from_handle(DEVS_HANDLE_TYPE_FIBER, fib->handle_tag));
}

value_t prop_Function_prototype(devs_ctx_t *ctx, value_t self) {
    value_t th;
    devs_activation_t *clo;
    int fn = devs_get_fnidx(ctx, self, &th, &clo);
    if (fn < 0 || fn >= DEVS_FIRST_BUILTIN_FUNCTION ||
        !(devs_img_get_function(ctx->img, fn)->flags & DEVS_FUNCTIONFLAG_IS_CTOR))
        return devs_throw_expecting_error_ext(ctx, "ctor function", self);
    value_t r = devs_short_map_get(ctx, ctx->fn_protos, fn);
    if (devs_is_null(r)) {
        r = devs_value_from_gc_obj(
            ctx, devs_map_try_alloc(
                     ctx, devs_object_get_built_in(ctx, DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE)));
        if (!devs_is_null(r)) {
            devs_value_pin(ctx, r);
            devs_any_set(ctx, r, devs_builtin_string(DEVS_BUILTIN_STRING_CONSTRUCTOR),
                         devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION, fn));
            devs_short_map_set(ctx, ctx->fn_protos, fn, r);
            devs_value_unpin(ctx, r);
        }
    }
    return r;
}

value_t prop_Function_name(devs_ctx_t *ctx, value_t self) {
    value_t th;
    devs_activation_t *clo;
    int fn = devs_get_fnidx(ctx, self, &th, &clo);
    if (fn < 0)
        return devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_FUNCTION, self);

    int bltin = fn - DEVS_FIRST_BUILTIN_FUNCTION;
    if (bltin >= 0) {
        JD_ASSERT(bltin < devs_num_builtin_functions);
        const devs_builtin_function_t *h = &devs_builtin_functions[bltin];
        return devs_builtin_string(h->builtin_string_id);
    } else {
        return devs_value_from_handle(DEVS_HANDLE_TYPE_IMG_BUFFERISH,
                                      devs_img_get_function(ctx->img, fn)->name_idx);
    }
}
