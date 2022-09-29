#include "jacs_internal.h"
#include "jacs_vm_internal.h"

typedef void (*jacs_vm_stmt_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);

static void stmt1_wait_role(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_role(frame);
    frame->fiber->role_idx = a;
    jacs_fiber_set_wake_time(frame->fiber, 0);
    jacs_fiber_yield(ctx);
}

static void stmt1_sleep_s(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int time = (int)(jacs_vm_exec_expr_f64(frame) * 1000.0 + 0.5);
    if (time >= 0)
        jacs_fiber_sleep(frame->fiber, time);
}

static void stmt1_sleep_ms(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int time = jacs_vm_exec_expr_i32(frame);
    if (time >= 0)
        jacs_fiber_sleep(frame->fiber, time);
}

static void stmt2_send_cmd(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_role(frame);
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    jacs_jd_send_cmd(ctx, a, b);
}

static void stmt3_query_reg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_role(frame);
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    uint32_t timeout = jacs_vm_exec_expr_u32(frame);
    jacs_jd_get_register(ctx, a, JD_GET(b), timeout, 0);
}

static void stmt4_query_idx_reg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_role(frame);
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    uint32_t timeout = jacs_vm_exec_expr_u32(frame);
    unsigned stridx = jacs_vm_exec_expr_stridx(frame);
    jacs_jd_get_register(ctx, a, b, timeout, stridx);
}

static void stmt3_log_format(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = jacs_vm_exec_expr_stridx(frame);
    uint32_t localidx = jacs_vm_exec_expr_u32(frame);
    uint32_t numargs = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_args_ok(frame, localidx, numargs))
        jacs_jd_send_logmsg(ctx, stridx, localidx, numargs);
}

static void stmt4_format(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned len;
    char *fmt = jacs_vm_exec_expr_buffer_data(frame, &len);
    uint32_t localidx = jacs_vm_exec_expr_u32(frame);
    uint32_t numargs = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);

    if (offset > JD_SERIAL_PAYLOAD_SIZE)
        return;

    if (jacs_vm_args_ok(frame, localidx, numargs))
        ctx->packet.service_size =
            offset + jacs_strformat(fmt, len, (char *)ctx->packet.data + offset,
                                    JD_SERIAL_PAYLOAD_SIZE - offset, frame->locals + localidx,
                                    numargs, 0);
}

static void stmt1_return(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    frame->fiber->ret_val = jacs_vm_exec_expr(frame);
    jacs_fiber_return_from_call(frame);
}

static void set_alloc(jacs_activation_t *frame, jacs_ctx_t *ctx, void *p, unsigned sz) {
    if (p == NULL)
        jacs_oom(ctx, sz);
    frame->fiber->ret_val = jacs_value_from_gc_obj(ctx, p);
}

static void stmt0_alloc_map(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    set_alloc(frame, ctx, jacs_map_try_alloc(ctx->gc), sizeof(jacs_map_t));
}

static void stmt1_alloc_array(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t sz = jacs_vm_exec_expr_u32(frame);
    set_alloc(frame, ctx, jacs_array_try_alloc(ctx->gc, sz),
              sizeof(jacs_array_t) + sz * sizeof(value_t));
}

static void stmt1_alloc_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t sz = jacs_vm_exec_expr_u32(frame);
    set_alloc(frame, ctx, jacs_buffer_try_alloc(ctx->gc, sz), sizeof(jacs_buffer_t) + sz);
}

static void stmtx2_set_field(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned idx = jacs_vm_fetch_int(frame, ctx);
    jacs_map_t *map = jacs_vm_exec_expr_map(frame, true);
    value_t v = jacs_vm_exec_expr(frame);
    if (map != NULL)
        jacs_map_set(ctx, map, idx, v);
}

static void stmt3_array_set(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t arr = jacs_vm_exec_expr(frame);
    uint32_t idx = jacs_vm_exec_expr_u32(frame);
    value_t v = jacs_vm_exec_expr(frame);

    if (jacs_index_set(ctx, arr, idx, v))
        jacs_runtime_failure(ctx, 60133);
}

