// Auto-generated from bytecode.md; do not edit.
#pragma once

#define DEVS_STMT1_CALL0 2           // CALL func()
#define DEVS_STMT2_CALL1 3           // CALL func(v0)
#define DEVS_STMT3_CALL2 4           // CALL func(v0, v1)
#define DEVS_STMT4_CALL3 5           // CALL func(v0, v1, v2)
#define DEVS_STMT5_CALL4 6           // CALL func(v0, v1, v2, v3)
#define DEVS_STMT6_CALL5 7           // CALL func(v0, v1, v2, v3, v4)
#define DEVS_STMT7_CALL6 8           // CALL func(v0, v1, v2, v3, v4, v5)
#define DEVS_STMT8_CALL7 9           // CALL func(v0, v1, v2, v3, v4, v5, v6)
#define DEVS_STMT9_CALL8 10          // CALL func(v0, v1, v2, v3, v4, v5, v6, v7)
#define DEVS_STMT1_RETURN 12         // value
#define DEVS_STMTx_JMP 13            // JMP jmpoffset
#define DEVS_STMTx1_JMP_Z 14         // JMP jmpoffset IF NOT x
#define DEVS_STMT1_PANIC 15          // error_code
#define DEVS_STMTx1_STORE_LOCAL 17   // local_idx := value
#define DEVS_STMTx1_STORE_GLOBAL 18  // global_idx := value
#define DEVS_STMT4_STORE_BUFFER 19   // buffer, numfmt, offset, value
#define DEVS_EXPRx_LOAD_LOCAL 21     // *local_idx
#define DEVS_EXPRx_LOAD_GLOBAL 22    // *global_idx
#define DEVS_STMTx2_STORE_CLOSURE 83 // *local_clo_idx, levels, value
#define DEVS_EXPRx1_LOAD_CLOSURE 84  // *local_clo_idx, levels
#define DEVS_EXPRx_MAKE_CLOSURE 85   // CLOSURE(func_idx)
#define DEVS_EXPR2_INDEX 24          // object[idx]
#define DEVS_STMT3_INDEX_SET 25      // object[index] := value
#define DEVS_STMT2_INDEX_DELETE 90   // delete object[index]
#define DEVS_EXPRx1_BUILTIN_FIELD 26 // [builtin_idx]obj
#define DEVS_EXPRx1_ASCII_FIELD 27   // [ascii_idx]obj
#define DEVS_EXPRx1_UTF8_FIELD 28    // [utf8_idx]obj
#define DEVS_EXPRx_MATH_FIELD 29     // Math.builtin_idx
#define DEVS_EXPRx_DS_FIELD 30       // ds.builtin_idx
#define DEVS_EXPRx_OBJECT_FIELD 89   // Object.builtin_idx
#define DEVS_STMT0_ALLOC_MAP 31
#define DEVS_STMT1_ALLOC_ARRAY 32           // initial_size
#define DEVS_STMT1_ALLOC_BUFFER 33          // size
#define DEVS_EXPRx_STATIC_ROLE 34           // *role_idx
#define DEVS_EXPRx_STATIC_BUFFER 35         // *buffer_idx
#define DEVS_EXPRx_STATIC_BUILTIN_STRING 36 // *builtin_idx
#define DEVS_EXPRx_STATIC_ASCII_STRING 37   // *ascii_idx
#define DEVS_EXPRx_STATIC_UTF8_STRING 38    // *utf8_idx
#define DEVS_EXPRx_STATIC_FUNCTION 39       // *func_idx
#define DEVS_EXPRx_LITERAL 40               // *value
#define DEVS_EXPRx_LITERAL_F64 41           // *f64_idx
#define DEVS_EXPRx_BUILTIN_OBJECT 1         // *builtin_object
#define DEVS_EXPR3_LOAD_BUFFER 43           // buffer, numfmt, offset
#define DEVS_EXPR0_RET_VAL 44
#define DEVS_EXPR1_TYPEOF 45     // object
#define DEVS_EXPR1_TYPEOF_STR 86 // object
#define DEVS_EXPR0_NULL 46
#define DEVS_EXPR1_IS_NULL 47
#define DEVS_EXPR0_TRUE 48
#define DEVS_EXPR0_FALSE 49
#define DEVS_EXPR1_TO_BOOL 50 // !!x
#define DEVS_EXPR0_NAN 51
#define DEVS_EXPR0_INF 87
#define DEVS_EXPR1_ABS 52
#define DEVS_EXPR1_BIT_NOT 53 // ~x
#define DEVS_EXPR1_IS_NAN 54
#define DEVS_EXPR1_NEG 55   // -x
#define DEVS_EXPR1_UPLUS 88 // +x
#define DEVS_EXPR1_NOT 56   // !x
#define DEVS_EXPR1_TO_INT 57
#define DEVS_EXPR2_ADD 58                  // x + y
#define DEVS_EXPR2_SUB 59                  // x - y
#define DEVS_EXPR2_MUL 60                  // x * y
#define DEVS_EXPR2_DIV 61                  // x / y
#define DEVS_EXPR2_BIT_AND 62              // x & y
#define DEVS_EXPR2_BIT_OR 63               // x | y
#define DEVS_EXPR2_BIT_XOR 64              // x ^ y
#define DEVS_EXPR2_SHIFT_LEFT 65           // x << y
#define DEVS_EXPR2_SHIFT_RIGHT 66          // x >> y
#define DEVS_EXPR2_SHIFT_RIGHT_UNSIGNED 67 // x >>> y
#define DEVS_EXPR2_EQ 68                   // x == y
#define DEVS_EXPR2_LE 69                   // x <= y
#define DEVS_EXPR2_LT 70                   // x < y
#define DEVS_EXPR2_NE 71                   // x != y
#define DEVS_STMT1_TERMINATE_FIBER 72      // fiber_handle
#define DEVS_STMT1_WAIT_ROLE 73            // role
#define DEVS_STMT3_QUERY_REG 74            // role, code, timeout
#define DEVS_STMT2_SEND_CMD 75             // role, code
#define DEVS_STMT4_QUERY_IDX_REG 76        // role, code, string, timeout
#define DEVS_STMT1_SETUP_PKT_BUFFER 77     // size
#define DEVS_STMT2_SET_PKT 78              // buffer, offset
#define DEVS_EXPR0_NOW_MS 79
#define DEVS_EXPR2_STR0EQ 11           // buffer, offset
#define DEVS_EXPR1_GET_FIBER_HANDLE 80 // func
#define DEVS_EXPR0_PKT_SIZE 81
#define DEVS_EXPR0_PKT_EV_CODE 82
#define DEVS_EXPR0_PKT_REG_GET_CODE 20
#define DEVS_EXPR0_PKT_REPORT_CODE 23
#define DEVS_EXPR0_PKT_COMMAND_CODE 16
#define DEVS_EXPR0_PKT_BUFFER 42
#define DEVS_OP_PAST_LAST 91

