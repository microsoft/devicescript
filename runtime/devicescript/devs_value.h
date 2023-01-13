#pragma once
#include <stdint.h>
#include <stdbool.h>

typedef union {
    double _f;
    uint64_t u64;
    struct {
        uint32_t mantissa32;
        uint32_t mantissa20 : 20;
        uint32_t exponent : 11;
        uint32_t sign : 1;
    };
    struct {
        int32_t val_int32;
        uint32_t exp_sign;
    };
    // this is for better view in the debugger
    struct {
        uint32_t handle_value;
        uint32_t handle_type : 4;
        uint32_t handle_hi_value : 16;
        uint32_t handle_eq_0 : 11;
        uint32_t handle_unused : 1;
    };
} value_t;

#define DEVS_INT_TAG (0U - 1U)
#define DEVS_HANDLE_TAG 0x00000000

// closure: ptr to env + static fn
// bound fn: ptr to gc_obj + static fn

#define DEVS_HANDLE_TYPE_MASK 0xf

#define DEVS_HANDLE_TYPE_FLOAT64 0x10

#define DEVS_HANDLE_TYPE_SPECIAL 0x0
#define DEVS_HANDLE_TYPE_FIBER 0x1
#define DEVS_HANDLE_TYPE_ROLE 0x2
#define DEVS_HANDLE_TYPE_STATIC_FUNCTION 0x3
#define DEVS_HANDLE_TYPE_IMG_BUFFERISH 0x4
#define DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC 0x5
#define DEVS_HANDLE_TYPE_ROLE_MEMBER 0x6

#define DEVS_HANDLE_TYPE_GC_OBJECT 0x8 // see devs_handle_type_is_ptr()
#define DEVS_HANDLE_TYPE_CLOSURE 0x9
#define DEVS_HANDLE_TYPE_BOUND_FUNCTION 0xA

#define DEVS_SPECIAL_NULL 0 // has to be zero! NULL is represented as all zero
#define DEVS_SPECIAL_FALSE 1
#define DEVS_SPECIAL_NAN 2
#define DEVS_SPECIAL_TRUE 0x40
#define DEVS_SPECIAL_INF 0x42
#define DEVS_SPECIAL_MINF 0x43

#define DEVS_PACK_SHIFT 28

#define DEVS_SPECIAL_THROW_JMP_OFF 0x400
#define DEVS_SPECIAL_THROW_JMP_LEVEL_SHIFT 4
#define DEVS_SPECIAL_THROW_JMP_LEVEL_MAX ((1 << DEVS_SPECIAL_THROW_JMP_LEVEL_SHIFT) - 1)
#define DEVS_SPECIAL_THROW_JMP_PC_MAX                                                              \
    ((1 << (DEVS_PACK_SHIFT - DEVS_SPECIAL_THROW_JMP_LEVEL_SHIFT)) - 1)

#define DEVS_SPECIAL_BUILTIN_OBJ_FIRST 0x60
#define DEVS_SPECIAL_BUILTIN_OBJ_LAST (DEVS_SPECIAL_BUILTIN_OBJ_FIRST + DEVS_BUILTIN_OBJECT___MAX)

value_t devs_value_encode_throw_jmp_pc(int pc, unsigned lev);

static inline bool devs_handle_is_builtin(uint32_t hv) {
    return DEVS_SPECIAL_BUILTIN_OBJ_FIRST <= hv && hv <= DEVS_SPECIAL_BUILTIN_OBJ_LAST;
}

static inline bool devs_handle_is_throw_jmp(uint32_t hv) {
    return hv >= DEVS_SPECIAL_THROW_JMP_OFF;
}

static inline int devs_handle_decode_throw_jmp_pc(uint32_t hv, unsigned *lev) {
    hv -= DEVS_SPECIAL_THROW_JMP_OFF;
    *lev = hv & DEVS_SPECIAL_THROW_JMP_LEVEL_MAX;
    return hv >> DEVS_SPECIAL_THROW_JMP_LEVEL_SHIFT;
}

static inline bool devs_is_tagged_int(value_t t) {
    return (t.exp_sign + 1) == 0;
}

static inline bool devs_handle_type_is_ptr(int tp) {
    return (tp & 0x8) != 0;
}

static inline bool devs_is_handle(value_t t) {
    return t.exponent == 0;
}

static inline int devs_handle_type(value_t t) {
    return devs_is_handle(t) ? (t.exp_sign & DEVS_HANDLE_TYPE_MASK) : DEVS_HANDLE_TYPE_FLOAT64;
}