static void stmt3_array_insert(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    TODO();
}

static void stmt1_setup_pkt_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_u32(frame);
    if (a > JD_SERIAL_PAYLOAD_SIZE) {
        jacs_runtime_failure(ctx, 60115);
    } else {
        ctx->packet.service_size = a;
        memset(ctx->packet.data, 0, a);
    }
}

static void stmt2_set_pkt(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned slen;
    void *src = jacs_vm_exec_expr_buffer_data(frame, &slen);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);

    int len = ctx->packet.service_size - offset;
    if (len > 0) {
        if (slen < (unsigned)len)
            len = slen;
        memcpy(ctx->packet.data + offset, src, len);
    }
}

static void stmt5_blit(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned dlen;
    uint8_t *dst = jacs_vm_exec_expr_buffer_data(frame, &dlen);
    uint32_t dst_offset = jacs_vm_exec_expr_u32(frame);
    unsigned slen;
    uint8_t *src = jacs_vm_exec_expr_buffer_data(frame, &slen);
    uint32_t src_offset = jacs_vm_exec_expr_u32(frame);
    uint32_t len = jacs_vm_exec_expr_u32(frame);

    if (src_offset >= slen)
        return;
    slen -= src_offset;
    if (slen < len)
        len = slen;

    if (dst_offset >= dlen)
        return;
    dlen -= dst_offset;
    if (dlen < len)
        len = dlen;

    memcpy(dst + dst_offset, src + src_offset, len);
}

static void stmt1_panic(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t code = jacs_vm_exec_expr_u32(frame);
    jacs_panic(ctx, code);
}

static void stmt3_call(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fidx = jacs_vm_exec_expr_u32(frame);
    uint32_t localidx = jacs_vm_exec_expr_u32(frame);
    uint32_t numargs = jacs_vm_exec_expr_u32(frame);

    if (jacs_vm_args_and_fun_ok(frame, localidx, numargs, fidx))
        jacs_fiber_call_function(frame->fiber, fidx, frame->locals + localidx, numargs);
}

static void stmt4_call_bg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fidx = jacs_vm_exec_expr_u32(frame);
    uint32_t localidx = jacs_vm_exec_expr_u32(frame);
    uint32_t numargs = jacs_vm_exec_expr_u32(frame);
    uint32_t flag = jacs_vm_exec_expr_u32(frame);

    if (jacs_vm_args_and_fun_ok(frame, localidx, numargs, fidx)) {
        jacs_fiber_t *fib = jacs_fiber_start(ctx, fidx, frame->locals + localidx, numargs, flag);
        frame->fiber->ret_val = jacs_value_from_handle(JACS_HANDLE_TYPE_FIBER, fib->handle_tag);
    }
}

static void stmtx_jmp(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int pc0 = frame->pc - 1;
    int32_t off = jacs_vm_fetch_int(frame, ctx);
    int pc = pc0 + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        frame->pc = pc;
    } else {
        jacs_runtime_failure(ctx, 60116);
    }
}

static void stmtx1_jmp_z(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int pc0 = frame->pc - 1;
    int32_t off = jacs_vm_fetch_int(frame, ctx);
    int cond = jacs_value_to_bool(jacs_vm_exec_expr(frame));
    int pc = pc0 + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        if (!cond)
            frame->pc = pc;
    } else {
        jacs_runtime_failure(ctx, 60117);
    }
}

static void stmtx1_store_local(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    value_t v = jacs_vm_exec_expr(frame);
    if (off >= frame->func->num_locals)
        jacs_runtime_failure(ctx, 60118);
    else
        frame->locals[off] = v;
}

static void stmtx1_store_param(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    value_t v = jacs_vm_exec_expr(frame);
    if (off >= frame->func->num_args)
        jacs_runtime_failure(ctx, 60119);
    else {
        if (off >= frame->num_params) {
            JD_ASSERT(!frame->params_is_copy);
            value_t *tmp = jacs_try_alloc(ctx, sizeof(value_t) * frame->func->num_args);
            memcpy(tmp, frame->params, sizeof(value_t) * frame->num_params);
            frame->num_params = frame->func->num_args;
            frame->params = tmp;
            frame->params_is_copy = 1;
        }
        frame->params[off] = v;
    }
}

