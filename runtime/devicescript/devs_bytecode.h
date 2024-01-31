// Auto-generated from bytecode.md; do not edit.
#pragma once

#define DEVS_STMT1_CALL0 2          // CALL func()
#define DEVS_STMT2_CALL1 3          // CALL func(v0)
#define DEVS_STMT3_CALL2 4          // CALL func(v0, v1)
#define DEVS_STMT4_CALL3 5          // CALL func(v0, v1, v2)
#define DEVS_STMT5_CALL4 6          // CALL func(v0, v1, v2, v3)
#define DEVS_STMT6_CALL5 7          // CALL func(v0, v1, v2, v3, v4)
#define DEVS_STMT7_CALL6 8          // CALL func(v0, v1, v2, v3, v4, v5)
#define DEVS_STMT8_CALL7 9          // CALL func(v0, v1, v2, v3, v4, v5, v6)
#define DEVS_STMT9_CALL8 10         // CALL func(v0, v1, v2, v3, v4, v5, v6, v7)
#define DEVS_STMT2_CALL_ARRAY 79    // CALL func(...args)
#define DEVS_STMT1_RETURN 12        // value
#define DEVS_STMTx_JMP 13           // JMP jmpoffset
#define DEVS_STMTx1_JMP_Z 14        // JMP jmpoffset IF NOT x
#define DEVS_STMTx_JMP_RET_VAL_Z 78 // JMP jmpoffset IF ret_val is nullish
#define DEVS_STMTx_TRY 80           // TRY jmpoffset
#define DEVS_STMTx_END_TRY 81       // *jmpoffset
#define DEVS_STMT0_CATCH 82
#define DEVS_STMT0_FINALLY 83
#define DEVS_STMT1_THROW 84      // value
#define DEVS_STMT1_RE_THROW 85   // value
#define DEVS_STMTx1_THROW_JMP 86 // *jmpoffset, level
#define DEVS_STMT0_DEBUGGER 87
#define DEVS_STMTx1_STORE_LOCAL 17   // local_idx := value
#define DEVS_STMTx1_STORE_GLOBAL 18  // global_idx := value
#define DEVS_STMT4_STORE_BUFFER 19   // buffer, numfmt, offset, value
#define DEVS_EXPRx_LOAD_LOCAL 21     // *local_idx
#define DEVS_EXPRx_LOAD_GLOBAL 22    // *global_idx
#define DEVS_STMTx2_STORE_CLOSURE 73 // *local_clo_idx, levels, value
#define DEVS_EXPRx1_LOAD_CLOSURE 74  // *local_clo_idx, levels
#define DEVS_EXPRx_MAKE_CLOSURE 75   // CLOSURE(func_idx)
#define DEVS_STMT1_STORE_RET_VAL 93  // ret_val := x
#define DEVS_EXPR2_INDEX 24          // object[idx]
#define DEVS_STMT3_INDEX_SET 25      // object[index] := value
#define DEVS_STMT2_INDEX_DELETE 11   // delete object[index]
#define DEVS_EXPRx1_BUILTIN_FIELD 26 // {swap}obj.builtin_idx
#define DEVS_EXPRx1_ASCII_FIELD 27   // {swap}obj.ascii_idx
#define DEVS_EXPRx1_UTF8_FIELD 28    // {swap}obj.utf8_idx
#define DEVS_EXPRx_MATH_FIELD 29     // Math.builtin_idx
#define DEVS_EXPRx_DS_FIELD 30       // ds.builtin_idx
#define DEVS_EXPRx_OBJECT_FIELD 16   // Object.builtin_idx
#define DEVS_EXPR1_NEW 88            // new func
#define DEVS_EXPR2_BIND 15           // func.bind(obj)
#define DEVS_STMT0_ALLOC_MAP 31
#define DEVS_STMT1_ALLOC_ARRAY 32           // initial_size
#define DEVS_STMT1_ALLOC_BUFFER 33          // size
#define DEVS_EXPRx_STATIC_SPEC_PROTO 34     // spec_idx.prototype
#define DEVS_EXPRx_STATIC_BUFFER 35         // *buffer_idx
#define DEVS_EXPRx_STATIC_BUILTIN_STRING 36 // *builtin_idx
#define DEVS_EXPRx_STATIC_ASCII_STRING 37   // *ascii_idx
#define DEVS_EXPRx_STATIC_UTF8_STRING 38    // *utf8_idx
#define DEVS_EXPRx_STATIC_FUNCTION 39       // *func_idx
#define DEVS_EXPRx_STATIC_SPEC 94           // *spec_idx
#define DEVS_EXPRx_LITERAL 40               // *value
#define DEVS_EXPRx_LITERAL_F64 41           // *f64_idx
#define DEVS_EXPRx_BUILTIN_OBJECT 1         // *builtin_object
#define DEVS_STMT0_REMOVED_42 42
#define DEVS_EXPR3_LOAD_BUFFER 43 // buffer, numfmt, offset
#define DEVS_EXPR0_RET_VAL 44
#define DEVS_EXPR1_TYPEOF 45     // object
#define DEVS_EXPR1_TYPEOF_STR 76 // object
#define DEVS_EXPR0_UNDEFINED 46  // undefined
#define DEVS_EXPR0_NULL 90       // null
#define DEVS_EXPR1_IS_UNDEFINED 47
#define DEVS_EXPR2_INSTANCE_OF 89 // obj, cls
#define DEVS_EXPR1_IS_NULLISH 72
#define DEVS_EXPR0_TRUE 48
#define DEVS_EXPR0_FALSE 49
#define DEVS_EXPR1_TO_BOOL 50 // !!x
#define DEVS_EXPR0_NAN 51
#define DEVS_EXPR0_INF 20
#define DEVS_EXPR1_ABS 52
#define DEVS_EXPR1_BIT_NOT 53 // ~x
#define DEVS_EXPR1_IS_NAN 54
#define DEVS_EXPR1_NEG 55   // -x
#define DEVS_EXPR1_UPLUS 23 // +x
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
#define DEVS_EXPR2_EQ 68                   // x === y
#define DEVS_EXPR2_LE 69                   // x <= y
#define DEVS_EXPR2_LT 70                   // x < y
#define DEVS_EXPR2_NE 71                   // x !== y
#define DEVS_EXPR2_APPROX_EQ 91            // x == y
#define DEVS_EXPR2_APPROX_NE 92            // x != y
#define DEVS_STMT0_REMOVED_77 77
#define DEVS_OP_PAST_LAST 95

