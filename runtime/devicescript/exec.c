#include "jacs_internal.h"

#include <math.h>
#include <assert.h>

static value_t fail(jacs_activation_t *frame, int code) {
    if (!frame->ctx->error_code) {
        DMESG("error %d at %x", code, frame->pc);
        frame->ctx->error_code = code;
    }
    return 0;
}

static value_t fail_ctx(jacs_ctx_t *ctx, int code) {
    if (!ctx->error_code) {
        DMESG("error %d at %x", code, ctx->curr_fn ? ctx->curr_fn->pc : 0);
        ctx->error_code = code;
    }
    return 0;
}

static value_t do_unop(int op, value_t v) {
    switch (op) {
    case JACS_OPUN_ID:
        return v;
    case JACS_OPUN_NEG:
        return -v;
    case JACS_OPUN_NOT:
        return v ? 0 : 1;
    case JACS_OPUN_ABS:
        return v < 0 ? -v : v;
    case JACS_OPUN_IS_NAN:
        return isnan(v) ? 1 : 0;
    default:
        oops();
        return 0;
    }
}

static value_t do_binop(int op, value_t a, value_t b) {
    switch (op) {
    case JACS_OPBIN_ADD:
        return a + b;
    case JACS_OPBIN_SUB:
        return a - b;
    case JACS_OPBIN_DIV:
        return a / b;
    case JACS_OPBIN_MUL:
        return a * b;
    case JACS_OPBIN_LT:
        return a < b ? 1 : 0;
    case JACS_OPBIN_LE:
        return a <= b ? 1 : 0;
    case JACS_OPBIN_EQ:
        return a == b ? 1 : 0;
    case JACS_OPBIN_NE:
        return a != b ? 1 : 0;
    case JACS_OPBIN_AND:
        return a ? b : a;
    case JACS_OPBIN_OR:
        return a ? a : b;
    default:
        oops();
        return 0;
    }
}

static value_t do_opmath1(int op, value_t a) {
    switch (op) {
    case JACS_OPMATH1_FLOOR:
        return floor(a);
    case JACS_OPMATH1_ROUND:
        return round(a);
    case JACS_OPMATH1_CEIL:
        return ceil(a);
    case JACS_OPMATH1_LOG_E:
        return log(a);
    case JACS_OPMATH1_RANDOM:
        return jd_random() * a / (value_t)0x100000000;
    default:
        oops();
        return 0;
    }
}

static value_t do_opmath2(int op, value_t a, value_t b) {
    switch (op) {
    case JACS_OPMATH2_MIN:
        return a < b ? a : b;
    case JACS_OPMATH2_MAX:
        return a > b ? a : b;
    case JACS_OPMATH2_POW:
        return pow(a, b);
    default:
        oops();
        return 0;
    }
}

// shift_val(10) = 1024
// shift_val(0) = 1
// shift_val(-10) = 1/1024
// TODO change to double?
static inline value_t shift_val(uint8_t shift) {
    uint32_t a = (0x7f + shift) << 23;
    float v;
    memcpy(&v, &a, sizeof(a));
    return v;
}

static value_t get_val(jacs_activation_t *frame, uint8_t offset, uint8_t fmt, uint8_t shift) {
    value_t q;
    uint8_t U8;
    uint16_t U16;
    uint32_t U32;
    uint64_t U64;
    int8_t I8;
    int16_t I16;
    int32_t I32;
    int64_t I64;
    float F32;
    double F64;

    unsigned sz = 1 << (fmt & 0b11);

    jd_packet_t *pkt = &frame->ctx->packet;

    if (offset + sz > pkt->service_size)
        return NAN;

#define GET_VAL(SZ)                                                                                \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        q = SZ;                                                                                    \
        break;

    switch (fmt) {
        GET_VAL(U8);
        GET_VAL(U16);
        GET_VAL(U32);
        GET_VAL(U64);
        GET_VAL(I8);
        GET_VAL(I16);
        GET_VAL(I32);
        GET_VAL(I64);
        GET_VAL(F32);
        GET_VAL(F64);
    default:
        fail(frame, 151);
        return 0;
    }
    if (shift)
        q *= shift_val(-shift);
    return q;
}