static void stmtx1_store_global(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    value_t v = jacs_vm_exec_expr(frame);
    if (off >= ctx->img.header->num_globals)
        jacs_runtime_failure(ctx, 60120);
    else
        ctx->globals[off] = v;
}

static void stmt4_store_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t buffer = jacs_vm_exec_expr_buffer(frame);
    uint32_t fmt0 = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);
    value_t val = jacs_vm_exec_expr(frame);
    jacs_buffer_op(frame, fmt0, offset, buffer, &val);
}

static void stmt1_terminate_fiber(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t h = jacs_vm_exec_expr(frame);
    frame->fiber->ret_val = jacs_undefined;
    if (jacs_is_nan(h))
        return;
    if (jacs_handle_type(h) != JACS_HANDLE_TYPE_FIBER)
        jacs_runtime_failure(ctx, 60123);
    else {
        jacs_fiber_t *fib = jacs_fiber_by_tag(ctx, jacs_handle_value(h));
        if (fib == NULL)
            return;
        if (fib == frame->fiber)
            jacs_fiber_yield(ctx);
        else
            frame->fiber->ret_val = jacs_zero;
        jacs_fiber_termiante(fib);
    }
}


static uint32_t random_max(uint32_t mx) {
    uint32_t mask = 1;
    while (mask < mx)
        mask = (mask << 1) | 1;
    for (;;) {
        uint32_t r = jd_random() & mask;
        if (r <= mx)
            return r;
    }
}

static value_t expr_invalid(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_runtime_failure(ctx, 60104);
}

static value_t expr2_str0eq(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned len;
    uint8_t *data = jacs_vm_exec_expr_buffer_data(frame, &len);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);

    return jacs_value_from_bool(ctx->packet.service_size >= offset + len + 1 &&
                                ctx->packet.data[offset + len] == 0 &&
                                memcmp(ctx->packet.data + offset, data, len) == 0);
}

static value_t exprx_load_local(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < frame->func->num_locals)
        return frame->locals[off];
    return jacs_runtime_failure(ctx, 60105);
}

static value_t exprx_load_param(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < frame->num_params)
        return frame->params[off];
    // no failure here - allow for var-args in future?
    return jacs_undefined;
}

static value_t exprx_load_global(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < ctx->img.header->num_globals)
        return ctx->globals[off];
    return jacs_runtime_failure(ctx, 60106);
}

static value_t expr3_load_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t buf = jacs_vm_exec_expr_buffer(frame);
    uint32_t fmt0 = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);
    return jacs_buffer_op(frame, fmt0, offset, buf, NULL);
}

static value_t exprx_literal(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int32_t v = jacs_vm_fetch_int(frame, ctx);
    return jacs_value_from_int(v);
}

static value_t exprx_literal_f64(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < jacs_img_num_floats(&ctx->img))
        return jacs_img_get_float(&ctx->img, off);
    return jacs_runtime_failure(ctx, 60107);
}

static value_t expr0_ret_val(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return frame->fiber->ret_val;
}

static value_t expr1_role_is_connected(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t b = jacs_vm_exec_expr_role(frame);
    return jacs_value_from_bool(ctx->roles[b]->service != NULL);
}

static value_t expr0_pkt_size(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_int(ctx->packet.service_size);
}

static value_t expr0_pkt_ev_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_event(&ctx->packet))
        return jacs_value_from_int(ctx->packet.service_command & JD_CMD_EVENT_CODE_MASK);
    else
        return jacs_undefined;
}

static value_t expr0_pkt_reg_get_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_report(&ctx->packet) && jd_is_register_get(&ctx->packet))
        return jacs_value_from_int(JD_REG_CODE(ctx->packet.service_command));
    else
        return jacs_undefined;
}

