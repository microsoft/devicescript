#include "devs_internal.h"
#include "devs_vm_internal.h"

#include <limits.h>
#include <math.h>

static void stmt1_return(devs_activation_t *frame, devs_ctx_t *ctx) {
    devs_fiber_t *f = ctx->curr_fiber;
    f->ret_val = devs_vm_pop_arg(ctx);
    devs_fiber_return_from_call(f, frame);
}

static void stmt0_debugger(devs_activation_t *frame, devs_ctx_t *ctx) {
    // no-op for now
}

static void set_alloc(devs_activation_t *frame, devs_ctx_t *ctx, void *p, unsigned sz) {
    if (p == NULL)
        devs_oom(ctx, sz);
    ctx->curr_fiber->ret_val = devs_value_from_gc_obj(ctx, p);
}

static void stmt0_alloc_map(devs_activation_t *frame, devs_ctx_t *ctx) {
    set_alloc(frame, ctx,
              devs_map_try_alloc(
                  ctx, devs_object_get_built_in(ctx, DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE)),
              sizeof(devs_map_t));
}

static void stmt1_alloc_array(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t sz = devs_vm_pop_arg_u32(ctx);
    set_alloc(frame, ctx, devs_array_try_alloc(ctx, sz),
              sizeof(devs_array_t) + sz * sizeof(value_t));
}

static void stmt1_alloc_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t sz = devs_vm_pop_arg_u32(ctx);
    devs_buffer_t *obj = devs_buffer_try_alloc(ctx, sz);
    // DMESG("buf=%p %p", obj, (void*)obj->gc.header);
    set_alloc(frame, ctx, obj, sizeof(devs_buffer_t) + sz);
}

static void stmt3_index_set(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    value_t idx = devs_vm_pop_arg(ctx);
    value_t obj = devs_vm_pop_arg(ctx);
    devs_any_set(ctx, obj, idx, v);
}

static void stmt2_index_delete(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t idx = devs_vm_pop_arg(ctx);
    value_t obj = devs_vm_pop_arg(ctx);
    ctx->curr_fiber->ret_val = devs_false;
    ctx->diag_field = idx;
    devs_map_t *map = devs_object_get_attached_rw(ctx, obj);
    if (!map)
        return;

    bool str = devs_is_string(ctx, idx);
    if (!str) {
        idx = devs_value_to_string(ctx, idx);
        devs_value_pin(ctx, idx);
    }

    if (devs_map_delete(ctx, map, idx) == 0)
        ctx->curr_fiber->ret_val = devs_true;

    if (!str)
        devs_value_unpin(ctx, idx);
}

static void stmt1_panic(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t code = devs_vm_pop_arg_u32(ctx);
    devs_panic(ctx, code);
}

static void stmt_callN(devs_activation_t *frame, devs_ctx_t *ctx, unsigned N) {
    JD_ASSERT(ctx->stack_top == N + 1);
    ctx->stack_top = 0;
#if 0
    devs_log_value(ctx, "fn", ctx->the_stack[0]);
    devs_log_value(ctx, "a0", ctx->the_stack[1]);
#endif
    devs_fiber_call_function(ctx->curr_fiber, N);
}

#define STMT_CALL(n, k)                                                                            \
    static void n(devs_activation_t *frame, devs_ctx_t *ctx) { stmt_callN(frame, ctx, k); }

STMT_CALL(stmt1_call0, 0)
STMT_CALL(stmt2_call1, 1)
STMT_CALL(stmt3_call2, 2)
STMT_CALL(stmt4_call3, 3)
STMT_CALL(stmt5_call4, 4)
STMT_CALL(stmt6_call5, 5)
STMT_CALL(stmt7_call6, 6)
STMT_CALL(stmt8_call7, 7)
STMT_CALL(stmt9_call8, 8)

static void stmt2_call_array(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t args = devs_vm_pop_arg(ctx);
    value_t fn = devs_vm_pop_arg(ctx);
    if (!devs_is_array(ctx, args))
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ARRAY, args);
    else {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, args);
        unsigned N = arr->length;
        if (N > DEVS_MAX_STACK_DEPTH - 1) {
            devs_throw_not_supported_error(ctx, "large parameters array");
        } else {
            ctx->stack_top_for_gc = N + 1;
            ctx->the_stack[0] = fn;
            memcpy(ctx->the_stack + 1, arr->data, N * sizeof(value_t));
            devs_fiber_call_function(ctx->curr_fiber, N);
        }
    }
}
static int get_pc(devs_activation_t *frame, devs_ctx_t *ctx) {
    int32_t off = ctx->literal_int;
    int pc = ctx->jmp_pc + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        return pc;
    } else {
        devs_runtime_failure(ctx, 60105);
        return 0;
    }
}

