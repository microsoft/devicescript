#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

typedef void (*jacs_stmt_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);
typedef value_t (*jacs_expr_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);

static value_t exec_expr(jacs_activation_t *frame);

static bool role_ok(jacs_ctx_t *ctx, uint16_t a) {
    if (a < jacs_img_num_roles(&ctx->img))
        return true;
    jacs_runtime_failure(ctx);
    return false;
}

static bool args_ok(jacs_activation_t *frame, uint32_t localidx, uint32_t numargs) {
    if (numargs > 16 || localidx > frame->func->num_locals ||
        localidx + numargs > frame->func->num_locals) {
        jacs_runtime_failure(frame->fiber->ctx);
        return false;
    }
    return true;
}

static uint8_t fetch_byte(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (frame->pc < frame->maxpc)
        return ctx->img.data[frame->pc++];
    jacs_runtime_failure(ctx);
    return 0;
}

static int32_t decode_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint8_t v = fetch_byte(frame, ctx);
    if (v <= 0xF8)
        return v;

    int32_t r = 0;
    bool n = !!(v & 4);
    int len = (v & 3) + 1;
    for (int i = 0; i < len; ++i) {
        uint8_t v = fetch_byte(frame, ctx);
        r <<= 8;
        r |= v;
    }

    return n ? -r : r;
}

static uint32_t exec_expr_u32(jacs_activation_t *frame) {
    // TODO int vs uint?
    // TODO specialize?
    return jacs_value_to_int(exec_expr(frame));
}

static uint32_t exec_expr_i32(jacs_activation_t *frame) {
    // TODO specialize?
    return jacs_value_to_int(exec_expr(frame));
}

static double exec_expr_f64(jacs_activation_t *frame) {
    return jacs_value_to_double(exec_expr(frame));
}

static void stmt1_wait_role(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = exec_expr_u32(frame);
    if (role_ok(ctx, a)) {
        frame->fiber->role_idx = a;
        jacs_fiber_set_wake_time(frame->fiber, 0);
        jacs_fiber_yield(ctx);
    }
}

static void stmt1_sleep_s(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_fiber_sleep(frame->fiber, exec_expr_u32(frame));
}

static void stmt1_sleep_ms(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_fiber_sleep(frame->fiber, (uint32_t)(exec_expr_f64(frame) * 1000 + 0.5));
}

static void stmt2_send_cmd(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = exec_expr_u32(frame);
    uint32_t b = exec_expr_u32(frame);
    if (role_ok(ctx, a))
        jacs_jd_send_cmd(ctx, a, b);
}

static void stmt3_query_reg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = exec_expr_u32(frame);
    uint32_t b = exec_expr_u32(frame);
    uint32_t timeout = exec_expr_u32(frame);
    if (role_ok(ctx, a))
        jacs_jd_get_register(ctx, a, JD_GET(b), timeout, 0);
}

static void stmt4_query_idx_reg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = exec_expr_u32(frame);
    uint32_t b = exec_expr_u32(frame);
    uint32_t timeout = exec_expr_u32(frame);
    uint32_t stridx = exec_expr_u32(frame);
    if (role_ok(ctx, a))
        jacs_jd_get_register(ctx, a, b, timeout, stridx);
}

static void stmt3_log_format(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = exec_expr_u32(frame);
    uint32_t localidx = exec_expr_u32(frame);
    uint32_t numargs = exec_expr_u32(frame);
    if (args_ok(frame, localidx, numargs))
        jacs_jd_send_logmsg(ctx, stridx, localidx, numargs);
}

static void stmt4_format(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = exec_expr_u32(frame);
    uint32_t localidx = exec_expr_u32(frame);
    uint32_t numargs = exec_expr_u32(frame);
    uint32_t offset = exec_expr_u32(frame);

    if (offset > JD_SERIAL_PAYLOAD_SIZE)
        return;

    if (args_ok(frame, localidx, numargs))
        ctx->packet.service_size =
            offset + jacs_strformat(jacs_img_get_string_ptr(&ctx->img, stridx),
                                    jacs_img_get_string_len(&ctx->img, stridx),
                                    (char *)ctx->packet.data + offset,
                                    JD_SERIAL_PAYLOAD_SIZE - offset, frame->locals + localidx,
                                    numargs, 0);
}

static void stmt1_return(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    frame->fiber->ret_val = exec_expr(frame);
    jacs_fiber_return_from_call(frame);
}

static void stmt1_setup_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = exec_expr_u32(frame);
    if (a > JD_SERIAL_PAYLOAD_SIZE) {
        jacs_runtime_failure(ctx);
    } else {
        ctx->packet.service_size = a;
        memset(ctx->packet.data, 0, a);
    }
}

