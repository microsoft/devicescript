#include "jacs_internal.h"
#include "jacs_vm_internal.h"

bool jacs_vm_args_ok(jacs_activation_t *frame, uint32_t localidx, uint32_t numargs) {
    if (numargs > 16 || localidx > frame->func->num_locals ||
        localidx + numargs > frame->func->num_locals) {
        jacs_runtime_failure(frame->fiber->ctx, 60113);
        return false;
    }
    return true;
}

bool jacs_vm_args_and_fun_ok(jacs_activation_t *frame, uint32_t localidx, uint32_t numargs,
                                    uint32_t fidx) {
    if (fidx >= jacs_img_num_functions(&frame->fiber->ctx->img)) {
        jacs_runtime_failure(frame->fiber->ctx, 60114);
        return false;
    }
    return jacs_vm_args_ok(frame, localidx, numargs);
}

int32_t jacs_vm_fetch_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
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


uint32_t jacs_vm_exec_expr_u32(jacs_activation_t *frame) {
    // TODO int vs uint?
    // TODO specialize?
    return jacs_value_to_int(jacs_vm_exec_expr(frame));
}

uint32_t jacs_vm_exec_expr_i32(jacs_activation_t *frame) {
    // TODO specialize?
    return jacs_value_to_int(jacs_vm_exec_expr(frame));
}

double jacs_vm_exec_expr_f64(jacs_activation_t *frame) {
    return jacs_value_to_double(jacs_vm_exec_expr(frame));
}

value_t jacs_vm_exec_expr_buffer(jacs_activation_t *frame) {
    value_t tmp = jacs_vm_exec_expr(frame);
    jacs_ctx_t *ctx = frame->fiber->ctx;
    if (!jacs_is_buffer(ctx, tmp)) {
        jacs_runtime_failure(ctx, 60125);
        return jacs_pkt_buffer;
    }
    return tmp;
}

void *jacs_vm_exec_expr_buffer_data(jacs_activation_t *frame, unsigned *sz) {
    value_t tmp = jacs_vm_exec_expr_buffer(frame);
    return jacs_buffer_data(frame->fiber->ctx, tmp, sz);
}

unsigned jacs_vm_exec_expr_stridx(jacs_activation_t *frame) {
    value_t tmp = jacs_vm_exec_expr(frame);
    jacs_ctx_t *ctx = frame->fiber->ctx;
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_IMG_BUFFER) {
        jacs_runtime_failure(ctx, 60127);
        return 0;
    }
    return jacs_handle_value(tmp);
}

unsigned jacs_vm_exec_expr_role(jacs_activation_t *frame) {
    value_t tmp = jacs_vm_exec_expr(frame);
    jacs_ctx_t *ctx = frame->fiber->ctx;
    if (jacs_handle_type(tmp) != JACS_HANDLE_TYPE_ROLE) {
        jacs_runtime_failure(ctx, 60126);
        return 0;
    }
    return jacs_handle_value(tmp);
}

jacs_map_t *jacs_vm_exec_expr_map(jacs_activation_t *frame, bool create) {
    value_t tmp = jacs_vm_exec_expr(frame);
    jacs_ctx_t *ctx = frame->fiber->ctx;
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