static void stmtx_jmp(devs_activation_t *frame, devs_ctx_t *ctx) {
    int pc = get_pc(frame, ctx);
    if (pc)
        frame->pc = pc;
}

static void stmtx1_jmp_z(devs_activation_t *frame, devs_ctx_t *ctx) {
    int cond = devs_value_to_bool(ctx, devs_vm_pop_arg(ctx));
    int pc = get_pc(frame, ctx);
    if (pc && !cond)
        frame->pc = pc;
}

static void stmtx_try(devs_activation_t *frame, devs_ctx_t *ctx) {
    int pc = get_pc(frame, ctx);
    devs_push_tryframe(frame, ctx, pc);
}

static void stmtx_end_try(devs_activation_t *frame, devs_ctx_t *ctx) {
    int pc = get_pc(frame, ctx);
    if (pc)
        frame->pc = pc;
    if (devs_pop_tryframe(frame, ctx) == 0)
        devs_runtime_failure(ctx, 60106);
}

static void stmt0_catch(devs_activation_t *frame, devs_ctx_t *ctx) {
    // no regular execution of catch()
    devs_runtime_failure(ctx, 60107);
}

static void stmt0_finally(devs_activation_t *frame, devs_ctx_t *ctx) {
    // regular execution of finally() clears the exception value
    // and pops the top of the try stack, that has to match the location of the finally()
    int pc = devs_pop_tryframe(frame, ctx);
    if (pc == frame->pc - 1)
        ctx->curr_fiber->ret_val = devs_undefined;
    else
        devs_runtime_failure(ctx, 60109);
}

static void stmt1_throw(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t exn = devs_vm_pop_arg(ctx);
    if (devs_is_null(exn)) {
        devs_throw_type_error(ctx, "throwing null");
    } else {
        devs_throw(ctx, exn, 0);
    }
}

static void stmtx1_throw_jmp(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned lev = devs_vm_pop_arg_i32(ctx);
    if (lev > DEVS_SPECIAL_THROW_JMP_LEVEL_MAX) {
        devs_runtime_failure(ctx, 60110);
        return;
    }
    int pc = get_pc(frame, ctx);
    if (pc) {
        value_t exn = devs_value_encode_throw_jmp_pc(pc, lev);
        devs_throw(ctx, exn, DEVS_THROW_NO_STACK);
    }
}

static void stmt1_re_throw(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t exn = devs_vm_pop_arg(ctx);
    if (devs_is_null(exn)) {
        // no-op
    } else {
        devs_throw(ctx, exn, DEVS_THROW_NO_STACK);
    }
}

static void stmtx1_store_local(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    unsigned off = ctx->literal_int;
    // DMESG("store L%d := %d st=%d", off, devs_value_to_int(v), frame->func->start);
    if (off >= frame->func->num_slots)
        devs_runtime_failure(ctx, 60111);
    else
        frame->slots[off] = v;
}

static value_t *lookup_clo_val(devs_activation_t *frame, devs_ctx_t *ctx) {
    int level = devs_vm_pop_arg_i32(ctx);
    unsigned off = ctx->literal_int;

    if (level <= 0)
        return NULL;

    devs_activation_t *closure = frame;
    while (closure && level-- > 0)
        closure = closure->closure;

    if (closure && off < closure->func->num_slots)
        return &closure->slots[off];

    return NULL;
}

static void stmtx2_store_closure(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    value_t *dst = lookup_clo_val(frame, ctx);
    if (dst == NULL)
        devs_runtime_failure(ctx, 60112);
    else
        *dst = v;
}

static void stmtx1_store_global(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    unsigned off = ctx->literal_int;
    if (off >= ctx->img.header->num_globals)
        devs_runtime_failure(ctx, 60113);
    else
        ctx->globals[off] = v;
}