static void stmt2_memcpy(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = exec_expr_u32(frame);
    uint32_t offset = exec_expr_u32(frame);

    int len = ctx->packet.service_size - offset;
    if (len > 0) {
        int l2 = jacs_img_get_string_len(&ctx->img, stridx);
        if (l2 < len)
            len = l2;
        memcpy(ctx->packet.data + offset, jacs_img_get_string_ptr(&ctx->img, stridx), len);
    }
}

static void stmt1_panic(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t code = exec_expr_u32(frame);
    jacs_panic(ctx, code);
}

static void stmt3_call(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fidx = exec_expr_u32(frame);
    uint32_t localidx = exec_expr_u32(frame);
    uint32_t numargs = exec_expr_u32(frame);

    if (args_ok(frame, localidx, numargs))
        jacs_fiber_call_function(frame->fiber, fidx, frame->locals + localidx, numargs);
}

static void stmt4_call_bg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fidx = exec_expr_u32(frame);
    uint32_t localidx = exec_expr_u32(frame);
    uint32_t numargs = exec_expr_u32(frame);
    uint32_t flag = exec_expr_u32(frame);

    if (args_ok(frame, localidx, numargs))
        jacs_fiber_start(ctx, fidx, frame->locals + localidx, numargs, flag);
}

static void stmtx_jmp(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int32_t off = decode_int(frame, ctx);
    int pc = frame->pc + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        frame->pc = pc;
    } else {
        jacs_runtime_failure(ctx);
    }
}

static void stmtx1_jmp_z(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int32_t off = decode_int(frame, ctx);
    int cond = jacs_value_to_bool(exec_expr(frame));
    int pc = frame->pc + off;
    if ((int)frame->func->start <= pc && pc < frame->maxpc) {
        if (!cond)
            frame->pc = pc;
    } else {
        jacs_runtime_failure(ctx);
    }
}

static void stmtx1_store_local(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = decode_int(frame, ctx);
    value_t v = exec_expr(frame);
    if (off >= frame->func->num_locals)
        jacs_runtime_failure(ctx);
    else
        frame->locals[off] = v;
}

static void stmtx1_store_param(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = decode_int(frame, ctx);
    value_t v = exec_expr(frame);
    if (off >= frame->func->num_args)
        jacs_runtime_failure(ctx);
    else {
        if (off >= frame->num_params) {
            JD_ASSERT(!frame->params_is_copy);
            value_t *tmp = jd_alloc(sizeof(value_t) * frame->func->num_args);
            memcpy(tmp, frame->params, sizeof(value_t) * frame->num_params);
            frame->num_params = frame->func->num_args;
            frame->params = tmp;
            frame->params_is_copy = 1;
        }
        frame->params[off] = v;
    }
}

static void stmtx1_store_global(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = decode_int(frame, ctx);
    value_t v = exec_expr(frame);
    if (off >= ctx->img.header->num_globals)
        jacs_runtime_failure(ctx);
    else
        ctx->globals[off] = v;
}

static void stmt4_store_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fmt0 = exec_expr_u32(frame);
    uint32_t offset = exec_expr_u32(frame);
    uint32_t bufferidx = exec_expr_u32(frame);
    value_t val = exec_expr(frame);
    jacs_buffer_op(frame, fmt0, offset, bufferidx, &val);
}

static void stmt_invalid(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_runtime_failure(ctx);
}

//
// Expressions
//

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
    jacs_runtime_failure(ctx);
    return jacs_nan;
}

static value_t expr2_str0eq(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = exec_expr_u32(frame);
    uint32_t c = exec_expr_u32(frame);

    int len = jacs_img_get_string_len(&ctx->img, a);
    if (ctx->packet.service_size >= c + len + 1 && ctx->packet.data[c + len] == 0 &&
        memcmp(ctx->packet.data + c, jacs_img_get_string_ptr(&ctx->img, a), len) == 0)
        return jacs_one;
    else
        return jacs_zero;
}

static value_t exprx_load_local(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = decode_int(frame, ctx);
    if (off < frame->func->num_locals)
        return frame->locals[off];
    jacs_runtime_failure(ctx);
    return jacs_nan;
}

static value_t exprx_load_global(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = decode_int(frame, ctx);
    if (off < ctx->img.header->num_globals)
        return ctx->globals[off];
    jacs_runtime_failure(ctx);
    return jacs_nan;
}

static value_t expr3_load_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fmt0 = exec_expr_u32(frame);
    uint32_t offset = exec_expr_u32(frame);
    uint32_t bufferidx = exec_expr_u32(frame);
    return jacs_buffer_op(frame, fmt0, offset, bufferidx, NULL);
}

