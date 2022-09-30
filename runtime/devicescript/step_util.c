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

//
// Pop utils
//

uint32_t jacs_vm_pop_arg_u32(jacs_ctx_t *ctx) {
    // TODO int vs uint?
    return jacs_value_to_int(jacs_vm_pop_arg(ctx));
}

uint32_t jacs_vm_pop_arg_i32(jacs_ctx_t *ctx) {
    return jacs_value_to_int(jacs_vm_pop_arg(ctx));
}

double jacs_vm_pop_arg_f64(jacs_ctx_t *ctx) {
    return jacs_value_to_double(jacs_vm_pop_arg(ctx));
}

value_t jacs_vm_pop_arg_buffer(jacs_ctx_t *ctx) {
    value_t tmp = jacs_vm_pop_arg(ctx);
    if (!jacs_is_buffer(ctx, tmp)) {
        jacs_runtime_failure(ctx, 60125);
        return jacs_pkt_buffer;
    }
    return tmp;
}

void *jacs_vm_pop_arg_buffer_data(jacs_ctx_t *ctx, unsigned *sz) {
    value_t tmp = jacs_vm_pop_arg_buffer(ctx);
    return jacs_buffer_data(ctx, tmp, sz);
}

unsigned jacs_vm_pop_arg_stridx(jacs_ctx_t *ctx) {
    value_t tmp = jacs_vm_pop_arg(ctx);
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_IMG_BUFFER) {
        jacs_runtime_failure(ctx, 60127);
        return 0;
    }
    return jacs_handle_value(tmp);
}

unsigned jacs_vm_pop_arg_role(jacs_ctx_t *ctx) {
    value_t tmp = jacs_vm_pop_arg(ctx);
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_ROLE) {
        jacs_runtime_failure(ctx, 60126);
        return 0;
    }
    return jacs_handle_value(tmp);
}

jacs_map_t *jacs_vm_pop_arg_map(jacs_ctx_t *ctx, bool create) {
    value_t tmp = jacs_vm_pop_arg(ctx);
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_GC_OBJECT) {
        jacs_runtime_failure(ctx, 60128);
        return NULL;
    }

    void *obj = jacs_handle_ptr_value(ctx, tmp);
    jacs_map_t **attached;

    switch (jacs_gc_tag(obj)) {
    case JACS_GC_TAG_BUFFER:
        attached = &((jacs_buffer_t *)obj)->attached;
        break;
    case JACS_GC_TAG_ARRAY:
        attached = &((jacs_array_t *)obj)->attached;
        break;
    case JACS_GC_TAG_MAP:
        return obj;
    default:
        JD_ASSERT(0);
        break;
    }

    obj = *attached;

    if (!obj && create) {
        obj = *attached = jacs_map_try_alloc(ctx->gc);
        if (obj == NULL)
            jacs_runtime_failure(ctx, 60131);
    }

    return obj;
}

value_t jacs_vm_pop_arg(jacs_ctx_t *ctx) {
    if (ctx->arg_stack_bottom >= ctx->stack_top)
        return jacs_runtime_failure(ctx, 60108);

    return ctx->the_stack[ctx->arg_stack_bottom++];
}

