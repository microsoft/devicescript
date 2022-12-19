// Auto-generated from bytecode.md; do not edit.

export enum Op {
    STMTx2_CALL = 1, // *local_idx, numargs, func
    STMT1_CALL0 = 2, // func
    STMT2_CALL1 = 3, // func, value0
    STMT3_CALL2 = 4, // func, value0, value1
    STMT4_CALL3 = 5, // func, value0, value1, value2
    STMT5_CALL4 = 6, // func, value0, value1, value2, value3
    STMT6_CALL5 = 7, // func, value0, value1, value2, value3, value4
    STMT7_CALL6 = 8, // func, value0, value1, value2, value3, value4, value5
    STMT8_CALL7 = 9, // func, value0, value1, value2, value3, value4, value5, value6
    STMT9_CALL8 = 10, // func, value0, value1, value2, value3, value4, value5, value6, value7
    STMTx3_CALL_BG = 11, // *local_idx, numargs, func, opcall
    STMT1_RETURN = 12, // value
    STMTx_JMP = 13, // JMP jmpoffset
    STMTx1_JMP_Z = 14, // JMP jmpoffset IF NOT x
    STMT1_PANIC = 15, // error_code
    STMTx2_LOG_FORMAT = 16, // *local_idx, numargs, string
    STMTx1_STORE_LOCAL = 17, // local_idx := value
    STMTx1_STORE_GLOBAL = 18, // global_idx := value
    STMT4_STORE_BUFFER = 19, // buffer, numfmt, offset, value
    STMTx1_STORE_PARAM = 20, // param_idx := value
    EXPRx_LOAD_LOCAL = 21, // *local_idx
    EXPRx_LOAD_GLOBAL = 22, // *global_idx
    EXPRx_LOAD_PARAM = 23, // *param_idx
    EXPR2_INDEX = 24, // object[idx]
    STMT3_INDEX_SET = 25, // object[index] := value
    EXPRx1_BUILTIN_FIELD = 26, // obj.builtin_idx
    EXPRx1_ASCII_FIELD = 27, // obj.ascii_idx
    EXPRx1_UTF8_FIELD = 28, // obj.utf8_idx
    EXPRx_MATH_FIELD = 29, // Math.builtin_idx
    EXPRx_DS_FIELD = 30, // ds.builtin_idx
    STMT0_ALLOC_MAP = 31,
    STMT1_ALLOC_ARRAY = 32, // initial_size
    STMT1_ALLOC_BUFFER = 33, // size
    EXPRx_STATIC_ROLE = 34, // *role_idx
    EXPRx_STATIC_BUFFER = 35, // *buffer_idx
    EXPRx_STATIC_BUILTIN_STRING = 36, // *builtin_idx
    EXPRx_STATIC_ASCII_STRING = 37, // *ascii_idx
    EXPRx_STATIC_UTF8_STRING = 38, // *utf8_idx
    EXPRx_STATIC_FUNCTION = 39, // *func_idx
    EXPRx_LITERAL = 40, // *value
    EXPRx_LITERAL_F64 = 41, // *f64_idx
    EXPRx2_FORMAT = 42, // *local_idx, numargs, string
    EXPR3_LOAD_BUFFER = 43, // buffer, numfmt, offset
    EXPR0_RET_VAL = 44,
    EXPR1_TYPEOF = 45, // object
    EXPR0_NULL = 46,
    EXPR1_IS_NULL = 47,
    EXPR0_TRUE = 48,
    EXPR0_FALSE = 49,
    EXPR1_TO_BOOL = 50, // !!x
    EXPR0_NAN = 51,
    EXPR1_ABS = 52,
    EXPR1_BIT_NOT = 53, // ~x
    EXPR1_IS_NAN = 54,
    EXPR1_NEG = 55, // -x
    EXPR1_NOT = 56, // !x
    EXPR1_TO_INT = 57,
    EXPR2_ADD = 58, // x + y
    EXPR2_SUB = 59, // x - y
    EXPR2_MUL = 60, // x * y
    EXPR2_DIV = 61, // x / y
    EXPR2_BIT_AND = 62, // x & y
    EXPR2_BIT_OR = 63, // x | y
    EXPR2_BIT_XOR = 64, // x ^ y
    EXPR2_SHIFT_LEFT = 65, // x << y
    EXPR2_SHIFT_RIGHT = 66, // x >> y
    EXPR2_SHIFT_RIGHT_UNSIGNED = 67, // x >>> y
    EXPR2_EQ = 68, // x == y
    EXPR2_LE = 69, // x <= y
    EXPR2_LT = 70, // x < y
    EXPR2_NE = 71, // x != y
    STMT1_TERMINATE_FIBER = 72, // fiber_handle
    STMT1_WAIT_ROLE = 73, // role
    STMT3_QUERY_REG = 74, // role, code, timeout
    STMT2_SEND_CMD = 75, // role, code
    STMT4_QUERY_IDX_REG = 76, // role, code, string, timeout
    STMT1_SETUP_PKT_BUFFER = 77, // size
    STMT2_SET_PKT = 78, // buffer, offset
    EXPR0_NOW_MS = 79,
    EXPR2_STR0EQ = 80, // buffer, offset
    EXPR1_GET_FIBER_HANDLE = 81, // func
    EXPR0_PKT_SIZE = 82,
    EXPR0_PKT_EV_CODE = 83,
    EXPR0_PKT_REG_GET_CODE = 84,
    EXPR0_PKT_REPORT_CODE = 85,
    EXPR0_PKT_COMMAND_CODE = 86,
    EXPR0_PKT_BUFFER = 87,
    OP_PAST_LAST = 88,
}