static value_t exprx_literal(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int32_t v = decode_int(frame, ctx);
    return jacs_value_from_int(v);
}

static value_t exprx_literal_f64(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = decode_int(frame, ctx);
    if (off < jacs_img_num_floats(&ctx->img))
        return jacs_img_get_float(&ctx->img, off);
    jacs_runtime_failure(ctx);
    return jacs_nan;
}

static value_t expr0_ret_val(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return frame->fiber->ret_val;
}

static value_t expr1_role_is_connected(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t b = exec_expr_u32(frame);
    if (role_ok(ctx, b))
        return jacs_value_from_bool(ctx->roles[b]->service != NULL);
    else
        return jacs_nan;
}

static value_t expr0_pkt_size(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_int(ctx->packet.service_size);
}

static value_t expr0_pkt_ev_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_event(&ctx->packet))
        return jacs_value_from_int(ctx->packet.service_command & JD_CMD_EVENT_CODE_MASK);
    else
        return jacs_nan;
}

static value_t expr0_pkt_reg_get_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_report(&ctx->packet) && jd_is_register_get(&ctx->packet))
        return jacs_value_from_int(JD_REG_CODE(ctx->packet.service_command));
    else
        return jacs_nan;
}

static value_t expr0_nan(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_nan;
}

static value_t expr1_abs(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    if (!jacs_is_tagged_int(v))
        return v.f < 0 ? jacs_value_from_double(-v.f) : v;
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
    return jacs_value_from_int(~exec_expr_i32(frame));
}

static value_t expr1_ceil(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return v;
    return jacs_value_from_double(ceil(v.f));
}

static value_t expr1_floor(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return v;
    return jacs_value_from_double(floor(v.f));
}

static value_t expr1_round(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return v;
    return jacs_value_from_double(round(v.f));
}

static value_t expr1_id(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return exec_expr(frame);
}

static value_t expr1_is_nan(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    if (jacs_is_tagged_int(v))
        return jacs_zero;
    return jacs_value_from_bool(isnan(v.f));
}

static value_t expr1_log_e(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_double(log(exec_expr_f64(frame)));
}

static value_t expr1_neg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    if (!jacs_is_tagged_int(v))
        return jacs_value_from_double(-v.f);
    if (v.val_int32 == INT_MIN)
        return jacs_max_int_1;
    else
        return jacs_value_from_int(-v.val_int32);
}

static value_t expr1_not(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    return jacs_value_from_int(!jacs_value_to_bool(v));
}

static value_t expr1_random(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_double(jd_random() * exec_expr_f64(frame) / (double)0x100000000);
}

static value_t expr1_random_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return jacs_value_from_int(random_max(exec_expr_i32(frame)));
}

static value_t expr1_to_bool(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    value_t v = exec_expr(frame);
    return jacs_value_from_int(jacs_value_to_bool(v));
}

