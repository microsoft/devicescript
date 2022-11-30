#include "devs_internal.h"
#include "devs_vm_internal.h"

static inline uint8_t devs_vm_fetch_byte(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (frame->pc < frame->maxpc)
        return ctx->img.data[frame->pc++];
    devs_runtime_failure(ctx, 60110);
    return 0;
}

static inline int32_t devs_vm_fetch_int(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint8_t v = devs_vm_fetch_byte(frame, ctx);
    if (v < JACS_FIRST_MULTIBYTE_INT)
        return v;

    int32_t r = 0;
    bool n = !!(v & 4);
    int len = (v & 3) + 1;
    for (int i = 0; i < len; ++i) {
        uint8_t b = devs_vm_fetch_byte(frame, ctx);
        r <<= 8;
        r |= b;
    }

    return n ? -r : r;
}

static inline void devs_vm_push(devs_ctx_t *ctx, value_t v) {
    if (ctx->stack_top >= JACS_MAX_STACK_DEPTH)
        devs_runtime_failure(ctx, 60109);
    else
        ctx->the_stack[ctx->stack_top++] = v;
}

void devs_dump_stackframe(devs_ctx_t *ctx, devs_activation_t *fn) {
    int idx = fn->func - devs_img_get_function(&ctx->img, 0);
    DMESG("pc=%d @ %s_F%d", (int)(fn->pc - fn->func->start), devs_img_fun_name(&ctx->img, idx),
          idx);
}

static void devs_vm_exec_opcode(devs_ctx_t *ctx, devs_activation_t *frame) {
    uint8_t op = devs_vm_fetch_byte(frame, ctx);

    if (op >= JACS_DIRECT_CONST_OP) {
        int v = op - JACS_DIRECT_CONST_OP - JACS_DIRECT_CONST_OFFSET;
        devs_vm_push(ctx, devs_value_from_int(v));
        return;
    }

    if (op >= JACS_OP_PAST_LAST) {
        devs_runtime_failure(ctx, 60122);
    } else {
        uint8_t flags = JACS_OP_PROPS[op];

        if (flags & JACS_BYTECODEFLAG_TAKES_NUMBER) {
            ctx->jmp_pc = frame->pc - 1;
            ctx->literal_int = devs_vm_fetch_int(frame, ctx);
        }

        ctx->stack_top_for_gc = ctx->stack_top;

        // devs_dump_stackframe(ctx, frame);

        if (flags & JACS_BYTECODEFLAG_IS_STMT) {
            ((devs_vm_stmt_handler_t)devs_vm_op_handlers[op])(frame, ctx);
            if (ctx->stack_top)
                devs_runtime_failure(ctx, 60135);
        } else {
            value_t v = ((devs_vm_expr_handler_t)devs_vm_op_handlers[op])(frame, ctx);
            devs_vm_push(ctx, v);
        }
    }
}

void devs_vm_exec_opcodes(devs_ctx_t *ctx) {
    unsigned maxsteps = JACS_MAX_STEPS;

    while (ctx->curr_fn && --maxsteps)
        devs_vm_exec_opcode(ctx, ctx->curr_fn);

    if (maxsteps == 0)
        devs_panic(ctx, JACS_PANIC_TIMEOUT);
}