#define DEVS_OP_PROPS                                                                              \
    "\x7f\x60\x11\x12\x13\x14\x15\x16\x17\x18\x19\x12\x51\x70\x31\x42\x60\x31\x31\x14\x40\x20\x20" \
    "\x41\x02\x13\x21\x21\x21\x60\x60\x10\x11\x11\x60\x60\x60\x60\x60\x60\x60\x60\x10\x03\x00\x41" \
    "\x40\x41\x40\x40\x41\x40\x41\x41\x41\x41\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42" \
    "\x42\x42\x42\x41\x32\x21\x20\x41\x10\x30\x12\x30\x70\x10\x10\x51\x51\x71\x10\x41\x42\x40\x42" \
    "\x42\x11\x60"
#define DEVS_OP_TYPES                                                                              \
    "\x7f\x01\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x08\x0e\x0f\x0f\x0f\x01\x0e\x0e" \
    "\x01\x0e\x0f\x0e\x0e\x0e\x0e\x0e\x0f\x0f\x0f\x0e\x04\x09\x09\x09\x08\x01\x01\x0f\x01\x0e\x01" \
    "\x0c\x06\x06\x06\x06\x01\x01\x01\x06\x01\x06\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x06" \
    "\x06\x06\x06\x06\x0f\x0e\x08\x01\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x0f\x08\x06\x0c\x06" \
    "\x06\x0f\x0e"

