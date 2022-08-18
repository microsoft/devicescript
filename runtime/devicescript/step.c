#include "jacs_internal.h"

#if 0
static bool role_ok(jacs_ctx_t *ctx, uint16_t a) {
    if (a < jacs_img_num_roles(&ctx->img))
        return true;
    jacs_runtime_failure(ctx);
    return false;
}

static value_t load_cell(jacs_ctx_t *ctx, jacs_activation_t *act, int tp, int idx, int b, int c,
                         int d) {
    switch (tp) {
    case JACS_CELL_KIND_LOCAL:
        return act->locals[idx];
    case JACS_CELL_KIND_GLOBAL:
        if (idx >= ctx->img.header->num_globals)
            return jacs_runtime_failure(ctx);
        return ctx->globals[idx];
    case JACS_CELL_KIND_BUFFER:
        return jacs_buffer_op(act, b, c, d, NULL);
    case JACS_CELL_KIND_FLOAT_CONST:
        return jacs_img_get_float(&ctx->img, idx);
    case JACS_CELL_KIND_IDENTITY:
        return jacs_value_from_int(idx);
    case JACS_CELL_KIND_SPECIAL:
        switch (idx) {
        case JACS_VALUE_SPECIAL_NAN:
            return jacs_nan;
        case JACS_VALUE_SPECIAL_SIZE:
            return jacs_value_from_int(ctx->packet.service_size);
        case JACS_VALUE_SPECIAL_EV_CODE:
            if (jd_is_event(&ctx->packet))
                return jacs_value_from_int(ctx->packet.service_command & JD_CMD_EVENT_CODE_MASK);
            else
                return jacs_nan;
        case JACS_VALUE_SPECIAL_REG_GET_CODE:
            if (jd_is_report(&ctx->packet) && jd_is_register_get(&ctx->packet))
                return jacs_value_from_int(JD_REG_CODE(ctx->packet.service_command));
            else
                return jacs_nan;
        default:
            oops();
        }
    case JACS_CELL_KIND_ROLE_PROPERTY:
        switch (idx) {
        case JACS_ROLE_PROPERTY_IS_CONNECTED:
            if (role_ok(ctx, b))
                return jacs_value_from_bool(ctx->roles[b]->service != NULL);
            else
                return jacs_nan;
        default:
            oops();
        }
    default:
        oops();
    }
}

static void store_cell(jacs_ctx_t *ctx, jacs_activation_t *act, int tp, int idx, int b, int c,
                       int d, value_t val) {
    switch (tp) {
    case JACS_CELL_KIND_LOCAL:
        // DMESG("loc %d := %f pc=%d", idx, val, act->pc);
        act->locals[idx] = val;
        break;
    case JACS_CELL_KIND_GLOBAL:
        if (idx >= ctx->img.header->num_globals)
            jacs_runtime_failure(ctx);
        else
            ctx->globals[idx] = val;
        break;
    case JACS_CELL_KIND_BUFFER:
        jacs_buffer_op(act, b, c, d, &val);
        break;
    default:
        oops();
    }
}

value_t *jacs_act_saved_regs_ptr(jacs_activation_t *act) {
    return &act->locals[act->func->num_locals];
}

static unsigned strformat(jacs_ctx_t *ctx, unsigned str_idx, unsigned numargs, uint8_t *dst,
                          unsigned dstlen, unsigned numskip) {
    return jacs_strformat(jacs_img_get_string_ptr(&ctx->img, str_idx),
                          jacs_img_get_string_len(&ctx->img, str_idx), (char *)dst, dstlen,
                          ctx->registers, numargs, numskip);
}

