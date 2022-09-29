#pragma once
#include <stdint.h>
#include <stdbool.h>

typedef union {
    double _f;
    uint64_t u64;
    struct {
        uint32_t mantisa32;
        uint32_t mantisa20 : 20;
        uint32_t exponent : 11;
        uint32_t sign : 1;
    };
    struct {
        int32_t val_int32;
        uint32_t exp_sign;
    };
} value_t;

#define JACS_INT_TAG (0U - 1U)
#define JACS_NAN_TAG 0x7ff80000
#define JACS_HANDLE_TAG 0x7ff00000

static inline bool jacs_is_tagged_int(value_t t) {
    return (t.exp_sign + 1) == 0;
}

static inline bool jacs_is_nan(value_t t) {
    return t.exp_sign == JACS_NAN_TAG;
}

static inline bool jacs_is_handle(value_t t) {
    return (t.exp_sign >> (20 - 1)) == (0x7ff << 1);
}

// handle type is 20 bit
static inline int jacs_handle_type(value_t t) {
    return jacs_is_handle(t) ? (t.exp_sign << 12) >> 12 : 0;
}

static inline uint32_t jacs_handle_value(value_t t) {
    return t.mantisa32;
}

#if JD_64
void *jacs_handle_ptr_value(jacs_ctx_t *ctx, value_t t);
#else
static inline void *jacs_handle_ptr_value(jacs_ctx_t *ctx, value_t t) {
    return (void *)t.mantisa32;
}
#endif

static inline value_t jacs_value_from_handle(int type, uint32_t value) {
    value_t r;
    r.exp_sign = JACS_HANDLE_TAG + type;
    r.mantisa32 = value;
    return r;
}

#define JACS_HANDLE_GC_MASK 0x80
#define JACS_HANDLE_IMG_MASK 0x40 // TODO remove this?

#define JACS_HANDLE_TYPE_FLOAT64 0x00
#define JACS_HANDLE_TYPE_SPECIAL 0x01
#define JACS_HANDLE_TYPE_FIBER 0x02
#define JACS_HANDLE_TYPE_GC_OBJECT (JACS_HANDLE_GC_MASK | 0x03)
#define JACS_HANDLE_TYPE_IMG_BUFFER 0x04
#define JACS_HANDLE_TYPE_ROLE 0x05

#define JACS_SPECIAL_NULL 0
#define JACS_SPECIAL_FALSE 1
#define JACS_SPECIAL_TRUE 0x40
#define JACS_SPECIAL_PKT_BUFFER 0x41

static inline bool jacs_is_special(value_t t) {
    return (t.exp_sign == JACS_HANDLE_TAG + JACS_HANDLE_TYPE_SPECIAL);
}

value_t jacs_value_from_double(double v);
value_t jacs_value_from_int(int v);
value_t jacs_value_from_bool(int v);
value_t jacs_value_from_pointer(jacs_ctx_t *ctx, int type, void *ptr);
static inline value_t jacs_value_from_gc_obj(jacs_ctx_t *ctx, void *ptr) {
    return jacs_value_from_pointer(ctx, JACS_HANDLE_TYPE_GC_OBJECT, ptr);
}

int32_t jacs_value_to_int(value_t v);
double jacs_value_to_double(value_t v);
bool jacs_value_to_bool(value_t v);

// returns one of JACS_OBJECT_TYPE_*
unsigned jacs_value_typeof(jacs_ctx_t *ctx, value_t v);

extern const value_t jacs_zero;
extern const value_t jacs_one;
extern const value_t jacs_nan;
extern const value_t jacs_int_min;
extern const value_t jacs_max_int_1;
extern const value_t jacs_null;
extern const value_t jacs_true;
extern const value_t jacs_false;
extern const value_t jacs_pkt_buffer;

#define jacs_void jacs_null
#define jacs_undefined jacs_null

bool jacs_is_buffer(jacs_ctx_t *ctx, value_t v);
bool jacs_buffer_is_writable(jacs_ctx_t *ctx, value_t v);
void *jacs_buffer_data(jacs_ctx_t *ctx, value_t v, unsigned *sz);

bool jacs_is_array(jacs_ctx_t *ctx, value_t v);
