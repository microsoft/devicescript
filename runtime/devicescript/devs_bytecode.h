// Auto-generated from bytecode.md; do not edit.
#pragma once

#define JACS_STMT1_WAIT_ROLE 62 // role
#define JACS_STMT1_SLEEP_S 63
#define JACS_STMT1_SLEEP_MS 64
#define JACS_STMT3_QUERY_REG 65        // role, code, timeout
#define JACS_STMT2_SEND_CMD 66         // role, code
#define JACS_STMT4_QUERY_IDX_REG 67    // role, code, string, timeout
#define JACS_STMTx2_LOG_FORMAT 68      // *local_idx, numargs, string
#define JACS_STMTx3_FORMAT 69          // *local_idx, numargs, string, offset
#define JACS_STMT1_SETUP_PKT_BUFFER 70 // size
#define JACS_STMT2_SET_PKT 71          // buffer, offset
#define JACS_STMT5_BLIT 72             // dst, dst_offset, src, src_offset, length
#define JACS_STMT4_MEMSET 93           // dst, offset, length, value
#define JACS_STMTx2_CALL 73            // *local_idx, numargs, func
#define JACS_STMTx3_CALL_BG 74         // *local_idx, numargs, func, opcall
#define JACS_STMT1_RETURN 75           // value
#define JACS_STMTx_JMP 76              // JMP jmpoffset
#define JACS_STMTx1_JMP_Z 77           // JMP jmpoffset IF NOT x
#define JACS_STMT1_PANIC 78            // error_code
#define JACS_STMTx1_STORE_LOCAL 79     // local_idx := value
#define JACS_STMTx1_STORE_GLOBAL 80    // global_idx := value
#define JACS_STMT4_STORE_BUFFER 81     // buffer, numfmt, offset, value
#define JACS_STMTx1_STORE_PARAM 82     // param_idx := value
#define JACS_STMT1_TERMINATE_FIBER 83  // fiber_handle
#define JACS_STMT0_ALLOC_MAP 84
#define JACS_STMT1_ALLOC_ARRAY 85      // initial_size
#define JACS_STMT1_ALLOC_BUFFER 86     // size
#define JACS_STMTx2_SET_FIELD 87       // object.field_idx := value
#define JACS_STMT3_ARRAY_SET 88        // array[index] := value
#define JACS_STMT3_ARRAY_INSERT 89     // array, index, count
#define JACS_EXPRx_LOAD_LOCAL 1        // *local_idx
#define JACS_EXPRx_LOAD_GLOBAL 2       // *global_idx
#define JACS_EXPRx_LOAD_PARAM 45       // *param_idx
#define JACS_EXPRx_STATIC_ROLE 50      // *role_idx
#define JACS_EXPRx_STATIC_BUFFER 51    // *string_idx
#define JACS_EXPRx_STATIC_FUNCTION 90  // *func_idx
#define JACS_EXPRx_LITERAL 4           // *value
#define JACS_EXPRx_LITERAL_F64 5       // *f64_idx
#define JACS_EXPR3_LOAD_BUFFER 3       // buffer, numfmt, offset
#define JACS_EXPR2_STR0EQ 7            // buffer, offset
#define JACS_EXPR1_ROLE_IS_CONNECTED 8 // role
#define JACS_EXPR1_GET_FIBER_HANDLE 47 // func
#define JACS_EXPR0_RET_VAL 6
#define JACS_EXPR0_NOW_MS 46
#define JACS_EXPRx1_GET_FIELD 52    // object.field_idx
#define JACS_EXPR2_INDEX 53         // object[idx]
#define JACS_EXPR1_OBJECT_LENGTH 54 // object
#define JACS_EXPR1_KEYS_LENGTH 55   // object
#define JACS_EXPR1_TYPEOF 56        // object
#define JACS_EXPR0_NULL 57
#define JACS_EXPR1_IS_NULL 58
#define JACS_EXPR0_PKT_SIZE 9
#define JACS_EXPR0_PKT_EV_CODE 10
#define JACS_EXPR0_PKT_REG_GET_CODE 11
#define JACS_EXPR0_PKT_REPORT_CODE 48
#define JACS_EXPR0_PKT_COMMAND_CODE 49
#define JACS_EXPR0_PKT_BUFFER 59
#define JACS_EXPR0_TRUE 60
#define JACS_EXPR0_FALSE 61
#define JACS_EXPR1_TO_BOOL 25 // !!x
#define JACS_EXPR0_NAN 12
#define JACS_EXPR1_ABS 13
#define JACS_EXPR1_BIT_NOT 14 // ~x
#define JACS_EXPR1_ROUND 24
#define JACS_EXPR1_CEIL 15
#define JACS_EXPR1_FLOOR 16
#define JACS_EXPR1_ID 17
#define JACS_EXPR1_IS_NAN 18
#define JACS_EXPR1_LOG_E 19
#define JACS_EXPR1_NEG 20 // -x
#define JACS_EXPR1_NOT 21 // !x
#define JACS_EXPR1_TO_INT 92
#define JACS_EXPR1_RANDOM 22
#define JACS_EXPR1_RANDOM_INT 23
#define JACS_EXPR2_ADD 26 // x + y
#define JACS_EXPR2_SUB 44 // x - y
#define JACS_EXPR2_MUL 38 // x * y
#define JACS_EXPR2_DIV 30 // x / y
#define JACS_EXPR2_POW 40
#define JACS_EXPR2_IDIV 32
#define JACS_EXPR2_IMUL 33
#define JACS_EXPR2_IMOD 91
#define JACS_EXPR2_BIT_AND 27              // x & y
#define JACS_EXPR2_BIT_OR 28               // x | y
#define JACS_EXPR2_BIT_XOR 29              // x ^ y
#define JACS_EXPR2_SHIFT_LEFT 41           // x << y
#define JACS_EXPR2_SHIFT_RIGHT 42          // x >> y
#define JACS_EXPR2_SHIFT_RIGHT_UNSIGNED 43 // x >>> y
#define JACS_EXPR2_EQ 31                   // x == y
#define JACS_EXPR2_LE 34                   // x <= y
#define JACS_EXPR2_LT 35                   // x < y
#define JACS_EXPR2_NE 39                   // x != y
#define JACS_EXPR2_MAX 36
#define JACS_EXPR2_MIN 37
#define JACS_OP_PAST_LAST 94

