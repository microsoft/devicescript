export enum BinFmt {
    Magic0 = 0x5363614a,
    Magic1 = 0x9a6a7e0a,
    ImgVersion = 0x00020001,
    FixHeaderSize = 64,
    SectionHeaderSize = 8,
    FunctionHeaderSize = 16,
    RoleHeaderSize = 8,
    BufferHeaderSize = 8,
    BinarySizeAlign = 32,
}

export interface SMap<T> {
    [k: string]: T
}

export const JACS_MAX_EXPR_DEPTH = 10

export enum OpStmt {
    STMT1_WAIT_ROLE = 1, // role
    STMT1_SLEEP_S = 2, // time in seconds
    STMT1_SLEEP_MS = 3, // time in ms
    STMT3_QUERY_REG = 4, // role, code, timeout
    STMT2_SEND_CMD = 5, // role, code
    STMT4_QUERY_IDX_REG = 6, // role, code, string-idx, timeout
    STMT3_LOG_FORMAT = 7, // string-idx, localidx, numargs
    STMT4_FORMAT = 8, // string-idx, localidx, numargs, offset
    STMT2_SETUP_BUFFER = 9, // size, buffer_id
    STMT2_MEMCPY = 10, // string-idx, offset
    STMT3_CALL = 11, // fun-idx, localidx, numargs
    STMT4_CALL_BG = 12, // fun-idx, localidx, numargs, bg
    STMT1_RETURN = 13, // ret-val
    STMTx_JMP = 14, // offset
    STMTx1_JMP_Z = 15, // offset, condition
    STMT1_PANIC = 16, // error-code
    STMTx1_STORE_LOCAL = 17, // idx, value
    STMTx1_STORE_GLOBAL = 18, // idx, value
    STMT4_STORE_BUFFER = 19, // shift:numfmt, offset, buffer_id, value
    STMTx1_STORE_PARAM = 20, // idx, value
}

export function stmtTakesNumber(op: OpStmt) {
    switch (op) {
        case OpStmt.STMTx_JMP:
        case OpStmt.STMTx1_JMP_Z:
        case OpStmt.STMTx1_STORE_LOCAL:
        case OpStmt.STMTx1_STORE_GLOBAL:
        case OpStmt.STMTx1_STORE_PARAM:
            return true
        default:
            return false
    }
}

export enum OpExpr {
    EXPRx_LOAD_LOCAL = 1,
    EXPRx_LOAD_GLOBAL = 2,
    EXPR3_LOAD_BUFFER = 3,
    EXPRx_LOAD_PARAM = 45,
    EXPRx_LITERAL = 4,
    EXPRx_LITERAL_F64 = 5,
    EXPR0_RET_VAL = 6, // return value of query register, call, etc
    EXPR2_STR0EQ = 7, // A-string-index C-offset
    EXPR1_ROLE_IS_CONNECTED = 8,
    EXPR0_PKT_SIZE = 9,
    EXPR0_PKT_EV_CODE = 10, // or nan
    EXPR0_PKT_REG_GET_CODE = 11, // or nan

    // stateless math stuff below
    EXPR0_NAN = 12, // NaN value
    EXPR1_ABS = 13, // Math.abs(x)
    EXPR1_BIT_NOT = 14, // ~x
    EXPR1_CEIL = 15, // Math.ceil(x)
    EXPR1_FLOOR = 16, // Math.floor(x)
    EXPR1_ID = 17, // x - TODO needed?
    EXPR1_IS_NAN = 18, // isNaN(x)
    EXPR1_LOG_E = 19, // log_e(x)
    EXPR1_NEG = 20, // -x
    EXPR1_NOT = 21, // !x
    EXPR1_RANDOM = 22, // value between 0 and arg
    EXPR1_RANDOM_INT = 23, // int between 0 and arg inclusive
    EXPR1_ROUND = 24, // Math.round(x)
    EXPR1_TO_BOOL = 25, // !!x
    EXPR2_ADD = 26,
    EXPR2_BIT_AND = 27,
    EXPR2_BIT_OR = 28,
    EXPR2_BIT_XOR = 29,
    EXPR2_DIV = 30,
    EXPR2_EQ = 31,
    EXPR2_IDIV = 32,
    EXPR2_IMUL = 33,
    EXPR2_LE = 34,
    EXPR2_LT = 35,
    EXPR2_MAX = 36,
    EXPR2_MIN = 37,
    EXPR2_MUL = 38,
    EXPR2_NE = 39,
    EXPR2_POW = 40,
    EXPR2_SHIFT_LEFT = 41,
    EXPR2_SHIFT_RIGHT = 42,
    EXPR2_SHIFT_RIGHT_UNSIGNED = 43,
    EXPR2_SUB = 44,
}