#define DEVS_OP_PROPS                                                                              \
    "\x7f\x60\x11\x12\x13\x14\x15\x16\x17\x18\x19\x02\x11\x30\x31\x11\x00\x31\x31\x14\x00\x20\x20" \
    "\x00\x02\x13\x21\x21\x21\x60\x60\x10\x11\x11\x60\x60\x60\x60\x60\x60\x60\x60\x40\x03\x00\x41" \
    "\x40\x41\x40\x40\x41\x40\x41\x41\x41\x41\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42" \
    "\x42\x42\x42\x11\x11\x13\x12\x14\x11\x12\x00\x01\x00\x00\x32\x21\x20\x41\x40\x41\x60\x12"
#define DEVS_OP_TYPES                                                                              \
    "\x7f\x01\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x06\x0b\x0b\x0b\x0b\x01\x0b\x0b\x0b\x01\x0a\x0a" \
    "\x01\x0a\x0b\x0a\x0a\x0a\x0a\x0a\x0b\x0b\x0b\x05\x04\x09\x09\x09\x08\x01\x01\x04\x01\x0a\x01" \
    "\x00\x06\x06\x06\x06\x01\x01\x01\x06\x01\x06\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x06" \
    "\x06\x06\x06\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x01\x07\x01\x01\x0b\x0a\x08\x01\x01\x01\x0a\x0b"