#define JACS_OP_PROPS                                                                              \
    "\x7f\x20\x20\x03\x60\x60\x00\x02\x01\x00\x00\x00\x40\x41\x41\x41\x41\x41\x41\x41\x41\x41\x01" \
    "\x01\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x20" \
    "\x00\x01\x00\x00\x60\x60\x21\x02\x01\x01\x41\x40\x41\x40\x40\x40\x11\x11\x11\x13\x12\x14\x32" \
    "\x33\x11\x12\x15\x32\x33\x11\x30\x31\x11\x31\x31\x14\x31\x11\x10\x11\x11\x32\x13\x13\x60\x42" \
    "\x41\x14"
#define JACS_OP_TYPES                                                                              \
    "\x7f\x0a\x0a\x01\x01\x01\x0a\x06\x06\x01\x01\x01\x01\x01\x01\x01\x01\x0a\x06\x01\x01\x06\x01" \
    "\x01\x01\x06\x01\x01\x01\x01\x01\x06\x01\x01\x06\x06\x01\x01\x01\x06\x01\x01\x01\x01\x01\x0a" \
    "\x01\x07\x01\x01\x05\x04\x0a\x0a\x01\x01\x01\x00\x06\x04\x06\x06\x0b\x0b\x0b\x0b\x0b\x0b\x0b" \
    "\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x08\x01" \
    "\x01\x0b"

