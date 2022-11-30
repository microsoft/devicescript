#include "devs_internal.h"
#include "devs_vm_internal.h"

//
// Pop utils
//

static inline value_t pop_arg(devs_ctx_t *ctx) {
    if (ctx->stack_top == 0)
        return devs_runtime_failure(ctx, 60108);

    return ctx->the_stack[--ctx->stack_top];
}

value_t devs_vm_pop_arg(devs_ctx_t *ctx) {
    return pop_arg(ctx);
}

uint32_t devs_vm_pop_arg_u32(devs_ctx_t *ctx) {
    // TODO int vs uint?
    return devs_value_to_int(pop_arg(ctx));
}

uint32_t devs_vm_pop_arg_i32(devs_ctx_t *ctx) {
    return devs_value_to_int(pop_arg(ctx));
}

uint32_t devs_vm_pop_arg_func(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) == JACS_HANDLE_TYPE_FUNCTION)
        return devs_handle_value(tmp);
    devs_runtime_failure(ctx, 60136);
    return 0;
}

double devs_vm_pop_arg_f64(devs_ctx_t *ctx) {
    return devs_value_to_double(pop_arg(ctx));
}

value_t devs_vm_pop_arg_buffer(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (!devs_is_buffer(ctx, tmp)) {
        devs_runtime_failure(ctx, 60125);
        return devs_pkt_buffer;
    }
    return tmp;
}

void *devs_vm_pop_arg_buffer_data(devs_ctx_t *ctx, unsigned *sz) {
    value_t tmp = devs_vm_pop_arg_buffer(ctx);
    return devs_buffer_data(ctx, tmp, sz);
}

unsigned devs_vm_pop_arg_stridx(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) != JACS_HANDLE_TYPE_IMG_BUFFER) {
        devs_runtime_failure(ctx, 60127);
        return 0;
    }
    return devs_handle_value(tmp);
}

unsigned devs_vm_pop_arg_role(devs_ctx_t *ctx) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) != JACS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60126);
        return 0;
    }
    return devs_handle_value(tmp);
}

devs_map_t *devs_vm_pop_arg_map(devs_ctx_t *ctx, bool create) {
    value_t tmp = pop_arg(ctx);
    if (devs_handle_type(tmp) != JACS_HANDLE_TYPE_GC_OBJECT) {
        devs_runtime_failure(ctx, 60128);
        return NULL;
    }

    void *obj = devs_handle_ptr_value(ctx, tmp);
    devs_map_t **attached;

    switch (devs_gc_tag(obj)) {
    case JACS_GC_TAG_BUFFER:
        attached = &((devs_buffer_t *)obj)->attached;
        break;
    case JACS_GC_TAG_ARRAY:
        attached = &((devs_array_t *)obj)->attached;
        break;
    case JACS_GC_TAG_MAP:
        return obj;
    default:
        JD_ASSERT(0);
        break;
    }

    obj = *attached;

    if (!obj && create) {
        obj = *attached = devs_map_try_alloc(ctx->gc);
        if (obj == NULL)
            devs_runtime_failure(ctx, 60131);
    }

    return obj;
}
