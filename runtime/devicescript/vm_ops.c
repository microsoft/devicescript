#include "devs_internal.h"
#include "devs_vm_internal.h"

#include <limits.h>
#include <math.h>

static bool devs_vm_args_ok(devs_activation_t *frame, uint32_t localidx, uint32_t numargs) {
    if (frame->fiber->ctx->error_code)
        return false;

    if (numargs > 16 || localidx > frame->func->num_locals ||
        localidx + numargs > frame->func->num_locals) {
        devs_runtime_failure(frame->fiber->ctx, 60113);
        return false;
    }
    return true;
}

static void stmt1_wait_role(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t a = devs_vm_pop_arg_role(ctx);
    frame->fiber->role_idx = a;
    devs_fiber_set_wake_time(frame->fiber, 0);
    devs_fiber_yield(ctx);
}

static void stmt2_send_cmd(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t b = devs_vm_pop_arg_u32(ctx);
    uint32_t a = devs_vm_pop_arg_role(ctx);
    devs_jd_send_cmd(ctx, a, b);
}

static void stmt3_query_reg(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t timeout = devs_vm_pop_arg_u32(ctx);
    uint32_t b = devs_vm_pop_arg_u32(ctx);
    uint32_t a = devs_vm_pop_arg_role(ctx);
    devs_jd_get_register(ctx, a, JD_GET(b), timeout, 0);
}

static void stmt4_query_idx_reg(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned stridx = devs_vm_pop_arg_stridx(ctx);
    uint32_t timeout = devs_vm_pop_arg_u32(ctx);
    uint32_t b = devs_vm_pop_arg_u32(ctx);
    uint32_t a = devs_vm_pop_arg_role(ctx);
    devs_jd_get_register(ctx, a, b, timeout, stridx);
}

static void stmtx2_log_format(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t stridx = devs_vm_pop_arg_stridx(ctx);
    uint32_t numargs = devs_vm_pop_arg_u32(ctx);
    uint32_t localidx = ctx->literal_int;
    if (devs_vm_args_ok(frame, localidx, numargs))
        devs_jd_send_logmsg(ctx, stridx, localidx, numargs);
}

static void stmt1_return(devs_activation_t *frame, devs_ctx_t *ctx) {
    frame->fiber->ret_val = devs_vm_pop_arg(ctx);
    devs_fiber_return_from_call(frame);
}

static void set_alloc(devs_activation_t *frame, devs_ctx_t *ctx, void *p, unsigned sz) {
    if (p == NULL)
        devs_oom(ctx, sz);
    frame->fiber->ret_val = devs_value_from_gc_obj(ctx, p);
}

static void stmt0_alloc_map(devs_activation_t *frame, devs_ctx_t *ctx) {
    set_alloc(frame, ctx, devs_map_try_alloc(ctx), sizeof(devs_map_t));
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

static void stmt3_array_insert(devs_activation_t *frame, devs_ctx_t *ctx) {
    int32_t count = devs_vm_pop_arg_i32(ctx);
    uint32_t idx = devs_vm_pop_arg_u32(ctx);
    value_t seq = devs_vm_pop_arg(ctx);

    devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
    if (devs_gc_tag(arr) == DEVS_GC_TAG_ARRAY) {
        if (devs_array_insert(ctx, arr, idx, count))
            devs_runtime_failure(ctx, 60138);
    } else {
        devs_runtime_failure(ctx, 60139);
    }
}

static void stmt1_setup_pkt_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t a = devs_vm_pop_arg_u32(ctx);
    if (a > JD_SERIAL_PAYLOAD_SIZE) {
        devs_runtime_failure(ctx, 60115);
    } else {
        ctx->packet.service_size = a;
        memset(ctx->packet.data, 0, a);
    }
}

static void stmt2_set_pkt(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned slen;
    uint32_t offset = devs_vm_pop_arg_u32(ctx);
    void *src = devs_vm_pop_arg_buffer_data(ctx, &slen, DEVS_BUFFER_STRING_OK);

    int len = ctx->packet.service_size - offset;
    if (len > 0) {
        if (slen < (unsigned)len)
            len = slen;
        memcpy(ctx->packet.data + offset, src, len);
    }
}