static void stmt4_store_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t val = devs_vm_pop_arg(ctx);
    uint32_t offset = devs_vm_pop_arg_u32(ctx);
    uint32_t fmt0 = devs_vm_pop_arg_u32(ctx);
    value_t buffer = devs_vm_pop_arg_buffer(ctx, DEVS_BUFFER_RW);
    if (!devs_is_null(buffer))
        devs_buffer_op(ctx, fmt0, offset, buffer, &val);
}

static void stmt1_terminate_fiber(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t h = devs_vm_pop_arg(ctx);
    ctx->curr_fiber->ret_val = devs_undefined;
    if (devs_is_nullish(h))
        return;
    if (devs_handle_type(h) != DEVS_HANDLE_TYPE_FIBER)
        devs_throw_expecting_error_ext(ctx, "fiber", h);
    else {
        devs_fiber_t *fib = devs_fiber_by_tag(ctx, devs_handle_value(h));
        if (fib == NULL)
            return;
        ctx->curr_fiber->ret_val = devs_zero;
        devs_fiber_terminate(fib);
    }
}

static value_t expr_invalid(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_runtime_failure(ctx, 60114);
}

static value_t exprx_load_local(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < frame->func->num_slots)
        return frame->slots[off];
    return devs_runtime_failure(ctx, 60115);
}

static value_t exprx1_load_closure(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t *src = lookup_clo_val(frame, ctx);
    if (src == NULL) {
        devs_runtime_failure(ctx, 60116);
        return devs_undefined;
    } else {
        return *src;
    }
}

static value_t exprx_make_closure(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned fidx = ctx->literal_int;
    if (fidx >= devs_img_num_functions(ctx->img)) {
        devs_runtime_failure(ctx, 60117);
        return devs_undefined;
    } else {
        return devs_make_closure(ctx, frame, fidx);
    }
}

static value_t exprx_load_global(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < ctx->img.header->num_globals)
        return ctx->globals[off];
    return devs_runtime_failure(ctx, 60118);
}

static value_t expr3_load_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t offset = devs_vm_pop_arg_u32(ctx);
    uint32_t fmt0 = devs_vm_pop_arg_u32(ctx);
    value_t buf = devs_vm_pop_arg_buffer(ctx, DEVS_BUFFER_STRING_OK);
    if (devs_is_null(buf))
        return devs_undefined;
    return devs_buffer_op(ctx, fmt0, offset, buf, NULL);
}

static value_t exprx_literal(devs_activation_t *frame, devs_ctx_t *ctx) {
    int32_t v = ctx->literal_int;
    return devs_value_from_int(v);
}

static value_t exprx_literal_f64(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < devs_img_num_floats(ctx->img))
        return devs_img_get_float(ctx->img, off);
    return devs_runtime_failure(ctx, 60119);
}

static value_t expr0_ret_val(devs_activation_t *frame, devs_ctx_t *ctx) {
    return ctx->curr_fiber->ret_val;
}

static value_t expr0_now_ms(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_value_from_double((double)ctx->_now_long);
}

static value_t expr1_get_fiber_handle(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t func = devs_vm_pop_arg(ctx);
    devs_fiber_t *fiber = NULL;

    if (devs_is_nullish(func))
        fiber = ctx->curr_fiber;
    else if (devs_handle_type(func) == DEVS_HANDLE_TYPE_STATIC_FUNCTION)
        fiber = devs_fiber_by_fidx(ctx, devs_handle_value(func));

    if (fiber == NULL)
        return devs_undefined;
    return devs_value_from_handle(DEVS_HANDLE_TYPE_FIBER, fiber->handle_tag);
}

static value_t expr1_new(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t func = devs_vm_pop_arg(ctx);
    value_t th;
    devs_activation_t *clo;

    int fidx = devs_get_fnidx(ctx, func, &th, &clo);
    if (fidx < 0)
        return devs_throw_type_error(ctx, "new unsupported on this expression");

    int bltin = fidx - DEVS_FIRST_BUILTIN_FUNCTION;
    if (bltin >= 0) {
        JD_ASSERT(bltin < devs_num_builtin_functions);
        const devs_builtin_function_t *h = &devs_builtin_functions[bltin];
        if (!(h->flags & DEVS_BUILTIN_FLAG_IS_CTOR))
            return devs_throw_type_error(ctx, "builtin function is not a ctor");
    } else {
        JD_ASSERT(fidx < (int)devs_img_num_functions(ctx->img));
        const devs_function_desc_t *func = devs_img_get_function(ctx->img, fidx);
        if (!(func->flags & DEVS_FUNCTIONFLAG_IS_CTOR))
            return devs_throw_type_error(ctx, "function is not a ctor");
    }

    return func;
    // return devs_function_bind(ctx, devs_new, func);
}