static value_t load_cell(jacs_ctx_t *ctx, jacs_activation_t *act, int tp, int idx, int c) {
    switch (tp) {
    case JACS_CELL_KIND_LOCAL:
        return act->locals[idx];
    case JACS_CELL_KIND_GLOBAL:
        return ctx->globals[idx];
    case JACS_CELL_KIND_BUFFER: // arg=shift:numfmt, C=Offset
        return get_val(act, c, idx & 0xf, idx >> 4);
    case JACS_CELL_KIND_FLOAT_CONST:
        return jacs_img_get_float(&ctx->img, idx);
    case JACS_CELL_KIND_IDENTITY:
        return idx;
    case JACS_CELL_KIND_SPECIAL:
        switch (idx) {
        case JACS_VALUE_SPECIAL_NAN:
            return NAN;
        case JACS_VALUE_SPECIAL_SIZE:
            return ctx->packet.service_size;
        case JACS_VALUE_SPECIAL_EV_CODE:
            if (jd_is_event(&ctx->packet))
                return ctx->packet.service_command & JD_CMD_EVENT_CODE_MASK;
            else
                return NAN;
        case JACS_VALUE_SPECIAL_REG_GET_CODE:
            if (jd_is_register_get(&ctx->packet))
                return JD_REG_CODE(ctx->packet.service_command);
            else
                return NAN;
        default:
            oops();
            return 0;
        }
    case JACS_CELL_KIND_ROLE_PROPERTY:
        switch (c) {
        case JACS_ROLE_PROPERTY_IS_CONNECTED:
            return ctx->roles[idx].service != NULL;
        default:
            oops();
            return 0;
        }
    default:
        oops();
        return 0;
    }
}

static void set_val(jacs_activation_t *frame, uint8_t offset, uint8_t fmt, uint8_t shift,
                    value_t q) {
    uint8_t U8;
    uint16_t U16;
    uint32_t U32;
    uint64_t U64;
    int8_t I8;
    int16_t I16;
    int32_t I32;
    int64_t I64;
    float F32;
    double F64;

    unsigned sz = 1 << (fmt & 0b11);

    jd_packet_t *pkt = &frame->ctx->packet;

    if (offset + sz > pkt->service_size)
        fail(frame, 152);

    if (shift)
        q *= shift_val(shift);

    if (!(fmt & 0b1000))
        q += 0.5f; // proper rounding

#define SET_VAL(SZ, l, h)                                                                          \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = q < l ? l : q > h ? h : q;                                                            \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

#define SET_VAL_R(SZ)                                                                              \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = q;                                                                                    \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

    switch (fmt) {
        SET_VAL(U8, 0, 0xff);
        SET_VAL(U16, 0, 0xffff);
        SET_VAL(U32, 0, 0xffffffff);
        SET_VAL(U64, 0, 0xffffffffffffffff);
        SET_VAL(I8, -0x80, 0x7f);
        SET_VAL(I16, -0x8000, 0x7fff);
        SET_VAL(I32, -0x80000000, 0x7fffffff);
        SET_VAL(I64, -0x8000000000000000, 0x7fffffffffffffff);
        SET_VAL_R(F32);
        SET_VAL_R(F64);
    default:
        fail(frame, 153);
        break;
    }
}

static void store_cell(jacs_ctx_t *ctx, jacs_activation_t *act, int tp, int idx, int c,
                       value_t val) {
    switch (tp) {
    case JACS_CELL_KIND_LOCAL:
        act->locals[idx] = val;
        break;
    case JACS_CELL_KIND_GLOBAL:
        ctx->globals[idx] = val;
        break;
    case JACS_CELL_KIND_BUFFER: // arg=shift:numfmt, C=Offset
        set_val(act, c, idx & 0xf, idx >> 4, val);
        break;
    default:
        oops();
    }
}

static void save_regs(jacs_activation_t *frame, uint16_t regs) {
    // TODO
}

static unsigned strformat(jacs_ctx_t *ctx, unsigned str_idx, unsigned numargs, uint8_t *dst,
                          unsigned dstlen) {
    return jacs_strformat(jacs_img_get_string_ptr(&ctx->img, str_idx),
                          jacs_img_get_string_len(&ctx->img, str_idx), (char *)dst, dstlen,
                          ctx->registers, numargs);
}

