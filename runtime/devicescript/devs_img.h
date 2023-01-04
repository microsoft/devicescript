#pragma once
#include "devs_format.h"
#include "devs_value.h"
#include <stdbool.h>

typedef struct devs_img {
    union {
        const uint8_t *data;
        const devs_img_header_t *header;
    };
} devs_img_t;

static inline uint32_t devs_img_num_roles(devs_img_t img) {
    return img.header->roles.length / sizeof(devs_role_desc_t);
}

static inline uint32_t devs_img_num_functions(devs_img_t img) {
    return img.header->functions.length / sizeof(devs_function_desc_t);
}

static inline uint32_t devs_img_num_floats(devs_img_t img) {
    return img.header->float_literals.length / sizeof(value_t);
}

static inline const devs_function_desc_t *devs_img_get_function(devs_img_t img, uint32_t idx) {
    return (const devs_function_desc_t *)(img.data + img.header->functions.start +
                                          idx * sizeof(devs_function_desc_t));
}

static inline const devs_role_desc_t *devs_img_get_role(devs_img_t img, uint32_t idx) {
    return (const devs_role_desc_t *)(img.data + img.header->roles.start +
                                      idx * sizeof(devs_role_desc_t));
}

static inline const devs_service_spec_t *devs_img_get_service_spec(devs_img_t img, uint32_t idx) {
    return (const devs_service_spec_t *)(img.data + img.header->service_specs.start +
                                         idx * sizeof(devs_service_spec_t));
}

static inline const devs_packet_spec_t *devs_img_get_packet_spec(devs_img_t img, unsigned offset) {
    return (const devs_packet_spec_t *)(img.data + img.header->service_specs.start + offset * 4);
}

static inline const devs_field_spec_t *devs_img_get_field_spec(devs_img_t img, unsigned offset) {
    return (const devs_field_spec_t *)(img.data + img.header->service_specs.start + offset * 4);
}

static inline value_t devs_img_get_float(devs_img_t img, uint32_t idx) {
    value_t v;
    memcpy(&v, img.data + img.header->float_literals.start + idx * sizeof(value_t),
           sizeof(value_t));
    return v;
}

const char *devs_builtin_string_by_idx(unsigned idx);
const char *devs_img_get_utf8(devs_img_t img, uint32_t idx, unsigned *size);
const char *devs_img_fun_name(devs_img_t img, unsigned fidx);
const char *devs_img_role_name(devs_img_t img, unsigned idx);
bool devs_img_stridx_ok(devs_img_t img, uint32_t stridx);
const char *devs_get_static_utf8(devs_ctx_t *ctx, uint32_t idx, unsigned *size);