export function exprIsStateful(op: OpExpr) {
    switch (op) {
        case OpExpr.EXPRx_LOAD_LOCAL:
        case OpExpr.EXPRx_LOAD_GLOBAL:
        case OpExpr.EXPR3_LOAD_BUFFER:
        case OpExpr.EXPRx_LOAD_PARAM:
        case OpExpr.EXPR0_RET_VAL:
        case OpExpr.EXPR2_STR0EQ:
        case OpExpr.EXPR0_PKT_SIZE:
        case OpExpr.EXPR0_PKT_EV_CODE:
        case OpExpr.EXPR0_PKT_REG_GET_CODE:
            return true
        default:
            return false
    }
}

export function exprTakesNumber(op: OpExpr) {
    switch (op) {
        case OpExpr.EXPRx_LOAD_LOCAL:
        case OpExpr.EXPRx_LOAD_GLOBAL:
        case OpExpr.EXPRx_LOAD_PARAM:
        case OpExpr.EXPRx_LITERAL:
        case OpExpr.EXPRx_LITERAL_F64:
            return true
        default:
            return false
    }
}

export enum OpCall {
    SYNC = 0, // regular call
    BG = 1, // start new fiber
    BG_MAX1 = 2, // ditto, unless one is already running
    BG_MAX1_PEND1 = 3, // ditto, but if fiber already running, re-run it later
}

export enum CellKind {
    LOCAL = OpExpr.EXPRx_LOAD_LOCAL,
    GLOBAL = OpExpr.EXPRx_LOAD_GLOBAL,
    PARAM = OpExpr.EXPRx_LOAD_PARAM,
    FLOAT_CONST = OpExpr.EXPRx_LITERAL_F64,

    // these cannot be emitted directly
    JD_EVENT = 0x100,
    JD_REG = 0x101,
    JD_ROLE = 0x102,
    JD_VALUE_SEQ = 0x103,
    JD_CURR_BUFFER = 0x104,
    JD_COMMAND = 0x105,
    JD_CLIENT_COMMAND = 0x106,
    X_BUFFER = 0x124,

    ERROR = 0x200,
}