static value_t expr0_pkt_command_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_command(&ctx->packet))
        return jacs_value_from_int(ctx->packet.service_command);
    else
        return jacs_undefined;
}

static value_t expr0_pkt_report_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_report(&ctx->packet))
        return jacs_value_from_int(ctx->packet.service_command);
    else
        return jacs_undefined;
}

static value_t expr0_now_ms(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_double((double)ctx->_now_long);
}

static value_t expr1_get_fiber_handle(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int idx = jacs_vm_exec_expr_i32(frame);
    jacs_fiber_t *fiber;

    if (idx < 0)
        fiber = frame->fiber;
    else {
        fiber = jacs_fiber_by_fidx(ctx, idx);
        if (fiber == NULL)
            return jacs_undefined;
    }

    return jacs_value_from_handle(JACS_HANDLE_TYPE_FIBER, fiber->handle_tag);
}

static bool jacs_vm_role_ok(jacs_ctx_t *ctx, uint32_t a) {
    if (a < jacs_img_num_roles(&ctx->img))
        return true;
    jacs_runtime_failure(ctx, 60111);
    return false;
}

static bool jacs_vm_str_ok(jacs_ctx_t *ctx, uint32_t a) {
    if (a < jacs_img_num_strings(&ctx->img))
        return true;
    jacs_runtime_failure(ctx, 60112);
    return false;
}

static value_t exprx_static_role(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned idx = jacs_vm_fetch_int(frame, ctx);
    if (!jacs_vm_role_ok(ctx, idx))
        return jacs_undefined;
    return jacs_value_from_handle(JACS_HANDLE_TYPE_ROLE, idx);
}

static value_t exprx_static_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned idx = jacs_vm_fetch_int(frame, ctx);
    if (!jacs_vm_str_ok(ctx, idx))
        return jacs_undefined;
    return jacs_value_from_handle(JACS_HANDLE_TYPE_IMG_BUFFER, idx);
}

static value_t exprx1_get_field(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned idx = jacs_vm_fetch_int(frame, ctx);
    jacs_map_t *map = jacs_vm_exec_expr_map(frame, false);
    if (map == NULL)
        return jacs_undefined;
    return jacs_map_get(ctx, map, idx);
}

static value_t expr2_index(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t arr = jacs_vm_exec_expr(frame);
    uint32_t idx = jacs_vm_exec_expr_u32(frame);
    return jacs_index(ctx, arr, idx);
}

static value_t expr1_object_length(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t arr = jacs_vm_exec_expr(frame);
    unsigned len;
    if (jacs_is_buffer(ctx, arr)) {
        jacs_buffer_data(ctx, arr, &len);
    } else {
        jacs_gc_object_t *obj = jacs_value_to_gc_obj(ctx, arr);
        if (jacs_gc_tag(obj) == JACS_GC_TAG_ARRAY)
            len = ((jacs_array_t *)obj)->length;
        else
            return jacs_zero;
    }
    return jacs_value_from_int(len);
}

static value_t expr1_keys_length(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_map_t *map = jacs_vm_exec_expr_map(frame, false);
    if (map == NULL)
        return jacs_zero;
    return jacs_value_from_int(map->length);
}

static value_t expr1_typeof(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t obj = jacs_vm_exec_expr(frame);
    return jacs_value_from_int(jacs_value_typeof(ctx, obj));
}

static value_t expr0_null(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_null;
}

static value_t expr0_pkt_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_pkt_buffer;
}

static value_t expr1_is_null(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t obj = jacs_vm_exec_expr(frame);
    if (jacs_is_special(obj) && jacs_handle_value(obj) == JACS_SPECIAL_NULL)
        return jacs_true;
    else
        return jacs_false;
}

static value_t expr0_true(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_true;
}

static value_t expr0_false(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_false;
}

//
// Math stuff
//
#if 1
static value_t expr0_nan(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_nan;
}

static value_t expr1_abs(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    if (!jacs_is_tagged_int(v)) {
        double f = jacs_value_to_double(v);
        return f < 0 ? jacs_value_from_double(-f) : v;
    }
    int q = v.val_int32;
    if (q < 0) {
        if (q == INT_MIN)
            return jacs_max_int_1;
        else
            return jacs_value_from_int(-q);
    } else
        return v;
}