void jacs_step(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->ctx;

    assert(!ctx->error_code);

    uint32_t instr = ctx->img.instructions[frame->pc++];

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
    uint16_t a = ctx->a;
    uint16_t b = ctx->b;
    uint16_t c = ctx->c;
    uint16_t d = ctx->d;

    switch (op) {
    case JACS_OPTOP_LOAD_CELL:
    case JACS_OPTOP_STORE_CELL:
    case JACS_OPTOP_JUMP:
    case JACS_OPTOP_CALL:
        b = (b << 6) | arg6;
        break;
    }

    switch (op) {
    case JACS_OPTOP_LOAD_CELL:
    case JACS_OPTOP_STORE_CELL:
        a = (a << 2) | (arg8 >> 6);
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
        ctx->params[arg12 >> 10] |= arg10 << 12;
        break;

    case JACS_OPTOP_UNARY: // OP[4] DST[4] SRC[4]
        ctx->registers[reg1] = do_unop(subop, ctx->registers[reg2]);
        break;

    case JACS_OPTOP_BINARY: // OP[4] DST[4] SRC[4]
        ctx->registers[reg1] = do_binop(subop, ctx->registers[reg1], ctx->registers[reg2]);
        break;

    case JACS_OPTOP_LOAD_CELL: // DST[4] A:OP[2] B:OFF[6]
        ctx->registers[reg0] = load_cell(ctx, frame, a, b, c);
        break;

    case JACS_OPTOP_STORE_CELL: // SRC[4] A:OP[2] B:OFF[6]
        store_cell(ctx, frame, a, b, c, ctx->registers[reg0]);
        break;

    case JACS_OPTOP_JUMP: // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
        if (arg8 & (1 << 6) && ctx->registers[reg0])
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
            jacs_act_call_function(frame, b, subop);
            break;
        case JACS_OPCALL_BG:
        case JACS_OPCALL_BG_MAX1:
        case JACS_OPCALL_BG_MAX1_PEND1:
            jacs_ctx_start_fiber(ctx, b, subop, arg8 >> 6);
            break;
        default:
            oops();
        }
        break;

    case JACS_OPTOP_SYNC: // A:ARG[4] OP[8]
        a = (a << 4) | subop;
        switch (arg8) {
        case JACS_OPSYNC_RETURN:
            jacs_act_return_from_call(frame);
            break;
        case JACS_OPSYNC_SETUP_BUFFER: // A-size
            ctx->packet.service_size = a;
            memset(ctx->packet.data, 0, a);
            break;
        case JACS_OPSYNC_FORMAT: // A-string-index B-numargs C-offset
            ctx->packet.service_size =
                c + strformat(ctx, a, b, ctx->packet.data + c, JD_SERIAL_PAYLOAD_SIZE - c);
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
                ctx->registers[0] = 1;
            else
                ctx->registers[0] = 0;
            break;
        }
        case JACS_OPSYNC_LOG_FORMAT: { // A-string-index B-numargs
            uint8_t tmp[128];          // TODO jd_alloc?
            strformat(ctx, a, b, tmp, sizeof(tmp));
            tmp[sizeof(tmp) - 1] = 0;
            DMESG("JSCR: %s", tmp);
        } break;
        case JACS_OPSYNC_MATH1:
            ctx->registers[0] = do_opmath1(a, ctx->registers[0]);
            break;
        case JACS_OPSYNC_MATH2:
            ctx->registers[0] = do_opmath2(a, ctx->registers[0], ctx->registers[1]);
            break;
        case JACS_OPSYNC_PANIC:
            jacs_ctx_panic(ctx, a);
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
            frame->fiber->role_idx = a;
            jacs_fiber_set_wake_time(frame->fiber, 0);
            jacs_ctx_yield(ctx);
            break;
        case JACS_OPASYNC_SLEEP_MS: // A-timeout in ms
            jacs_fiber_set_wake_time(frame->fiber, now + a);
            jacs_ctx_yield(ctx);
            break;
        case JACS_OPASYNC_SLEEP_R0:
            jacs_fiber_set_wake_time(frame->fiber,
                                     now + (uint32_t)(ctx->registers[0] * 1000 + 0.5));
            jacs_ctx_yield(ctx);
            break;
        case JACS_OPASYNC_SEND_CMD: // A-role, B-code
            jacs_ctx_send_cmd(ctx, a, b);
            break;
        case JACS_OPASYNC_QUERY_REG: // A-role, B-code, C-timeout
            jacs_ctx_get_jd_register(ctx, a, JD_GET(b), c, 0);
            break;
        case JACS_OPASYNC_QUERY_IDX_REG:
            jacs_ctx_get_jd_register(ctx, a, b & 0xff, c, b >> 8);
            break;
        default:
            oops();
            break;
        }
        break;
    }

    if (!jacs_is_prefix_instr(instr))
        ctx->a = ctx->b = ctx->c = ctx->d = 0;
}

#if 0

static void jacs_store_arg16(jacs_activation_t *frame, uint16_t arg, value_t v) {
    uint32_t idx = arg & 0x0fff;
    jacs_ctx_t *ctx = frame->ctx;
    switch (arg >> 12) {
    case JACS_ARG16_REG:
        if (idx >= JACS_NUM_REGS)
            fail(frame, 110);
        else
            ctx->regs[idx] = v;
        break;
    case JACS_ARG16_LOCAL:
        if (idx >= frame->func->num_locals)
            fail(frame, 111);
        else
            frame->locals[idx] = v;
        break;
    case JACS_ARG16_GLOBAL:
        if (idx >= ctx->header->num_globals)
            fail(frame, 112);
        else
            ctx->globals[idx] = v;
        break;
    default:
        // err 113-118 available
        fail(frame, 119);
        break;
    }
}

