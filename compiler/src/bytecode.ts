// Auto-generated from bytecode.md; do not edit.

export enum Op {
    STMT1_WAIT_ROLE = 62, // role
    STMT1_SLEEP_S = 63,
    STMT1_SLEEP_MS = 64,
    STMT3_QUERY_REG = 65, // role, code, timeout
    STMT2_SEND_CMD = 66, // role, code
    STMT4_QUERY_IDX_REG = 67, // role, code, string, timeout
    STMT3_LOG_FORMAT = 68, // string, local_idx, numargs
    STMT4_FORMAT = 69, // string, local_idx, numargs, offset
    STMT1_SETUP_PKT_BUFFER = 70, // size
    STMT2_SET_PKT = 71, // buffer, offset
    STMT5_BLIT = 72, // dst, dst_offset, src, src_offset, length
    STMT3_CALL = 73, // func_idx, local_idx, numargs
    STMT4_CALL_BG = 74, // func_idx, local_idx, numargs, opcall
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
    STMTx2_SET_FIELD = 87, // object.field_idx := value
    STMT3_ARRAY_SET = 88, // array[index] := value
    STMT3_ARRAY_INSERT = 89, // array, index, count
    EXPRx_LOAD_LOCAL = 1, // *local_idx
    EXPRx_LOAD_GLOBAL = 2, // *global_idx
    EXPRx_LOAD_PARAM = 45, // *param_idx
    EXPRx_STATIC_ROLE = 50, // *role_idx
    EXPRx_STATIC_BUFFER = 51, // *string_idx
    EXPRx_LITERAL = 4, // *value
    EXPRx_LITERAL_F64 = 5, // *f64_idx
    EXPR3_LOAD_BUFFER = 3, // buffer, numfmt, offset
    EXPR2_STR0EQ = 7, // buffer, offset
    EXPR1_ROLE_IS_CONNECTED = 8, // role
    EXPR1_GET_FIBER_HANDLE = 47, // func_idx
    EXPR0_RET_VAL = 6,
    EXPR0_NOW_MS = 46,
    EXPRx1_GET_FIELD = 52, // object.field_idx
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
    EXPR1_CEIL = 15,
    EXPR1_FLOOR = 16,
    EXPR1_ID = 17,
    EXPR1_IS_NAN = 18,
    EXPR1_LOG_E = 19,
    EXPR1_NEG = 20, // -x
    EXPR1_NOT = 21, // !x
    EXPR1_RANDOM = 22,
    EXPR1_RANDOM_INT = 23,
    EXPR1_ROUND = 24,
    EXPR2_ADD = 26, // x + y
    EXPR2_BIT_AND = 27, // x & y
    EXPR2_BIT_OR = 28, // x | y
    EXPR2_BIT_XOR = 29, // x ^ y
    EXPR2_DIV = 30, // x / y
    EXPR2_EQ = 31, // x == y
    EXPR2_IDIV = 32,
    EXPR2_IMUL = 33,
    EXPR2_LE = 34, // x <= y
    EXPR2_LT = 35, // x < y
    EXPR2_MAX = 36,
    EXPR2_MIN = 37,
    EXPR2_MUL = 38, // x * y
    EXPR2_NE = 39, // x != y
    EXPR2_POW = 40,
    EXPR2_SHIFT_LEFT = 41, // x << y
    EXPR2_SHIFT_RIGHT = 42, // x >> y
    EXPR2_SHIFT_RIGHT_UNSIGNED = 43, // x >>> y
    EXPR2_SUB = 44, // x - y
    OP_PAST_LAST = 90,
}

export const OP_PROPS =
    "\x7f\x21\x21\x03\x61\x61\x00\x02\x01\x00\x00\x00\x40\x41\x41\x41\x41\x41\x41\x41\x41\x41\x01\x01\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x21\x00\x01\x00\x00\x61\x61\x22\x02\x01\x01\x41\x40\x41\x40\x40\x40\x11\x11\x11\x13\x12\x14\x13\x14\x11\x12\x15\x13\x14\x11\x31\x32\x11\x32\x32\x14\x32\x11\x10\x11\x11\x33\x13\x13"

export enum BinFmt {
    IMG_VERSION = 0x00030001,
    MAGIC0 = 0x5363614a, // "JacS"
    MAGIC1 = 0x9a6a7e0a,
    NUM_IMG_SECTIONS = 6,
    FIX_HEADER_SIZE = 64,
    SECTION_HEADER_SIZE = 8,
    FUNCTION_HEADER_SIZE = 16,
    ROLE_HEADER_SIZE = 8,
    BINARY_SIZE_ALIGN = 32,
    MAX_STACK_DEPTH = 10,
    DIRECT_CONST_OP = 0x80,
    DIRECT_CONST_OFFSET = 16,
}

export enum OpCall {
    SYNC = 0,
    BG = 1,
    BG_MAX1 = 2,
    BG_MAX1_PEND1 = 3,
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
    BOOLEAN = 6,
    FIBER = 7,
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
    "get_fiber_handle(%F)",
    "pkt_report_code()",
    "pkt_command_code()",
    "%R",
    "%S",
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
    "LOG_FORMAT string=%e %L numargs=%e",
    "FORMAT string=%e %L numargs=%e offset=%e",
    "SETUP_PKT_BUFFER size=%e",
    "SET_PKT %e offset=%e",
    "BLIT dst=%e dst_offset=%e src=%e src_offset=%e length=%e",
    "CALL %F %L numargs=%e",
    "CALL_BG %F %L numargs=%e %o",
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
]
