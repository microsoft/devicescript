#include "devs_internal.h"

void methX_Function_start(devs_ctx_t *ctx) {
    if (ctx->stack_top_for_gc < 2) {
        devs_runtime_failure(ctx, 60137);
        return;
    }

    unsigned flag = devs_arg_int(ctx, 0);
    if (flag == 0 || flag > DEVS_OPCALL_BG_MAX1_REPLACE) {
        devs_runtime_failure(ctx, 60137);
        return;
    }

    ctx->stack_top_for_gc--;
    unsigned numargs = ctx->stack_top_for_gc - 1;
    memmove(ctx->the_stack + 1, ctx->the_stack + 2, numargs * sizeof(value_t));
    devs_fiber_t *fib = devs_fiber_start(ctx, numargs, flag);
    devs_ret_gc_ptr(ctx, fib);
}
