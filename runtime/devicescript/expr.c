#include "jacs_internal.h"
#include "jacs_vm_internal.h"

#include <math.h>
#include <limits.h>

typedef value_t (*jacs_vm_expr_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);

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
    jacs_runtime_failure(ctx, 60104);
    return jacs_nan;
}

static value_t expr2_str0eq(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);

    if (!jacs_vm_str_ok(ctx, stridx))
        return jacs_nan;

    int len = jacs_img_get_string_len(&ctx->img, stridx);
    if (ctx->packet.service_size >= offset + len + 1 && ctx->packet.data[offset + len] == 0 &&
        memcmp(ctx->packet.data + offset, jacs_img_get_string_ptr(&ctx->img, stridx), len) == 0)
        return jacs_one;
    else
        return jacs_zero;
}

static value_t exprx_load_local(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < frame->func->num_locals)
        return frame->locals[off];
    jacs_runtime_failure(ctx, 60105);
    return jacs_nan;
}

static value_t exprx_load_param(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < frame->num_params)
        return frame->params[off];
    return jacs_nan;
}

static value_t exprx_load_global(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < ctx->img.header->num_globals)
        return ctx->globals[off];
    jacs_runtime_failure(ctx, 60106);
    return jacs_nan;
}

static value_t expr3_load_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fmt0 = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);
    uint32_t bufferidx = jacs_vm_exec_expr_u32(frame);
    return jacs_buffer_op(frame, fmt0, offset, bufferidx, NULL);
}

static value_t exprx_literal(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int32_t v = jacs_vm_fetch_int(frame, ctx);
    return jacs_value_from_int(v);
}

static value_t exprx_literal_f64(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    if (off < jacs_img_num_floats(&ctx->img))
        return jacs_img_get_float(&ctx->img, off);
    jacs_runtime_failure(ctx, 60107);
    return jacs_nan;
}

static value_t expr0_ret_val(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    return frame->fiber->ret_val;
}

static value_t expr1_role_is_connected(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_role_ok(ctx, b))
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

static value_t expr0_pkt_command_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_command(&ctx->packet))
        return jacs_value_from_int(ctx->packet.service_command);
    else
        return jacs_nan;
}

static value_t expr0_pkt_report_code(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    if (jd_is_report(&ctx->packet))
        return jacs_value_from_int(ctx->packet.service_command);
    else
        return jacs_nan;
}

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
    return jacs_value_from_int(jacs_value_to_bool(v));
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
            return jacs_nan;
    }

    return jacs_value_from_handle(JACS_HANDLE_TYPE_FIBER, fiber->handle_tag);
}

static const jacs_vm_expr_handler_t jacs_vm_expr_handlers[JACS_EXPR_PAST_LAST + 1] = {
    [0] = expr_invalid,
    [JACS_EXPRx_LOAD_LOCAL] = exprx_load_local,
    [JACS_EXPRx_LOAD_GLOBAL] = exprx_load_global,
    [JACS_EXPR3_LOAD_BUFFER] = expr3_load_buffer,
    [JACS_EXPRx_LOAD_PARAM] = exprx_load_param,

    [JACS_EXPRx_LITERAL] = exprx_literal,
    [JACS_EXPRx_LITERAL_F64] = exprx_literal_f64,

    [JACS_EXPR0_RET_VAL] = expr0_ret_val,

    [JACS_EXPR1_ROLE_IS_CONNECTED] = expr1_role_is_connected,
    [JACS_EXPR0_PKT_SIZE] = expr0_pkt_size,
    [JACS_EXPR0_PKT_EV_CODE] = expr0_pkt_ev_code,
    [JACS_EXPR0_PKT_REG_GET_CODE] = expr0_pkt_reg_get_code,
    [JACS_EXPR0_PKT_COMMAND_CODE] = expr0_pkt_command_code,
    [JACS_EXPR0_PKT_REPORT_CODE] = expr0_pkt_report_code,
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
    [JACS_EXPR0_NOW_MS] = expr0_now_ms,
    [JACS_EXPR1_GET_FIBER_HANDLE] = expr1_get_fiber_handle,

    [JACS_EXPR_PAST_LAST] = expr_invalid,
};

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