#define DEVS_IMG_VERSION 0x02000000
#define DEVS_MAGIC0 0x53766544 // "DevS"
#define DEVS_MAGIC1 0x9a6a7e0a
#define DEVS_NUM_IMG_SECTIONS 9
#define DEVS_FIX_HEADER_SIZE 32
#define DEVS_SECTION_HEADER_SIZE 8
#define DEVS_FUNCTION_HEADER_SIZE 16
#define DEVS_ROLE_HEADER_SIZE 8
#define DEVS_ASCII_HEADER_SIZE 2
#define DEVS_BINARY_SIZE_ALIGN 32
#define DEVS_MAX_STACK_DEPTH 10
#define DEVS_DIRECT_CONST_OP 0x80
#define DEVS_DIRECT_CONST_OFFSET 16
#define DEVS_FIRST_MULTIBYTE_INT 0xf8
#define DEVS_FIRST_NON_OPCODE 0x10000
#define DEVS_FIRST_BUILTIN_FUNCTION 50000
#define DEVS_MAX_ARGS_SHORT_CALL 8

#define DEVS_STRIDX_BUFFER 0
#define DEVS_STRIDX_BUILTIN 1
#define DEVS_STRIDX_ASCII 2
#define DEVS_STRIDX_UTF8 3
#define DEVS_STRIDX__SHIFT 14

#define DEVS_OPCALL_SYNC 0
#define DEVS_OPCALL_BG 1
#define DEVS_OPCALL_BG_MAX1 2
#define DEVS_OPCALL_BG_MAX1_PEND1 3
#define DEVS_OPCALL_BG_MAX1_REPLACE 4
#define DEVS_OPCALL___MAX 4

#define DEVS_BYTECODEFLAG_NUM_ARGS_MASK 0xf
#define DEVS_BYTECODEFLAG_IS_STMT 0x10
#define DEVS_BYTECODEFLAG_TAKES_NUMBER 0x20
#define DEVS_BYTECODEFLAG_IS_STATELESS 0x40 // fun modifier

#define DEVS_FUNCTIONFLAG_NEEDS_THIS 0x01
#define DEVS_FUNCTIONFLAG___MAX 1

#define DEVS_NUMFMT_U8 0b0000
#define DEVS_NUMFMT_U16 0b0001
#define DEVS_NUMFMT_U32 0b0010
#define DEVS_NUMFMT_U64 0b0011
#define DEVS_NUMFMT_I8 0b0100
#define DEVS_NUMFMT_I16 0b0101
#define DEVS_NUMFMT_I32 0b0110
#define DEVS_NUMFMT_I64 0b0111
#define DEVS_NUMFMT_F8 0b1000  // not supported
#define DEVS_NUMFMT_F16 0b1001 // not supported
#define DEVS_NUMFMT_F32 0b1010
#define DEVS_NUMFMT_F64 0b1011
#define DEVS_NUMFMT___MAX 11