static value_t jacs_arg16(jacs_activation_t *frame, uint16_t arg) {
    uint32_t idx = arg & 0x0fff;
    jacs_ctx_t *ctx = frame->ctx;
    switch (arg >> 12) {
    case JACS_ARG16_REG:
        if (idx >= JACS_NUM_REGS)
            return fail(frame, 102);
        return ctx->regs[idx];
    case JACS_ARG16_LOCAL:
        if (idx >= frame->func->num_locals)
            return fail(frame, 105);
        return frame->locals[idx];
    case JACS_ARG16_GLOBAL:
        if (idx >= ctx->header->num_globals)
            return fail(frame, 101);
        return ctx->globals[idx];
    case JACS_ARG16_FLOAT:
        if (idx >= ctx->header->float_literals.length)
            return fail(frame, 103);
        return *(value_t *)(&ctx->img[ctx->header->float_literals.start + idx]);
    case JACS_ARG16_INT:
        if (idx >= ctx->header->int_literals.length)
            return fail(frame, 104);
        return *(int32_t *)(&ctx->img[ctx->header->int_literals.start + idx]);
    case JACS_ARG16_SPECIAL:
        switch (idx) {
        case JACS_ARG_SPECIAL_NAN:
            return NAN;
        case JACS_ARG_SPECIAL_SIZE:
            return ctx->packet.service_size;
        default:
            return fail(frame, 0);
        }
    default:
        if (arg >> 15)
            return (value_t)(arg & 0x7fff);
        // err 107-108 available
        return fail(frame, 109);
    }
}

static value_t jacs_arg8(jacs_activation_t *frame, uint8_t arg) {
    if ((arg >> 4) == JACS_ARG16_REG)
        return frame->ctx->regs[arg & 0xf]; // fast-path
    else
        return jacs_arg16(frame, ((arg >> 4) << 12) | (arg & 0xf));
}

static void setup_call(jacs_activation_t *caller, const jacs_function_desc_t *desc) {
    // TODO num args?
    size_t lsz = sizeof(value_t) * desc->num_locals;
    jacs_activation_t *frame = jd_alloc(sizeof(jacs_activation_t *) + lsz);
    frame->ctx = caller->ctx;
    frame->caller = caller;
    frame->func = desc;
    frame->pc = desc->start;
    memset(frame->locals, 0, lsz);
    frame->ctx->curr_fn = frame;
}

static void setup_buffer(jacs_activation_t *frame, uint8_t size) {
    jd_packet_t *pkt = &frame->ctx->packet;
    if (size > JD_SERIAL_PAYLOAD_SIZE)
        fail(frame, 0);
    memset(pkt, 0, sizeof(jd_frame_t));
    pkt->service_size = size;
}

static jacs_role_t *get_role(jacs_ctx_t *ctx, uint8_t idx) {
    if (idx >= ctx->num_roles) {
        fail_ctx(ctx, 0);
        return &ctx->roles[0];
    }
    return &ctx->roles[idx];
}

static void format_string(jacs_ctx_t *ctx, uint8_t offset, uint8_t stridx) {
    if (stridx > ctx->header->strings.length) {
        fail_ctx(ctx, 0);
        return;
    }
    const jacs_img_section_t *sect = (void *)&ctx->img[ctx->header->strings.start + stridx];
    uint32_t ep = sect->start + sect->length;
    if (ep > 4 * ctx->header->string_data.length) {
        fail_ctx(ctx, 0);
        return;
    }
    const char *ptr = (const char *)&ctx->img[ctx->header->string_data.start];
    jd_packet_t *pkt = &ctx->packet;

    int sz = pkt->service_size - offset;
    if (sz > 0)
        jacs_strformat(ptr, sect->length, (char *)&pkt->data[offset], sz, ctx->regs, JACS_NUM_REGS);
}

