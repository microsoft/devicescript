#include "jacs_internal.h"
#include "jacs_vm_internal.h"

typedef void (*jacs_vm_stmt_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);

bool jacs_vm_role_ok(jacs_ctx_t *ctx, uint32_t a) {
    if (a < jacs_img_num_roles(&ctx->img))
        return true;
    jacs_runtime_failure(ctx, 60111);
    return false;
}

bool jacs_vm_str_ok(jacs_ctx_t *ctx, uint32_t a) {
    if (a < jacs_img_num_strings(&ctx->img))
        return true;
    jacs_runtime_failure(ctx, 60112);
    return false;
}

bool jacs_vm_args_ok(jacs_activation_t *frame, uint32_t localidx, uint32_t numargs) {
    if (numargs > 16 || localidx > frame->func->num_locals ||
        localidx + numargs > frame->func->num_locals) {
        jacs_runtime_failure(frame->fiber->ctx, 60113);
        return false;
    }
    return true;
}

static bool jacs_vm_args_and_fun_ok(jacs_activation_t *frame, uint32_t localidx, uint32_t numargs,
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
        uint8_t v = jacs_vm_fetch_byte(frame, ctx);
        r <<= 8;
        r |= v;
    }

    return n ? -r : r;
}

static void stmt1_wait_role(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_role_ok(ctx, a)) {
        frame->fiber->role_idx = a;
        jacs_fiber_set_wake_time(frame->fiber, 0);
        jacs_fiber_yield(ctx);
    }
}

static void stmt1_sleep_s(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_fiber_sleep(frame->fiber, (uint32_t)(jacs_vm_exec_expr_f64(frame) * 1000.0 + 0.5));
}

static void stmt1_sleep_ms(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_fiber_sleep(frame->fiber, jacs_vm_exec_expr_u32(frame));
}

static void stmt2_send_cmd(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_u32(frame);
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_role_ok(ctx, a))
        jacs_jd_send_cmd(ctx, a, b);
}

static void stmt3_query_reg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_u32(frame);
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    uint32_t timeout = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_role_ok(ctx, a))
        jacs_jd_get_register(ctx, a, JD_GET(b), timeout, 0);
}

static void stmt4_query_idx_reg(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_u32(frame);
    uint32_t b = jacs_vm_exec_expr_u32(frame);
    uint32_t timeout = jacs_vm_exec_expr_u32(frame);
    uint32_t stridx = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_role_ok(ctx, a) && jacs_vm_str_ok(ctx, stridx))
        jacs_jd_get_register(ctx, a, b, timeout, stridx);
}

static void stmt3_log_format(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = jacs_vm_exec_expr_u32(frame);
    uint32_t localidx = jacs_vm_exec_expr_u32(frame);
    uint32_t numargs = jacs_vm_exec_expr_u32(frame);
    if (jacs_vm_args_ok(frame, localidx, numargs) && jacs_vm_str_ok(ctx, stridx))
        jacs_jd_send_logmsg(ctx, stridx, localidx, numargs);
}

static void stmt4_format(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = jacs_vm_exec_expr_u32(frame);
    uint32_t localidx = jacs_vm_exec_expr_u32(frame);
    uint32_t numargs = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);

    if (offset > JD_SERIAL_PAYLOAD_SIZE)
        return;

    if (jacs_vm_args_ok(frame, localidx, numargs) && jacs_vm_str_ok(ctx, stridx))
        ctx->packet.service_size =
            offset + jacs_strformat(jacs_img_get_string_ptr(&ctx->img, stridx),
                                    jacs_img_get_string_len(&ctx->img, stridx),
                                    (char *)ctx->packet.data + offset,
                                    JD_SERIAL_PAYLOAD_SIZE - offset, frame->locals + localidx,
                                    numargs, 0);
}

static void stmt1_return(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    frame->fiber->ret_val = jacs_vm_exec_expr(frame);
    jacs_fiber_return_from_call(frame);
}

static void stmt2_setup_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t a = jacs_vm_exec_expr_u32(frame);
    uint32_t bufid = jacs_vm_exec_expr_u32(frame);
    if (bufid != 0 || a > JD_SERIAL_PAYLOAD_SIZE) {
        // bufid != 0 not supported yet
        jacs_runtime_failure(ctx, 60115);
    } else {
        ctx->packet.service_size = a;
        memset(ctx->packet.data, 0, a);
    }
}

static void stmt2_memcpy(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t stridx = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);

    if (jacs_vm_str_ok(ctx, stridx)) {
        int len = ctx->packet.service_size - offset;
        if (len > 0) {
            int l2 = jacs_img_get_string_len(&ctx->img, stridx);
            if (l2 < len)
                len = l2;
            memcpy(ctx->packet.data + offset, jacs_img_get_string_ptr(&ctx->img, stridx), len);
        }
    }
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

    if (jacs_vm_args_and_fun_ok(frame, localidx, numargs, fidx))
        jacs_fiber_start(ctx, fidx, frame->locals + localidx, numargs, flag);
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
    unsigned off = jacs_vm_fetch_int(frame, ctx);
    value_t v = jacs_vm_exec_expr(frame);
    if (off >= ctx->img.header->num_globals)
        jacs_runtime_failure(ctx, 60120);
    else
        ctx->globals[off] = v;
}

static void stmt4_store_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    uint32_t fmt0 = jacs_vm_exec_expr_u32(frame);
    uint32_t offset = jacs_vm_exec_expr_u32(frame);
    uint32_t bufferidx = jacs_vm_exec_expr_u32(frame);
    value_t val = jacs_vm_exec_expr(frame);
    jacs_buffer_op(frame, fmt0, offset, bufferidx, &val);
}

static void stmt_invalid(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_runtime_failure(ctx, 60121);
}

static const jacs_vm_stmt_handler_t jacs_vm_stmt_handlers[JACS_STMT_MAX + 1] = {
    [0] = stmt_invalid,
    [JACS_STMT1_WAIT_ROLE] = stmt1_wait_role,
    [JACS_STMT1_SLEEP_S] = stmt1_sleep_s,
    [JACS_STMT1_SLEEP_MS] = stmt1_sleep_ms,
    [JACS_STMT3_QUERY_REG] = stmt3_query_reg,
    [JACS_STMT2_SEND_CMD] = stmt2_send_cmd,
    [JACS_STMT4_QUERY_IDX_REG] = stmt4_query_idx_reg,
    [JACS_STMT3_LOG_FORMAT] = stmt3_log_format,
    [JACS_STMT4_FORMAT] = stmt4_format,
    [JACS_STMT2_SETUP_BUFFER] = stmt2_setup_buffer,
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

void jacs_vm_check_stmt() {
    for (unsigned i = 0; i <= JACS_STMT_MAX; i++) {
        if (jacs_vm_stmt_handlers[i] == NULL) {
            DMESG("missing stmt %d", i);
            jd_panic();
        }
    }
}

void jacs_vm_exec_stmt(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

    uint8_t op = jacs_vm_fetch_byte(frame, ctx);

    if (op >= JACS_STMT_MAX) {
        jacs_runtime_failure(ctx, 60122);
    } else {
        jacs_vm_stmt_handlers[op](frame, ctx);
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
