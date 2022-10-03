#include "jacs_internal.h"
#include "jacs_vm_internal.h"

//
// Pop utils
//

static inline value_t pop_arg(jacs_ctx_t *ctx) {
    if (ctx->stack_top == 0)
        return jacs_runtime_failure(ctx, 60108);

    return ctx->the_stack[--ctx->stack_top];
}

value_t jacs_vm_pop_arg(jacs_ctx_t *ctx) {
    return pop_arg(ctx);
}

uint32_t jacs_vm_pop_arg_u32(jacs_ctx_t *ctx) {
    // TODO int vs uint?
    return jacs_value_to_int(pop_arg(ctx));
}

uint32_t jacs_vm_pop_arg_i32(jacs_ctx_t *ctx) {
    return jacs_value_to_int(pop_arg(ctx));
}

double jacs_vm_pop_arg_f64(jacs_ctx_t *ctx) {
    return jacs_value_to_double(pop_arg(ctx));
}

value_t jacs_vm_pop_arg_buffer(jacs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
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
    value_t tmp = pop_arg(ctx);
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_IMG_BUFFER) {
        jacs_runtime_failure(ctx, 60127);
        return 0;
    }
    return jacs_handle_value(tmp);
}

unsigned jacs_vm_pop_arg_role(jacs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_ROLE) {
        jacs_runtime_failure(ctx, 60126);
        return 0;
    }
    return jacs_handle_value(tmp);
}

jacs_map_t *jacs_vm_pop_arg_map(jacs_ctx_t *ctx, bool create) {
    value_t tmp = pop_arg(ctx);
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