static void jacs_step(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->ctx;

    assert(!ctx->error_code);

    uint32_t instr = ctx->img[frame->pc++];

    // we actually expect the compiler to never emit the assignments below
    // and instead use the bitops as needed in the implementation of opcodes
    int dst = (instr >> 16) & (JACS_NUM_REGS - 1);
    int subop = (instr >> 20) & 0xf;
    uint16_t arg16 = instr & 0xffff;
    uint8_t left = (instr >> 8) & 0xff;
    uint8_t right = instr & 0xff;
    uint8_t fnidx = right;
    uint8_t stridx = left;
    uint16_t cmdcode = instr & 0x1ff;
    uint16_t roleidx = (instr >> 9) & 0x7f;

    uint8_t offset = right;
    uint8_t shift = left;
    uint8_t numfmt = subop;

    int jmpoff;

    value_t a, b;

    switch (instr >> 24) {
    case JACS_OP_BINARY:
        a = jacs_arg8(frame, left);
        b = jacs_arg8(frame, right);
        switch (subop) {
        case JACS_SUBOP_BINARY_ADD:
            a = a + b;
            break;
        case JACS_SUBOP_BINARY_SUB:
            a = a - b;
            break;
        case JACS_SUBOP_BINARY_DIV:
            a = a / b;
            break;
        case JACS_SUBOP_BINARY_MUL:
            a = a * b;
            break;
        case JACS_SUBOP_BINARY_LT:
            a = a < b;
            break;
        case JACS_SUBOP_BINARY_LE:
            a = a <= b;
            break;
        case JACS_SUBOP_BINARY_EQ:
            a = a == b;
            break;
        case JACS_SUBOP_BINARY_NE:
            a = a != b;
            break;
        case JACS_SUBOP_BINARY_AND:
            a = !!a && !!b;
            break;
        case JACS_SUBOP_BINARY_OR:
            a = !!a || !!b;
            break;
        default:
            fail(frame, 120);
            break;
        }
        ctx->regs[dst] = a;
        break;
    case JACS_OP_UNARY:
        a = jacs_arg16(frame, arg16);
        switch (subop) {
        case JACS_SUBOP_UNARY_ID:
            break;
        case JACS_SUBOP_UNARY_NEG:
            a = -a;
            break;
        case JACS_SUBOP_UNARY_NOT:
            a = !a;
            break;
        default:
            fail(frame, 121);
            break;
        }
        ctx->regs[dst] = a;
        break;
    case JACS_OP_STORE:
        jacs_store_arg16(frame, arg16, ctx->regs[dst]);
        break;
    case JACS_OP_JUMP:
        jmpoff = arg16;
        switch (subop >> 1) {
        case (JACS_SUBOP_JUMP_FORWARD >> 1):
            break;
        case (JACS_SUBOP_JUMP_FORWARD_IF_ZERO >> 1):
            if (!ctx->regs[dst])
                jmpoff = 0;
            break;
        case (JACS_SUBOP_JUMP_FORWARD_IF_NOT_ZERO >> 1):
            if (ctx->regs[dst])
                jmpoff = 0;
            break;
        default:
            fail(frame, 122);
            break;
        }
        if (subop & 1)
            jmpoff = -jmpoff;
        frame->pc += jmpoff;
        break;
    case JACS_OP_CALL:
#define WORDS_PER_FUN (sizeof(jacs_function_desc_t) / 4)
        if (WORDS_PER_FUN * fnidx > ctx->header->functions.length)
            fail(frame, 123);
        else
            setup_call(frame,
                       (const jacs_function_desc_t
                            *)(&ctx->img[ctx->header->functions.start + WORDS_PER_FUN * fnidx]));
        break;
    case JACS_OP_RET:
        ctx->curr_fn = frame->caller;
        break;
    case JACS_OP_SET_BUFFER:
        set_val(frame, offset, numfmt, shift, ctx->regs[dst]);
        break;
    case JACS_OP_GET_BUFFER:
        ctx->regs[dst] = get_val(frame, offset, numfmt, shift);
        break;
    case JACS_OP_SETUP_BUFFER:
        if (subop || right)
            fail(frame, 124);
        setup_buffer(frame, offset);
        break;
    case JACS_OP_GET_REG:
        ctx->curr_fiber->sleeping_on = get_role(ctx, roleidx);
        ctx->curr_fiber->sleeping_reg = cmdcode;
        // TODO
        break;
    case JACS_OP_SPRINTF:
        format_string(ctx, offset, stridx);
        break;
    }
}

void jacs_exec(jacs_ctx_t *ctx) {
    jacs_activation_t *frame;

    while (!ctx->error_code) {
        frame = ctx->curr_fn;
        if (!frame)
            break;
        uint32_t off = (uint32_t)frame->pc - (uint32_t)frame->func->start;
        if (off >= frame->func->length)
            fail(frame, 150);
        else
            jacs_step(frame);
    }
}

const MAX_STEPS = 128 * 1024;

export function oopsPos(pos: number, msg: string): never {
    throw new Error(`verification error at ${hex(pos)}: ${msg}`);
}

export function assertPos(pos: number, cond: boolean, msg: string) {
    if (!cond) oopsPos(pos, msg);
}

export function hex(n: number) {
    return "0x" + n.toString(16);
}

function log(msg: string) {
    console.log("VM: " + msg);
}



function strFormat(fmt: Uint8Array, args: Float64Array) {
    return stringToUint8Array(strformat(uint8ArrayToString(fmt), args));
}

class Activation {
    locals: Float64Array;
    savedRegs: number;
    pc: number;

    constructor(
        public fiber: Fiber,
        public info: FunctionInfo,
        public caller: Activation,
        numargs: number
    ) {
        this->locals = new Float64Array(info.numLocals + info.numRegs);
        for (let i = 0; i < numargs; ++i)
            this->locals[i] = this->fiber.ctx->registers[i];
        this->pc = info.startPC;
    }

    restart() {
        this->pc = this->info.startPC;
    }

    private saveRegs(d: number) {
        let p = 0;
        const r = this->fiber.ctx->registers;
        for (let i = 0; i < NUM_REGS; i++) {
            if ((1 << i) & d) {
                if (p >= this->info.numRegs) oops();
                this->locals[this->info.numLocals + p] = r[i];
                p++;
            }
        }
        this->savedRegs = d;
    }