// Size in bits is: 8 << (fmt & 0b11)
// Format is ["u", "i", "f", "reserved"](fmt >> 2)
export enum OpFmt {
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

export function stringifyCellKind(vk: CellKind) {
    switch (vk) {
        case CellKind.LOCAL:
            return "local variable"
        case CellKind.GLOBAL:
            return "global variable"
        case CellKind.FLOAT_CONST:
            return "float literal"
        case CellKind.JD_VALUE_SEQ:
            return "multi-field buffer"
        case CellKind.JD_CURR_BUFFER:
            return "current buffer"
        case CellKind.JD_EVENT:
            return "Jacdac event"
        case CellKind.JD_COMMAND:
            return "Jacdac command"
        case CellKind.JD_REG:
            return "Jacdac register"
        case CellKind.JD_ROLE:
            return "Jacdac role"
        case CellKind.ERROR:
            return "(error node)"
        default:
            return "ValueKind: 0x" + (vk as number).toString(16)
    }
}

export interface InstrArgResolver {
    describeCell?(t: CellKind, idx: number): string
    funName?(idx: number): string
    roleName?(idx: number): string
    resolverPC?: number
}

export function bitSize(fmt: OpFmt) {
    return 8 << (fmt & 0b11)
}

export function stringifyInstr(
    getbyte: () => number,
    resolver?: InstrArgResolver
) {
    let res = "    " + doOp()

    const pc = resolver?.resolverPC
    if (pc !== undefined)
        res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res

    return res

    function doOp() {
        const op = getbyte()
        const expr = stringifyExpr
        switch (op) {
            case OpStmt.STMT1_WAIT_ROLE: // role
                return `wait_role ${role()}`
            case OpStmt.STMT1_SLEEP_S: // time in seconds
                return `sleep_s ${expr()}`
            case OpStmt.STMT1_SLEEP_MS: // time in ms
                return `sleep_ms ${expr()}`
            case OpStmt.STMT3_QUERY_REG: // role, code, timeout
                return `RET_VAL := ${role()}.reg[${expr()}; timeout=${expr()}]`
            case OpStmt.STMT2_SEND_CMD: // role, code
                return `${role()}.cmd[${expr()}]`
            case OpStmt.STMT4_QUERY_IDX_REG: // role, code, string-idx, timeout
                return `RET_VAL := ${role()}.reg[${expr()}; str=${expr()}; timeout=${expr()}]`
            case OpStmt.STMT3_LOG_FORMAT: // string-idx, localidx, numargs
                return `log str=${expr()} args=${expr()}+${expr()}`
            case OpStmt.STMT4_FORMAT: // string-idx, localidx, numargs, offset
                return `format str=${expr()} args=${expr()}+${expr()} offset=${expr()}`
            case OpStmt.STMT2_SETUP_BUFFER: // size, bufid
                return `setup_buffer size=${expr()} buf${expr()}`
            case OpStmt.STMT2_MEMCPY: // string-idx, offset
                return `memcpy str=${expr()} offset=${expr()}`
            case OpStmt.STMT3_CALL: // fun-idx, localidx, numargs
                return calldesc()
            case OpStmt.STMT4_CALL_BG: // fun-idx, localidx, numargs, bg
                return calldesc() + callop()
            case OpStmt.STMT1_RETURN: // ret-val
                return `return ${expr()}`
            case OpStmt.STMTx_JMP: // offset
                return `jmp ${jmpOffset()}`
            case OpStmt.STMTx1_JMP_Z: // offset, condition
                return `jmp ${jmpOffset()} if not ${expr()}`
            case OpStmt.STMT1_PANIC: // error-code
                return `panic ${expr()}`
            case OpStmt.STMTx1_STORE_LOCAL: // idx, value
                return `${celldesc(CellKind.LOCAL)} := ${expr()}`
            case OpStmt.STMTx1_STORE_GLOBAL: // idx, value
                return `${celldesc(CellKind.GLOBAL)} := ${expr()}`
            case OpStmt.STMT4_STORE_BUFFER: // shift:numfmt, offset, buffer_id, value
                return `${bufferdesc()} := ${expr()}`
            case OpStmt.STMTx1_STORE_PARAM: // idx, value
                return `${celldesc(CellKind.PARAM)} := ${expr()}`
        }
    }

    function funname() {
        const fn = stringifyExpr()
        if (isNumber(fn)) {
            const b = +fn
            return (resolver?.funName?.(b) || "") + "_F" + b
        } else {
            return `_F[${fn}]`
        }
    }

    function calldesc() {
        return `${funname()} args=${stringifyExpr()}+${stringifyExpr()}`
    }

    function jmpOffset() {
        const off = decodeInt()
        const offs = (off >= 0 ? "+" : "") + off
        return resolver?.resolverPC === undefined
            ? offs
            : resolver?.resolverPC + off + (" (" + offs + ")")
    }

    function role() {
        const roleIdx = stringifyExpr()
        if (isNumber(roleIdx)) {
            const idx = +roleIdx
            return (resolver?.roleName?.(idx) || "") + "_r" + idx
        } else {
            return `role(${roleIdx})`
        }
    }

    function isNumber(s: string) {
        return /^\d+$/.test(s)
    }

    function numfmt(vv: string) {
        if (!isNumber(vv)) return vv
        const v = +vv
        const fmt = v & 0xf
        const bitsz = bitSize(fmt)
        const letter = ["u", "i", "f", "x"][fmt >> 2]
        const shift = v >> 4
        if (shift) return letter + (bitsz - shift) + "." + shift
        else return letter + bitsz
    }

    function callop() {
        const op = stringifyExpr()
        if (isNumber(op))
            switch (+op) {
                case OpCall.SYNC:
                    return ""
                case OpCall.BG:
                    return " bg"
                case OpCall.BG_MAX1:
                    return " bg (max1)"
                case OpCall.BG_MAX1_PEND1:
                    return " bg (max1 pend1)"
            }
        else return ` callop=${op}`
    }

    function decodeInt() {
        const v = getbyte()
        if (v < 0xf8) return v

        let r = 0
        const n = !!(v & 4)
        const len = (v & 3) + 1

        for (let i = 0; i < len; ++i) {
            const v = getbyte()
            r = r << 8
            r |= v
        }

        return n ? -r : r
    }

    function celldesc(cellkind: CellKind) {
        const idx = decodeInt()
        const r = resolver?.describeCell?.(cellkind, idx) || ""
        switch (cellkind) {
            case CellKind.LOCAL:
                return `${r}_L${idx}`
            case CellKind.GLOBAL:
                return `${r}_G${idx}`
            case CellKind.PARAM:
                return `${r}_P${idx}`
            case CellKind.FLOAT_CONST:
                return `${r}_F${idx}`
            default:
                return `C${cellkind}[${idx}]` // ??
        }
    }

    function bufferdesc(): string {
        const fmt = stringifyExpr()
        const offset = stringifyExpr()
        const bufferidx = stringifyExpr()
        return `buf${bufferidx}[${offset} @ ${numfmt(fmt)}]`
    }

    function stringifyExpr(): string {
        const op = getbyte()

        if (op >= 0x80) return "" + (op - 0x80 - 16)

        const expr = stringifyExpr

        switch (op) {
            case OpExpr.EXPRx_LOAD_LOCAL:
            case OpExpr.EXPRx_LOAD_GLOBAL:
            case OpExpr.EXPRx_LOAD_PARAM:
            case OpExpr.EXPRx_LITERAL_F64:
                return celldesc(op as any)
            case OpExpr.EXPR3_LOAD_BUFFER:
                return bufferdesc()
            case OpExpr.EXPRx_LITERAL:
                return "" + decodeInt()
            case OpExpr.EXPR0_RET_VAL: // return value of query register, call, etc
                return "RET_VAL"
            case OpExpr.EXPR2_STR0EQ: // A-string-index C-offset
                return `str0eq(str=${expr}, off=${expr})`
            case OpExpr.EXPR1_ROLE_IS_CONNECTED:
                return `is_connected(${role()})`
            case OpExpr.EXPR0_PKT_SIZE:
                return "PKT_SIZE"
            case OpExpr.EXPR0_PKT_EV_CODE:
                return "PKT_EV_CODE"
            case OpExpr.EXPR0_PKT_REG_GET_CODE:
                return "PKT_REG_GET_CODE"
            case OpExpr.EXPR0_NAN:
                return "NaN"
            case OpExpr.EXPR1_ABS:
                return `abs(${expr()})`
            case OpExpr.EXPR1_BIT_NOT:
                return `~(${expr()})`
            case OpExpr.EXPR1_CEIL:
                return `ceil(${expr()})`
            case OpExpr.EXPR1_FLOOR:
                return `floor(${expr()})`
            case OpExpr.EXPR1_ID:
                return `id(${expr()})`
            case OpExpr.EXPR1_IS_NAN:
                return `isNaN(${expr()})`
            case OpExpr.EXPR1_LOG_E:
                return `log_E(${expr()})`
            case OpExpr.EXPR1_NEG:
                return `-(${expr()})`
            case OpExpr.EXPR1_NOT:
                return `!(${expr()})`
            case OpExpr.EXPR1_RANDOM: // value between 0 and arg
                return `random(${expr()})`
            case OpExpr.EXPR1_RANDOM_INT: // int between 0 and arg inclusive
                return `random_int(${expr()})`
            case OpExpr.EXPR1_ROUND:
                return `round(${expr()})`
            case OpExpr.EXPR1_TO_BOOL:
                return `!!(${expr()})`
            case OpExpr.EXPR2_ADD:
                return `(${expr()}) + (${expr()})`
            case OpExpr.EXPR2_BIT_AND:
                return `(${expr()}) & (${expr()})`
            case OpExpr.EXPR2_BIT_OR:
                return `(${expr()}) | (${expr()})`
            case OpExpr.EXPR2_BIT_XOR:
                return `(${expr()}) ^ (${expr()})`
            case OpExpr.EXPR2_DIV:
                return `(${expr()}) / (${expr()})`
            case OpExpr.EXPR2_EQ:
                return `(${expr()}) == (${expr()})`
            case OpExpr.EXPR2_IDIV:
                return `idiv(${expr()}, ${expr()})`
            case OpExpr.EXPR2_IMUL:
                return `imul(${expr()}, ${expr()})`
            case OpExpr.EXPR2_LE:
                return `(${expr()}) <= (${expr()})`
            case OpExpr.EXPR2_LT:
                return `(${expr()}) < (${expr()})`
            case OpExpr.EXPR2_MAX:
                return `max(${expr()}, ${expr()})`
            case OpExpr.EXPR2_MIN:
                return `min(${expr()}, ${expr()})`
            case OpExpr.EXPR2_MUL:
                return `(${expr()}) * (${expr()})`
            case OpExpr.EXPR2_NE:
                return `(${expr()}) != (${expr()})`
            case OpExpr.EXPR2_POW:
                return `pow(${expr()}, ${expr()})`
            case OpExpr.EXPR2_SHIFT_LEFT:
                return `(${expr()}) << (${expr()})`
            case OpExpr.EXPR2_SHIFT_RIGHT:
                return `(${expr()}) >> (${expr()})`
            case OpExpr.EXPR2_SHIFT_RIGHT_UNSIGNED:
                return `(${expr()}) >>> (${expr()})`
            case OpExpr.EXPR2_SUB:
                return `(${expr()}) - (${expr()})`
            default:
                return `? 0x${op.toString(16)} ?`
        }
    }
}

export interface FunctionDebugInfo {
    name: string
    // format is (line-number, start, len)
    // start is offset in halfwords from the start of the function
    // len is in halfwords
    srcmap: number[]
    locals: CellDebugInfo[]
}

export interface CellDebugInfo {
    name: string
}

export interface RoleDebugInfo extends CellDebugInfo {
    serviceClass: number
}

export interface DebugInfo {
    functions: FunctionDebugInfo[]
    roles: RoleDebugInfo[]
    globals: CellDebugInfo[]
    source: string
}

export function emptyDebugInfo(): DebugInfo {
    return {
        functions: [],
        globals: [],
        roles: [],
        source: "",
    }
}

export interface Host {
    write(filename: string, contents: Uint8Array | string): void
    log(msg: string): void
    mainFileName?(): string
    error?(err: JacError): void
    getSpecs(): jdspec.ServiceSpec[]
    verifyBytecode?(buf: Uint8Array, dbgInfo?: DebugInfo): void
}

export interface JacError {
    filename: string
    line: number
    column: number
    message: string
    codeFragment: string
}

export function printJacError(err: JacError) {
    let msg = `${err.filename || ""}(${err.line},${err.column}): ${err.message}`
    if (err.codeFragment) msg += ` (${err.codeFragment})`
    console.error(msg)
}
