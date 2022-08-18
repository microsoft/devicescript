#pragma once
#include <stdint.h>

typedef struct {
    uint32_t start;  // in bytes
    uint32_t length; // in bytes
} jacs_img_section_t;

#define JACS_NUM_IMG_SECTIONS 7

#define JACS_IMG_VERSION 0x00020001

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint32_t version;
    uint16_t num_globals;
    uint8_t reserved[64 - 4 - 4 - 4 - 2];

    jacs_img_section_t functions;      // jacs_function_desc_t[]
    jacs_img_section_t functions_data; // uint16_t[]
    jacs_img_section_t float_literals; // value_t[]
    jacs_img_section_t roles;          // jacs_role_desc_t[]
    jacs_img_section_t strings;        // jacs_img_section_t[]
    jacs_img_section_t string_data;    // "strings" points in here
    jacs_img_section_t buffers;        // jacs_buffer_desc_t[]
} jacs_img_header_t;

typedef struct {
    // position of function (must be within code section)
    uint32_t start;  // in bytes, in whole image
    uint32_t length; // in bytes
    uint16_t num_locals;
    uint8_t num_args;
    uint8_t flags;
    uint32_t reserved;
} jacs_function_desc_t;

typedef struct {
    uint32_t service_class;
    uint16_t name_idx; // index in strings section
    uint16_t reserved;
} jacs_role_desc_t;

typedef struct {
    uint32_t type; // currently always 0
    uint16_t size;
    uint16_t reserved;
} jacs_buffer_desc_t;

#define JACS_IMG_MAGIC0 0x5363614a // "JacS"
#define JACS_IMG_MAGIC1 0x9a6a7e0a

#define JACS_STMT1_WAIT_ROLE 1      // role
#define JACS_STMT1_SLEEP_S 2        // time in seconds
#define JACS_STMT1_SLEEP_MS 3       // time in ms
#define JACS_STMT3_QUERY_REG 4      // role, code, timeout
#define JACS_STMT2_SEND_CMD 5       // role, code
#define JACS_STMT4_QUERY_IDX_REG 6  // role, code, string-idx, timeout
#define JACS_STMT3_LOG_FORMAT 7     // string-idx, localidx, numargs
#define JACS_STMT4_FORMAT 8         // string-idx, localidx, numargs, offset
#define JACS_STMT1_SETUP_BUFFER 9   // size
#define JACS_STMT2_MEMCPY 10        // string-idx, offset
#define JACS_STMT3_CALL 11          // fun-idx, localidx, numargs
#define JACS_STMT4_CALL_BG 12       // fun-idx, localidx, numargs
#define JACS_STMT1_RETURN 13        // ret-val
#define JACS_STMTx_JMP 14           // offset
#define JACS_STMTx1_JMP_Z 15        // offset, condition
#define JACS_STMT1_PANIC 16         // error-code
#define JACS_STMTx1_STORE_LOCAL 17  // idx, value
#define JACS_STMTx1_STORE_GLOBAL 18 // idx, value
#define JACS_STMT4_STORE_BUFFER 19  // shift:numfmt, offset, buffer_id, value
#define JACS_STMTx1_STORE_PARAM 20  // idx, value

#define JACS_STMT_MAX 21

// expressions
#define JACS_EXPRx_LOAD_LOCAL 1
#define JACS_EXPRx_LOAD_GLOBAL 2
#define JACS_EXPR3_LOAD_BUFFER 3
#define JACS_EXPRx_LOAD_PARAM 45

#define JACS_EXPRx_LITERAL 4
#define JACS_EXPRx_LITERAL_F64 5

#define JACS_EXPR0_RET_VAL 6 // return value of query register, call, etc
#define JACS_EXPR2_STR0EQ 7  // A-string-index C-offset

#define JACS_EXPR1_ROLE_IS_CONNECTED 8
#define JACS_EXPR0_PKT_SIZE 9
#define JACS_EXPR0_PKT_EV_CODE 10      // or nan
#define JACS_EXPR0_PKT_REG_GET_CODE 11 // or nan

// math
#define JACS_EXPR0_NAN 12        // NaN value
#define JACS_EXPR1_ABS 13        // Math.abs(x)
#define JACS_EXPR1_BIT_NOT 14    // ~x
#define JACS_EXPR1_CEIL 15       // Math.ceil(x)
#define JACS_EXPR1_FLOOR 16      // Math.floor(x)
#define JACS_EXPR1_ID 17         // x - TODO needed?
#define JACS_EXPR1_IS_NAN 18     // isNaN(x)
#define JACS_EXPR1_LOG_E 19      // log_e(x)
#define JACS_EXPR1_NEG 20        // -x
#define JACS_EXPR1_NOT 21        // !x
#define JACS_EXPR1_RANDOM 22     // value between 0 and arg
#define JACS_EXPR1_RANDOM_INT 23 // int between 0 and arg inclusive
#define JACS_EXPR1_ROUND 24      // Math.round(x)
#define JACS_EXPR1_TO_BOOL 25    // !!x
#define JACS_EXPR2_ADD 26
#define JACS_EXPR2_BIT_AND 27
#define JACS_EXPR2_BIT_OR 28
#define JACS_EXPR2_BIT_XOR 29
#define JACS_EXPR2_DIV 30
#define JACS_EXPR2_EQ 31
#define JACS_EXPR2_IDIV 32
#define JACS_EXPR2_IMUL 33
#define JACS_EXPR2_LE 34
#define JACS_EXPR2_LT 35
#define JACS_EXPR2_MAX 36
#define JACS_EXPR2_MIN 37
#define JACS_EXPR2_MUL 38
#define JACS_EXPR2_NE 39
#define JACS_EXPR2_POW 40
#define JACS_EXPR2_SHIFT_LEFT 41
#define JACS_EXPR2_SHIFT_RIGHT 42
#define JACS_EXPR2_SHIFT_RIGHT_UNSIGNED 43
#define JACS_EXPR2_SUB 44

#define JACS_EXPR_MAX 46

#define JACS_OPCALL_SYNC 0          // regular call
#define JACS_OPCALL_BG 1            // start new fiber
#define JACS_OPCALL_BG_MAX1 2       // ditto, unless one is already running
#define JACS_OPCALL_BG_MAX1_PEND1 3 // ditto, but if fiber already running, re-run it later


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
