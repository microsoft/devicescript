#include "jd_vm.h"

#include <math.h>
#include <assert.h>

typedef struct {
    uint32_t start;  // in bytes
    uint32_t length; // in bytes
} jacs_img_section_t;

#define JACS_IMG_MAGIC0 0x5363614a // "JacS"
#define JACS_IMG_MAGIC1 0x9a6a7e0a

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint16_t num_globals;
    uint8_t reserved[64 - 4 - 4 - 2];

    jacs_img_section_t functions;      // jacs_function_desc_t[]
    jacs_img_section_t functions_data; // uint16_t[]
    jacs_img_section_t float_literals; // value_t[]
    jacs_img_section_t roles;          // jacs_role_desc_t[]
    jacs_img_section_t strings;        // jacs_img_section_t[]
    jacs_img_section_t string_data;    // "strings" points in here
} jacs_img_header_t;

STATIC_ASSERT(sizeof(jacs_img_header_t) == 64 + 6 * sizeof(jacs_img_section_t));

typedef struct {
    // position of function (must be within code section)
    uint32_t start;  // in bytes, in whole image
    uint32_t length; // in bytes
    uint16_t num_locals;
    uint8_t num_regs_and_args; //  num_regs | (num_args << 4)
    uint8_t flags;
    uint32_t reserved;
} jacs_function_desc_t;

typedef struct {
    uint32_t service_class;
    uint16_t name_idx; // index in strings section
    uint16_t reserved;
} jacs_role_desc_t;

typedef struct jacs_function_frame jacs_function_frame_t;

typedef struct {
    jd_device_service_t *service;
} jacs_role_t;

#define JACS_FIBER_FLAG_SLEEPING_ON_REG 0x0001
#define JACS_FIBER_FLAG_SLEEPING_ON_ROLE 0x0002

typedef struct jacs_fiber {
    struct jacs_fiber *next;
    jacs_role_t *sleeping_on;
    jd_packet_t *arg;      // ?
    uint16_t sleeping_reg; // 0x0000 when any packet will do
    uint32_t wake_time;
} jacs_fiber_t;

typedef struct {
    value_t regs[JACS_NUM_REGS];
    value_t *globals;

    uint16_t error_code;
    uint8_t num_roles;

    union {
        const uint32_t *img;
        const jacs_img_header_t *header;
    };

    jacs_function_frame_t *curr_fn;
    jacs_fiber_t *curr_fiber;

    jacs_fiber_t *fibers;
    jacs_role_t *roles;

    union {
        jd_frame_t frame;
        jd_packet_t packet;
    };
} jacs_ctx_t;

struct jacs_function_frame {
    jacs_ctx_t *ctx;
    jacs_function_frame_t *caller;
    const jacs_function_desc_t *func;
    uint16_t pc;
    value_t locals[0];
};

#define JACS_FMT_U8 0b0000
#define JACS_FMT_U16 0b0001
#define JACS_FMT_U32 0b0010
#define JACS_FMT_U64 0b0011
#define JACS_FMT_I8 0b0100
#define JACS_FMT_I16 0b0101
#define JACS_FMT_I32 0b0110
#define JACS_FMT_I64 0b0111
//#define JACS_FMT_F8  0b1000
//#define JACS_FMT_F16 0b1001
#define JACS_FMT_F32 0b1010
#define JACS_FMT_F64 0b1011

static value_t fail(jacs_function_frame_t *frame, int code) {
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

static void jacs_store_arg16(jacs_function_frame_t *frame, uint16_t arg, value_t v) {
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

static value_t jacs_arg16(jacs_function_frame_t *frame, uint16_t arg) {
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

static value_t jacs_arg8(jacs_function_frame_t *frame, uint8_t arg) {
    if ((arg >> 4) == JACS_ARG16_REG)
        return frame->ctx->regs[arg & 0xf]; // fast-path
    else
        return jacs_arg16(frame, ((arg >> 4) << 12) | (arg & 0xf));
}

static void setup_call(jacs_function_frame_t *caller, const jacs_function_desc_t *desc) {
    // TODO num args?
    size_t lsz = sizeof(value_t) * desc->num_locals;
    jacs_function_frame_t *frame = jd_alloc(sizeof(jacs_function_frame_t *) + lsz);
    frame->ctx = caller->ctx;
    frame->caller = caller;
    frame->func = desc;
    frame->pc = desc->start;
    memset(frame->locals, 0, lsz);
    frame->ctx->curr_fn = frame;
}

// shift_val(10) = 1024
// shift_val(0) = 1
// shift_val(-10) = 1/1024
static inline value_t shift_val(uint8_t shift) {
    uint32_t a = (0x7f + shift) << 23;
    float v;
    memcpy(&v, &a, sizeof(a));
    return v;
}

static value_t get_val(jacs_function_frame_t *frame, uint8_t offset, uint8_t fmt, uint8_t shift) {
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
    case JACS_FMT_##SZ:                                                                            \
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

static void set_val(jacs_function_frame_t *frame, uint8_t offset, uint8_t fmt, uint8_t shift,
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
    case JACS_FMT_##SZ:                                                                            \
        SZ = q < l ? l : q > h ? h : q;                                                            \
        memcpy(pkt->data + offset, &SZ, sizeof(SZ));                                               \
        break

#define SET_VAL_R(SZ)                                                                              \
    case JACS_FMT_##SZ:                                                                            \
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

static void setup_buffer(jacs_function_frame_t *frame, uint8_t size) {
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

static void jacs_step(jacs_function_frame_t *frame) {
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
    jacs_function_frame_t *frame;

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