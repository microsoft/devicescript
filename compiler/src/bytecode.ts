// Auto-generated from bytecode.md; do not edit.

export enum Op {
    STMT1_WAIT_ROLE = 62, // role
    STMT1_SLEEP_S = 63,
    STMT1_SLEEP_MS = 64,
    STMT3_QUERY_REG = 65, // role, code, timeout
    STMT2_SEND_CMD = 66, // role, code
    STMT4_QUERY_IDX_REG = 67, // role, code, string, timeout
    STMTx2_LOG_FORMAT = 68, // *local_idx, numargs, string
    STMT1_SETUP_PKT_BUFFER = 70, // size
    STMT2_SET_PKT = 71, // buffer, offset
    STMT5_BLIT = 72, // dst, dst_offset, src, src_offset, length
    STMT4_MEMSET = 51, // dst, offset, length, value
    STMT1_DECODE_UTF8 = 97, // buffer
    STMTx2_CALL = 73, // *local_idx, numargs, func
    STMTx3_CALL_BG = 74, // *local_idx, numargs, func, opcall
    STMT1_RETURN = 75, // value
    STMTx_JMP = 76, // JMP jmpoffset
    STMTx1_JMP_Z = 77, // JMP jmpoffset IF NOT x
    STMT1_PANIC = 78, // error_code
    STMTx1_STORE_LOCAL = 79, // local_idx := value
    STMTx1_STORE_GLOBAL = 80, // global_idx := value
    STMT4_STORE_BUFFER = 81, // buffer, numfmt, offset, value
    STMTx1_STORE_PARAM = 82, // param_idx := value
    STMT1_TERMINATE_FIBER = 83, // fiber_handle
    STMT0_ALLOC_MAP = 84,
    STMT1_ALLOC_ARRAY = 85, // initial_size
    STMT1_ALLOC_BUFFER = 86, // size
    STMT3_SET_FIELD = 87, // object.field := value
    STMT3_ARRAY_SET = 88, // array[index] := value
    STMT3_ARRAY_INSERT = 89, // array, index, count
    EXPRx_LOAD_LOCAL = 1, // *local_idx
    EXPRx_LOAD_GLOBAL = 2, // *global_idx
    EXPRx_LOAD_PARAM = 45, // *param_idx
    EXPRx_STATIC_ROLE = 50, // *role_idx
    EXPRx_STATIC_BUFFER = 93, // *buffer_idx
    EXPRx_STATIC_BUILTIN_STRING = 94, // *builtin_idx
    EXPRx_STATIC_ASCII_STRING = 95, // *ascii_idx
    EXPRx_STATIC_UTF8_STRING = 96, // *utf8_idx
    EXPRx_STATIC_FUNCTION = 90, // *func_idx
    EXPRx2_FORMAT = 69, // *local_idx, numargs, string
    EXPRx_LITERAL = 4, // *value
    EXPRx_LITERAL_F64 = 5, // *f64_idx
    EXPR3_LOAD_BUFFER = 3, // buffer, numfmt, offset
    EXPR2_STR0EQ = 7, // buffer, offset
    EXPR1_ROLE_IS_CONNECTED = 8, // role
    EXPR1_GET_FIBER_HANDLE = 47, // func
    EXPR0_RET_VAL = 6,
    EXPR0_NOW_MS = 46,
    EXPR2_GET_FIELD = 52, // object.field
    EXPR2_INDEX = 53, // object[idx]
    EXPR1_OBJECT_LENGTH = 54, // object
    EXPR1_KEYS_LENGTH = 55, // object
    EXPR1_TYPEOF = 56, // object
    EXPR0_NULL = 57,
    EXPR1_IS_NULL = 58,
    EXPR0_PKT_SIZE = 9,
    EXPR0_PKT_EV_CODE = 10,
    EXPR0_PKT_REG_GET_CODE = 11,
    EXPR0_PKT_REPORT_CODE = 48,
    EXPR0_PKT_COMMAND_CODE = 49,
    EXPR0_PKT_BUFFER = 59,
    EXPR0_TRUE = 60,
    EXPR0_FALSE = 61,
    EXPR1_TO_BOOL = 25, // !!x
    EXPR0_NAN = 12,
    EXPR1_ABS = 13,
    EXPR1_BIT_NOT = 14, // ~x
    EXPR1_ROUND = 24,
    EXPR1_CEIL = 15,
    EXPR1_FLOOR = 16,
    EXPR1_ID = 17,
    EXPR1_IS_NAN = 18,
    EXPR1_LOG_E = 19,
    EXPR1_NEG = 20, // -x
    EXPR1_NOT = 21, // !x
    EXPR1_TO_INT = 92,
    EXPR1_RANDOM = 22,
    EXPR1_RANDOM_INT = 23,
    EXPR2_ADD = 26, // x + y
    EXPR2_SUB = 44, // x - y
    EXPR2_MUL = 38, // x * y
    EXPR2_DIV = 30, // x / y
    EXPR2_POW = 40,
    EXPR2_IDIV = 32,
    EXPR2_IMUL = 33,
    EXPR2_IMOD = 91,
    EXPR2_BIT_AND = 27, // x & y
    EXPR2_BIT_OR = 28, // x | y
    EXPR2_BIT_XOR = 29, // x ^ y
    EXPR2_SHIFT_LEFT = 41, // x << y
    EXPR2_SHIFT_RIGHT = 42, // x >> y
    EXPR2_SHIFT_RIGHT_UNSIGNED = 43, // x >>> y
    EXPR2_EQ = 31, // x == y
    EXPR2_LE = 34, // x <= y
    EXPR2_LT = 35, // x < y
    EXPR2_NE = 39, // x != y
    EXPR2_MAX = 36,
    EXPR2_MIN = 37,
    OP_PAST_LAST = 98,
}