    restoreRegs() {
        if (this->savedRegs == 0) return;
        const r = this->fiber.ctx->registers;
        let p = 0;
        for (let i = 0; i < NUM_REGS; i++) {
            if ((1 << i) & this->savedRegs) {
                r[i] = this->locals[this->info.numLocals + p];
                p++;
            }
        }
        this->savedRegs = 0;
    }


    logInstr() {
        const ctx = this->fiber.ctx;
        const [a, b, c, d] = ctx->params;
        const instr = ctx->info.code[this->pc];
        log(
            `run: ${this->pc}: ${stringifyInstr(instr, {
                resolverParams: [a, b, c, d],
            })}`
        );
    }
}

function memcmp(a: Uint8Array, b: Uint8Array, sz: number) {
    for (let i = 0; i < sz; ++i) {
        const d = a[i] - b[i];
        if (d) return Math.sign(d);
    }
    return 0;
}

class Fiber {
    wake_time: number;
    role_idx: Role;
    service_command: number;
    command_arg: number;
    resend_timeout: number;
    cmdPayload: Uint8Array;

    activation: Activation;
    bottom_function_idx: FunctionInfo;
    pending: boolean;

    constructor(public ctx: Ctx) {}

    resume() {
        if (fiber->prelude()) return;
        fiber->setwake_time(0);
        fiber->role_idx = null;
        fiber->ctx->curr_fiber = fiber;
        fiber->ctx->params.fill(0);
        fiber->activate(fiber->activation);
    }

    private prelude() {
        const resumeUserCode = false;
        const keepWaiting = true;

        if (!fiber->service_command) return false;
        const role = fiber->role_idx;
        if (!role.isAttached()) {
            fiber->setwake_time(0);
            return keepWaiting; // unbound, keep waiting, no timeout
        }

        if (fiber->cmdPayload) {
            const pkt = role.mkCmd(fiber->service_command, fiber->cmdPayload);
            log(`send to ${role.info}: ${printPacket(pkt)}`);
            fiber->ctx->env.send(pkt);
            fiber->service_command = 0;
            fiber->cmdPayload = null;
            return resumeUserCode;
        }

        const pkt = fiber->ctx->packet;

        if (pkt.isReport && pkt.serviceCommand == fiber->service_command) {
            const c = new CachedRegister();
            c.code = pkt.serviceCommand;
            c.argument = fiber->command_arg;
            c.role = role;
            if (c.updateWith(role, pkt, fiber->ctx)) {
                fiber->ctx->regs.add(c);
                fiber->service_command = 0;
                pkt.data = c.value; // fiber will strip any string label
                return resumeUserCode;
            }
        }
        if (fiber->now >= fiber->wake_time) {
            const p = role.mkCmd(fiber->service_command);
            if (fiber->command_arg)
                p.data = fiber->ctx->info.stringLiterals[fiber->command_arg].slice();
            fiber->ctx->env.send(p);
            if (fiber->resend_timeout < 1000) fiber->resend_timeout *= 2;
            fiber->sleep(fiber->resend_timeout);
        }
        return keepWaiting;
    }

    activate(a: Activation) {
        fiber->activation = a;
        fiber->ctx->curr_fn = a;
        a.restoreRegs();
    }

   

    sleep(ms: number) {
        fiber->setwake_time(fiber->now + ms);
        fiber->jacs_ctx_yield(ctx);
    }

    finish() {
        log(`finish ${fiber->bottom_function_idx} ${fiber->pending ? " +pending" : ""}`);
        if (fiber->pending) {
            fiber->pending = false;
            fiber->activation.restart();
        } else {
            const idx = fiber->ctx->fibers.indexOf(fiber);
            if (idx < 0) oops();
            fiber->ctx->fibers.splice(idx, 1);
            fiber->jacs_ctx_yield(ctx);
        }
    }
}

class Role {
    device: JDDevice;
    serviceIndex: number;

    constructor(public info: RoleInfo) {}

    assign(d: JDDevice, idx: number) {
        log(`role ${this->info} <-- ${d}:${idx}`);
        this->device = d;
        this->serviceIndex = idx;
    }

    mkCmd(serviceCommand: number, payload?: Uint8Array) {
        const p = Packet.from(serviceCommand, payload || new Uint8Array(0));
        p.deviceIdentifier = this->device.deviceId;
        p.device = this->device;
        p.serviceIndex = this->serviceIndex;
        p.isCommand = true;
        return p;
    }

    isAttached() {
        return this->isCondition() || !!this->device;
    }

    isCondition() {
        return this->info.classId == SRV_JACSCRIPT_CONDITION;
    }
}

