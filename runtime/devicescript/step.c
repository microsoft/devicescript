#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

static value_t do_unop(int op, value_t v) {
    switch (op) {
    case JACS_OPUN_ID:
        return v;
    case JACS_OPUN_NOT:
        return jacs_value_from_int(!jacs_value_to_bool(v));
    case JACS_OPUN_BIT_NOT:
        return jacs_value_from_int(~jacs_value_to_int(v));
    case JACS_OPUN_TO_BOOL:
        return jacs_value_from_int(jacs_value_to_bool(v));
    }

    if (jacs_is_tagged_int(v)) {
        int q = v.mantisa32;
        switch (op) {
        case JACS_OPUN_NEG:
            if (q == INT_MIN)
                return jacs_max_int_1;
            else
                return jacs_value_from_int(-q);
        case JACS_OPUN_ABS:
            if (q < 0) {
                if (q == INT_MIN)
                    return jacs_max_int_1;
                else
                    return jacs_value_from_int(-q);
            } else {
                return v;
            }
        case JACS_OPUN_IS_NAN:
            return jacs_zero;
        default:
            oops();
        }
    } else {
        switch (op) {
        case JACS_OPUN_NEG:
            return jacs_value_from_double(-v.f);
        case JACS_OPUN_ABS:
            return v.f < 0 ? jacs_value_from_double(-v.f) : v;
        case JACS_OPUN_IS_NAN:
            return jacs_value_from_bool(isnan(v.f));
        default:
            oops();
        }
    }
}

