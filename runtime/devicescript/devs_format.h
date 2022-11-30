#pragma once
#include <stdint.h>
#include "devs_bytecode.h"

typedef struct {
    uint32_t start;  // in bytes
    uint32_t length; // in bytes
} devs_img_section_t;

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint32_t version;
    uint16_t num_globals;
    uint8_t reserved[JACS_FIX_HEADER_SIZE - 4 - 4 - 4 - 2];

    devs_img_section_t functions;      // devs_function_desc_t[]
    devs_img_section_t functions_data; // uint16_t[]
    devs_img_section_t float_literals; // value_t[]
    devs_img_section_t roles;          // devs_role_desc_t[]
    devs_img_section_t strings;        // devs_img_section_t[]
    devs_img_section_t string_data;    // "strings" points in here
} devs_img_header_t;

typedef struct {
    // position of function (must be within code section)
    uint32_t start;  // in bytes, in whole image
    uint32_t length; // in bytes
    uint16_t num_locals;
    uint8_t num_args;
    uint8_t flags;
    uint16_t name_idx;
    uint16_t reserved;
} devs_function_desc_t;

typedef struct {
    uint32_t service_class;
    uint16_t name_idx; // index in strings section
    uint16_t reserved;
} devs_role_desc_t;
