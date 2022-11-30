#pragma once
#include <stdint.h>

#define JACS_NUM_FMT(fmt, shift) ((fmt) | ((shift) << 4))
typedef struct {
    const char *name;
    uint32_t service_class;
    uint16_t numfmt;
} devs_packed_service_desc_t;

extern const unsigned devs_num_packed_service_descs;
extern const devs_packed_service_desc_t devs_packed_service_descs[];

const devs_packed_service_desc_t *devs_get_packed_service_desc(uint32_t service_class);