void jacs_act_step(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    JD_ASSERT(!ctx->error_code);

    uint32_t instr = ctx->img.instructions[frame->pc++];

    // DMESG("step %04x @ %d", instr, frame->pc - 1);

    uint32_t op = instr >> 12;
    uint32_t arg12 = instr & 0xfff;
    uint32_t arg10 = instr & 0x3ff;
    uint32_t arg8 = instr & 0xff;
    uint32_t arg6 = instr & 0x3f;
    uint32_t arg4 = instr & 0xf;
    uint32_t subop = arg12 >> 8;
    uint32_t reg0 = subop;
    uint32_t reg1 = arg8 >> 4;
    uint32_t reg2 = arg4;
    uint32_t celltp = arg8 >> 4;
    uint16_t a = ctx->a;
    uint16_t b = ctx->b;
    uint16_t c = ctx->c;
    uint16_t d = ctx->d;

    switch (op) {
    case JACS_OPTOP_LOAD_CELL:
    case JACS_OPTOP_STORE_CELL:
        a = (a << 4) | arg4;
        break;
    case JACS_OPTOP_JUMP:
    case JACS_OPTOP_CALL:
        b = (b << 6) | arg6;
        break;
    }

    switch (op) {
    case JACS_OPTOP_SET_A:
    case JACS_OPTOP_SET_B:
    case JACS_OPTOP_SET_C:
    case JACS_OPTOP_SET_D:
        ctx->params[op] = arg12;
        break;

    case JACS_OPTOP_SET_HIGH:
        if (instr & (1 << 9))
            ctx->params[arg12 >> 10] = jacs_value_to_int(ctx->registers[reg2]);
        else
            ctx->params[arg12 >> 10] |= arg10 << 12;
        break;

    case JACS_OPTOP_UNARY: // OP[4] DST[4] SRC[4]
        ctx->registers[reg1] = jacs_step_unop(subop, ctx->registers[reg2]);
        break;

    case JACS_OPTOP_BINARY: // OP[4] DST[4] SRC[4]
        ctx->registers[reg1] = jacs_step_binop(subop, ctx->registers[reg1], ctx->registers[reg2]);
        break;

    case JACS_OPTOP_LOAD_CELL: // DST[4] A:OP[2] B:OFF[6]
        ctx->registers[reg0] = load_cell(ctx, frame, celltp, a, b, c, d);
        break;

    case JACS_OPTOP_STORE_CELL: // SRC[4] A:OP[2] B:OFF[6]
        store_cell(ctx, frame, celltp, a, b, c, d, ctx->registers[reg0]);
        break;

    case JACS_OPTOP_JUMP: // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
        if (arg8 & (1 << 6) && jacs_value_to_bool(ctx->registers[reg0]))
            break;
        if (arg8 & (1 << 7)) {
            frame->pc -= b;
        } else {
            frame->pc += b;
        }
        break;

    case JACS_OPTOP_CALL: // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)
        save_regs(frame, d);
        switch (arg8 >> 6) {
        case JACS_OPCALL_SYNC:
            jacs_fiber_call_function(frame->fiber, b, subop);
            break;
        case JACS_OPCALL_BG:
        case JACS_OPCALL_BG_MAX1:
        case JACS_OPCALL_BG_MAX1_PEND1:
            jacs_fiber_start(ctx, b, subop, arg8 >> 6);
            break;
        default:
            oops();
        }
        break;

    case JACS_OPTOP_SYNC:
        switch (arg8) {
        case JACS_OPSYNC_RETURN:
            jacs_fiber_return_from_call(frame);
            break;
        case JACS_OPSYNC_SETUP_BUFFER: // A-size
            if (a > JD_SERIAL_PAYLOAD_SIZE) {
                jacs_runtime_failure(ctx);
            } else {
                ctx->packet.service_size = a;
                memset(ctx->packet.data, 0, a);
            }
            break;
        case JACS_OPSYNC_FORMAT: // A-string-index B-numargs C-offset
            ctx->packet.service_size =
                c + strformat(ctx, a, b, ctx->packet.data + c, JD_SERIAL_PAYLOAD_SIZE - c, 0);
            break;
        case JACS_OPSYNC_MEMCPY: // A-string-index C-offset
        {
            int len = ctx->packet.service_size - c;
            if (len > 0) {
                int l2 = jacs_img_get_string_len(&ctx->img, a);
                if (l2 < len)
                    len = l2;
                memcpy(ctx->packet.data + c, jacs_img_get_string_ptr(&ctx->img, a), len);
            }
        } break;
        case JACS_OPSYNC_STR0EQ: {
            int len = jacs_img_get_string_len(&ctx->img, a);
            if (ctx->packet.service_size >= c + len + 1 && ctx->packet.data[c + len] == 0 &&
                memcmp(ctx->packet.data + c, jacs_img_get_string_ptr(&ctx->img, a), len) == 0)
                ctx->registers[0] = jacs_one;
            else
                ctx->registers[0] = jacs_zero;
            break;
        }
        case JACS_OPSYNC_MATH1:
            ctx->registers[0] = jacs_step_opmath1(a, ctx->registers[0]);
            break;
        case JACS_OPSYNC_MATH2:
            ctx->registers[0] = jacs_step_opmath2(a, ctx->registers[0], ctx->registers[1]);
            break;
        case JACS_OPSYNC_PANIC:
            jacs_panic(ctx, a);
            break;
        default:
            oops();
            break;
        }
        break;

    case JACS_OPTOP_ASYNC: // D:SAVE_REGS[4] OP[8]
        d = (d << 4) | subop;
        save_regs(frame, d);
        switch (arg8) {
        case JACS_OPASYNC_WAIT_ROLE:
            if (role_ok(ctx, a)) {
                frame->fiber->role_idx = a;
                jacs_fiber_set_wake_time(frame->fiber, 0);
                jacs_fiber_yield(ctx);
            }
            break;
        case JACS_OPASYNC_SLEEP_MS: // A-timeout in ms
            jacs_fiber_sleep(frame->fiber, a);
            break;
        case JACS_OPASYNC_SLEEP_R0:
            jacs_fiber_sleep(frame->fiber,
                             (uint32_t)(jacs_value_to_double(ctx->registers[0]) * 1000 + 0.5));
            break;
        case JACS_OPASYNC_SEND_CMD: // A-role, B-code
            if (role_ok(ctx, a))
                jacs_jd_send_cmd(ctx, a, b);
            break;
        case JACS_OPASYNC_QUERY_REG: // A-role, B-code, C-timeout
            if (role_ok(ctx, a))
                jacs_jd_get_register(ctx, a, JD_GET(b), c, 0);
            break;
        case JACS_OPASYNC_QUERY_IDX_REG:
            if (role_ok(ctx, a))
                jacs_jd_get_register(ctx, a, b & 0xff, c, b >> 8);
            break;
        case JACS_OPASYNC_LOG_FORMAT:
            jacs_jd_send_logmsg(ctx, a, b);
            break;
        default:
            oops();
            break;
        }
        break;

    default:
        oops();
    }

    if (!jacs_is_prefix_instr(instr))
        ctx->a = ctx->b = ctx->c = ctx->d = 0;
}

