#include "jacs_internal.h"
#include "jacs_vm_internal.h"

static inline uint8_t jacs_vm_fetch_byte(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (frame->pc < frame->maxpc)
        return ctx->img.data[frame->pc++];
    jacs_runtime_failure(ctx, 60110);
    return 0;
}

static inline int32_t jacs_vm_fetch_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint8_t v = jacs_vm_fetch_byte(frame, ctx);
    if (v < 0xF8)
        return v;

    int32_t r = 0;
    bool n = !!(v & 4);
    int len = (v & 3) + 1;
    for (int i = 0; i < len; ++i) {
        uint8_t b = jacs_vm_fetch_byte(frame, ctx);
        r <<= 8;
        r |= b;
    }

    return n ? -r : r;
}

static inline void jacs_vm_push(jacs_ctx_t *ctx, value_t v) {
    if (ctx->stack_top >= JACS_MAX_STACK_DEPTH)
        jacs_runtime_failure(ctx, 60109);
    else
        ctx->the_stack[ctx->stack_top++] = v;
}

void jacs_vm_exec_stmt(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    uint8_t op = jacs_vm_fetch_byte(frame, ctx);

    if (op >= JACS_DIRECT_CONST_OP) {
        jacs_vm_push(ctx,
                     jacs_value_from_int(op - JACS_DIRECT_CONST_OP - JACS_DIRECT_CONST_OFFSET));
        return;
    }

    if (op >= JACS_OP_PAST_LAST) {
        jacs_runtime_failure(ctx, 60122);
    } else {
        uint8_t flags = JACS_OP_PROPS[op];

        if (flags & JACS_BYTECODEFLAG_TAKES_NUMBER) {
            ctx->literal_int = jacs_vm_fetch_int(frame, ctx);
        }

        uint8_t numargs = flags & JACS_BYTECODEFLAG_NUM_ARGS_MASK;

        if (numargs) {
            int bot = ctx->stack_top - numargs;
            if (bot < 0)
                jacs_runtime_failure(ctx, 60134);
            ctx->arg_stack_bottom = bot;
        }

        if (flags & JACS_BYTECODEFLAG_IS_STMT) {
            ((jacs_vm_stmt_handler_t)jacs_vm_op_handlers[op])(frame, ctx);
            ctx->stack_top -= numargs;
            if (ctx->stack_top)
                jacs_runtime_failure(ctx, 60135);
        } else {
            value_t v = ((jacs_vm_expr_handler_t)jacs_vm_op_handlers[op])(frame, ctx);
            ctx->stack_top -= numargs;
            jacs_vm_push(ctx, v);
        }
    }
}