#define DEVS_OBJECT_TYPE_NULL 0
#define DEVS_OBJECT_TYPE_NUMBER 1
#define DEVS_OBJECT_TYPE_MAP 2
#define DEVS_OBJECT_TYPE_ARRAY 3
#define DEVS_OBJECT_TYPE_BUFFER 4
#define DEVS_OBJECT_TYPE_ROLE 5
#define DEVS_OBJECT_TYPE_BOOL 6
#define DEVS_OBJECT_TYPE_FIBER 7
#define DEVS_OBJECT_TYPE_FUNCTION 8
#define DEVS_OBJECT_TYPE_STRING 9
#define DEVS_OBJECT_TYPE_ANY 10
#define DEVS_OBJECT_TYPE_VOID 11
#define DEVS_OBJECT_TYPE___MAX 11

#define DEVS_BUILTIN_OBJECT_MATH 0
#define DEVS_BUILTIN_OBJECT_OBJECT 1
#define DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE 2
#define DEVS_BUILTIN_OBJECT_ARRAY 3
#define DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE 3
#define DEVS_BUILTIN_OBJECT_BUFFER 4
#define DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE 5
#define DEVS_BUILTIN_OBJECT_STRING 6
#define DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE 7
#define DEVS_BUILTIN_OBJECT_NUMBER 8
#define DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE 9
#define DEVS_BUILTIN_OBJECT_FIBER 10
#define DEVS_BUILTIN_OBJECT_FIBER_PROTOTYPE 11
#define DEVS_BUILTIN_OBJECT_ROLE 12
#define DEVS_BUILTIN_OBJECT_ROLE_PROTOTYPE 13
#define DEVS_BUILTIN_OBJECT_FUNCTION 14
#define DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE 15
#define DEVS_BUILTIN_OBJECT_BOOLEAN 16
#define DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE 17
#define DEVS_BUILTIN_OBJECT_DEVICESCRIPT 18
#define DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE 19
#define DEVS_BUILTIN_OBJECT_DSCOMMAND_PROTOTYPE 20
#define DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE 21
#define DEVS_BUILTIN_OBJECT___MAX 21