static void stmt1_panic(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t code = devs_vm_pop_arg_u32(ctx);
    devs_panic(ctx, code);
}

static int args_to_stack(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t fn = devs_vm_pop_arg(ctx);
    uint32_t numargs = devs_vm_pop_arg_u32(ctx);
    uint32_t localidx = ctx->literal_int;

    if (devs_vm_args_ok(frame, localidx, numargs)) {
        JD_ASSERT(ctx->stack_top == 0);
        if (numargs + 2 >= DEVS_MAX_STACK_DEPTH)
            devs_runtime_failure(ctx, 60162);
        ctx->stack_top_for_gc = numargs + 1;
        ctx->the_stack[0] = fn;
        memcpy(ctx->the_stack + 1, devs_frame_locals(frame) + localidx, numargs * sizeof(value_t));
        return numargs;
    }

    return -1;
}

static void stmtx2_call(devs_activation_t *frame, devs_ctx_t *ctx) {
    int numargs = args_to_stack(frame, ctx);
    if (numargs >= 0)
        devs_fiber_call_function(frame->fiber, numargs);
}

static void stmt_callN(devs_activation_t *frame, devs_ctx_t *ctx, unsigned N) {
    JD_ASSERT(ctx->stack_top == N + 1);
    ctx->stack_top = 0;
    devs_fiber_call_function(frame->fiber, N);
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

static void stmtx3_call_bg(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t flag = devs_vm_pop_arg_u32(ctx);
    int numargs = args_to_stack(frame, ctx);
    if (flag == 0 || flag > DEVS_OPCALL_BG_MAX1_REPLACE)
        devs_runtime_failure(ctx, 60137);
    else if (numargs >= 0) {
        devs_fiber_t *fib = devs_fiber_start(ctx, numargs, flag);
        if (fib)
            frame->fiber->ret_val = devs_value_from_handle(DEVS_HANDLE_TYPE_FIBER, fib->handle_tag);
    }
}

static void stmtx_jmp(devs_activation_t *frame, devs_ctx_t *ctx) {
    int32_t off = ctx->literal_int;
    int pc = ctx->jmp_pc + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        frame->pc = pc;
    } else {
        devs_runtime_failure(ctx, 60116);
    }
}

static void stmtx1_jmp_z(devs_activation_t *frame, devs_ctx_t *ctx) {
    int cond = devs_value_to_bool(devs_vm_pop_arg(ctx));
    int32_t off = ctx->literal_int;
    int pc = ctx->jmp_pc + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        if (!cond)
            frame->pc = pc;
    } else {
        devs_runtime_failure(ctx, 60117);
    }
}

static void stmtx1_store_local(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    unsigned off = ctx->literal_int;
    // DMESG("store L%d := %d st=%d", off, devs_value_to_int(v), frame->func->start);
    if (off >= frame->func->num_locals)
        devs_runtime_failure(ctx, 60118);
    else
        devs_frame_locals(frame)[off] = v;
}

static void stmtx1_store_param(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    unsigned off = ctx->literal_int;
    if (off >= frame->func->num_args)
        devs_runtime_failure(ctx, 60119);
    else
        devs_frame_params(frame)[off] = v;
}

static void stmtx1_store_global(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    unsigned off = ctx->literal_int;
    if (off >= ctx->img.header->num_globals)
        devs_runtime_failure(ctx, 60120);
    else
        ctx->globals[off] = v;
}

static void stmt4_store_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t val = devs_vm_pop_arg(ctx);
    uint32_t offset = devs_vm_pop_arg_u32(ctx);
    uint32_t fmt0 = devs_vm_pop_arg_u32(ctx);
    value_t buffer = devs_vm_pop_arg_buffer(ctx, DEVS_BUFFER_RW);
    devs_buffer_op(frame, fmt0, offset, buffer, &val);
}