#endif

typedef void (*jacs_stmt_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);
typedef void (*expr_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);

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
    int32_t off = decode_int(frame, ctx);
    value_t v = exec_expr(frame);
    if (off < 0 || off >= frame->func->num_locals)
        jacs_runtime_failure(ctx);
    else
        frame->locals[off] = v;
}

static void stmtx1_store_global(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    int32_t off = decode_int(frame, ctx);
    value_t v = exec_expr(frame);
    if (off < 0 || off >= ctx->img.header->num_globals)
        jacs_runtime_failure(ctx);
    else
        ctx->globals[off] = v;
}

static void stmt4_store_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fmt0 = exec_expr_u32(frame);
    uint32_t offset = exec_expr_u32(frame);
    uint32_t bufferidx = exec_expr_u32(frame);
    value_t val = exec_expr(frame);
    jacs_buffer_op(act, fmt0, offset, bufferidx, &val);
}

static void stmt_invalid(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_runtime_failure(ctx);
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
    [JACS_STMT_MAX] = stmt_invalid,
};

static const expr_handler_t expr_handlers[JACS_EXPR_MAX + 1] = {
    [0] = expr_invalid,
    [JACS_EXPR2_STR0EQ] = expr2_str0eq,
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

void jacs_exec_stmt(jacs_activation_t *frame) {
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

#if 0
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
#endif