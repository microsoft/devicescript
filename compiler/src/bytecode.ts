// Auto-generated from bytecode.md; do not edit.

export enum OpStmt {
    STMT1_WAIT_ROLE = 1, // role
    STMT1_SLEEP_S = 2,
    STMT1_SLEEP_MS = 3,
    STMT3_QUERY_REG = 4, // role, code, timeout
    STMT2_SEND_CMD = 5, // role, code
    STMT4_QUERY_IDX_REG = 6, // role, code, string_idx, timeout
    STMT3_LOG_FORMAT = 7, // string_idx, local_idx, numargs
    STMT4_FORMAT = 8, // string_idx, local_idx, numargs, offset
    STMT2_SETUP_BUFFER = 9, // size, buffer_idx
    STMT2_MEMCPY = 10, // string_idx, offset
    STMT3_CALL = 11, // func_idx, local_idx, numargs
    STMT4_CALL_BG = 12, // func_idx, local_idx, numargs, opcall
    STMT1_RETURN = 13, // value
    STMTx_JMP = 14, // JMP jmpoffset
    STMTx1_JMP_Z = 15, // JMP jmpoffset IF NOT x
    STMT1_PANIC = 16, // error_code
    STMTx1_STORE_LOCAL = 17, // local_idx := value
    STMTx1_STORE_GLOBAL = 18, // global_idx := value
    STMT4_STORE_BUFFER = 19, // numfmt, offset, buffer_idx, value
    STMTx1_STORE_PARAM = 20, // param_idx := value
    STMT1_TERMINATE_FIBER = 21, // fiber_handle
    STMT_PAST_LAST = 22,
}

export const STMT_PROPS =
    "\x7f\x01\x01\x01\x03\x02\x04\x03\x04\x02\x02\x03\x04\x01\x21\x22\x01\x22\x22\x04\x22\x01"

export enum OpExpr {
    EXPRx_LOAD_LOCAL = 1, // *local_idx
    EXPRx_LOAD_GLOBAL = 2, // *global_idx
    EXPRx_LOAD_PARAM = 45, // *param_idx
    EXPRx_LITERAL = 4, // *value
    EXPRx_LITERAL_F64 = 5, // *f64_idx
    EXPR3_LOAD_BUFFER = 3, // numfmt, offset, buffer_idx
    EXPR2_STR0EQ = 7, // string_idx, offset
    EXPR1_ROLE_IS_CONNECTED = 8, // role
    EXPR1_GET_FIBER_HANDLE = 47, // func_idx
    EXPR0_RET_VAL = 6,
    EXPR0_PKT_SIZE = 9,
    EXPR0_PKT_EV_CODE = 10,
    EXPR0_PKT_REG_GET_CODE = 11,
    EXPR0_NAN = 12,
    EXPR0_NOW_MS = 46,
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
    EXPR1_TO_BOOL = 25, // !!x
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
    EXPR_PAST_LAST = 48,
}

export const EXPR_PROPS =
    "\x7f\x21\x21\x03\x61\x61\x00\x02\x01\x00\x00\x00\x40\x41\x41\x41\x41\x41\x41\x41\x41\x41\x01\x01\x41\x41\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x42\x21\x00\x01"

export enum BinFmt {
    IMG_VERSION = 0x00020001,
    MAGIC0 = 0x5363614a, // "JacS"
    MAGIC1 = 0x9a6a7e0a,
    NUM_IMG_SECTIONS = 7,
    FIX_HEADER_SIZE = 64,
    SECTION_HEADER_SIZE = 8,
    FUNCTION_HEADER_SIZE = 16,
    ROLE_HEADER_SIZE = 8,
    BUFFER_HEADER_SIZE = 8,
    BINARY_SIZE_ALIGN = 32,
    MAX_EXPR_DEPTH = 10,
}

export enum OpCall {
    SYNC = 0,
    BG = 1,
    BG_MAX1 = 2,
    BG_MAX1_PEND1 = 3,
}

export enum BytecodeFlag {
    NUM_ARGS_MASK = 0xf,
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

export const EXPR_PRINT_FMTS = [
    null,
    "%L",
    "%G",
    "load_buffer(%n, offset=%e, buffer_idx=%e)",
    "%e",
    "%D",
    "ret_val()",
    "str0eq(%S, offset=%e)",
    "role_is_connected(%R)",
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
]
export const STMT_PRINT_FMTS = [
    null,
    "WAIT_ROLE %R",
    "SLEEP_S %e",
    "SLEEP_MS %e",
    "QUERY_REG %R code=%e timeout=%e",
    "SEND_CMD %R code=%e",
    "QUERY_IDX_REG %R code=%e %S timeout=%e",
    "LOG_FORMAT %S %L numargs=%e",
    "FORMAT %S %L numargs=%e offset=%e",
    "SETUP_BUFFER size=%e buffer_idx=%e",
    "MEMCPY %S offset=%e",
    "CALL %F %L numargs=%e",
    "CALL_BG %F %L numargs=%e %o",
    "RETURN %e",
    "JMP %j",
    "JMP %j IF NOT %e",
    "PANIC error_code=%e",
    "%L := %e",
    "%G := %e",
    "STORE_BUFFER %n offset=%e buffer_idx=%e %e",
    "%P := %e",
    "TERMINATE_FIBER fiber_handle=%e",
]
