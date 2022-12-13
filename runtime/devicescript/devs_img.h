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

static inline uint32_t devs_img_num_roles(const devs_img_t *img) {
    return img->header->roles.length / sizeof(devs_role_desc_t);
}

static inline uint32_t devs_img_num_functions(const devs_img_t *img) {
    return img->header->functions.length / sizeof(devs_function_desc_t);
}

static inline uint32_t devs_img_num_floats(const devs_img_t *img) {
    return img->header->float_literals.length / sizeof(value_t);
}

static inline const devs_function_desc_t *devs_img_get_function(const devs_img_t *img,
                                                                uint32_t idx) {
    return (const devs_function_desc_t *)(img->data + img->header->functions.start +
                                          idx * sizeof(devs_function_desc_t));
}

static inline const devs_role_desc_t *devs_img_get_role(const devs_img_t *img, uint32_t idx) {
    return (const devs_role_desc_t *)(img->data + img->header->roles.start +
                                      idx * sizeof(devs_role_desc_t));
}

static inline value_t devs_img_get_float(const devs_img_t *img, uint32_t idx) {
    value_t v;
    memcpy(&v, img->data + img->header->float_literals.start + idx * sizeof(value_t),
           sizeof(value_t));
    return v;
}

const char *devs_img_get_utf8(const devs_img_t *img, uint32_t idx, unsigned *size);
const char *devs_img_fun_name(const devs_img_t *img, unsigned fidx);
bool devs_img_stridx_ok(devs_img_t img, uint32_t stridx);