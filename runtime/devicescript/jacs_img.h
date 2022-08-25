#pragma once
#include "jacs_format.h"
#include "jacs_value.h"
#include <stdbool.h>

typedef struct jacs_img {
    union {
        const uint8_t *data;
        const jacs_img_header_t *header;
    };
} jacs_img_t;

static inline uint32_t jacs_img_num_strings(const jacs_img_t *img) {
    return img->header->strings.length / sizeof(jacs_img_section_t);
}

static inline uint32_t jacs_img_num_roles(const jacs_img_t *img) {
    return img->header->roles.length / sizeof(jacs_role_desc_t);
}

static inline uint32_t jacs_img_num_functions(const jacs_img_t *img) {
    return img->header->functions.length / sizeof(jacs_function_desc_t);
}

static inline uint32_t jacs_img_num_floats(const jacs_img_t *img) {
    return img->header->float_literals.length / sizeof(value_t);
}

static inline uint32_t jacs_img_num_buffers(const jacs_img_t *img) {
    return img->header->buffers.length / sizeof(jacs_buffer_desc_t);
}

static inline const jacs_function_desc_t *jacs_img_get_function(const jacs_img_t *img,
                                                                uint32_t idx) {
    return (const jacs_function_desc_t *)(img->data + img->header->functions.start +
                                          idx * sizeof(jacs_function_desc_t));
}

static inline const jacs_role_desc_t *jacs_img_get_role(const jacs_img_t *img, uint32_t idx) {
    return (const jacs_role_desc_t *)(img->data + img->header->roles.start +
                                      idx * sizeof(jacs_role_desc_t));
}

static inline value_t jacs_img_get_float(const jacs_img_t *img, uint32_t idx) {
    value_t v;
    memcpy(&v, img->data + img->header->float_literals.start + idx * sizeof(value_t),
           sizeof(value_t));
    return v;
}

static inline const jacs_buffer_desc_t *jacs_img_get_buffer(const jacs_img_t *img, uint32_t idx) {
    return (const jacs_buffer_desc_t *)(img->data + img->header->buffers.start +
                                        idx * sizeof(jacs_buffer_desc_t));
}

static inline const jacs_img_section_t *jacs_img_get_string(const jacs_img_t *img, uint32_t idx) {
    return (const jacs_img_section_t *)(img->data + img->header->strings.start +
                                        idx * sizeof(jacs_img_section_t));
}

static inline const char *jacs_img_get_string_ptr(const jacs_img_t *img, uint32_t idx) {
    return (const char *)(img->data + jacs_img_get_string(img, idx)->start);
}

static inline unsigned jacs_img_get_string_len(const jacs_img_t *img, uint32_t idx) {
    return jacs_img_get_string(img, idx)->length;
}

const char *jacs_img_fun_name(const jacs_img_t *img, unsigned fidx);