#define DEVS_IMG_VERSION_MAJOR 2
#define DEVS_IMG_VERSION_MINOR 16
#define DEVS_IMG_VERSION_PATCH 2
#define DEVS_IMG_VERSION 0x2100002
#define DEVS_MAGIC0 0x53766544 // "DevS"
#define DEVS_MAGIC1 0xf1296e0a
#define DEVS_NUM_IMG_SECTIONS 10
#define DEVS_FIX_HEADER_SIZE 32
#define DEVS_SECTION_HEADER_SIZE 8
#define DEVS_FUNCTION_HEADER_SIZE 16
#define DEVS_ASCII_HEADER_SIZE 2
#define DEVS_UTF8_HEADER_SIZE 4
#define DEVS_UTF8_TABLE_SHIFT 4
#define DEVS_BINARY_SIZE_ALIGN 32
#define DEVS_MAX_STACK_DEPTH 16
#define DEVS_MAX_CALL_DEPTH 100
#define DEVS_DIRECT_CONST_OP 0x80
#define DEVS_DIRECT_CONST_OFFSET 16
#define DEVS_FIRST_MULTIBYTE_INT 0xf8
#define DEVS_FIRST_NON_OPCODE 0x10000
#define DEVS_FIRST_BUILTIN_FUNCTION 50000
#define DEVS_MAX_ARGS_SHORT_CALL 8
#define DEVS_SERVICE_SPEC_HEADER_SIZE 16
#define DEVS_SERVICE_SPEC_PACKET_SIZE 8
#define DEVS_SERVICE_SPEC_FIELD_SIZE 4
#define DEVS_ROLE_BITS 15

#define DEVS_STRIDX_BUFFER 0
#define DEVS_STRIDX_BUILTIN 1
#define DEVS_STRIDX_ASCII 2
#define DEVS_STRIDX_UTF8 3
#define DEVS_STRIDX__SHIFT 14

#define DEVS_OPCALL___MAX 4
#define DEVS_OPCALL_SYNC 0
#define DEVS_OPCALL_BG 1
#define DEVS_OPCALL_BG_MAX1 2
#define DEVS_OPCALL_BG_MAX1_PEND1 3
#define DEVS_OPCALL_BG_MAX1_REPLACE 4

#define DEVS_BYTECODEFLAG_NUM_ARGS_MASK 0xf
#define DEVS_BYTECODEFLAG_IS_STMT 0x10
#define DEVS_BYTECODEFLAG_TAKES_NUMBER 0x20
#define DEVS_BYTECODEFLAG_IS_STATELESS 0x40  // fun modifier - only valid when !is_stmt
#define DEVS_BYTECODEFLAG_IS_FINAL_STMT 0x40 // final modifier - only valid when is_stmt

#define DEVS_FUNCTIONFLAG_NEEDS_THIS 0x01
#define DEVS_FUNCTIONFLAG_IS_CTOR 0x02
#define DEVS_FUNCTIONFLAG_HAS_REST_ARG 0x04

#define DEVS_NUMFMT___MAX 12
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
#define DEVS_NUMFMT_SPECIAL 0b1100

#define DEVS_NUMFMT_SPECIAL___MAX 6
#define DEVS_NUMFMT_SPECIAL_EMPTY 0
#define DEVS_NUMFMT_SPECIAL_BYTES 1
#define DEVS_NUMFMT_SPECIAL_STRING 2
#define DEVS_NUMFMT_SPECIAL_STRING0 3
#define DEVS_NUMFMT_SPECIAL_BOOL 4
#define DEVS_NUMFMT_SPECIAL_PIPE 5
#define DEVS_NUMFMT_SPECIAL_PIPE_PORT 6

#define DEVS_PACKETSPEC_CODE_REGISTER 0x1000
#define DEVS_PACKETSPEC_CODE_EVENT 0x8000
#define DEVS_PACKETSPEC_CODE_COMMAND 0x0000
#define DEVS_PACKETSPEC_CODE_REPORT 0x2000
#define DEVS_PACKETSPEC_CODE_MASK 0xf000

#define DEVS_SERVICESPEC_FLAG_DERIVE_MASK 0x000f
#define DEVS_SERVICESPEC_FLAG_DERIVE_BASE 0x0000
#define DEVS_SERVICESPEC_FLAG_DERIVE_SENSOR 0x0001
#define DEVS_SERVICESPEC_FLAG_DERIVE_LAST 0x0001

#define DEVS_PACKETSPEC_FLAG___MAX 1
#define DEVS_PACKETSPEC_FLAG_MULTI_FIELD 0x01