export const OP_PROPS =
    "\x7f\x20\x20\x03\x60\x60\x00\x02\x01\x00\x00\x00\x40\x41\x41\x41\x41\x41\x41\x41\x41\x41\x01\x01\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x20\x00\x01\x00\x00\x60\x14\x02\x02\x01\x01\x41\x40\x41\x40\x40\x40\x11\x11\x11\x13\x12\x14\x32\x62\x11\x12\x15\x32\x33\x11\x30\x31\x11\x31\x31\x14\x31\x11\x10\x11\x11\x13\x13\x13\x60\x42\x41\x60\x60\x60\x60\x11"
export const OP_TYPES =
    "\x7f\x0a\x0a\x01\x01\x01\x0a\x06\x06\x01\x01\x01\x01\x01\x01\x01\x01\x0a\x06\x01\x01\x06\x01\x01\x01\x06\x01\x01\x01\x01\x01\x06\x01\x01\x06\x06\x01\x01\x01\x06\x01\x01\x01\x01\x01\x0a\x01\x07\x01\x01\x05\x0b\x0a\x0a\x01\x01\x01\x00\x06\x04\x06\x06\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x09\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x08\x01\x01\x04\x09\x09\x09\x0b"

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
}

export enum BytecodeFlag {
    NUM_ARGS_MASK = 0xf,
    IS_STMT = 0x10,
    TAKES_NUMBER = 0x20,
    IS_STATELESS = 0x40, // fun modifier
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
}

export enum BuiltInString {
    _EMPTY = 0,
    NULL = 18,
    UNDEFINED = 1,
    STRING = 2,
    NUMBER = 3,
    BOOLEAN = 4,
    FUNCTION = 5,
    TOSTRING = 6,
    CHARCODEAT = 7,
    NEXT = 8,
    PREV = 9,
    LENGTH = 10,
    POP = 11,
    PUSH = 12,
    SHIFT = 13,
    UNSHIFT = 14,
    SPLICE = 15,
    SLICE = 16,
    JOIN = 17,
    TRUE = 19,
    FALSE = 20,
    PACKET = 21,
    NAN = 22,
    ARRAY = 23,
    BUFFER = 24,
    MAP = 25,
}