/*
// in C
uint8_t role
uint8_t arg
uint16_t code
uint32_t last_refresh
uint8_t data_size
uint8_t data[data_size]
*/

class CachedRegister {
    role: Role;
    code: number;
    argument: number;
    last_access_idx: number;
    last_refresh_time: number;
    value: Uint8Array;
    dead: boolean;

    expired(now: number, validity: number) {
        if (!validity) validity = 15 * 60 * 1000;
        return this->last_refresh_time + validity <= now;
    }

    updateWith(role: Role, pkt: Packet, ctx: Ctx) {
        if (this->dead) return false;
        if (this->role != role) return false;
        if (this->code != pkt.serviceCommand) return false;
        if (!pkt.isReport) return false;
        let val = pkt.data;
        if (this->argument) {
            const arg = ctx->info.stringLiterals[this->argument];
            if (
                pkt.data.length >= arg.length + 1 &&
                pkt.data[arg.length] == 0 &&
                memcmp(pkt.data, arg, arg.length) == 0
            ) {
                val = pkt.data.slice(arg.length + 1);
            } else {
                val = null;
            }
        }
        if (val) {
            this->last_refresh_time = now;
            this->value = val.slice();
            return true;
        } else {
            return false;
        }
    }
}

const MAX_REG_CACHE = 50;
const HALF_REG_CACHE = MAX_REG_CACHE >> 1;

class RegisterCache {
    private regs: CachedRegister[] = [];
    private access_idx = 0;

    markUsed(c: CachedRegister) {
        c.last_access_idx = this->access_idx++;
    }
    lookup(role: Role, code: number, arg = 0) {
        return this->regs.find(
            r =>
                !r.dead && r.role == role && r.code == code && r.argument == arg
        );
    }
    detachRole(role: Role) {
        for (const r of this->regs) if (r.role == role) r.dead = true;
    }
    roleChanged(now: number, role: Role) {
        for (const r of this->regs) {
            if (r.role == role) {
                // if the role changed, push all it's registers' last update time at least 10s in the past
                r.last_refresh_time = Math.min(
                    r.last_refresh_time,
                    now - 10000
                );
            }
        }
    }
    updateWith(role: Role, pkt: Packet, ctx: Ctx) {
        for (const r of this->regs) r.updateWith(role, pkt, ctx);
    }
    add(c: CachedRegister) {
        if (this->regs.length >= MAX_REG_CACHE) {
            let old_access = 0;
            let num_live = 0;
            for (;;) {
                let min_access = this->access_idx;
                num_live = 0;
                for (const r of this->regs) {
                    if (r.last_access_idx <= old_access) r.dead = true;
                    if (r.dead) continue;
                    min_access = Math.min(r.last_access_idx, min_access);
                    num_live++;
                }
                if (num_live <= HALF_REG_CACHE) break;
                old_access = min_access - 2;
            }
            this->regs = this->regs.filter(r => !r.dead);
        }
        this->regs.push(c);
        this->markUsed(c);
    }
}

const RESTART_PANIC_CODE = 0x100000;
const INTERNAL_ERROR_PANIC_CODE = 0x100001;

class Ctx {
    pkt: Packet;
    registers = new Float64Array(NUM_REGS);
    params = new Uint16Array(4);
    globals: Float64Array;
    curr_fiber: Fiber;
    fibers: Fiber[] = [];
    curr_fn: Activation;
    roles: Role[];
    wake_timeout: any;
    wakeUpdated = false;
    panicCode = 0;
    onPanic: (code: number) => void;
    onError: (err: Error) => void;
    bus: JDBus;
    regs = new RegisterCache();

    constructor(public info: ImageInfo, public env: JacsEnv) {
        this->globals = new Float64Array(this->info.numGlobals);
        this->roles = info.roles.map(r => new Role(r));

        this->env.onPacket = this->processPkt.bind(this);

        this->env.roleManager.setRoles(
            this->roles
                .filter(r => !r.isCondition())
                .map(r => ({
                    name: r.info.roleName,
                    classIdenitifer: r.info.classId,
                }))
        );

        this->env.roleManager.onAssignmentsChanged =
            this->syncRoleAssignments.bind(this);

        this->wakeFibers = this->wakeFibers.bind(this);
    }

    private syncRoleAssignments() {
        const assignedRoles: Role[] = [];
        for (const r of this->roles) {
            if (r.isCondition()) continue;
            const curr = this->env.roleManager.getRole(r.info.roleName);
            if (
                curr.device != r.device ||
                curr.serviceIndex != r.serviceIndex
            ) {
                assignedRoles.push(r);
                r.assign(curr.device, curr.serviceIndex);
                if (!curr.device) this->regs.detachRole(r);
            }
        }
        if (assignedRoles.length) {
            for (const r of assignedRoles) {
                this->pkt = Packet.from(0xffff, new Uint8Array(0));
                if (r.device) this->pkt.deviceIdentifier = r.device.deviceId;
                this->wakeRole(r);
            }
            this->pokeFibers();
        }
    }