#define DEVS_FIELDSPEC_FLAG___MAX 2
#define DEVS_FIELDSPEC_FLAG_IS_BYTES 0x01
#define DEVS_FIELDSPEC_FLAG_STARTS_REPEATS 0x02

#define DEVS_OBJECT_TYPE___MAX 15
#define DEVS_OBJECT_TYPE_UNDEFINED 0
#define DEVS_OBJECT_TYPE_NUMBER 1
#define DEVS_OBJECT_TYPE_MAP 2
#define DEVS_OBJECT_TYPE_ARRAY 3
#define DEVS_OBJECT_TYPE_BUFFER 4
#define DEVS_OBJECT_TYPE_ROLE 5
#define DEVS_OBJECT_TYPE_BOOL 6
#define DEVS_OBJECT_TYPE_FIBER 7
#define DEVS_OBJECT_TYPE_FUNCTION 8
#define DEVS_OBJECT_TYPE_STRING 9
#define DEVS_OBJECT_TYPE_PACKET 10
#define DEVS_OBJECT_TYPE_EXOTIC 11
#define DEVS_OBJECT_TYPE_NULL 12
#define DEVS_OBJECT_TYPE_IMAGE 13
#define DEVS_OBJECT_TYPE_ANY 14
#define DEVS_OBJECT_TYPE_VOID 15

#define DEVS_BUILTIN_OBJECT___MAX 43
#define DEVS_BUILTIN_OBJECT_MATH 0
#define DEVS_BUILTIN_OBJECT_OBJECT 1
#define DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE 2
#define DEVS_BUILTIN_OBJECT_ARRAY 3
#define DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE 4
#define DEVS_BUILTIN_OBJECT_BUFFER 5
#define DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE 6
#define DEVS_BUILTIN_OBJECT_STRING 7
#define DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE 8
#define DEVS_BUILTIN_OBJECT_NUMBER 9
#define DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE 10
#define DEVS_BUILTIN_OBJECT_DSFIBER 11
#define DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE 12
#define DEVS_BUILTIN_OBJECT_DSROLE 13
#define DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE 14
#define DEVS_BUILTIN_OBJECT_FUNCTION 15
#define DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE 16
#define DEVS_BUILTIN_OBJECT_BOOLEAN 17
#define DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE 18
#define DEVS_BUILTIN_OBJECT_DSPACKET 19
#define DEVS_BUILTIN_OBJECT_DSPACKET_PROTOTYPE 20
#define DEVS_BUILTIN_OBJECT_DEVICESCRIPT 21
#define DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE 22
#define DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE 23
#define DEVS_BUILTIN_OBJECT_DSCOMMAND_PROTOTYPE 24
#define DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE 25
#define DEVS_BUILTIN_OBJECT_DSREPORT_PROTOTYPE 26
#define DEVS_BUILTIN_OBJECT_ERROR 27
#define DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE 28
#define DEVS_BUILTIN_OBJECT_TYPEERROR 29
#define DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE 30
#define DEVS_BUILTIN_OBJECT_RANGEERROR 31
#define DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE 32
#define DEVS_BUILTIN_OBJECT_SYNTAXERROR 33
#define DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE 34
#define DEVS_BUILTIN_OBJECT_JSON 35
#define DEVS_BUILTIN_OBJECT_DSSERVICESPEC 36
#define DEVS_BUILTIN_OBJECT_DSSERVICESPEC_PROTOTYPE 37
#define DEVS_BUILTIN_OBJECT_DSPACKETSPEC 38
#define DEVS_BUILTIN_OBJECT_DSPACKETSPEC_PROTOTYPE 39
#define DEVS_BUILTIN_OBJECT_IMAGE 40
#define DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE 41
#define DEVS_BUILTIN_OBJECT_GPIO 42
#define DEVS_BUILTIN_OBJECT_GPIO_PROTOTYPE 43