static value_t expr2_bind(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t obj = devs_vm_pop_arg(ctx);
    value_t func = devs_vm_pop_arg(ctx);
    return devs_function_bind(ctx, obj, func);
}

static value_t exprx_static_function(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned fidx = ctx->literal_int;

    if (fidx >= devs_img_num_functions(ctx->img)) {
        devs_runtime_failure(ctx, 60120);
        return devs_undefined;
    } else {
        return devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION, fidx);
    }
}

bool devs_vm_role_ok(devs_ctx_t *ctx, uint32_t a) {
    if (a < devs_img_num_roles(ctx->img))
        return true;
    devs_runtime_failure(ctx, 60121);
    return false;
}

static value_t exprx_static_role(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned idx = ctx->literal_int;
    if (!devs_vm_role_ok(ctx, idx))
        return devs_undefined;
    return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, idx);
}

static value_t exprx_role_proto(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned idx = ctx->literal_int;
    if (!devs_vm_role_ok(ctx, idx))
        return devs_undefined;
    return devs_value_from_gc_obj(ctx, devs_get_role_proto(ctx, idx));
}

static inline int string_index(devs_ctx_t *ctx, unsigned tp) {
    uint32_t v = (tp << DEVS_STRIDX__SHIFT) | ctx->literal_int;
    if (!devs_img_stridx_ok(ctx->img, v))
        return -1;
    return v;
}

static value_t static_something(devs_ctx_t *ctx, unsigned tp) {
    int v = string_index(ctx, tp);
    if (v < 0) {
        devs_runtime_failure(ctx, 60122);
        return devs_undefined;
    }
    return devs_value_from_handle(DEVS_HANDLE_TYPE_IMG_BUFFERISH, v);
}

static inline value_t get_field_ex(devs_ctx_t *ctx, unsigned tp, value_t obj) {
    value_t fld = static_something(ctx, tp);
    if (devs_is_null(fld))
        return devs_undefined;
    else
        return devs_object_get(ctx, obj, fld);
}

static inline value_t get_field(devs_ctx_t *ctx, unsigned tp) {
    return get_field_ex(ctx, tp, devs_vm_pop_arg(ctx));
}

static value_t exprx_static_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    return static_something(ctx, DEVS_STRIDX_BUFFER);
}

static value_t exprx_static_ascii_string(devs_activation_t *frame, devs_ctx_t *ctx) {
    return static_something(ctx, DEVS_STRIDX_ASCII);
}

static value_t exprx_static_utf8_string(devs_activation_t *frame, devs_ctx_t *ctx) {
    return static_something(ctx, DEVS_STRIDX_UTF8);
}

static value_t exprx_static_builtin_string(devs_activation_t *frame, devs_ctx_t *ctx) {
    return static_something(ctx, DEVS_STRIDX_BUILTIN);
}

static value_t exprx1_builtin_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_field(ctx, DEVS_STRIDX_BUILTIN);
}

static value_t exprx1_ascii_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_field(ctx, DEVS_STRIDX_ASCII);
}

static value_t exprx1_utf8_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_field(ctx, DEVS_STRIDX_UTF8);
}

static value_t get_builtin_field(devs_ctx_t *ctx, unsigned obj) {
    value_t fld = static_something(ctx, DEVS_STRIDX_BUILTIN);
    return devs_object_get_no_bind(ctx, devs_object_get_built_in(ctx, obj), fld);
}

static value_t exprx_math_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_builtin_field(ctx, DEVS_BUILTIN_OBJECT_MATH);
}

static value_t exprx_object_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_builtin_field(ctx, DEVS_BUILTIN_OBJECT_OBJECT);
}

static value_t exprx_ds_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_builtin_field(ctx, DEVS_BUILTIN_OBJECT_DEVICESCRIPT);
}

static value_t exprx_builtin_object(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_builtin_object_value(ctx, ctx->literal_int);
}