static value_t expr1_bit_not(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_int(~jacs_vm_exec_expr_i32(frame));
}

static value_t expr1_ceil(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return v;
    return jacs_value_from_double(ceil(jacs_value_to_double(v)));
}

static value_t expr1_floor(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return v;
    return jacs_value_from_double(floor(jacs_value_to_double(v)));
}

static value_t expr1_round(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return v;
    return jacs_value_from_double(round(jacs_value_to_double(v)));
}

static value_t expr1_id(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_vm_exec_expr(frame);
}

static value_t expr1_is_nan(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    return jacs_value_from_bool(v.exp_sign == JACS_NAN_TAG);
}

static value_t expr1_log_e(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_double(log(jacs_vm_exec_expr_f64(frame)));
}

static value_t expr1_neg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    if (!jacs_is_tagged_int(v))
        return jacs_value_from_double(-jacs_value_to_double(v));
    if (v.val_int32 == INT_MIN)
        return jacs_max_int_1;
    else
        return jacs_value_from_int(-v.val_int32);
}

static value_t expr1_not(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    return jacs_value_from_int(!jacs_value_to_bool(v));
}

static value_t expr1_random(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_double(jd_random() * jacs_vm_exec_expr_f64(frame) / (double)0x100000000);
}

static value_t expr1_random_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_int(random_max(jacs_vm_exec_expr_i32(frame)));
}

static value_t expr1_to_bool(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = jacs_vm_exec_expr(frame);
    return jacs_value_from_bool(jacs_value_to_bool(v));
}

static int exec2_and_check_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t tmp = jacs_vm_exec_expr(frame);
    ctx->binop[1] = jacs_vm_exec_expr(frame);
    ctx->binop[0] = tmp;
    return jacs_is_tagged_int(ctx->binop[0]) && jacs_is_tagged_int(ctx->binop[1]);
}

#define aa ctx->binop[0].val_int32
#define bb ctx->binop[1].val_int32

#define af ctx->binop_f[0]
#define bf ctx->binop_f[1]

static void force_double(jacs_ctx_t *ctx) {
    af = jacs_value_to_double(ctx->binop[0]);
    bf = jacs_value_to_double(ctx->binop[1]);
}

static void exec2_and_force_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    aa = jacs_vm_exec_expr_i32(frame);
    bb = jacs_vm_exec_expr_i32(frame);
}

static int exec2_and_check_int_or_force_double(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx))
        return 1;
    force_double(ctx);
    return 0;
}

static value_t expr2_add(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        if (!__builtin_sadd_overflow(aa, bb, &r))
            return jacs_value_from_int(r);
    }
    force_double(ctx);
    return jacs_value_from_double(af + bf);
}

static value_t expr2_sub(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        if (!__builtin_ssub_overflow(aa, bb, &r))
            return jacs_value_from_int(r);
    }
    force_double(ctx);
    return jacs_value_from_double(af - bf);
}

static value_t expr2_mul(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        if (!__builtin_smul_overflow(aa, bb, &r))
            return jacs_value_from_int(r);
    }
    force_double(ctx);
    return jacs_value_from_double(af * bf);
}

static value_t expr2_div(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int(frame, ctx)) {
        int r;
        // not sure this is worth it on M0+; it definitely is on M4
        if (bb != 0 && (bb != -1 || aa != INT_MIN) && ((r = aa / bb)) * bb == aa)
            return jacs_value_from_int(r);
    }
    force_double(ctx);
    return jacs_value_from_double(af / bf);
}

static value_t expr2_pow(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_check_int(frame, ctx);
    force_double(ctx);
    return jacs_value_from_double(pow(af, bf));
}

static value_t expr2_bit_and(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return jacs_value_from_int(aa & bb);
}

static value_t expr2_bit_or(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return jacs_value_from_int(aa | bb);
}

static value_t expr2_bit_xor(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return jacs_value_from_int(aa ^ bb);
}