#define DEVS_BUILTIN_STRING___MAX 225
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
#define DEVS_BUILTIN_STRING_ISBOUND 32
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
#define DEVS_BUILTIN_STRING__PANIC 48
#define DEVS_BUILTIN_STRING_POP 49
#define DEVS_BUILTIN_STRING_POW 50
#define DEVS_BUILTIN_STRING_PREV 51
#define DEVS_BUILTIN_STRING_PROTOTYPE 52
#define DEVS_BUILTIN_STRING_PUSH 53
#define DEVS_BUILTIN_STRING_RANDOM 54
#define DEVS_BUILTIN_STRING_RANDOMINT 55
#define DEVS_BUILTIN_STRING_READ 56
#define DEVS_BUILTIN_STRING_RESTART 57
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
#define DEVS_BUILTIN_STRING_SLEEP 74
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
#define DEVS_BUILTIN_STRING___FUNC__ 88
#define DEVS_BUILTIN_STRING_ROLE 89
#define DEVS_BUILTIN_STRING_DEVICEIDENTIFIER 90
#define DEVS_BUILTIN_STRING_SHORTID 91
#define DEVS_BUILTIN_STRING_SERVICEINDEX 92
#define DEVS_BUILTIN_STRING_SERVICECOMMAND 93
#define DEVS_BUILTIN_STRING_PAYLOAD 94
#define DEVS_BUILTIN_STRING_DECODE 95
#define DEVS_BUILTIN_STRING_ENCODE 96
#define DEVS_BUILTIN_STRING__ONPACKET 97
#define DEVS_BUILTIN_STRING_CODE 98
#define DEVS_BUILTIN_STRING_NAME 99
#define DEVS_BUILTIN_STRING_ISEVENT 100
#define DEVS_BUILTIN_STRING_EVENTCODE 101
#define DEVS_BUILTIN_STRING_ISREGSET 102
#define DEVS_BUILTIN_STRING_ISREGGET 103
#define DEVS_BUILTIN_STRING_REGCODE 104
#define DEVS_BUILTIN_STRING_FLAGS 105
#define DEVS_BUILTIN_STRING_ISREPORT 106
#define DEVS_BUILTIN_STRING_ISCOMMAND 107
#define DEVS_BUILTIN_STRING_ISARRAY 108
#define DEVS_BUILTIN_STRING_INLINE 109
#define DEVS_BUILTIN_STRING_ASSERT 110
#define DEVS_BUILTIN_STRING_PUSHRANGE 111
#define DEVS_BUILTIN_STRING_SENDCOMMAND 112
#define DEVS_BUILTIN_STRING___STACK__ 113
#define DEVS_BUILTIN_STRING_ERROR 114
#define DEVS_BUILTIN_STRING_TYPEERROR 115
#define DEVS_BUILTIN_STRING_RANGEERROR 116
#define DEVS_BUILTIN_STRING_STACK 117
#define DEVS_BUILTIN_STRING_MESSAGE 118
#define DEVS_BUILTIN_STRING_CAUSE 119
#define DEVS_BUILTIN_STRING___NEW__ 120
#define DEVS_BUILTIN_STRING_SETPROTOTYPEOF 121
#define DEVS_BUILTIN_STRING_GETPROTOTYPEOF 122
#define DEVS_BUILTIN_STRING_CONSTRUCTOR 123
#define DEVS_BUILTIN_STRING___PROTO__ 124
#define DEVS_BUILTIN_STRING__LOGREPR 125
#define DEVS_BUILTIN_STRING_PRINT 126
#define DEVS_BUILTIN_STRING_EVERYMS 127
#define DEVS_BUILTIN_STRING_SETINTERVAL 128
#define DEVS_BUILTIN_STRING_SETTIMEOUT 129
#define DEVS_BUILTIN_STRING_CLEARINTERVAL 130
#define DEVS_BUILTIN_STRING_CLEARTIMEOUT 131
#define DEVS_BUILTIN_STRING_SYNTAXERROR 132
#define DEVS_BUILTIN_STRING_JSON 133
#define DEVS_BUILTIN_STRING_PARSE 134
#define DEVS_BUILTIN_STRING_STRINGIFY 135
#define DEVS_BUILTIN_STRING__DCFGSTRING 136
#define DEVS_BUILTIN_STRING_ISSIMULATOR 137
#define DEVS_BUILTIN_STRING__ROLE 138 // Role
#define DEVS_BUILTIN_STRING_FIBER 139
#define DEVS_BUILTIN_STRING_SUSPEND 140
#define DEVS_BUILTIN_STRING_RESUME 141
#define DEVS_BUILTIN_STRING_TERMINATE 142
#define DEVS_BUILTIN_STRING_SELF 143
#define DEVS_BUILTIN_STRING_CURRENT 144
#define DEVS_BUILTIN_STRING_ID 145
#define DEVS_BUILTIN_STRING__COMMANDRESPONSE 146
#define DEVS_BUILTIN_STRING_ISACTION 147
#define DEVS_BUILTIN_STRING_MILLIS 148
#define DEVS_BUILTIN_STRING_FROM 149
#define DEVS_BUILTIN_STRING_HEX 150
#define DEVS_BUILTIN_STRING_UTF8 151
#define DEVS_BUILTIN_STRING_UTF_8 152 // utf-8
#define DEVS_BUILTIN_STRING_SUSPENDED 153
#define DEVS_BUILTIN_STRING_REBOOT 154
#define DEVS_BUILTIN_STRING_SERVER 155
#define DEVS_BUILTIN_STRING_SPEC 156
#define DEVS_BUILTIN_STRING_SERVICESPEC 157
#define DEVS_BUILTIN_STRING_CLASSIDENTIFIER 158
#define DEVS_BUILTIN_STRING_LOOKUP 159
#define DEVS_BUILTIN_STRING_PACKETSPEC 160
#define DEVS_BUILTIN_STRING_PARENT 161
#define DEVS_BUILTIN_STRING_RESPONSE 162
#define DEVS_BUILTIN_STRING_SERVERINTERFACE 163
#define DEVS_BUILTIN_STRING__ONSERVERPACKET 164
#define DEVS_BUILTIN_STRING__SERVERSEND 165
#define DEVS_BUILTIN_STRING_NOTIMPLEMENTED 166
#define DEVS_BUILTIN_STRING_DELAY 167
#define DEVS_BUILTIN_STRING_FROMCHARCODE 168
#define DEVS_BUILTIN_STRING__ALLOCROLE 169
#define DEVS_BUILTIN_STRING_SPICONFIGURE 170
#define DEVS_BUILTIN_STRING_SPIXFER 171
#define DEVS_BUILTIN_STRING__SOCKETOPEN 172
#define DEVS_BUILTIN_STRING__SOCKETCLOSE 173
#define DEVS_BUILTIN_STRING__SOCKETWRITE 174
#define DEVS_BUILTIN_STRING__SOCKETONEVENT 175
#define DEVS_BUILTIN_STRING_OPEN 176
#define DEVS_BUILTIN_STRING_CLOSE 177
#define DEVS_BUILTIN_STRING_ERROR_ 178 // error
#define DEVS_BUILTIN_STRING_DATA 179
#define DEVS_BUILTIN_STRING_TOUPPERCASE 180
#define DEVS_BUILTIN_STRING_TOLOWERCASE 181
#define DEVS_BUILTIN_STRING_INDEXOF 182
#define DEVS_BUILTIN_STRING_BYTELENGTH 183
#define DEVS_BUILTIN_STRING_IMAGE 184
#define DEVS_BUILTIN_STRING_WIDTH 185
#define DEVS_BUILTIN_STRING_HEIGHT 186
#define DEVS_BUILTIN_STRING_BPP 187
#define DEVS_BUILTIN_STRING_GET 188
#define DEVS_BUILTIN_STRING_CLONE 189
#define DEVS_BUILTIN_STRING_SET 190
#define DEVS_BUILTIN_STRING_FILL 191
#define DEVS_BUILTIN_STRING_FLIPX 192
#define DEVS_BUILTIN_STRING_FLIPY 193
#define DEVS_BUILTIN_STRING_TRANSPOSED 194
#define DEVS_BUILTIN_STRING_DRAWIMAGE 195
#define DEVS_BUILTIN_STRING_DRAWTRANSPARENTIMAGE 196
#define DEVS_BUILTIN_STRING_OVERLAPSWITH 197
#define DEVS_BUILTIN_STRING_FILLRECT 198
#define DEVS_BUILTIN_STRING_DRAWLINE 199
#define DEVS_BUILTIN_STRING_EQUALS 200
#define DEVS_BUILTIN_STRING_ISREADONLY 201
#define DEVS_BUILTIN_STRING_FILLCIRCLE 202
#define DEVS_BUILTIN_STRING_BLITROW 203
#define DEVS_BUILTIN_STRING_BLIT 204
#define DEVS_BUILTIN_STRING__I2CTRANSACTION 205
#define DEVS_BUILTIN_STRING__TWINMESSAGE 206
#define DEVS_BUILTIN_STRING_SPISENDIMAGE 207
#define DEVS_BUILTIN_STRING_GPIO 208
#define DEVS_BUILTIN_STRING_LABEL 209
#define DEVS_BUILTIN_STRING_MODE 210
#define DEVS_BUILTIN_STRING_CAPABILITIES 211
#define DEVS_BUILTIN_STRING_VALUE 212
#define DEVS_BUILTIN_STRING_SETMODE 213
#define DEVS_BUILTIN_STRING_FILLRANDOM 214
#define DEVS_BUILTIN_STRING_ENCRYPT 215
#define DEVS_BUILTIN_STRING_DECRYPT 216
#define DEVS_BUILTIN_STRING_DIGEST 217
#define DEVS_BUILTIN_STRING_LEDSTRIPSEND 218
#define DEVS_BUILTIN_STRING_ROTATE 219
#define DEVS_BUILTIN_STRING_REGISTER 220
#define DEVS_BUILTIN_STRING_EVENT 221
#define DEVS_BUILTIN_STRING_ACTION 222
#define DEVS_BUILTIN_STRING_REPORT 223
#define DEVS_BUILTIN_STRING_TYPE 224
#define DEVS_BUILTIN_STRING_BYCODE 225

