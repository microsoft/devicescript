#pragma once
#include <stdint.h>
#include "devs_bytecode.h"

#define DEVS_VERSION_MAJOR(n) (unsigned)(((n) >> 24) & 0xff)
#define DEVS_VERSION_MINOR(n) (unsigned)(((n) >> 16) & 0xff)
#define DEVS_VERSION_PATCH(n) (unsigned)((n)&0xffff)

typedef uint16_t devs_pc_t;

typedef struct {
    uint32_t start;  // in bytes
    uint32_t length; // in bytes
} devs_img_section_t;

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint32_t version;
    uint16_t num_globals;
    uint16_t num_service_specs;
    uint8_t reserved[DEVS_FIX_HEADER_SIZE - 4 - 4 - 4 - 2 - 2];

    devs_img_section_t functions;      // devs_function_desc_t[]
    devs_img_section_t functions_data; // uint16_t[]
    devs_img_section_t float_literals; // value_t[]
    devs_img_section_t roles;          // devs_role_desc_t[]
    devs_img_section_t ascii_strings;  // uint16_t[]
    devs_img_section_t utf8_strings;   // devs_img_section_t[]
    devs_img_section_t buffers;        // devs_img_section_t[]
    devs_img_section_t string_data;    // "strings" points in here
    devs_img_section_t service_specs;  // devs_service_spec_t[] followed by other stuff
    devs_img_section_t dcfg;           // see jd_dcfg.h
} devs_img_header_t;

#define DEVS_ROLE_MASK ((1U << DEVS_ROLE_BITS) - 1)
#define DEVS_ROLE_INVALID DEVS_ROLE_MASK

typedef struct {
    // position of function (must be within code section)
    uint32_t start;  // in bytes, in whole image
    uint32_t length; // in bytes
    uint16_t num_slots;
    uint8_t num_args;
    uint8_t flags;
    uint16_t name_idx;
    uint8_t num_try_frames;
    uint8_t reserved;
} devs_function_desc_t;

typedef struct {
    uint32_t service_class;
    uint16_t name_idx; // index in strings section
    uint16_t reserved;
} devs_role_desc_t;

typedef struct {
    uint16_t name_idx; // "LightLevel"
    uint16_t flags;
    uint32_t service_class;
    uint16_t num_packets;
    uint16_t packets_offset; // offset in 32-bit words in spec section
    uint32_t reserved;
} devs_service_spec_t;

typedef struct {
    uint16_t name_idx; // "lightLevelError"
    uint16_t code;     // 0x1106 (reg-get)
    uint16_t flags;    // DEVS_PACKETSPEC_FLAG_*
    uint16_t numfmt_or_offset;
} devs_packet_spec_t;

typedef struct {
    uint16_t name_idx; // "x"
    uint8_t numfmt;    // DEVS_FIELDSPEC_FLAG_*
    uint8_t flags;
} devs_field_spec_t;