#define DEVS_BUILTIN_STRING__EMPTY 0
#define DEVS_BUILTIN_STRING_MINFINITY 1 // -Infinity
#define DEVS_BUILTIN_STRING_DEVICESCRIPT 2
#define DEVS_BUILTIN_STRING_E 3
#define DEVS_BUILTIN_STRING_INFINITY 4
#define DEVS_BUILTIN_STRING_LN10 5
#define DEVS_BUILTIN_STRING_LN2 6
#define DEVS_BUILTIN_STRING_LOG10E 7
#define DEVS_BUILTIN_STRING_LOG2E 8
#define DEVS_BUILTIN_STRING_NAN 9
#define DEVS_BUILTIN_STRING_PI 10
#define DEVS_BUILTIN_STRING_SQRT1_2 11
#define DEVS_BUILTIN_STRING_SQRT2 12
#define DEVS_BUILTIN_STRING_ABS 13
#define DEVS_BUILTIN_STRING_ALLOC 14
#define DEVS_BUILTIN_STRING_ARRAY 15
#define DEVS_BUILTIN_STRING_BLITAT 16
#define DEVS_BUILTIN_STRING_BOOLEAN 17
#define DEVS_BUILTIN_STRING_BUFFER 18
#define DEVS_BUILTIN_STRING_CBRT 19
#define DEVS_BUILTIN_STRING_CEIL 20
#define DEVS_BUILTIN_STRING_CHARCODEAT 21
#define DEVS_BUILTIN_STRING_CLAMP 22
#define DEVS_BUILTIN_STRING_EXP 23
#define DEVS_BUILTIN_STRING_FALSE 24
#define DEVS_BUILTIN_STRING_FILLAT 25
#define DEVS_BUILTIN_STRING_FLOOR 26
#define DEVS_BUILTIN_STRING_FOREACH 27
#define DEVS_BUILTIN_STRING_FUNCTION 28
#define DEVS_BUILTIN_STRING_GETAT 29
#define DEVS_BUILTIN_STRING_IDIV 30
#define DEVS_BUILTIN_STRING_IMUL 31
#define DEVS_BUILTIN_STRING_ISCONNECTED 32
#define DEVS_BUILTIN_STRING_JOIN 33
#define DEVS_BUILTIN_STRING_LENGTH 34
#define DEVS_BUILTIN_STRING_LOG 35
#define DEVS_BUILTIN_STRING_LOG10 36
#define DEVS_BUILTIN_STRING_LOG2 37
#define DEVS_BUILTIN_STRING_MAP 38
#define DEVS_BUILTIN_STRING_MAX 39
#define DEVS_BUILTIN_STRING_MIN 40
#define DEVS_BUILTIN_STRING_NEXT 41
#define DEVS_BUILTIN_STRING_NULL 42
#define DEVS_BUILTIN_STRING_NUMBER 43
#define DEVS_BUILTIN_STRING_ONCHANGE 44
#define DEVS_BUILTIN_STRING_ONCONNECTED 45
#define DEVS_BUILTIN_STRING_ONDISCONNECTED 46
#define DEVS_BUILTIN_STRING_PACKET 47
#define DEVS_BUILTIN_STRING_PANIC 48
#define DEVS_BUILTIN_STRING_POP 49
#define DEVS_BUILTIN_STRING_POW 50
#define DEVS_BUILTIN_STRING_PREV 51
#define DEVS_BUILTIN_STRING_PROTOTYPE 52
#define DEVS_BUILTIN_STRING_PUSH 53
#define DEVS_BUILTIN_STRING_RANDOM 54
#define DEVS_BUILTIN_STRING_RANDOMINT 55
#define DEVS_BUILTIN_STRING_READ 56
#define DEVS_BUILTIN_STRING_REBOOT 57
#define DEVS_BUILTIN_STRING_ROUND 58
#define DEVS_BUILTIN_STRING_SETAT 59
#define DEVS_BUILTIN_STRING_SETLENGTH 60
#define DEVS_BUILTIN_STRING_SHIFT 61
#define DEVS_BUILTIN_STRING_SIGNAL 62
#define DEVS_BUILTIN_STRING_SLICE 63
#define DEVS_BUILTIN_STRING_SPLICE 64
#define DEVS_BUILTIN_STRING_SQRT 65
#define DEVS_BUILTIN_STRING_STRING 66
#define DEVS_BUILTIN_STRING_SUBSCRIBE 67
#define DEVS_BUILTIN_STRING_TOSTRING 68
#define DEVS_BUILTIN_STRING_TRUE 69
#define DEVS_BUILTIN_STRING_UNDEFINED 70
#define DEVS_BUILTIN_STRING_UNSHIFT 71
#define DEVS_BUILTIN_STRING_WAIT 72
#define DEVS_BUILTIN_STRING_WRITE 73
#define DEVS_BUILTIN_STRING_SLEEPMS 74
#define DEVS_BUILTIN_STRING_IMOD 75
#define DEVS_BUILTIN_STRING_FORMAT 76
#define DEVS_BUILTIN_STRING_INSERT 77
#define DEVS_BUILTIN_STRING_START 78
#define DEVS_BUILTIN_STRING_CLOUD 79
#define DEVS_BUILTIN_STRING_MAIN 80
#define DEVS_BUILTIN_STRING_CHARAT 81
#define DEVS_BUILTIN_STRING_OBJECT 82
#define DEVS_BUILTIN_STRING_PARSEINT 83
#define DEVS_BUILTIN_STRING_PARSEFLOAT 84
#define DEVS_BUILTIN_STRING_ASSIGN 85
#define DEVS_BUILTIN_STRING_KEYS 86
#define DEVS_BUILTIN_STRING_VALUES 87
#define DEVS_BUILTIN_STRING___MAX 87

