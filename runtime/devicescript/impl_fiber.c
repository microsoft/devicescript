#include "devs_internal.h"

value_t prop_DsFiber_id(devs_ctx_t *ctx, value_t self) {
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_FIBER)
        return devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_FIBER, self);
    return devs_value_from_int(devs_handle_value(self));
}

static devs_fiber_t *devs_arg_self_fiber(devs_ctx_t *ctx) {
    value_t self = devs_arg_self(ctx);
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_FIBER) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_FIBER, self);
        return NULL;
    } else {
        devs_fiber_t *f = devs_fiber_by_tag(ctx, devs_handle_value(self));
        if (f == NULL)
            devs_throw_range_error(ctx, "fiber already disposed");
        return f;
    }
}

void meth1_DsFiber_resume(devs_ctx_t *ctx) {
    devs_fiber_t *fib = devs_arg_self_fiber(ctx);
    if (!fib)
        return;
    if (fib->pkt_kind != DEVS_PKT_KIND_SUSPENDED) {
        devs_throw_range_error(ctx, "fiber not suspended");
        return;
    }

    fib->ret_val = devs_arg(ctx, 0);
    devs_fiber_set_wake_time(fib, 1); // 1 is in the past
}

void meth0_DsFiber_terminate(devs_ctx_t *ctx) {
    devs_fiber_t *fib = devs_arg_self_fiber(ctx);
    if (!fib)
        return;
    devs_fiber_termiante(fib);
}

void fun1_DeviceScript_suspend(devs_ctx_t *ctx) {
    int time = devs_arg_int(ctx, 0);
    if (time >= 0) {
        devs_fiber_t *fib = ctx->curr_fiber;
        devs_fiber_sleep(ctx->curr_fiber, time);
        fib->pkt_kind = DEVS_PKT_KIND_SUSPENDED;
    }
}

void fun0_DsFiber_self(devs_ctx_t *ctx) {
    devs_ret(ctx, devs_value_from_handle(DEVS_HANDLE_TYPE_FIBER, ctx->curr_fiber->handle_tag));
}
