#include "jacs_internal.h"

#include <math.h>

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

    jacs_ctx_t *ctx = frame->fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;

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
        oops();
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

    jacs_ctx_t *ctx = frame->fiber->ctx;
    jd_packet_t *pkt = &ctx->packet;

    if (offset + sz > pkt->service_size)
        oops(); // ?

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
        oops();
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

static void save_regs(jacs_activation_t *act, unsigned regs) {
    unsigned p = 0;
    value_t *r = act->fiber->ctx->registers;
    unsigned numloc = act->func->num_locals;
    for (unsigned i = 0; i < JACS_NUM_REGS; i++) {
        if ((1 << i) & regs) {
            if (p >= (act->func->num_regs_and_args & 0xf))
                oops();
            act->locals[numloc + p] = r[i];
            p++;
        }
    }
    act->saved_regs = regs;
}

void jacs_act_restore_regs(jacs_activation_t *act) {
    if (act->saved_regs == 0)
        return;
    value_t *r = act->fiber->ctx->registers;
    unsigned numloc = act->func->num_locals;
    unsigned p = 0;
    for (unsigned i = 0; i < JACS_NUM_REGS; i++) {
        if ((1 << i) & act->saved_regs) {
            r[i] = act->locals[numloc + p];
            p++;
        }
    }
    act->saved_regs = 0;
}

static unsigned strformat(jacs_ctx_t *ctx, unsigned str_idx, unsigned numargs, uint8_t *dst,
                          unsigned dstlen) {
    return jacs_strformat(jacs_img_get_string_ptr(&ctx->img, str_idx),
                          jacs_img_get_string_len(&ctx->img, str_idx), (char *)dst, dstlen,
                          ctx->registers, numargs);
}

void jacs_act_step(jacs_activation_t *frame) {
    jacs_ctx_t *ctx = frame->fiber->ctx;

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

    case JACS_OPTOP_SYNC: // A:ARG[4] OP[8]
        a = (a << 4) | subop;
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
            jacs_fiber_sleep(frame->fiber, (uint32_t)(ctx->registers[0] * 1000 + 0.5));
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
        ctx->globals = new Float64Array(ctx->info.numGlobals);
        ctx->roles = info.roles.map(r => new Role(r));

        ctx->env.onPacket = ctx->processPkt.bind(ctx);

        ctx->env.roleManager.setRoles(
            ctx->roles
                .filter(r => !r.isCondition())
                .map(r => ({
                    name: r.info.roleName,
                    classIdenitifer: r.info.classId,
                }))
        );

        ctx->env.roleManager.onAssignmentsChanged =
            ctx->syncRoleAssignments.bind(ctx);

        ctx->wakeFibers = ctx->wakeFibers.bind(ctx);
    }

    private syncRoleAssignments() {
        const assignedRoles: Role[] = [];
        for (const r of ctx->roles) {
            if (r.isCondition()) continue;
            const curr = ctx->env.roleManager.getRole(r.info.roleName);
            if (
                curr.device != r.device ||
                curr.serviceIndex != r.serviceIndex
            ) {
                assignedRoles.push(r);
                r.assign(curr.device, curr.serviceIndex);
                if (!curr.device) ctx->regs.detachRole(r);
            }
        }
        if (assignedRoles.length) {
            for (const r of assignedRoles) {
                ctx->packet = Packet.from(0xffff, new Uint8Array(0));
                if (r.device) ctx->packet.deviceIdentifier = r.device.deviceId;
                ctx->wakeRole(r);
            }
            ctx->pokeFibers();
        }
    }

    startProgram() {
        ctx->startFiber(ctx->info.functions[0], 0, JACS_OPCALL_BG);
        ctx->pokeFibers();
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