static inline uint32_t devs_handle_value(value_t t) {
    return t.mantissa32;
}

// high_value is 16 bit
static inline uint16_t devs_handle_high_value(value_t t) {
    return (t.exp_sign << 12) >> (12 + 4);
}

static inline bool devs_handle_is_ptr(value_t t) {
    return devs_handle_type_is_ptr(devs_handle_type(t));
}

#if JD_64
void *devs_handle_ptr_value(devs_ctx_t *ctx, value_t t);
#else
static inline void *devs_handle_ptr_value(devs_ctx_t *ctx, value_t t) {
    return (void *)t.mantissa32;
}
#endif

static inline value_t devs_value_from_handle(int type, uint32_t value) {
    value_t r;
    r.exp_sign = DEVS_HANDLE_TAG + type;
    r.mantissa32 = value;
    return r;
}

static inline bool devs_is_null(value_t t) {
    return t.u64 == 0;
}

static inline bool devs_bufferish_is_buffer(value_t v) {
    return (devs_handle_value(v) >> DEVS_STRIDX__SHIFT) == DEVS_STRIDX_BUFFER;
}

static inline bool devs_is_special(value_t t) {
    return t.exp_sign == DEVS_HANDLE_TAG + DEVS_HANDLE_TYPE_SPECIAL;
}

static inline bool devs_is_nan(value_t t) {
    return devs_is_special(t) && devs_handle_value(t) == DEVS_SPECIAL_NAN;
}

bool devs_is_nullish(value_t t);
// this excludes NaN and Inf
bool devs_is_number(value_t t);

value_t devs_value_from_double(double v);
value_t devs_value_from_int(int v);
value_t devs_value_from_bool(int v);
value_t devs_value_from_pointer(devs_ctx_t *ctx, int handle_type, void *ptr);
static inline value_t devs_value_from_gc_obj(devs_ctx_t *ctx, void *ptr) {
    return devs_value_from_pointer(ctx, DEVS_HANDLE_TYPE_GC_OBJECT, ptr);
}

int32_t devs_value_to_int(devs_ctx_t *ctx, value_t v);
double devs_value_to_double(devs_ctx_t *ctx, value_t v);
bool devs_value_to_bool(devs_ctx_t *ctx, value_t v);

bool devs_value_ieee_eq(devs_ctx_t *ctx, value_t a, value_t b);
bool devs_value_eq(devs_ctx_t *ctx, value_t a, value_t b);

// returns one of DEVS_OBJECT_TYPE_*
unsigned devs_value_typeof(devs_ctx_t *ctx, value_t v);

extern const value_t devs_zero;
extern const value_t devs_one;
extern const value_t devs_nan;
extern const value_t devs_inf;
extern const value_t devs_minf;
extern const value_t devs_int_min;
extern const value_t devs_max_int_1;
extern const value_t devs_true;
extern const value_t devs_false;

static inline value_t devs_null_(void) {
    value_t v = {.u64 = 0};
    return v;
}
#define devs_null (devs_null_())

#define devs_void devs_null
#define devs_undefined devs_null
#define devs_error devs_null

bool devs_is_buffer(devs_ctx_t *ctx, value_t v);
bool devs_buffer_is_writable(devs_ctx_t *ctx, value_t v);
void *devs_buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz);

// this returns NULL if v is neither buffer not string
const void *devs_bufferish_data(devs_ctx_t *ctx, value_t v, unsigned *sz);

bool devs_is_array(devs_ctx_t *ctx, value_t v);

bool devs_is_string(devs_ctx_t *ctx, value_t v);
value_t devs_string_concat(devs_ctx_t *ctx, value_t a, value_t b);
const char *devs_string_get_utf8(devs_ctx_t *ctx, value_t s, unsigned *size);
value_t devs_value_to_string(devs_ctx_t *ctx, value_t v);
value_t devs_string_vsprintf(devs_ctx_t *ctx, const char *format, va_list ap);
__attribute__((format(printf, 2, 3))) value_t devs_string_sprintf(devs_ctx_t *ctx,
                                                                  const char *format, ...);
value_t devs_string_from_utf8(devs_ctx_t *ctx, const uint8_t *utf8, unsigned len);
value_t devs_builtin_string(unsigned idx);

void devs_value_pin(devs_ctx_t *ctx, value_t v);
void devs_value_unpin(devs_ctx_t *ctx, value_t v);
