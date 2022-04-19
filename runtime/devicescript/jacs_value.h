#pragma once
#include <stdint.h>
#include <stdbool.h>

typedef union {
    double f;
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

static inline bool jacs_is_tagged_int(value_t t) {
    return (t.exp_sign + 1) == 0;
}

value_t jacs_value_from_double(double v);
value_t jacs_value_from_int(int v);
value_t jacs_value_from_bool(int v);

int32_t jacs_value_to_int(value_t v);
double jacs_value_to_double(value_t v);
int jacs_value_to_bool(value_t v);

extern const value_t jacs_zero;
extern const value_t jacs_one;
extern const value_t jacs_nan;
extern const value_t jacs_int_min;
extern const value_t jacs_max_int_1;