static void stmt1_terminate_fiber(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t h = devs_vm_pop_arg(ctx);
    frame->fiber->ret_val = devs_undefined;
    if (devs_is_nullish(h))
        return;
    if (devs_handle_type(h) != DEVS_HANDLE_TYPE_FIBER)
        devs_runtime_failure(ctx, 60123);
    else {
        devs_fiber_t *fib = devs_fiber_by_tag(ctx, devs_handle_value(h));
        if (fib == NULL)
            return;
        frame->fiber->ret_val = devs_zero;
        devs_fiber_termiante(fib);
    }
}

static value_t expr_invalid(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_runtime_failure(ctx, 60104);
}

static value_t expr2_str0eq(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned len;
    uint32_t offset = devs_vm_pop_arg_u32(ctx);
    uint8_t *data = devs_vm_pop_arg_buffer_data(ctx, &len, DEVS_BUFFER_STRING_OK);

    return devs_value_from_bool(ctx->packet.service_size >= offset + len + 1 &&
                                ctx->packet.data[offset + len] == 0 &&
                                memcmp(ctx->packet.data + offset, data, len) == 0);
}

static value_t exprx_load_local(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < frame->func->num_locals)
        return devs_frame_locals(frame)[off];
    return devs_runtime_failure(ctx, 60105);
}

static value_t exprx_load_param(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < frame->func->num_args)
        return devs_frame_params(frame)[off];
    // no failure here - allow for var-args in future?
    return devs_undefined;
}

static value_t exprx_load_global(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < ctx->img.header->num_globals)
        return ctx->globals[off];
    return devs_runtime_failure(ctx, 60106);
}

static value_t expr3_load_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t offset = devs_vm_pop_arg_u32(ctx);
    uint32_t fmt0 = devs_vm_pop_arg_u32(ctx);
    value_t buf = devs_vm_pop_arg_buffer(ctx, DEVS_BUFFER_STRING_OK);
    return devs_buffer_op(frame, fmt0, offset, buf, NULL);
}

static value_t exprx_literal(devs_activation_t *frame, devs_ctx_t *ctx) {
    int32_t v = ctx->literal_int;
    return devs_value_from_int(v);
}

static value_t exprx_literal_f64(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned off = ctx->literal_int;
    if (off < devs_img_num_floats(ctx->img))
        return devs_img_get_float(ctx->img, off);
    return devs_runtime_failure(ctx, 60107);
}

static value_t exprx2_format(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned len;
    const char *fmt = devs_vm_pop_arg_string_data(ctx, &len);
    uint32_t numargs = devs_vm_pop_arg_u32(ctx);
    uint32_t localidx = ctx->literal_int;

    if (!devs_vm_args_ok(frame, localidx, numargs))
        return devs_undefined;

    char tmp[64];
    unsigned sz = devs_strformat(ctx, fmt, len, tmp, sizeof(tmp),
                                 devs_frame_locals(frame) + localidx, numargs, 0);
    devs_string_t *str = devs_string_try_alloc(ctx, sz - 1);
    if (str == NULL) {
        devs_runtime_failure(ctx, 60146);
        return devs_undefined;
    }
    if (sz > sizeof(tmp))
        devs_strformat(ctx, fmt, len, str->data, sz, devs_frame_locals(frame) + localidx, numargs,
                       0);
    else
        memcpy(str->data, tmp, sz - 1);
    return devs_value_from_gc_obj(ctx, str);
}

static value_t expr0_ret_val(devs_activation_t *frame, devs_ctx_t *ctx) {
    return frame->fiber->ret_val;
}

static value_t expr0_pkt_size(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_value_from_int(ctx->packet.service_size);
}

static value_t expr0_pkt_ev_code(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (jd_is_event(&ctx->packet))
        return devs_value_from_int(ctx->packet.service_command & JD_CMD_EVENT_CODE_MASK);
    else
        return devs_undefined;
}

