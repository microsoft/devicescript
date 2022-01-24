#pragma once
#include <stdint.h>

typedef struct {
    uint32_t start;  // in bytes
    uint32_t length; // in bytes
} jacs_img_section_t;

#define JACS_NUM_IMG_SECTIONS 6

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint16_t num_globals;
    uint8_t reserved[64 - 4 - 4 - 2];

    jacs_img_section_t functions;      // jacs_function_desc_t[]
    jacs_img_section_t functions_data; // uint16_t[]
    jacs_img_section_t float_literals; // value_t[]
    jacs_img_section_t roles;          // jacs_role_desc_t[]
    jacs_img_section_t strings;        // jacs_img_section_t[]
    jacs_img_section_t string_data;    // "strings" points in here
} jacs_img_header_t;

typedef struct {
    // position of function (must be within code section)
    uint32_t start;  // in bytes, in whole image
    uint32_t length; // in bytes
    uint16_t num_locals;
    uint8_t num_regs_and_args; //  num_regs | (num_args << 4)
    uint8_t flags;
    uint32_t reserved;
} jacs_function_desc_t;

typedef struct {
    uint32_t service_class;
    uint16_t name_idx; // index in strings section
    uint16_t reserved;
} jacs_role_desc_t;

#define JACS_IMG_MAGIC0 0x5363614a // "JacS"
#define JACS_IMG_MAGIC1 0x9a6a7e0a

#define JACS_OPTOP_SET_A 0      // ARG[12]
#define JACS_OPTOP_SET_B 1      // ARG[12]
#define JACS_OPTOP_SET_C 2      // ARG[12]
#define JACS_OPTOP_SET_D 3      // ARG[12]
#define JACS_OPTOP_SET_HIGH 4   // A/B/C/D[2] ARG[10]
#define JACS_OPTOP_UNARY 5      // OP[4] DST[4] SRC[4]
#define JACS_OPTOP_BINARY 6     // OP[4] DST[4] SRC[4]
#define JACS_OPTOP_LOAD_CELL 7  // DST[4] A:OP[2] B:OFF[6]
#define JACS_OPTOP_STORE_CELL 8 // SRC[4] A:OP[2] B:OFF[6]
#define JACS_OPTOP_JUMP 9       // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
#define JACS_OPTOP_CALL 10      // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)
#define JACS_OPTOP_SYNC 11      // A:ARG[4] OP[8]
#define JACS_OPTOP_ASYNC 12     // D:SAVE_REGS[4] OP[8]

#define JACS_OPASYNC_WAIT_ROLE 0     // A-role
#define JACS_OPASYNC_SLEEP_R0 1      // R0 - wait time in seconds
#define JACS_OPASYNC_SLEEP_MS 2      // A - time in ms
#define JACS_OPASYNC_QUERY_REG 3     // A-role, B-code, C-timeout
#define JACS_OPASYNC_SEND_CMD 4      // A-role, B-code
#define JACS_OPASYNC_QUERY_IDX_REG 5 // A-role, B-STRIDX:CMD[8], C-timeout
#define JACS_OPASYNC__LAST 6

#define JACS_OPSYNC_RETURN 0
#define JACS_OPSYNC_SETUP_BUFFER 1 // A-size
#define JACS_OPSYNC_FORMAT 2       // A-string-index B-numargs C-offset
#define JACS_OPSYNC_MEMCPY 3       // A-string-index C-offset
#define JACS_OPSYNC_STR0EQ 4       // A-string-index C-offset result in R0
#define JACS_OPSYNC_LOG_FORMAT 5   // A-string-index B-numargs
#define JACS_OPSYNC_MATH1 6        // A-OpMath1, R0 := op(R0)
#define JACS_OPSYNC_MATH2 7        // A-OpMath2, R0 := op(R0, R1)
#define JACS_OPSYNC_PANIC 8        // A-error code
#define JACS_OPSYNC__LAST 9

#define JACS_OPMATH1_FLOOR 0
#define JACS_OPMATH1_ROUND 1
#define JACS_OPMATH1_CEIL 2
#define JACS_OPMATH1_LOG_E 3
#define JACS_OPMATH1_RANDOM 4 // value between 0 and R0
#define JACS_OPMATH1__LAST 5

#define JACS_OPMATH2_MIN 0
#define JACS_OPMATH2_MAX 1
#define JACS_OPMATH2_POW 2
#define JACS_OPMATH2__LAST 3

#define JACS_OPCALL_SYNC 0          // regular call
#define JACS_OPCALL_BG 1            // start new fiber
#define JACS_OPCALL_BG_MAX1 2       // ditto, unless one is already running
#define JACS_OPCALL_BG_MAX1_PEND1 3 // ditto, but if fiber already running, re-run it later

#define JACS_CELL_KIND_LOCAL 0
#define JACS_CELL_KIND_GLOBAL 1
#define JACS_CELL_KIND_FLOAT_CONST 2
#define JACS_CELL_KIND_IDENTITY 3
#define JACS_CELL_KIND_BUFFER 4        // arg=shift:numfmt, C=Offset
#define JACS_CELL_KIND_SPECIAL 5       // arg=nan, regcode, role, ...
#define JACS_CELL_KIND_ROLE_PROPERTY 6 // arg=roleidx, C=OpRoleProperty

#define JACS_ROLE_PROPERTY_IS_CONNECTED 0
#define JACS_ROLE_PROPERTY__LAST 1

#define JACS_VALUE_SPECIAL_NAN 0x0
// jd_packet accessors:
#define JACS_VALUE_SPECIAL_SIZE 0x1
#define JACS_VALUE_SPECIAL_EV_CODE 0x2      // or nan
#define JACS_VALUE_SPECIAL_REG_GET_CODE 0x3 // or nan
#define JACS_VALUE_SPECIAL__LAST 0x4

#define JACS_OPBIN_ADD 0x1
#define JACS_OPBIN_SUB 0x2
#define JACS_OPBIN_DIV 0x3
#define JACS_OPBIN_MUL 0x4
#define JACS_OPBIN_LT 0x5
#define JACS_OPBIN_LE 0x6
#define JACS_OPBIN_EQ 0x7
#define JACS_OPBIN_NE 0x8
#define JACS_OPBIN_AND 0x9
#define JACS_OPBIN_OR 0xa
#define JACS_OPBIN__LAST 0xb

#define JACS_OPUN_ID 0x0
#define JACS_OPUN_NEG 0x1
#define JACS_OPUN_NOT 0x2
#define JACS_OPUN_ABS 0x3
#define JACS_OPUN_IS_NAN 0x4
#define JACS_OPUN__LAST 0x5

// Size in bits is: 8 << (fmt & 0b11)
// Format is ["u", "i", "f", "reserved"](fmt >> 2)
#define JACS_NUMFMT_U8 0b0000
#define JACS_NUMFMT_U16 0b0001
#define JACS_NUMFMT_U32 0b0010
#define JACS_NUMFMT_U64 0b0011
#define JACS_NUMFMT_I8 0b0100
#define JACS_NUMFMT_I16 0b0101
#define JACS_NUMFMT_I32 0b0110
#define JACS_NUMFMT_I64 0b0111
//#define JACS_NUMFMT_F8 0b1000
//#define JACS_NUMFMT_F16 0b1001
#define JACS_NUMFMT_F32 0b1010
#define JACS_NUMFMT_F64 0b1011
