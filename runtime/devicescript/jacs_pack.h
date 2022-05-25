#pragma once
#include <stdint.h>

#define JACS_NUM_FMT(fmt, shift) ((fmt) | ((shift) << 4))
typedef struct {
    const char *name;
    uint32_t service_class;
    uint16_t numfmt;
    uint8_t mode;
} jacs_packed_service_desc_t;

extern const unsigned jacs_num_packed_service_descs;
extern const jacs_packed_service_desc_t jacs_packed_service_descs[];

const jacs_packed_service_desc_t *jacs_get_packed_service_desc(uint32_t service_class);
