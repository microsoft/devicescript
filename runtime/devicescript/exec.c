#include "jd_vm.h"

#include <math.h>
#include <assert.h>

#define JDVM_NUM_REGS 16

typedef float value_t;

typedef struct {
    uint16_t start;  // in words
    uint16_t length; // in words
} jdvm_img_section_t;

#define JDVM_IMG_MAGIC0 0x4d564a44 // "JDVM"
#define JDVM_IMG_MAGIC1 0x9a6a7e0a

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint16_t num_globals;
    jdvm_img_section_t functions;      // jdvm_function_desc_t[]
    jdvm_img_section_t functions_data; // uint32_t[]
    jdvm_img_section_t float_literals; // value_t[]
    jdvm_img_section_t int_literals;   // int32_t[]
    jdvm_img_section_t strings;        // jdvm_img_section_t[]
    jdvm_img_section_t string_data;    // "strings" points in here
    jdvm_img_section_t roles;          // jdvm_role_desc_t[]

    uint32_t refresh_ms_value[16];
} jdvm_img_header_t;

typedef struct {
    // position of function (must be within code section)
    uint16_t start;  // in words, in whole image
    uint16_t length; // in words
    uint8_t num_locals;
    uint8_t num_args;
    uint16_t flags;
} jdvm_function_desc_t;

typedef struct {
    uint32_t service_class;
    jdvm_img_section_t name; // within string_data section
} jdvm_role_desc_t;

typedef struct jdvm_function_frame jdvm_function_frame_t;

typedef struct {
    value_t regs[JDVM_NUM_REGS];
    value_t *globals;

    uint16_t error_code;

    union {
        const uint32_t *img;
        const jdvm_img_header_t *header;
    };

    jdvm_function_frame_t *curr_fn;

    union {
        jd_frame_t frame;
        jd_packet_t packet;
    };
} jdvm_ctx_t;

struct jdvm_function_frame {
    jdvm_ctx_t *ctx; // ???
    jdvm_function_frame_t *caller;
    const jdvm_function_desc_t *func;
    uint16_t pc;
    value_t locals[0];
};

// formats:
// $op      - 31:24      JDVM_OP_*
// $subop   - 23:20      JDVM_SUBOP_*
// $dst     - 19:16      destination register index
// $src     - $dst       used when $dst is actually source
// $left    - 15:8       left argument of binary op (arg8 enc.)
// $right   - 7:0        right argument of binary op (arg8 enc.)
// $arg16   - 15:0       argument of unary ops (arg16 enc.)
// $role    - 15:9       index into roles table
// $code    - 8:0        9 bit register or command code
// $ms      - $subop     delay in miliseconds, refresh_ms_value[] index
// $fn      - $right     points into functions section
// $str     - $right     points into string_literals section
// $offset  - $right
// $fmt     - $subop:$left

#define JDVM_OP_INVALID 0x00
#define JDVM_OP_BINARY 0x01  // $dst := $left $subop $right
#define JDVM_OP_UNARY 0x02   // $dst := $subop $arg16
#define JDVM_OP_STORE 0x03   // $arg16 := $src
#define JDVM_OP_JUMP 0x04    // jump $subop($src) $arg16 (offset)
#define JDVM_OP_CALL 0x05    // call $fn
#define JDVM_OP_CALL_BG 0x06 // callbg $fn (max pending?)
#define JDVM_OP_RET 0x07     // ret

#define JDVM_OP_SPRINTF 0x10 // buffer[$offset] = $fmt % r0,...

#define JDVM_OP_SETUP_BUFFER 0x20 // clear buffer sz=$left
#define JDVM_OP_SET_BUFFER 0x21   // buffer[$offset @ $fmt] := $src
#define JDVM_OP_GET_BUFFER 0x22   // $dst := buffer[$offset @ $fmt]

#define JDVM_OP_GET_REG 0x80  // buffer := $role.$code (max wait: $ms)
#define JDVM_OP_SET_REG 0x81  // $role.$code := buffer
#define JDVM_OP_WAIT_REG 0x82 // wait for $role.$code change, max $ms
#define JDVM_OP_WAIT_PKT 0x83 // wait for any pkt from $role, max $ms

#define JDVM_FMT_U8 0b0000
#define JDVM_FMT_U16 0b0001
#define JDVM_FMT_U32 0b0010
#define JDVM_FMT_U64 0b0011
#define JDVM_FMT_I8 0b0100
#define JDVM_FMT_I16 0b0101
#define JDVM_FMT_I32 0b0110
#define JDVM_FMT_I64 0b0111
//#define JDVM_FMT_F8  0b1000
//#define JDVM_FMT_F16 0b1001
#define JDVM_FMT_F32 0b1010
#define JDVM_FMT_F64 0b1011