#define DEVS_OP_HANDLERS                                                                           \
    expr_invalid, exprx_builtin_object, stmt1_call0, stmt2_call1, stmt3_call2, stmt4_call3,        \
        stmt5_call4, stmt6_call5, stmt7_call6, stmt8_call7, stmt9_call8, stmt2_index_delete,       \
        stmt1_return, stmtx_jmp, stmtx1_jmp_z, expr2_bind, exprx_object_field, stmtx1_store_local, \
        stmtx1_store_global, stmt4_store_buffer, expr0_inf, exprx_load_local, exprx_load_global,   \
        expr1_uplus, expr2_index, stmt3_index_set, exprx1_builtin_field, exprx1_ascii_field,       \
        exprx1_utf8_field, exprx_math_field, exprx_ds_field, stmt0_alloc_map, stmt1_alloc_array,   \
        stmt1_alloc_buffer, exprx_static_spec_proto, exprx_static_buffer,                          \
        exprx_static_builtin_string, exprx_static_ascii_string, exprx_static_utf8_string,          \
        exprx_static_function, exprx_literal, exprx_literal_f64, expr_invalid, expr3_load_buffer,  \
        expr0_ret_val, expr1_typeof, expr0_undefined, expr1_is_undefined, expr0_true, expr0_false, \
        expr1_to_bool, expr0_nan, expr1_abs, expr1_bit_not, expr1_is_nan, expr1_neg, expr1_not,    \
        expr1_to_int, expr2_add, expr2_sub, expr2_mul, expr2_div, expr2_bit_and, expr2_bit_or,     \
        expr2_bit_xor, expr2_shift_left, expr2_shift_right, expr2_shift_right_unsigned, expr2_eq,  \
        expr2_le, expr2_lt, expr2_ne, expr1_is_nullish, stmtx2_store_closure, exprx1_load_closure, \
        exprx_make_closure, expr1_typeof_str, expr_invalid, stmtx_jmp_ret_val_z, stmt2_call_array, \
        stmtx_try, stmtx_end_try, stmt0_catch, stmt0_finally, stmt1_throw, stmt1_re_throw,         \
        stmtx1_throw_jmp, stmt0_debugger, expr1_new, expr2_instance_of, expr0_null,                \
        expr2_approx_eq, expr2_approx_ne, stmt1_store_ret_val, exprx_static_spec, expr_invalid