    now() {
        return this->env.now();
    }

    startProgram() {
        this->startFiber(this->info.functions[0], 0, JACS_OPCALL_BG);
        this->pokeFibers();
    }

    wake_timesUpdated() {
        this->wakeUpdated = true;
    }


    private clearwake_timer() {
        if (this->wake_timeout !== undefined) {
            this->env.clearTimeout(this->wake_timeout);
            this->wake_timeout = undefined;
        }
    }

    private run(f: Fiber) {
        if (this->panicCode) return;
        try {
            f.resume();
            let maxSteps = MAX_STEPS;
            while (this->curr_fn) {
                this->curr_fn.step();
                if (!--maxSteps) throw new Error("execution timeout");
            }
        } catch (e) {
            if (this->panicCode) {
                this->onPanic(this->panicCode);
            } else {
                try {
                    // this will set this->panicCode, so we don't run any code anymore
                    this->panic(INTERNAL_ERROR_PANIC_CODE);
                } catch {}
                this->onError(e);
            }
        }
    }

    private pokeFibers() {
        if (this->wakeUpdated) this->wakeFibers();
    }

    private wakeFibers() {
        if (this->panicCode) return;

        let minTime = 0;

        this->clearwake_timer();

        this->pkt = Packet.onlyHeader(0xffff);

        for (;;) {
            let numRun = 0;
            const now = this->now();
            minTime = Infinity;
            for (const f of this->fibers) {
                if (!f.wake_time) continue;
                const wake_time = f.wake_time;
                if (now >= wake_time) {
                    this->run(f);
                    if (this->panicCode) return;
                    numRun++;
                } else {
                    minTime = Math.min(wake_time, minTime);
                }
            }

            if (numRun == 0 && minTime > this->now()) break;
        }

        this->wakeUpdated = false;
        if (minTime < Infinity) {
            const delta = Math.max(0, minTime - this->now());
            this->wake_timeout = this->env.setTimeout(this->wakeFibers, delta);
        }
    }

    private wakeRole(role: Role) {
        for (const f of this->fibers)
            if (f.role_idx == role) {
                if (false)
                    log(
                        `wake ${f.bottom_function_idx} r=${
                            role.info
                        } pkt=${this->pkt.toString()}`
                    );
                this->run(f);
            }
    }

    private processPkt(pkt: Packet) {
        if (this->panicCode) return;
        if (pkt.isRepeatedEvent) return;

        this->pkt = pkt;
        if (false && pkt.serviceIndex != 0)
            console.log(new Date(), "process: " + printPacket(pkt));
        for (let idx = 0; idx < this->roles.length; ++idx) {
            const r = this->roles[idx];
            if (
                r.device == pkt.device &&
                (r.serviceIndex == pkt.serviceIndex ||
                    (pkt.serviceIndex == 0 && pkt.serviceCommand == 0))
            ) {
                if (pkt.eventCode === SystemEvent.Change)
                    this->regs.roleChanged(this->now(), r);
                this->regs.updateWith(r, pkt, this);
                this->wakeRole(r);
            }
        }
        this->pokeFibers();
    }

    doYield() {
        const f = this->curr_fiber;
        this->curr_fiber = null;
        this->curr_fn = null;
        return f;
    }

    private pktLabel() {
        return fromUTF8(uint8ArrayToString(this->pkt.data));
    }
}

export enum RunnerState {
    Initializing,
    Running,
    Error,
}

export class Runner {
    private ctx: Ctx;
    img: ImageInfo;
    allowRestart = false;
    options: JacsEnvOptions = {};
    state = RunnerState.Initializing;
    startDelay = 1100;
    onError: (err: Error) => void = null;
    onPanic: (code: number) => void = null;

    constructor(
        public bus: JDBus,
        public bin: Uint8Array,
        public dbg: DebugInfo = emptyDebugInfo()
    ) {
        this->img = new ImageInfo(bin, dbg);
    }

    run() {
        if (!this->img.roles.some(r => r.classId == SRV_JACSCRIPT_CLOUD))
            this->options.disableCloud = true;
        this->ctx = new Ctx(this->img, new JDBusJacsEnv(this->bus, this->options));
        this->ctx->onError = e => {
            console.error("Internal error", e.stack);
            this->state = RunnerState.Error;
            if (this->onError) this->onError(e);
        };
        this->ctx->onPanic = code => {
            if (code == RESTART_PANIC_CODE) code = 0;
            if (code) console.error(`PANIC ${code}`);
            if (this->onPanic) this->onPanic(code);
            if (this->allowRestart) this->run();
        };
        this->bus.scheduler.setTimeout(() => {
            this->state = RunnerState.Running;
            this->ctx->startProgram();
        }, this->startDelay);
    }
}

#endif