export const OP_PROPS =
    "\x7f\x32\x11\x12\x13\x14\x15\x16\x17\x18\x19\x33\x11\x30\x31\x11\x32\x31\x31\x14\x31\x20\x20\x20\x42\x13\x21\x21\x21\x60\x60\x10\x11\x11\x60\x60\x60\x60\x60\x60\x60\x60\x62\x03\x00\x41\x40\x41\x40\x40\x41\x40\x41\x41\x41\x41\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x11\x11\x13\x12\x14\x11\x12\x00\x02\x01\x00\x00\x00\x00\x00\x40"
export const OP_TYPES =
    "\x7f\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0a\x0a\x0a\x0a\x0b\x0a\x0a\x0a\x0a\x0a\x0b\x0b\x0b\x05\x04\x09\x09\x09\x08\x01\x01\x09\x01\x0a\x01\x00\x06\x06\x06\x06\x01\x01\x01\x06\x01\x06\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x01\x06\x06\x06\x06\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x01\x06\x07\x01\x01\x01\x01\x01\x04"

export enum BinFmt {
    IMG_VERSION = 0x00010000,
    MAGIC0 = 0x53766544, // "DevS"
    MAGIC1 = 0x9a6a7e0a,
    NUM_IMG_SECTIONS = 8,
    FIX_HEADER_SIZE = 32,
    SECTION_HEADER_SIZE = 8,
    FUNCTION_HEADER_SIZE = 16,
    ROLE_HEADER_SIZE = 8,
    ASCII_HEADER_SIZE = 2,
    BINARY_SIZE_ALIGN = 32,
    MAX_STACK_DEPTH = 10,
    DIRECT_CONST_OP = 0x80,
    DIRECT_CONST_OFFSET = 16,
    FIRST_MULTIBYTE_INT = 0xf8,
    FIRST_NON_OPCODE = 0x10000,
    FIRST_BUILTIN_FUNCTION = 0xf000,
}

export enum StrIdx {
    BUFFER = 0,
    BUILTIN = 1,
    ASCII = 2,
    UTF8 = 3,
    _SHIFT = 14,
}

export enum OpCall {
    SYNC = 0,
    BG = 1,
    BG_MAX1 = 2,
    BG_MAX1_PEND1 = 3,
    BG_MAX1_REPLACE = 4,
    __MAX = 4,
}

export enum BytecodeFlag {
    NUM_ARGS_MASK = 0xf,
    IS_STMT = 0x10,
    TAKES_NUMBER = 0x20,
    IS_STATELESS = 0x40, // fun modifier
}

export enum FunctionFlag {
    NEEDS_THIS = 0x01,
    __MAX = 1,
}