#define JDVM_SUBOP_BINARY_ADD 0x1
#define JDVM_SUBOP_BINARY_SUB 0x2
#define JDVM_SUBOP_BINARY_DIV 0x3
#define JDVM_SUBOP_BINARY_MUL 0x4
#define JDVM_SUBOP_BINARY_LT 0x5
#define JDVM_SUBOP_BINARY_LE 0x6
#define JDVM_SUBOP_BINARY_EQ 0x7
#define JDVM_SUBOP_BINARY_NE 0x8
#define JDVM_SUBOP_BINARY_AND 0x9
#define JDVM_SUBOP_BINARY_OR 0xA

#define JDVM_SUBOP_UNARY_ID 0x0
#define JDVM_SUBOP_UNARY_NEG 0x1
#define JDVM_SUBOP_UNARY_NOT 0x2

#define JDVM_SUBOP_JUMP_FORWARD 0x0
#define JDVM_SUBOP_JUMP_BACK 0x1
#define JDVM_SUBOP_JUMP_FORWARD_IF_ZERO 0x2
#define JDVM_SUBOP_JUMP_BACK_IF_ZERO 0x3
#define JDVM_SUBOP_JUMP_FORWARD_IF_NOT_ZERO 0x4
#define JDVM_SUBOP_JUMP_BACK_IF_NOT_ZERO 0x5

#define JDVM_ARG16_REG 0x0
#define JDVM_ARG16_LOCAL 0x1
#define JDVM_ARG16_GLOBAL 0x2
#define JDVM_ARG16_FLOAT 0x3
#define JDVM_ARG16_INT 0x4
#define JDVM_ARG16_SPECIAL 0x5
#define JDVM_ARG16_RESERVED_6 0x6
#define JDVM_ARG16_RESERVED_7 0x7
#define JDVM_ARG16_SMALL_INT 0x8 // until 0xF

#define NUM_SPECIAL_LITS 1

static const value_t special_lits[NUM_SPECIAL_LITS] = {NAN};

static inline value_t fail(jdvm_function_frame_t *frame, int code) {
    if (!frame->ctx->error_code) {
        DMESG("error %d at %x", code, frame->pc);
        frame->ctx->error_code = code;
    }
    return 0;
}