static value_t do_binop(int op, value_t a, value_t b) {
    switch (op) {
    case JACS_OPBIN_BIT_AND:
        return jacs_value_from_int(jacs_value_to_int(a) & jacs_value_to_int(b));
    case JACS_OPBIN_BIT_OR:
        return jacs_value_from_int(jacs_value_to_int(a) | jacs_value_to_int(b));
    case JACS_OPBIN_BIT_XOR:
        return jacs_value_from_int(jacs_value_to_int(a) ^ jacs_value_to_int(b));
    case JACS_OPBIN_SHIFT_LEFT:
        return jacs_value_from_int(jacs_value_to_int(a) << (jacs_value_to_int(b) & 31));
    case JACS_OPBIN_SHIFT_RIGHT:
        return jacs_value_from_int(jacs_value_to_int(a) >> (jacs_value_to_int(b) & 31));
    case JACS_OPBIN_SHIFT_RIGHT_UNSIGNED: {
        uint32_t tmp = (uint32_t)jacs_value_to_int(a) >> (jacs_value_to_int(b) & 31);
        if (tmp >> 31)
            return jacs_value_from_double(tmp);
        else
            return jacs_value_from_int(tmp);
    }
    }

    if (jacs_is_tagged_int(a) && jacs_is_tagged_int(b)) {
        int aa = a.mantisa32;
        int bb = b.mantisa32;
        int r;

        switch (op) {
        case JACS_OPBIN_ADD:
            if (__builtin_sadd_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_SUB:
            if (__builtin_ssub_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_DIV:
            // not sure this is worth it on M0+
            if ((bb == -1 && aa == INT_MIN) || ((r = aa / bb)) * bb != aa)
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_MUL:
            if (__builtin_smul_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_LT:
            return jacs_value_from_bool(aa < bb);
        case JACS_OPBIN_LE:
            return jacs_value_from_bool(aa <= bb);
        case JACS_OPBIN_EQ:
            return jacs_value_from_bool(aa == bb);
        case JACS_OPBIN_NE:
            return jacs_value_from_bool(aa != bb);

        default:
            oops();
        }
    }

    double af = jacs_value_to_double(a);
    double bf = jacs_value_to_double(b);

    switch (op) {
    case JACS_OPBIN_ADD:
        return jacs_value_from_double(af + bf);
    case JACS_OPBIN_SUB:
        return jacs_value_from_double(af - bf);
    case JACS_OPBIN_DIV:
        return jacs_value_from_double(af / bf);
    case JACS_OPBIN_MUL:
        return jacs_value_from_double(af * bf);
    case JACS_OPBIN_LT:
        return jacs_value_from_bool(af < bf);
    case JACS_OPBIN_LE:
        return jacs_value_from_bool(af <= bf);
    case JACS_OPBIN_EQ:
        return jacs_value_from_bool(af == bf);
    case JACS_OPBIN_NE:
        return jacs_value_from_bool(af != bf);

    default:
        oops();
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

static value_t do_opmath1(int op, value_t a) {
    if (jacs_is_tagged_int(a)) {
        switch (op) {
        case JACS_OPMATH1_FLOOR:
        case JACS_OPMATH1_ROUND:
        case JACS_OPMATH1_CEIL:
            return a;
        }
    }

    double af = jacs_value_to_double(a);

    switch (op) {
    case JACS_OPMATH1_FLOOR:
        return jacs_value_from_double(floor(af));
    case JACS_OPMATH1_ROUND:
        return jacs_value_from_double(round(af));
    case JACS_OPMATH1_CEIL:
        return jacs_value_from_double(ceil(af));
    case JACS_OPMATH1_LOG_E:
        return jacs_value_from_double(log(af));
    case JACS_OPMATH1_RANDOM:
        return jacs_value_from_double(jd_random() * af / (double)0x100000000);
    case JACS_OPMATH1_RANDOM_INT:
        return jacs_value_from_int(random_max(jacs_value_to_int(a)));
    default:
        oops();
    }
}

static value_t do_opmath2(int op, value_t a, value_t b) {
    if (jacs_is_tagged_int(a) && jacs_is_tagged_int(b)) {
        int aa = a.mantisa32;
        int bb = b.mantisa32;
        switch (op) {
        case JACS_OPMATH2_MIN:
            return aa < bb ? a : b;
        case JACS_OPMATH2_MAX:
            return aa > bb ? a : b;
        }
    }

    double af = jacs_value_to_double(a);
    double bf = jacs_value_to_double(b);

    switch (op) {
    case JACS_OPMATH2_MIN:
        return af < bf ? a : b;
    case JACS_OPMATH2_MAX:
        return af > bf ? a : b;
    case JACS_OPMATH2_POW:
        return jacs_value_from_double(pow(af, bf));
    default:
        oops();
    }
}

// shift_val(10) = 1024
// shift_val(0) = 1
// shift_val(-10) = 1/1024
static inline double shift_val(int shift) {
    value_t t = {0};
    t.exponent = 0x3ff + shift;
    return t.f;
}

static value_t get_val(jacs_activation_t *frame, uint8_t offset, uint8_t fmt, uint8_t shift) {
    int is_float = 0;
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

    jacs_ctx_t *ctx = frame->fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;

    if (offset + sz > pkt->service_size) {
        // DMESG("gv NAN at pc=%d sz=%d %x", frame->pc, pkt->service_size, pkt->service_command);
        return jacs_nan;
    }

#define GET_VAL_INT(SZ)                                                                            \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        I32 = SZ;                                                                                  \
        break;

#define GET_VAL_UINT(SZ)                                                                           \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        if (SZ <= INT_MAX)                                                                         \
            I32 = SZ;                                                                              \
        else {                                                                                     \
            is_float = 1;                                                                          \
            F64 = SZ;                                                                              \
        }                                                                                          \
        break;

#define GET_VAL_DBL(SZ)                                                                            \
    case JACS_NUMFMT_##SZ:                                                                         \
        memcpy(&SZ, pkt->data + offset, sizeof(SZ));                                               \
        is_float = 1;                                                                              \
        F64 = SZ;                                                                                  \
        break;

    switch (fmt) {
        GET_VAL_INT(U8);
        GET_VAL_INT(U16);
        GET_VAL_UINT(U32);
        GET_VAL_UINT(U64);
        GET_VAL_INT(I8);
        GET_VAL_INT(I16);
        GET_VAL_INT(I32);
        GET_VAL_DBL(I64);
        GET_VAL_DBL(F32);
        GET_VAL_DBL(F64);
    default:
        oops();
    }

    if (!shift && !is_float)
        return jacs_value_from_int(I32);

    if (!is_float)
        F64 = I32;

    if (shift)
        F64 *= shift_val(-shift);

    return jacs_value_from_double(F64);
}

static value_t load_cell(jacs_ctx_t *ctx, jacs_activation_t *act, int tp, int idx, int b, int c,
                         int d) {
    switch (tp) {
    case JACS_CELL_KIND_LOCAL:
        return act->locals[idx];
    case JACS_CELL_KIND_GLOBAL:
        return ctx->globals[idx];
    case JACS_CELL_KIND_BUFFER: // arg=shift:numfmt, C=Offset
        return get_val(act, c, b & 0xf, b >> 4);
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
            return jacs_value_from_bool(ctx->roles[b]->service != NULL);
        default:
            oops();
        }
    default:
        oops();
    }
}

static int clamp_int(value_t v, int l, int h) {
    int vv = jacs_value_to_int(v);
    if (vv < l)
        return l;
    if (vv > h)
        return h;
    return vv;
}

static double clamp_double(value_t v, double l, double h) {
    double vv = jacs_value_to_double(v);
    if (vv < l)
        return l;
    if (vv > h)
        return h;
    return vv;
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

    jacs_ctx_t *ctx = frame->fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;

    if (offset + sz > pkt->service_size)
        oops(); // ?

    if (shift || !jacs_is_tagged_int(q)) {
        double qq = jacs_value_to_double(q) * shift_val(shift);
        if (!(fmt & 0b1000))
            qq += 0.5; // proper rounding
        q = jacs_value_from_double(qq);
    }

#define SET_VAL(SZ, l, h)                                                                          \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = clamp_int(q, l, h);                                                                   \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

#define SET_VAL_U(SZ, l, h)                                                                        \
    case JACS_NUMFMT_##SZ:                                                                         \
        if (jacs_is_tagged_int(q) && (int)q.mantisa32 > 0)                                         \
            SZ = q.mantisa32;                                                                      \
        else                                                                                       \
            SZ = clamp_double(q, l, h);                                                            \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

#define SET_VAL_R(SZ)                                                                              \
    case JACS_NUMFMT_##SZ:                                                                         \
        SZ = jacs_value_to_double(q);                                                              \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

    switch (fmt) {
        SET_VAL(U8, 0, 0xff);
        SET_VAL(U16, 0, 0xffff);
        SET_VAL_U(U32, 0, 0xffffffff);
        SET_VAL_U(U64, 0, (double)0xffffffffffffffff);
        SET_VAL(I8, -0x80, 0x7f);
        SET_VAL(I16, -0x8000, 0x7fff);
        SET_VAL(I32, -0x80000000, 0x7fffffff);
        SET_VAL_U(I64, -0x8000000000000000, (double)0x7fffffffffffffff);
        SET_VAL_R(F32);
        SET_VAL_R(F64);
    default:
        oops();
        break;
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
        ctx->globals[idx] = val;
        break;
    case JACS_CELL_KIND_BUFFER: // arg=shift:numfmt, C=Offset
        set_val(act, c, b & 0xf, b >> 4, val);
        break;
    default:
        oops();
    }
}

value_t *jacs_act_saved_regs_ptr(jacs_activation_t *act) {
    return &act->locals[act->func->num_locals];
}

static void save_regs(jacs_activation_t *act, unsigned regs) {
    value_t *r = act->fiber->ctx->registers;
    value_t *saved0 = jacs_act_saved_regs_ptr(act);
    value_t *saved = saved0;
    for (unsigned i = 0; i < JACS_NUM_REGS; i++) {
        if ((1 << i) & regs) {
            if ((saved - saved0) >= (act->func->num_regs_and_args & 0xf))
                oops();
            *saved++ = r[i];
        }
    }
    act->saved_regs = regs;
}

void jacs_act_restore_regs(jacs_activation_t *act) {
    if (act->saved_regs == 0)
        return;
    value_t *r = act->fiber->ctx->registers;
    value_t *saved = jacs_act_saved_regs_ptr(act);
    for (unsigned i = 0; i < JACS_NUM_REGS; i++) {
        if ((1 << i) & act->saved_regs) {
            r[i] = *saved++;
        }
    }
    act->saved_regs = 0;
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
        ctx->params[arg12 >> 10] |= arg10 << 12;
        break;

    case JACS_OPTOP_UNARY: // OP[4] DST[4] SRC[4]
        ctx->registers[reg1] = do_unop(subop, ctx->registers[reg2]);
        break;

    case JACS_OPTOP_BINARY: // OP[4] DST[4] SRC[4]
        ctx->registers[reg1] = do_binop(subop, ctx->registers[reg1], ctx->registers[reg2]);
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
            ctx->packet.service_size = a;
            memset(ctx->packet.data, 0, a);
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
            ctx->registers[0] = do_opmath1(a, ctx->registers[0]);
            break;
        case JACS_OPSYNC_MATH2:
            ctx->registers[0] = do_opmath2(a, ctx->registers[0], ctx->registers[1]);
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
            frame->fiber->role_idx = a;
            jacs_fiber_set_wake_time(frame->fiber, 0);
            jacs_fiber_yield(ctx);
            break;
        case JACS_OPASYNC_SLEEP_MS: // A-timeout in ms
            jacs_fiber_sleep(frame->fiber, a);
            break;
        case JACS_OPASYNC_SLEEP_R0:
            jacs_fiber_sleep(frame->fiber,
                             (uint32_t)(jacs_value_to_double(ctx->registers[0]) * 1000 + 0.5));
            break;
        case JACS_OPASYNC_SEND_CMD: // A-role, B-code
            jacs_jd_send_cmd(ctx, a, b);
            break;
        case JACS_OPASYNC_QUERY_REG: // A-role, B-code, C-timeout
            jacs_jd_get_register(ctx, a, JD_GET(b), c, 0);
            break;
        case JACS_OPASYNC_QUERY_IDX_REG:
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