export enum NumFmt {
    U8 = 0b0000,
    U16 = 0b0001,
    U32 = 0b0010,
    U64 = 0b0011,
    I8 = 0b0100,
    I16 = 0b0101,
    I32 = 0b0110,
    I64 = 0b0111,
    F8 = 0b1000, // not supported
    F16 = 0b1001, // not supported
    F32 = 0b1010,
    F64 = 0b1011,
    __MAX = 11,
}

export enum ObjectType {
    NULL = 0,
    NUMBER = 1,
    MAP = 2,
    ARRAY = 3,
    BUFFER = 4,
    ROLE = 5,
    BOOL = 6,
    FIBER = 7,
    FUNCTION = 8,
    STRING = 9,
    ANY = 10,
    VOID = 11,
    __MAX = 11,
}

export enum BuiltInObject {
    MATH = 0,
    OBJECT = 1,
    OBJECT_PROTOTYPE = 2,
    ARRAY = 3,
    ARRAY_PROTOTYPE = 3,
    BUFFER = 4,
    BUFFER_PROTOTYPE = 5,
    STRING = 6,
    STRING_PROTOTYPE = 7,
    NUMBER = 8,
    NUMBER_PROTOTYPE = 9,
    FIBER = 10,
    FIBER_PROTOTYPE = 11,
    ROLE = 12,
    ROLE_PROTOTYPE = 13,
    FUNCTION = 14,
    FUNCTION_PROTOTYPE = 15,
    BOOLEAN = 16,
    BOOLEAN_PROTOTYPE = 17,
    DEVICESCRIPT = 18,
    __MAX = 18,
}

export enum BuiltInString {
    _EMPTY = 0,
    MINFINITY = 1, // -Infinity
    DEVICESCRIPT = 2,
    E = 3,
    INFINITY = 4,
    LN10 = 5,
    LN2 = 6,
    LOG10E = 7,
    LOG2E = 8,
    NAN = 9,
    PI = 10,
    SQRT1_2 = 11,
    SQRT2 = 12,
    ABS = 13,
    ALLOC = 14,
    ARRAY = 15,
    BLITAT = 16,
    BOOLEAN = 17,
    BUFFER = 18,
    CBRT = 19,
    CEIL = 20,
    CHARCODEAT = 21,
    CLAMP = 22,
    EXP = 23,
    FALSE = 24,
    FILLAT = 25,
    FLOOR = 26,
    FOREACH = 27,
    FUNCTION = 28,
    GETAT = 29,
    IDIV = 30,
    IMUL = 31,
    ISCONNECTED = 32,
    JOIN = 33,
    LENGTH = 34,
    LOG = 35,
    LOG10 = 36,
    LOG2 = 37,
    MAP = 38,
    MAX = 39,
    MIN = 40,
    NEXT = 41,
    NULL = 42,
    NUMBER = 43,
    ONCHANGE = 44,
    ONCONNECTED = 45,
    ONDISCONNECTED = 46,
    PACKET = 47,
    PANIC = 48,
    POP = 49,
    POW = 50,
    PREV = 51,
    PROTOTYPE = 52,
    PUSH = 53,
    RANDOM = 54,
    RANDOMINT = 55,
    READ = 56,
    REBOOT = 57,
    ROUND = 58,
    SETAT = 59,
    SETLENGTH = 60,
    SHIFT = 61,
    SIGNAL = 62,
    SLICE = 63,
    SPLICE = 64,
    SQRT = 65,
    STRING = 66,
    SUBSCRIBE = 67,
    TOSTRING = 68,
    TRUE = 69,
    UNDEFINED = 70,
    UNSHIFT = 71,
    WAIT = 72,
    WRITE = 73,
    WAITMS = 74,
    __MAX = 74,
}