static void jdvm_store_arg16(jdvm_function_frame_t *frame, uint16_t arg, value_t v) {
    uint32_t idx = arg & 0x0fff;
    jdvm_ctx_t *ctx = frame->ctx;
    switch (arg >> 4) {
    case JDVM_ARG16_REG:
        if (idx >= JDVM_NUM_REGS)
            fail(frame, 110);
        else
            ctx->regs[idx] = v;
        break;
    case JDVM_ARG16_LOCAL:
        if (idx >= frame->func->num_locals)
            fail(frame, 111);
        else
            frame->locals[idx] = v;
        break;
    case JDVM_ARG16_GLOBAL:
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

static value_t jdvm_arg16(jdvm_function_frame_t *frame, uint16_t arg) {
    uint32_t idx = arg & 0x0fff;
    jdvm_ctx_t *ctx = frame->ctx;
    switch (arg >> 4) {
    case JDVM_ARG16_REG:
        if (idx >= JDVM_NUM_REGS)
            return fail(frame, 102);
        return ctx->regs[idx];
    case JDVM_ARG16_LOCAL:
        if (idx >= frame->func->num_locals)
            return fail(frame, 105);
        return frame->locals[idx];
    case JDVM_ARG16_GLOBAL:
        if (idx >= ctx->header->num_globals)
            return fail(frame, 101);
        return ctx->globals[idx];
    case JDVM_ARG16_FLOAT:
        if (idx >= ctx->header->float_literals.length)
            return fail(frame, 103);
        return *(value_t *)(&ctx->img[ctx->header->float_literals.start + idx]);
    case JDVM_ARG16_INT:
        if (idx >= ctx->header->int_literals.length)
            return fail(frame, 104);
        return *(int32_t *)(&ctx->img[ctx->header->int_literals.start + idx]);
    case JDVM_ARG16_SPECIAL:
        if (idx >= NUM_SPECIAL_LITS)
            return fail(frame, 106);
        return special_lits[idx];
    default:
        if (arg >> 15)
            return (value_t)(arg & 0x7fff);
        // err 107-108 available
        return fail(frame, 109);
    }
}

static value_t jdvm_arg8(jdvm_function_frame_t *frame, uint8_t arg) {
    if ((arg >> 4) == JDVM_ARG16_REG)
        return frame->ctx->regs[arg & 0xf]; // fast-path
    else
        return jdvm_arg16(frame, ((arg >> 4) << 12) | (arg & 0xf));
}

static void setup_call(jdvm_function_frame_t *caller, const jdvm_function_desc_t *desc) {
    // TODO num args?
    size_t lsz = sizeof(value_t) * desc->num_locals;
    jdvm_function_frame_t *frame = jd_alloc(sizeof(jdvm_function_frame_t *) + lsz);
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

static value_t get_val(jdvm_function_frame_t *frame, uint8_t offset, uint8_t fmt, uint8_t shift) {
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
        fail(frame, 152);

#define GET_VAL(SZ)                                                                                \
    case JDVM_FMT_##SZ:                                                                            \
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

static void jdvm_step(jdvm_function_frame_t *frame) {
    jdvm_ctx_t *ctx = frame->ctx;

    assert(!ctx->error_code);

    uint32_t instr = ctx->img[frame->pc++];

    // we actually expect the compiler to never emit the assignments below
    // and instead use the bitops as needed in the implementation of opcodes
    int dst = (instr >> 16) & (JDVM_NUM_REGS - 1);
    int subop = (instr >> 20) & 0xf;
    uint16_t arg16 = instr & 0xffff;
    uint8_t arg8_a = (instr >> 8) & 0xff;
    uint8_t arg8_b = instr & 0xff;
    uint8_t offset = arg8_b;
    uint8_t fnidx = arg8_b;
    uint8_t stridx = arg8_b;
    uint16_t cmdcode = instr & 0x1ff;
    uint16_t roleidx = (instr >> 9) & 0x7f;
    int jmpoff;

    value_t a, b;

    switch (instr >> 24) {
    case JDVM_OP_BINARY:
        a = jdvm_arg8(frame, arg8_a);
        b = jdvm_arg8(frame, arg8_b);
        switch (subop) {
        case JDVM_SUBOP_BINARY_ADD:
            a = a + b;
            break;
        case JDVM_SUBOP_BINARY_SUB:
            a = a - b;
            break;
        case JDVM_SUBOP_BINARY_DIV:
            a = a / b;
            break;
        case JDVM_SUBOP_BINARY_MUL:
            a = a * b;
            break;
        case JDVM_SUBOP_BINARY_LT:
            a = a < b;
            break;
        case JDVM_SUBOP_BINARY_LE:
            a = a <= b;
            break;
        case JDVM_SUBOP_BINARY_EQ:
            a = a == b;
            break;
        case JDVM_SUBOP_BINARY_NE:
            a = a != b;
            break;
        case JDVM_SUBOP_BINARY_AND:
            a = !!a && !!b;
            break;
        case JDVM_SUBOP_BINARY_OR:
            a = !!a || !!b;
            break;
        default:
            fail(frame, 120);
            break;
        }
        ctx->regs[dst] = a;
        break;
    case JDVM_OP_UNARY:
        a = jdvm_arg16(frame, arg16);
        switch (subop) {
        case JDVM_SUBOP_UNARY_ID:
            break;
        case JDVM_SUBOP_UNARY_NEG:
            a = -a;
            break;
        case JDVM_SUBOP_UNARY_NOT:
            a = !a;
            break;
        default:
            fail(frame, 121);
            break;
        }
        ctx->regs[dst] = a;
        break;
    case JDVM_OP_STORE:
        jdvm_store_arg16(frame, arg16, ctx->regs[dst]);
        break;
    case JDVM_OP_JUMP:
        jmpoff = arg16;
        switch (subop >> 1) {
        case (JDVM_SUBOP_JUMP_FORWARD >> 1):
            break;
        case (JDVM_SUBOP_JUMP_FORWARD_IF_ZERO >> 1):
            if (!ctx->regs[dst])
                jmpoff = 0;
            break;
        case (JDVM_SUBOP_JUMP_FORWARD_IF_NOT_ZERO >> 1):
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
    case JDVM_OP_CALL:
#define WORDS_PER_FUN (sizeof(jdvm_function_desc_t) / 4)
        if (WORDS_PER_FUN * fnidx > ctx->header->functions.length)
            fail(frame, 123);
        else
            setup_call(frame,
                       (const jdvm_function_desc_t
                            *)(&ctx->img[ctx->header->functions.start + WORDS_PER_FUN * fnidx]));
        break;
    case JDVM_OP_RET:
        ctx->curr_fn = frame->caller;
        break;
    }
}

void jdvm_exec(jdvm_ctx_t *ctx) {
    jdvm_function_frame_t *frame;

    while (!ctx->error_code) {
        frame = ctx->curr_fn;
        if (!frame)
            break;
        uint32_t off = (uint32_t)frame->pc - (uint32_t)frame->func->start;
        if (off >= frame->func->length)
            fail(frame, 150);
        else
            jdvm_step(frame);
    }
}