static value_t expr0_pkt_reg_get_code(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (jd_is_report(&ctx->packet) && jd_is_register_get(&ctx->packet))
        return devs_value_from_int(JD_REG_CODE(ctx->packet.service_command));
    else
        return devs_undefined;
}

static value_t expr0_pkt_command_code(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (jd_is_command(&ctx->packet))
        return devs_value_from_int(ctx->packet.service_command);
    else
        return devs_undefined;
}

static value_t expr0_pkt_report_code(devs_activation_t *frame, devs_ctx_t *ctx) {
    if (jd_is_report(&ctx->packet))
        return devs_value_from_int(ctx->packet.service_command);
    else
        return devs_undefined;
}

static value_t expr0_now_ms(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_value_from_double((double)ctx->_now_long);
}

static value_t expr1_get_fiber_handle(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t func = devs_vm_pop_arg(ctx);
    devs_fiber_t *fiber = NULL;

    if (devs_is_nullish(func))
        fiber = frame->fiber;
    else if (devs_handle_type(func) == DEVS_HANDLE_TYPE_STATIC_FUNCTION)
        fiber = devs_fiber_by_fidx(ctx, devs_handle_value(func));

    if (fiber == NULL)
        return devs_undefined;
    return devs_value_from_handle(DEVS_HANDLE_TYPE_FIBER, fiber->handle_tag);
}

static value_t exprx_static_function(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned fidx = ctx->literal_int;

    if (fidx >= devs_img_num_functions(ctx->img)) {
        devs_runtime_failure(ctx, 60114);
        return devs_undefined;
    } else {
        return devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION, fidx);
    }
}

static bool devs_vm_role_ok(devs_ctx_t *ctx, uint32_t a) {
    if (a < devs_img_num_roles(ctx->img))
        return true;
    devs_runtime_failure(ctx, 60111);
    return false;
}

static value_t exprx_static_role(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned idx = ctx->literal_int;
    if (!devs_vm_role_ok(ctx, idx))
        return devs_undefined;
    return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, idx);
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
        devs_runtime_failure(ctx, 60112);
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

static value_t exprx_ds_field(devs_activation_t *frame, devs_ctx_t *ctx) {
    return get_builtin_field(ctx, DEVS_BUILTIN_OBJECT_DEVICESCRIPT);
}

static value_t exprx_builtin_object(devs_activation_t *frame, devs_ctx_t *ctx) {
    uint32_t idx = ctx->literal_int;

    if (idx > DEVS_BUILTIN_OBJECT___MAX)
        return devs_undefined;

    const devs_map_or_proto_t *p = devs_object_get_built_in(ctx, idx);
    if (devs_is_map(p))
        return devs_value_from_gc_obj(ctx, (void *)p);
    else
        return devs_value_from_handle(DEVS_HANDLE_TYPE_SPECIAL,
                                      DEVS_SPECIAL_BUILTIN_OBJ_FIRST + idx);
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

static value_t expr0_null(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_null;
}

static value_t expr0_pkt_buffer(devs_activation_t *frame, devs_ctx_t *ctx) {
    return devs_pkt_buffer;
}

static value_t expr1_is_null(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t obj = devs_vm_pop_arg(ctx);
    if (devs_is_null(obj))
        return devs_true;
    else
        return devs_false;
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

static value_t expr1_abs(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    if (!devs_is_tagged_int(v)) {
        double f = devs_value_to_double(v);
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
        return devs_value_from_double(-devs_value_to_double(v));
    if (v.val_int32 == INT_MIN)
        return devs_max_int_1;
    else
        return devs_value_from_int(-v.val_int32);
}

static value_t expr1_not(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    return devs_value_from_bool(!devs_value_to_bool(v));
}

static value_t expr1_to_bool(devs_activation_t *frame, devs_ctx_t *ctx) {
    value_t v = devs_vm_pop_arg(ctx);
    return devs_value_from_bool(devs_value_to_bool(v));
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
    af = devs_value_to_double(ctx->binop[0]);
    bf = devs_value_to_double(ctx->binop[1]);
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