static int exec2_and_check_int(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    ctx->binop[0] = exec_expr(frame);
    ctx->binop[1] = exec_expr(frame);
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
    aa = exec_expr_i32(frame);
    bb = exec_expr_i32(frame);
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

static const jacs_stmt_handler_t stmt_handlers[JACS_STMT_MAX + 1] = {
    [0] = stmt_invalid,
    [JACS_STMT1_WAIT_ROLE] = stmt1_wait_role,
    [JACS_STMT1_SLEEP_S] = stmt1_sleep_s,
    [JACS_STMT1_SLEEP_MS] = stmt1_sleep_ms,
    [JACS_STMT3_QUERY_REG] = stmt3_query_reg,
    [JACS_STMT2_SEND_CMD] = stmt2_send_cmd,
    [JACS_STMT4_QUERY_IDX_REG] = stmt4_query_idx_reg,
    [JACS_STMT3_LOG_FORMAT] = stmt3_log_format,
    [JACS_STMT4_FORMAT] = stmt4_format,
    [JACS_STMT1_SETUP_BUFFER] = stmt1_setup_buffer,
    [JACS_STMT2_MEMCPY] = stmt2_memcpy,
    [JACS_STMT3_CALL] = stmt3_call,
    [JACS_STMT4_CALL_BG] = stmt4_call_bg,
    [JACS_STMT1_RETURN] = stmt1_return,
    [JACS_STMTx_JMP] = stmtx_jmp,
    [JACS_STMTx1_JMP_Z] = stmtx1_jmp_z,
    [JACS_STMT1_PANIC] = stmt1_panic,
    [JACS_STMTx1_STORE_LOCAL] = stmtx1_store_local,
    [JACS_STMTx1_STORE_GLOBAL] = stmtx1_store_global,
    [JACS_STMT4_STORE_BUFFER] = stmt4_store_buffer,
    [JACS_STMTx1_STORE_PARAM] = stmtx1_store_param,
    [JACS_STMT_MAX] = stmt_invalid,
};

static const jacs_expr_handler_t expr_handlers[JACS_EXPR_MAX + 1] = {
    [0] = expr_invalid,
    [JACS_EXPRx_LOAD_LOCAL] = exprx_load_local,
    [JACS_EXPRx_LOAD_GLOBAL] = exprx_load_global,
    [JACS_EXPR3_LOAD_BUFFER] = expr3_load_buffer,

    [JACS_EXPRx_LITERAL] = exprx_literal,
    [JACS_EXPRx_LITERAL_F64] = exprx_literal_f64,

    [JACS_EXPR0_RET_VAL] = expr0_ret_val,

    [JACS_EXPR1_ROLE_IS_CONNECTED] = expr1_role_is_connected,
    [JACS_EXPR0_PKT_SIZE] = expr0_pkt_size,
    [JACS_EXPR0_PKT_EV_CODE] = expr0_pkt_ev_code,
    [JACS_EXPR0_PKT_REG_GET_CODE] = expr0_pkt_reg_get_code,
    [JACS_EXPR2_STR0EQ] = expr2_str0eq,

    // math
    [JACS_EXPR0_NAN] = expr0_nan,
    [JACS_EXPR1_ABS] = expr1_abs,
    [JACS_EXPR1_BIT_NOT] = expr1_bit_not,
    [JACS_EXPR1_CEIL] = expr1_ceil,
    [JACS_EXPR1_FLOOR] = expr1_floor,
    [JACS_EXPR1_ID] = expr1_id,
    [JACS_EXPR1_IS_NAN] = expr1_is_nan,
    [JACS_EXPR1_LOG_E] = expr1_log_e,
    [JACS_EXPR1_NEG] = expr1_neg,
    [JACS_EXPR1_NOT] = expr1_not,
    [JACS_EXPR1_RANDOM] = expr1_random,
    [JACS_EXPR1_RANDOM_INT] = expr1_random_int,
    [JACS_EXPR1_ROUND] = expr1_round,
    [JACS_EXPR1_TO_BOOL] = expr1_to_bool,
    [JACS_EXPR2_ADD] = expr2_add,
    [JACS_EXPR2_BIT_AND] = expr2_bit_and,
    [JACS_EXPR2_BIT_OR] = expr2_bit_or,
    [JACS_EXPR2_BIT_XOR] = expr2_bit_xor,
    [JACS_EXPR2_DIV] = expr2_div,
    [JACS_EXPR2_EQ] = expr2_eq,
    [JACS_EXPR2_IDIV] = expr2_idiv,
    [JACS_EXPR2_IMUL] = expr2_imul,
    [JACS_EXPR2_LE] = expr2_le,
    [JACS_EXPR2_LT] = expr2_lt,
    [JACS_EXPR2_MAX] = expr2_max,
    [JACS_EXPR2_MIN] = expr2_min,
    [JACS_EXPR2_MUL] = expr2_mul,
    [JACS_EXPR2_NE] = expr2_ne,
    [JACS_EXPR2_POW] = expr2_pow,
    [JACS_EXPR2_SHIFT_LEFT] = expr2_shift_left,
    [JACS_EXPR2_SHIFT_RIGHT] = expr2_shift_right,
    [JACS_EXPR2_SHIFT_RIGHT_UNSIGNED] = expr2_shift_right_unsigned,
    [JACS_EXPR2_SUB] = expr2_sub,

    [JACS_EXPR_MAX] = expr_invalid,
};

static value_t exec_expr(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    uint8_t op = fetch_byte(frame, ctx);
    if (op >= 0x80) {
        return jacs_value_from_int(op - 0x80 - 16);
    }

    if (ctx->opstack++ > 10 || op >= JACS_EXPR_MAX) {
        jacs_runtime_failure(ctx);
        return jacs_nan;
    }

    value_t r = expr_handlers[op](frame, ctx);
    ctx->opstack--;

    return r;
}

void jacs_act_step(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    uint8_t op = fetch_byte(frame, ctx);

    if (op >= JACS_STMT_MAX) {
        jacs_runtime_failure(ctx);
    } else {
        stmt_handlers[op](frame, ctx);
    }
}

/*

nan-box pointers - should allow for GC of locals/globals

object types:
  - buffer
  - key-value map (u16 -> f64)
  - array of values
  - string

what about function values?

*/