static value_t expr2_index(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t idx = devs_vm_pop_arg(ctx);
    value_t arr = devs_vm_pop_arg(ctx);
    return devs_any_get(ctx, arr, idx);
}

static value_t expr1_typeof(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t obj = devs_vm_pop_arg(ctx);
    return devs_value_from_int(devs_value_typeof(ctx, obj));
}

static const uint8_t typeof_map[] = {
    // typeof null is not JS-compliant, but makes much more sense
    [DEVS_OBJECT_TYPE_NULL] = DEVS_BUILTIN_STRING_NULL,
    [DEVS_OBJECT_TYPE_NUMBER] = DEVS_BUILTIN_STRING_NUMBER,
    [DEVS_OBJECT_TYPE_MAP] = DEVS_BUILTIN_STRING_OBJECT,
    [DEVS_OBJECT_TYPE_ARRAY] = DEVS_BUILTIN_STRING_OBJECT,
    [DEVS_OBJECT_TYPE_BUFFER] = DEVS_BUILTIN_STRING_OBJECT,
    [DEVS_OBJECT_TYPE_ROLE] = DEVS_BUILTIN_STRING_OBJECT,
    [DEVS_OBJECT_TYPE_BOOL] = DEVS_BUILTIN_STRING_BOOLEAN,
    [DEVS_OBJECT_TYPE_FIBER] = DEVS_BUILTIN_STRING_OBJECT,
    [DEVS_OBJECT_TYPE_FUNCTION] = DEVS_BUILTIN_STRING_FUNCTION,
    [DEVS_OBJECT_TYPE_STRING] = DEVS_BUILTIN_STRING_STRING,
    [DEVS_OBJECT_TYPE_PACKET] = DEVS_BUILTIN_STRING_OBJECT,
    [DEVS_OBJECT_TYPE_EXOTIC] = DEVS_BUILTIN_STRING_OBJECT,
};

static value_t expr1_typeof_str(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t obj = devs_vm_pop_arg(ctx);
    unsigned idx = devs_value_typeof(ctx, obj);
    if (idx < sizeof(typeof_map))
        idx = typeof_map[idx];
    else
        idx = 0;
    if (idx == 0)
        return devs_undefined;
    else {
        ctx->literal_int = idx;
        return static_something(ctx, DEVS_STRIDX_BUILTIN);
    }
}

static value_t expr0_null(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_null;
}

static value_t expr1_is_null(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t obj = devs_vm_pop_arg(ctx);
    if (devs_is_null(obj))
        return devs_true;
    else
        return devs_false;
}

static value_t expr2_instance_of(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t cls = devs_vm_pop_arg(ctx);
    value_t obj = devs_vm_pop_arg(ctx);
    return devs_value_from_bool(devs_instance_of(ctx, obj, devs_get_prototype_field(ctx, cls)));
}

static value_t expr0_true(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_true;
}

static value_t expr0_false(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_false;
}

//
// Math stuff
//
static value_t expr0_nan(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_nan;
}

static value_t expr0_inf(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_inf;
}

static value_t expr1_abs(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    if (!devs_is_tagged_int(v)) {
        double f = devs_value_to_double(ctx, v);
        return f < 0 ? devs_value_from_double(-f) : v;
    }
    int q = v.val_int32;
    if (q < 0) {
        if (q == INT_MIN)
            return devs_max_int_1;
        else
            return devs_value_from_int(-q);
    } else
        return v;
}

static value_t expr1_bit_not(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_value_from_int(~devs_vm_pop_arg_i32(ctx));
}

static value_t expr1_to_int(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_value_from_int(devs_vm_pop_arg_i32(ctx));
}

static value_t expr1_is_nan(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    return devs_value_from_bool(devs_is_nan(v));
}

static value_t expr1_neg(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    if (!devs_is_tagged_int(v))
        return devs_value_from_double(-devs_value_to_double(ctx, v));
    if (v.val_int32 == INT_MIN)
        return devs_max_int_1;
    else
        return devs_value_from_int(-v.val_int32);
}

static value_t expr1_uplus(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    if (devs_is_number(v) || devs_is_nan(v))
        return v;
    return devs_value_from_double(devs_value_to_double(ctx, v));
}

static value_t expr1_not(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    return devs_value_from_bool(!devs_value_to_bool(ctx, v));
}