#define DEVS_OP_HANDLERS                                                                           \
    expr_invalid, exprx_builtin_object, stmt1_call0, stmt2_call1, stmt3_call2, stmt4_call3,        \
        stmt5_call4, stmt6_call5, stmt7_call6, stmt8_call7, stmt9_call8, expr2_str0eq,             \
        stmt1_return, stmtx_jmp, stmtx1_jmp_z, stmt1_panic, expr0_pkt_command_code,                \
        stmtx1_store_local, stmtx1_store_global, stmt4_store_buffer, expr0_pkt_reg_get_code,       \
        exprx_load_local, exprx_load_global, expr0_pkt_report_code, expr2_index, stmt3_index_set,  \
        exprx1_builtin_field, exprx1_ascii_field, exprx1_utf8_field, exprx_math_field,             \
        exprx_ds_field, stmt0_alloc_map, stmt1_alloc_array, stmt1_alloc_buffer, exprx_static_role, \
        exprx_static_buffer, exprx_static_builtin_string, exprx_static_ascii_string,               \
        exprx_static_utf8_string, exprx_static_function, exprx_literal, exprx_literal_f64,         \
        expr0_pkt_buffer, expr3_load_buffer, expr0_ret_val, expr1_typeof, expr0_null,              \
        expr1_is_null, expr0_true, expr0_false, expr1_to_bool, expr0_nan, expr1_abs,               \
        expr1_bit_not, expr1_is_nan, expr1_neg, expr1_not, expr1_to_int, expr2_add, expr2_sub,     \
        expr2_mul, expr2_div, expr2_bit_and, expr2_bit_or, expr2_bit_xor, expr2_shift_left,        \
        expr2_shift_right, expr2_shift_right_unsigned, expr2_eq, expr2_le, expr2_lt, expr2_ne,     \
        stmt1_terminate_fiber, stmt1_wait_role, stmt3_query_reg, stmt2_send_cmd,                   \
        stmt4_query_idx_reg, stmt1_setup_pkt_buffer, stmt2_set_pkt, expr0_now_ms,                  \
        expr1_get_fiber_handle, expr0_pkt_size, expr0_pkt_ev_code, stmtx2_store_closure,           \
        exprx1_load_closure, exprx_make_closure, expr1_typeof_str, expr0_inf, expr1_uplus,         \
        exprx_object_field, stmt2_index_delete, expr_invalid

#define DEVS_BUILTIN_STRING__VAL                                                                   \
    "", "-Infinity", "DeviceScript", "E", "Infinity", "LN10", "LN2", "LOG10E", "LOG2E", "NaN",     \
        "PI", "SQRT1_2", "SQRT2", "abs", "alloc", "array", "blitAt", "boolean", "buffer", "cbrt",  \
        "ceil", "charCodeAt", "clamp", "exp", "false", "fillAt", "floor", "forEach", "function",   \
        "getAt", "idiv", "imul", "isConnected", "join", "length", "log", "log10", "log2", "map",   \
        "max", "min", "next", "null", "number", "onChange", "onConnected", "onDisconnected",       \
        "packet", "panic", "pop", "pow", "prev", "prototype", "push", "random", "randomInt",       \
        "read", "reboot", "round", "setAt", "setLength", "shift", "signal", "slice", "splice",     \
        "sqrt", "string", "subscribe", "toString", "true", "undefined", "unshift", "wait",         \
        "write", "sleepMs", "imod", "format", "insert", "start", "cloud", "main", "charAt",        \
        "object", "parseInt", "parseFloat", "assign", "keys", "values"
#define DEVS_BUILTIN_OBJECT__VAL                                                                   \
    "Math", "Object", "Object_prototype", "Array_prototype", "Buffer", "Buffer_prototype",         \
        "String", "String_prototype", "Number", "Number_prototype", "Fiber", "Fiber_prototype",    \
        "Role", "Role_prototype", "Function", "Function_prototype", "Boolean",                     \
        "Boolean_prototype", "DeviceScript", "DsRegister_prototype", "DsCommand_prototype",        \
        "DsEvent_prototype"