static value_t expr2_shift_left(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return jacs_value_from_int(aa << (31 & bb));
}

static value_t expr2_shift_right(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    return jacs_value_from_int(aa >> (31 & bb));
}

static value_t expr2_shift_right_unsigned(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    uint32_t tmp = (uint32_t)aa >> (31 & bb);
    if (tmp >> 31)
        return jacs_value_from_double(tmp);
    else
        return jacs_value_from_int(tmp);
}

static value_t expr2_idiv(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    if (bb == 0)
        return jacs_zero;
    return jacs_value_from_int(aa / bb);
}

static value_t expr2_imul(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    exec2_and_force_int(frame, ctx);
    // avoid signed overflow, which is undefined
    // note that signed and unsigned multiplication result in the same bit patterns
    return jacs_value_from_int((uint32_t)aa * (uint32_t)bb);
}

static value_t expr2_eq(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int_or_force_double(frame, ctx))
        return jacs_value_from_bool(aa == bb);
    return jacs_value_from_bool(af == bf);
}

static value_t expr2_le(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int_or_force_double(frame, ctx))
        return jacs_value_from_bool(aa <= bb);
    return jacs_value_from_bool(af <= bf);
}

static value_t expr2_lt(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int_or_force_double(frame, ctx))
        return jacs_value_from_bool(aa < bb);
    return jacs_value_from_bool(af < bf);
}

static value_t expr2_ne(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (exec2_and_check_int_or_force_double(frame, ctx))
        return jacs_value_from_bool(aa != bb);
    return jacs_value_from_bool(af != bf);
}

static value_t expr2_max(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int lt;
    if (exec2_and_check_int_or_force_double(frame, ctx))
        lt = aa < bb;
    else if (isnan(af) || isnan(bf))
        return jacs_nan;
    else
        lt = af < bf;

    return lt ? ctx->binop[1] : ctx->binop[0];
}

static value_t expr2_min(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int lt;
    if (exec2_and_check_int_or_force_double(frame, ctx))
        lt = aa < bb;
    else if (isnan(af) || isnan(bf))
        return jacs_nan;
    else
        lt = af < bf;

    return lt ? ctx->binop[0] : ctx->binop[1];
}
#endif

static const jacs_vm_expr_handler_t jacs_vm_expr_handlers[JACS_EXPR_PAST_LAST + 1] = {
    JACS_EXPR_HANDLERS};

void jacs_vm_check_expr() {
    for (unsigned i = 0; i <= JACS_EXPR_PAST_LAST; ++i) {
        if (jacs_vm_expr_handlers[i] == NULL) {
            DMESG("missing expr %d", i);
            jd_panic();
        }
    }
}

value_t jacs_vm_exec_expr(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    uint8_t op = jacs_vm_fetch_byte(frame, ctx);
    if (op >= 0x80) {
        return jacs_value_from_int(op - 0x80 - 16);
    }

    if (ctx->opstack++ > JACS_MAX_EXPR_DEPTH)
        return jacs_runtime_failure(ctx, 60108);

    if (op >= JACS_EXPR_PAST_LAST)
        return jacs_runtime_failure(ctx, 60109);

    value_t r = jacs_vm_expr_handlers[op](frame, ctx);
    ctx->opstack--;

    return r;
}

static const jacs_vm_stmt_handler_t jacs_vm_stmt_handlers[JACS_STMT_PAST_LAST + 1] = {
    JACS_STMT_HANDLERS};

void jacs_vm_check_stmt() {
    for (unsigned i = 0; i <= JACS_STMT_PAST_LAST; i++) {
        if (jacs_vm_stmt_handlers[i] == NULL) {
            DMESG("missing stmt %d", i);
            jd_panic();
        }
    }
}

void jacs_vm_exec_stmt(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    uint8_t op = jacs_vm_fetch_byte(frame, ctx);

    if (op >= JACS_STMT_PAST_LAST) {
        jacs_runtime_failure(ctx, 60122);
    } else {
        jacs_vm_stmt_handlers[op](frame, ctx);
    }
}
