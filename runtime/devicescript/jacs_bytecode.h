// Auto-generated from bytecode.md; do not edit.
#pragma once

#define JACS_STMT1_WAIT_ROLE 1        // role
#define JACS_STMT1_SLEEP_S 2          // time_in_s
#define JACS_STMT1_SLEEP_MS 3         // time_in_ms
#define JACS_STMT3_QUERY_REG 4        // role, code, timeout
#define JACS_STMT2_SEND_CMD 5         // role, code
#define JACS_STMT4_QUERY_IDX_REG 6    // role, code, string_idx, timeout
#define JACS_STMT3_LOG_FORMAT 7       // string_idx, local_idx, numargs
#define JACS_STMT4_FORMAT 8           // string_idx, local_idx, numargs, offset
#define JACS_STMT2_SETUP_BUFFER 9     // size, buffer_idx
#define JACS_STMT2_MEMCPY 10          // string_idx, offset
#define JACS_STMT3_CALL 11            // func_idx, local_idx, numargs
#define JACS_STMT4_CALL_BG 12         // func_idx, local_idx, numargs, opcall
#define JACS_STMT1_RETURN 13          // value
#define JACS_STMTx_JMP 14             // *offset
#define JACS_STMTx1_JMP_Z 15          // *offset, condition
#define JACS_STMT1_PANIC 16           // error_code
#define JACS_STMTx1_STORE_LOCAL 17    // *local_idx, value
#define JACS_STMTx1_STORE_GLOBAL 18   // *global_idx, value
#define JACS_STMT4_STORE_BUFFER 19    // numfmt, offset, buffer_idx, value
#define JACS_STMTx1_STORE_PARAM 20    // *param_idx, value
#define JACS_STMT1_TERMINATE_FIBER 21 // fiber_handle
#define JACS_STMT_PAST_LAST 22

#define JACS_STMT_PROPS                                                                            \
    "\x7f\x01\x01\x01\x03\x02\x04\x03\x04\x02\x02\x03\x04\x01\x21\x22\x01\x22\x22\x04\x22\x01"

#define JACS_EXPRx_LOAD_LOCAL 1        // *local_idx
#define JACS_EXPRx_LOAD_GLOBAL 2       // *global_idx
#define JACS_EXPRx_LOAD_PARAM 45       // *param_idx
#define JACS_EXPRx_LITERAL 4           // *value
#define JACS_EXPRx_LITERAL_F64 5       // *f64_idx
#define JACS_EXPR3_LOAD_BUFFER 3       // numfmt, offset, buffer_idx
#define JACS_EXPR2_STR0EQ 7            // string_idx, offset
#define JACS_EXPR1_ROLE_IS_CONNECTED 8 // role
#define JACS_EXPR1_GET_FIBER_HANDLE 47 // func_idx
#define JACS_EXPR0_RET_VAL 6
#define JACS_EXPR0_PKT_SIZE 9
#define JACS_EXPR0_PKT_EV_CODE 10
#define JACS_EXPR0_PKT_REG_GET_CODE 11
#define JACS_EXPR0_NAN 12
#define JACS_EXPR0_NOW_MS 46
#define JACS_EXPR1_ABS 13
#define JACS_EXPR1_BIT_NOT 14 // ~x
#define JACS_EXPR1_CEIL 15
#define JACS_EXPR1_FLOOR 16
#define JACS_EXPR1_ID 17
#define JACS_EXPR1_IS_NAN 18
#define JACS_EXPR1_LOG_E 19
#define JACS_EXPR1_NEG 20 // -x
#define JACS_EXPR1_NOT 21 // !x
#define JACS_EXPR1_RANDOM 22
#define JACS_EXPR1_RANDOM_INT 23
#define JACS_EXPR1_ROUND 24
#define JACS_EXPR1_TO_BOOL 25 // !!x
#define JACS_EXPR2_ADD 26     // x + y
#define JACS_EXPR2_BIT_AND 27 // x & y
#define JACS_EXPR2_BIT_OR 28  // x | y
#define JACS_EXPR2_BIT_XOR 29 // x ^ y
#define JACS_EXPR2_DIV 30     // x / y
#define JACS_EXPR2_EQ 31      // x == y
#define JACS_EXPR2_IDIV 32
#define JACS_EXPR2_IMUL 33
#define JACS_EXPR2_LE 34 // x <= y
#define JACS_EXPR2_LT 35 // x < y
#define JACS_EXPR2_MAX 36
#define JACS_EXPR2_MIN 37
#define JACS_EXPR2_MUL 38 // x * y
#define JACS_EXPR2_NE 39  // x != y
#define JACS_EXPR2_POW 40
#define JACS_EXPR2_SHIFT_LEFT 41           // x << y
#define JACS_EXPR2_SHIFT_RIGHT 42          // x >> y
#define JACS_EXPR2_SHIFT_RIGHT_UNSIGNED 43 // x >>> y
#define JACS_EXPR2_SUB 44                  // x - y
#define JACS_EXPR_PAST_LAST 48

#define JACS_EXPR_PROPS                                                                            \
    "\x7f\x21\x21\x03\x61\x61\x00\x02\x01\x00\x00\x00\x40\x41\x41\x41\x41\x41\x41\x41\x41\x41\x01" \
    "\x01\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x21" \
    "\x00\x01"

#define JACS_IMG_VERSION 0x00020001
#define JACS_MAGIC0 0x5363614a // "JacS"
#define JACS_MAGIC1 0x9a6a7e0a
#define JACS_NUM_IMG_SECTIONS 7
#define JACS_FIX_HEADER_SIZE 64
#define JACS_SECTION_HEADER_SIZE 8
#define JACS_FUNCTION_HEADER_SIZE 16
#define JACS_ROLE_HEADER_SIZE 8
#define JACS_BUFFER_HEADER_SIZE 8
#define JACS_BINARY_SIZE_ALIGN 32
#define JACS_MAX_EXPR_DEPTH 10

#define JACS_OPCALL_SYNC 0
#define JACS_OPCALL_BG 1
#define JACS_OPCALL_BG_MAX1 2
#define JACS_OPCALL_BG_MAX1_PEND1 3

#define JACS_BYTECODEFLAG_NUM_ARGS_MASK 0xf
#define JACS_BYTECODEFLAG_TAKES_NUMBER 0x20
#define JACS_BYTECODEFLAG_IS_STATELESS 0x40 // fun modifier

#define JACS_NUMFMT_U8 0b0000
#define JACS_NUMFMT_U16 0b0001
#define JACS_NUMFMT_U32 0b0010
#define JACS_NUMFMT_U64 0b0011
#define JACS_NUMFMT_I8 0b0100
#define JACS_NUMFMT_I16 0b0101
#define JACS_NUMFMT_I32 0b0110
#define JACS_NUMFMT_I64 0b0111
#define JACS_NUMFMT_F8 0b1000  // not supported
#define JACS_NUMFMT_F16 0b1001 // not supported
#define JACS_NUMFMT_F32 0b1010
#define JACS_NUMFMT_F64 0b1011