#define JACS_IMG_VERSION 0x00030002
#define JACS_MAGIC0 0x5363614a // "JacS"
#define JACS_MAGIC1 0x9a6a7e0a
#define JACS_NUM_IMG_SECTIONS 6
#define JACS_FIX_HEADER_SIZE 64
#define JACS_SECTION_HEADER_SIZE 8
#define JACS_FUNCTION_HEADER_SIZE 16
#define JACS_ROLE_HEADER_SIZE 8
#define JACS_BINARY_SIZE_ALIGN 32
#define JACS_MAX_STACK_DEPTH 10
#define JACS_DIRECT_CONST_OP 0x80
#define JACS_DIRECT_CONST_OFFSET 16
#define JACS_FIRST_MULTIBYTE_INT 0xf8
#define JACS_FIRST_NON_OPCODE 0x10000

#define JACS_OPCALL_SYNC 0
#define JACS_OPCALL_BG 1
#define JACS_OPCALL_BG_MAX1 2
#define JACS_OPCALL_BG_MAX1_PEND1 3
#define JACS_OPCALL_BG_MAX1_REPLACE 4

#define JACS_BYTECODEFLAG_NUM_ARGS_MASK 0xf
#define JACS_BYTECODEFLAG_IS_STMT 0x10
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

#define JACS_OBJECT_TYPE_NULL 0
#define JACS_OBJECT_TYPE_NUMBER 1
#define JACS_OBJECT_TYPE_MAP 2
#define JACS_OBJECT_TYPE_ARRAY 3
#define JACS_OBJECT_TYPE_BUFFER 4
#define JACS_OBJECT_TYPE_ROLE 5
#define JACS_OBJECT_TYPE_BOOL 6
#define JACS_OBJECT_TYPE_FIBER 7
#define JACS_OBJECT_TYPE_FUNCTION 8
#define JACS_OBJECT_TYPE_ANY 10
#define JACS_OBJECT_TYPE_VOID 11

#define JACS_OP_HANDLERS                                                                           \
    expr_invalid, exprx_load_local, exprx_load_global, expr3_load_buffer, exprx_literal,           \
        exprx_literal_f64, expr0_ret_val, expr2_str0eq, expr1_role_is_connected, expr0_pkt_size,   \
        expr0_pkt_ev_code, expr0_pkt_reg_get_code, expr0_nan, expr1_abs, expr1_bit_not,            \
        expr1_ceil, expr1_floor, expr1_id, expr1_is_nan, expr1_log_e, expr1_neg, expr1_not,        \
        expr1_random, expr1_random_int, expr1_round, expr1_to_bool, expr2_add, expr2_bit_and,      \
        expr2_bit_or, expr2_bit_xor, expr2_div, expr2_eq, expr2_idiv, expr2_imul, expr2_le,        \
        expr2_lt, expr2_max, expr2_min, expr2_mul, expr2_ne, expr2_pow, expr2_shift_left,          \
        expr2_shift_right, expr2_shift_right_unsigned, expr2_sub, exprx_load_param, expr0_now_ms,  \
        expr1_get_fiber_handle, expr0_pkt_report_code, expr0_pkt_command_code, exprx_static_role,  \
        exprx_static_buffer, exprx1_get_field, expr2_index, expr1_object_length,                   \
        expr1_keys_length, expr1_typeof, expr0_null, expr1_is_null, expr0_pkt_buffer, expr0_true,  \
        expr0_false, stmt1_wait_role, stmt1_sleep_s, stmt1_sleep_ms, stmt3_query_reg,              \
        stmt2_send_cmd, stmt4_query_idx_reg, stmtx2_log_format, stmtx3_format,                     \
        stmt1_setup_pkt_buffer, stmt2_set_pkt, stmt5_blit, stmtx2_call, stmtx3_call_bg,            \
        stmt1_return, stmtx_jmp, stmtx1_jmp_z, stmt1_panic, stmtx1_store_local,                    \
        stmtx1_store_global, stmt4_store_buffer, stmtx1_store_param, stmt1_terminate_fiber,        \
        stmt0_alloc_map, stmt1_alloc_array, stmt1_alloc_buffer, stmtx2_set_field, stmt3_array_set, \
        stmt3_array_insert, exprx_static_function, expr2_imod, expr1_to_int, stmt4_memset,         \
        expr_invalid