export const OP_PRINT_FMTS = [
    null,
    "CALL %L numargs=%e func=%e",
    "CALL0 func=%e",
    "CALL1 func=%e value0=%e",
    "CALL2 func=%e value0=%e value1=%e",
    "CALL3 func=%e value0=%e value1=%e value2=%e",
    "CALL4 func=%e value0=%e value1=%e value2=%e value3=%e",
    "CALL5 func=%e value0=%e value1=%e value2=%e value3=%e value4=%e",
    "CALL6 func=%e value0=%e value1=%e value2=%e value3=%e value4=%e value5=%e",
    "CALL7 func=%e value0=%e value1=%e value2=%e value3=%e value4=%e value5=%e value6=%e",
    "CALL8 func=%e value0=%e value1=%e value2=%e value3=%e value4=%e value5=%e value6=%e value7=%e",
    "CALL_BG %L numargs=%e func=%e %o",
    "RETURN %e",
    "JMP %j",
    "JMP %j IF NOT %e",
    "PANIC error_code=%e",
    "LOG_FORMAT %L numargs=%e string=%e",
    "%L := %e",
    "%G := %e",
    "STORE_BUFFER %e %n offset=%e %e",
    "%P := %e",
    "%L",
    "%G",
    "%P",
    "%e[%e]",
    "%e[%e] := %e",
    "%e.%I",
    "%e.%A",
    "%e.%U",
    "Math.%I",
    "ds.%I",
    "ALLOC_MAP ",
    "ALLOC_ARRAY initial_size=%e",
    "ALLOC_BUFFER size=%e",
    "%R",
    "%B",
    "%I",
    "%A",
    "%U",
    "%F",
    "%e",
    "%D",
    "format(%L, numargs=%e, string=%e)",
    "load_buffer(%e, %n, offset=%e)",
    "ret_val()",
    "typeof(%e)",
    "null()",
    "is_null(%e)",
    "true()",
    "false()",
    "!!%e",
    "nan()",
    "abs(%e)",
    "~%e",
    "is_nan(%e)",
    "-%e",
    "!%e",
    "to_int(%e)",
    "(%e + %e)",
    "(%e - %e)",
    "(%e * %e)",
    "(%e / %e)",
    "(%e & %e)",
    "(%e | %e)",
    "(%e ^ %e)",
    "(%e << %e)",
    "(%e >> %e)",
    "(%e >>> %e)",
    "(%e == %e)",
    "(%e <= %e)",
    "(%e < %e)",
    "(%e != %e)",
    "TERMINATE_FIBER fiber_handle=%e",
    "WAIT_ROLE %e",
    "QUERY_REG %e code=%e timeout=%e",
    "SEND_CMD %e code=%e",
    "QUERY_IDX_REG %e code=%e string=%e timeout=%e",
    "SETUP_PKT_BUFFER size=%e",
    "SET_PKT %e offset=%e",
    "now_ms()",
    "str0eq(%e, offset=%e)",
    "get_fiber_handle(func=%e)",
    "pkt_size()",
    "pkt_ev_code()",
    "pkt_reg_get_code()",
    "pkt_report_code()",
    "pkt_command_code()",
    "pkt_buffer()",
]
export const OBJECT_TYPE = [
    "null",
    "number",
    "map",
    "array",
    "buffer",
    "role",
    "bool",
    "fiber",
    "function",
    "string",
    "any",
    "void",
]
export const BUILTIN_STRING__VAL = [
    "",
    "-Infinity",
    "DeviceScript",
    "E",
    "Infinity",
    "LN10",
    "LN2",
    "LOG10E",
    "LOG2E",
    "NaN",
    "PI",
    "SQRT1_2",
    "SQRT2",
    "abs",
    "alloc",
    "array",
    "blitAt",
    "boolean",
    "buffer",
    "cbrt",
    "ceil",
    "charCodeAt",
    "clamp",
    "exp",
    "false",
    "fillAt",
    "floor",
    "forEach",
    "function",
    "getAt",
    "idiv",
    "imul",
    "isConnected",
    "join",
    "length",
    "log",
    "log10",
    "log2",
    "map",
    "max",
    "min",
    "next",
    "null",
    "number",
    "onChange",
    "onConnected",
    "onDisconnected",
    "packet",
    "panic",
    "pop",
    "pow",
    "prev",
    "prototype",
    "push",
    "random",
    "randomInt",
    "read",
    "reboot",
    "round",
    "setAt",
    "setLength",
    "shift",
    "signal",
    "slice",
    "splice",
    "sqrt",
    "string",
    "subscribe",
    "toString",
    "true",
    "undefined",
    "unshift",
    "wait",
    "write",
    "waitMs",
]