export const OP_PRINT_FMTS = [
    null,
    "%L",
    "%G",
    "load_buffer(%e, %n, offset=%e)",
    "%e",
    "%D",
    "ret_val()",
    "str0eq(%e, offset=%e)",
    "role_is_connected(%e)",
    "pkt_size()",
    "pkt_ev_code()",
    "pkt_reg_get_code()",
    "nan()",
    "abs(%e)",
    "~%e",
    "ceil(%e)",
    "floor(%e)",
    "id(%e)",
    "is_nan(%e)",
    "log_e(%e)",
    "-%e",
    "!%e",
    "random(%e)",
    "random_int(%e)",
    "round(%e)",
    "!!%e",
    "(%e + %e)",
    "(%e & %e)",
    "(%e | %e)",
    "(%e ^ %e)",
    "(%e / %e)",
    "(%e == %e)",
    "idiv(%e, %e)",
    "imul(%e, %e)",
    "(%e <= %e)",
    "(%e < %e)",
    "max(%e, %e)",
    "min(%e, %e)",
    "(%e * %e)",
    "(%e != %e)",
    "pow(%e, %e)",
    "(%e << %e)",
    "(%e >> %e)",
    "(%e >>> %e)",
    "(%e - %e)",
    "%P",
    "now_ms()",
    "get_fiber_handle(func=%e)",
    "pkt_report_code()",
    "pkt_command_code()",
    "%R",
    "MEMSET dst=%e offset=%e length=%e %e",
    "%e.%e",
    "%e[%e]",
    "object_length(%e)",
    "keys_length(%e)",
    "typeof(%e)",
    "null()",
    "is_null(%e)",
    "pkt_buffer()",
    "true()",
    "false()",
    "WAIT_ROLE %e",
    "SLEEP_S %e",
    "SLEEP_MS %e",
    "QUERY_REG %e code=%e timeout=%e",
    "SEND_CMD %e code=%e",
    "QUERY_IDX_REG %e code=%e string=%e timeout=%e",
    "LOG_FORMAT %L numargs=%e string=%e",
    "format(%L, numargs=%e, string=%e)",
    "SETUP_PKT_BUFFER size=%e",
    "SET_PKT %e offset=%e",
    "BLIT dst=%e dst_offset=%e src=%e src_offset=%e length=%e",
    "CALL %L numargs=%e func=%e",
    "CALL_BG %L numargs=%e func=%e %o",
    "RETURN %e",
    "JMP %j",
    "JMP %j IF NOT %e",
    "PANIC error_code=%e",
    "%L := %e",
    "%G := %e",
    "STORE_BUFFER %e %n offset=%e %e",
    "%P := %e",
    "TERMINATE_FIBER fiber_handle=%e",
    "ALLOC_MAP ",
    "ALLOC_ARRAY initial_size=%e",
    "ALLOC_BUFFER size=%e",
    "%e.%e := %e",
    "%e[%e] := %e",
    "ARRAY_INSERT array=%e index=%e count=%e",
    "%F",
    "imod(%e, %e)",
    "to_int(%e)",
    "%B",
    "%I",
    "%A",
    "%U",
    "DECODE_UTF8 %e",
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
    "undefined",
    "string",
    "number",
    "boolean",
    "function",
    "toString",
    "charCodeAt",
    "next",
    "prev",
    "length",
    "pop",
    "push",
    "shift",
    "unshift",
    "splice",
    "slice",
    "join",
    "null",
    "true",
    "false",
    "packet",
    "NaN",
    "array",
    "buffer",
    "map",
]
export const BUILTIN_STRING__SIZE = 26
