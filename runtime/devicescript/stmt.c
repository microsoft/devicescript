#include "jacs_internal.h"
#include "jacs_vm_internal.h"

#define TODO() JD_ASSERT(0)

typedef void (*jacs_vm_stmt_handler_t)(jacs_activation_t *frame, jacs_ctx_t *ctx);

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
        uint8_t b = jacs_vm_fetch_byte(frame, ctx);
        r <<= 8;
        r |= b;
    }

    return n ? -r : r;
}

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

static void set_alloc(jacs_activation_t *frame, jacs_ctx_t *ctx, void *p) {
    if (p == NULL)
        jacs_runtime_failure(ctx, 60130);
    frame->fiber->ret_val = jacs_value_from_gc_obj(ctx, p);
}

static void stmt0_alloc_map(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    set_alloc(frame, ctx, jacs_map_try_alloc(ctx->gc));
}

static void stmt1_alloc_array(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    // uint32_t sz = jacs_vm_exec_expr_u32(frame);
    TODO();
}

static void stmt1_alloc_buffer(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    // uint32_t sz = jacs_vm_exec_expr_u32(frame);
    TODO();
}

static void stmtx2_set_field(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    unsigned idx = jacs_vm_fetch_int(frame, ctx);
    jacs_map_t *map = jacs_vm_exec_expr_map(frame, true);
    value_t v = jacs_vm_exec_expr(frame);
    if (map == NULL)
        jacs_runtime_failure(ctx, 60131);
    jacs_map_set(ctx, map, idx, v);
}

static void stmt3_array_set(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    TODO();
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

static void stmt_invalid(jacs_activation_t *frame, jacs_ctx_t *ctx) {
    jacs_runtime_failure(ctx, 60121);
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

/*

nan-box pointers - should allow for GC of locals/globals

nan vs undefined?

object types:
  - buffer
  - key-value map (u16 -> f64)
  - array of values
  - string

what about function values?

role -> right now index

attach kv map to role?

EXPR1_ROLE_USER_DATA: role -> kvmap
EXPR2_KV_LOOKUP: kvmap, key -> value (or nan)
STMT3_KV_STORE: kvmap, key, value

manufactured pointers

---

light client:
buffer attached to role

*/