#define DEVS_BUILTIN_STRING__VAL                                                                   \
    "", "-Infinity", "DeviceScript", "E", "Infinity", "LN10", "LN2", "LOG10E", "LOG2E", "NaN",     \
        "PI", "SQRT1_2", "SQRT2", "abs", "alloc", "array", "blitAt", "boolean", "buffer", "cbrt",  \
        "ceil", "charCodeAt", "clamp", "exp", "false", "fillAt", "floor", "forEach", "function",   \
        "getAt", "idiv", "imul", "isBound", "join", "length", "log", "log10", "log2", "map",       \
        "max", "min", "next", "null", "number", "onChange", "onConnected", "onDisconnected",       \
        "packet", "_panic", "pop", "pow", "prev", "prototype", "push", "random", "randomInt",      \
        "read", "restart", "round", "setAt", "setLength", "shift", "signal", "slice", "splice",    \
        "sqrt", "string", "subscribe", "toString", "true", "undefined", "unshift", "wait",         \
        "write", "sleep", "imod", "format", "insert", "start", "cloud", "main", "charAt",          \
        "object", "parseInt", "parseFloat", "assign", "keys", "values", "__func__", "role",        \
        "deviceIdentifier", "shortId", "serviceIndex", "serviceCommand", "payload", "decode",      \
        "encode", "_onPacket", "code", "name", "isEvent", "eventCode", "isRegSet", "isRegGet",     \
        "regCode", "flags", "isReport", "isCommand", "isArray", "inline", "assert", "pushRange",   \
        "sendCommand", "__stack__", "Error", "TypeError", "RangeError", "stack", "message",        \
        "cause", "__new__", "setPrototypeOf", "getPrototypeOf", "constructor", "__proto__",        \
        "_logRepr", "print", "everyMs", "setInterval", "setTimeout", "clearInterval",              \
        "clearTimeout", "SyntaxError", "JSON", "parse", "stringify", "_dcfgString", "isSimulator", \
        "Role", "Fiber", "suspend", "resume", "terminate", "self", "current", "id",                \
        "_commandResponse", "isAction", "millis", "from", "hex", "utf8", "utf-8", "suspended",     \
        "reboot", "server", "spec", "ServiceSpec", "classIdentifier", "lookup", "PacketSpec",      \
        "parent", "response", "ServerInterface", "_onServerPacket", "_serverSend",                 \
        "notImplemented", "delay", "fromCharCode", "_allocRole", "spiConfigure", "spiXfer",        \
        "_socketOpen", "_socketClose", "_socketWrite", "_socketOnEvent", "open", "close", "error", \
        "data", "toUpperCase", "toLowerCase", "indexOf", "byteLength", "Image", "width", "height", \
        "bpp", "get", "clone", "set", "fill", "flipX", "flipY", "transposed", "drawImage",         \
        "drawTransparentImage", "overlapsWith", "fillRect", "drawLine", "equals", "isReadOnly",    \
        "fillCircle", "blitRow", "blit", "_i2cTransaction", "_twinMessage", "spiSendImage",        \
        "gpio", "label", "mode", "capabilities", "value", "setMode", "fillRandom", "encrypt",      \
        "decrypt", "digest", "ledStripSend", "rotate", "register", "event", "action", "report",    \
        "type", "byCode"
#define DEVS_BUILTIN_OBJECT__VAL                                                                   \
    "Math", "Object", "Object_prototype", "Array", "Array_prototype", "Buffer",                    \
        "Buffer_prototype", "String", "String_prototype", "Number", "Number_prototype", "DsFiber", \
        "DsFiber_prototype", "DsRole", "DsRole_prototype", "Function", "Function_prototype",       \
        "Boolean", "Boolean_prototype", "DsPacket", "DsPacket_prototype", "DeviceScript",          \
        "DsPacketInfo_prototype", "DsRegister_prototype", "DsCommand_prototype",                   \
        "DsEvent_prototype", "DsReport_prototype", "Error", "Error_prototype", "TypeError",        \
        "TypeError_prototype", "RangeError", "RangeError_prototype", "SyntaxError",                \
        "SyntaxError_prototype", "JSON", "DsServiceSpec", "DsServiceSpec_prototype",               \
        "DsPacketSpec", "DsPacketSpec_prototype", "Image", "Image_prototype", "GPIO",              \
        "GPIO_prototype"