static value_t expr1_to_bool(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    return devs_value_from_bool(devs_value_to_bool(ctx, v));
}

static int exec2_and_check_int(devs_activation_t *frame, devs_ctx_t *ctx) {
    ctx->binop[1] = devs_vm_pop_arg(ctx);
    ctx->binop[0] = devs_vm_pop_arg(ctx);
    return devs_is_tagged_int(ctx->binop[0]) && devs_is_tagged_int(ctx->binop[1]);
}

#define aa ctx->binop[0].val_int32
#define bb ctx->binop[1].val_int32

#define af ctx->binop_f[0]
#define bf ctx->binop_f[1]

static bool either_is_string(devs_ctx_t *ctx) {
    return devs_is_string(ctx, ctx->binop[0]) || devs_is_string(ctx, ctx->binop[1]);
}

static void force_double(devs_ctx_t *ctx) {
    af = devs_value_to_double(ctx, ctx->binop[0]);
    bf = devs_value_to_double(ctx, ctx->binop[1]);
}

static void exec2_and_force_int(devs_activation_t *frame, devs_ctx_t *ctx) {
    bb = devs_vm_pop_arg_i32(ctx);
    aa = devs_vm_pop_arg_i32(ctx);
}

static int exec2_and_check_int_or_force_double(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx))
        return 1;
    force_double(ctx);
    return 0;
}

static value_t expr2_add(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        if (!__builtin_sadd_overflow(aa, bb, &r))
            return devs_value_from_int(r);
    }
    if (either_is_string(ctx))
        return devs_string_concat(ctx, ctx->binop[0], ctx->binop[1]);
    force_double(ctx);
    return devs_value_from_double(af + bf);
}

static value_t expr2_sub(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        if (!__builtin_ssub_overflow(aa, bb, &r))
            return devs_value_from_int(r);
    }
    force_double(ctx);
    return devs_value_from_double(af - bf);
}

static value_t expr2_mul(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        if (!__builtin_smul_overflow(aa, bb, &r))
            return devs_value_from_int(r);
    }
    force_double(ctx);
    return devs_value_from_double(af * bf);
}

static value_t expr2_div(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        // not sure this is worth it on M0+; it definitely is on M4
        if (bb != 0 && (bb != -1 || aa != INT_MIN) && ((r = aa / bb)) * bb == aa)
            return devs_value_from_int(r);
    }
    force_double(ctx);
    return devs_value_from_double(af / bf);
}

static value_t expr2_bit_and(devs_activation_t *frame, devs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return devs_value_from_int(aa & bb);
}

static value_t expr2_bit_or(devs_activation_t *frame, devs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return devs_value_from_int(aa | bb);
}

static value_t expr2_bit_xor(devs_activation_t *frame, devs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return devs_value_from_int(aa ^ bb);
}

static value_t expr2_shift_left(devs_activation_t *frame, devs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return devs_value_from_int(aa << (31 & bb));
}

static value_t expr2_shift_right(devs_activation_t *frame, devs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return devs_value_from_int(aa >> (31 & bb));
}

static value_t expr2_shift_right_unsigned(devs_activation_t *frame, devs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    uint32_t tmp = (uint32_t)aa >> (31 & bb);
    if (tmp >> 31)
        return devs_value_from_double(tmp);
    else
        return devs_value_from_int(tmp);
}

static value_t expr2_eq(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx))
        return devs_value_from_bool(aa == bb);
    return devs_value_from_bool(devs_value_ieee_eq(ctx, ctx->binop[0], ctx->binop[1]));
}

static value_t expr2_ne(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx))
        return devs_value_from_bool(aa != bb);
    return devs_value_from_bool(!devs_value_ieee_eq(ctx, ctx->binop[0], ctx->binop[1]));
}

static value_t expr2_le(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int_or_force_double(frame, ctx))
        return devs_value_from_bool(aa <= bb);
    return devs_value_from_bool(af <= bf);
}

static value_t expr2_lt(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (exec2_and_check_int_or_force_double(frame, ctx))
        return devs_value_from_bool(aa < bb);
    return devs_value_from_bool(af < bf);
}

const void *devs_vm_op_handlers[DEVS_OP_PAST_LAST + 1] = {DEVS_OP_HANDLERS};
