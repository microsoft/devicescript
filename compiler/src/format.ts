export enum BinFmt {
    Magic0 = 0x5363614a,
    Magic1 = 0x9a6a7e0a,
    FixHeaderSize = 64,
    SectionHeaderSize = 8,
    FunctionHeaderSize = 16,
    RoleHeaderSize = 8,
    BinarySizeAlign = 32,
}

export interface SMap<T> {
    [k: string]: T
}

export const NUM_REGS = 16

export enum OpTop {
    SET_A = 0, // ARG[12]
    SET_B = 1, // ARG[12]
    SET_C = 2, // ARG[12]
    SET_D = 3, // ARG[12]
    SET_HIGH = 4, // A/B/C/D[2] ARG[10]

    UNARY = 5, // OP[4] DST[4] SRC[4]
    BINARY = 6, // OP[4] DST[4] SRC[4]

    LOAD_CELL = 7, // DST[4] CELL_KIND[4] A:OFF[4]
    STORE_CELL = 8, // SRC[4] CELL_KIND[4] A:OFF[4]

    JUMP = 9, // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
    CALL = 10, // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)

    SYNC = 11, // UNUSED[4] OP[8]
    ASYNC = 12, // D:SAVE_REGS[4] OP[8]
}

export enum OpAsync {
    WAIT_ROLE = 0, // A-role
    SLEEP_R0 = 1, // R0 - wait time in seconds
    SLEEP_MS = 2, // A - time in ms
    QUERY_REG = 3, // A-role, B-code, C-timeout
    SEND_CMD = 4, // A-role, B-code
    QUERY_IDX_REG = 5, // A-role, B-STRIDX:CMD[8], C-timeout
    LOG_FORMAT = 6, // A-string-index B-numargs
    _LAST = 6,
}

export enum OpSync {
    RETURN = 0,
    SETUP_BUFFER = 1, // A-size
    FORMAT = 2, // A-string-index B-numargs C-offset
    MEMCPY = 3, // A-string-index C-offset
    STR0EQ = 4, // A-string-index C-offset result in R0
    _UNUSED_5 = 5,
    MATH1 = 6, // A-OpMath1, R0 := op(R0)
    MATH2 = 7, // A-OpMath2, R0 := op(R0, R1)
    PANIC = 8, // A-error code
    _LAST = 8,
}

export enum OpMath1 {
    FLOOR = 0,
    ROUND = 1,
    CEIL = 2,
    LOG_E = 3,
    RANDOM = 4, // value between 0 and R0
    RANDOM_INT = 5, // int32 between 0 and (int32)R0 inclusive
    _LAST = 5,
}

export enum OpMath2 {
    MIN = 0,
    MAX = 1,
    POW = 2,
    IDIV = 3,
    IMUL = 4,
    _LAST = 4,
}

export enum OpCall {
    SYNC = 0, // regular call
    BG = 1, // start new fiber
    BG_MAX1 = 2, // ditto, unless one is already running
    BG_MAX1_PEND1 = 3, // ditto, but if fiber already running, set flag for it to be re-run when it finishes
}

export enum CellKind {
    // A=idx
    LOCAL = 0,
    GLOBAL = 1,
    FLOAT_CONST = 2,
    IDENTITY = 3,

    BUFFER = 4, // A=0, B=shift:numfmt, C=Offset, D=buffer_id
    SPECIAL = 5, // A=nan, regcode, role, ..., D=buffer_id (sometimes)
    ROLE_PROPERTY = 6, // A=OpRoleProperty, B=roleidx

    _HW_LAST = 6,

    // these cannot be emitted directly
    JD_EVENT = 0x100,
    JD_REG = 0x101,
    JD_ROLE = 0x102,
    JD_VALUE_SEQ = 0x103,
    JD_CURR_BUFFER = 0x104,
    JD_COMMAND = 0x105,

    X_STRING = 0x120,
    X_FP_REG = 0x121,
    X_FLOAT = 0x122,
    X_FUNCTION = 0x123,

    ERROR = 0x200,
}

export enum OpRoleProperty {
    IS_CONNECTED = 0,
    _LAST = 0,
}

export enum ValueSpecial {
    NAN = 0x0,
    // jd_packet accessors:
    SIZE = 0x1,
    EV_CODE = 0x2, // or nan
    REG_GET_CODE = 0x3, // or nan
    _LAST = 0x3,
}

export enum OpBinary {
    ADD = 0x1,
    SUB = 0x2,
    DIV = 0x3,
    MUL = 0x4,
    LT = 0x5,
    LE = 0x6,
    EQ = 0x7,
    NE = 0x8,
    BIT_AND = 0x9,
    BIT_OR = 0xa,
    BIT_XOR = 0xb,
    SHIFT_LEFT = 0xc,
    SHIFT_RIGHT = 0xd,
    SHIFT_RIGHT_UNSIGNED = 0xe,
    _LAST = 0xe,
}

export enum OpUnary {
    ID = 0x0, // x
    NEG = 0x1, // -x
    NOT = 0x2, // !x
    ABS = 0x3, // Math.abs(x)
    IS_NAN = 0x4, // isNaN(x)
    BIT_NOT = 0x5, // ~x
    TO_BOOL = 0x6, // !!x
    _LAST = 0x6,
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
    F32 = 0b1010,
    F64 = 0b1011,
}

export function stringifyCellKind(vk: CellKind) {
    switch (vk) {
        case CellKind.X_FP_REG:
            return "(reg)"
        case CellKind.LOCAL:
            return "local variable"
        case CellKind.GLOBAL:
            return "global variable"
        case CellKind.FLOAT_CONST:
            return "float literal"
        case CellKind.IDENTITY:
            return "small int literal"
        case CellKind.SPECIAL:
            return "special value"
        case CellKind.BUFFER:
            return "buffer access"
        case CellKind.ROLE_PROPERTY:
            return "role property"
        case CellKind.JD_VALUE_SEQ:
            return "multi-field buffer"
        case CellKind.JD_CURR_BUFFER:
            return "current buffer"
        case CellKind.X_STRING:
            return "string literal"
        case CellKind.X_FLOAT:
            return "float literal (generic)"
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
    resolverParams: number[]
}

export function bitSize(fmt: OpFmt) {
    return 8 << (fmt & 0b11)
}

export function isPrefixInstr(instr: number) {
    const op = instr >>> 12
    return op <= OpTop.SET_HIGH
}

export function stringifyInstr(instr: number, resolver?: InstrArgResolver) {
    const op = instr >>> 12
    const arg12 = instr & 0xfff
    const arg10 = instr & 0x3ff
    const arg8 = instr & 0xff
    const arg6 = instr & 0x3f
    const arg4 = instr & 0xf
    const subop = arg12 >> 8

    const reg0 = `R${subop}`
    const reg1 = `R${arg8 >> 4}`
    const reg2 = `R${arg4}`

    const abcd = ["A", "B", "C", "D"]

    let params: number[] = resolver?.resolverParams || [0, 0, 0, 0]

    let [a, b, c, d] = params

    let res = "    " + doOp()

    if (!isPrefixInstr(instr)) {
        res = "    " + res
        params = [0, 0, 0, 0]
    }
    if (resolver) resolver.resolverParams = params

    const pc = resolver?.resolverPC
    if (pc !== undefined)
        res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res

    return res

    function doOp() {
        switch (op) {
            case OpTop.SET_A: // ARG[12]
            case OpTop.SET_B: // ARG[12]
            case OpTop.SET_C: // ARG[12]
            case OpTop.SET_D: // ARG[12]
                params[op] = arg12
                return `[${abcd[op]} 0x${arg12.toString(16)}] `

            case OpTop.SET_HIGH: // A/B/C/D[2] ARG[10]
                params[arg12 >> 10] |= arg10 << 12
                return `[upper ${abcd[arg12 >> 10]} 0x${arg10.toString(16)}] `

            case OpTop.UNARY: // OP[4] DST[4] SRC[4]
                return `${reg1} := ${uncode()} ${reg2}`

            case OpTop.BINARY: // OP[4] DST[4] SRC[4]
                return `${reg1} := ${reg1} ${bincode()} ${reg2}`

            case OpTop.LOAD_CELL:
            case OpTop.STORE_CELL:
                a = (a << 4) | (arg8 & 0xf)
                return op == OpTop.LOAD_CELL
                    ? `${reg0} := ${celldesc()}`
                    : `${celldesc()} := ${reg0}`

            case OpTop.JUMP: // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
                b = (b << 6) | arg6
                const off = arg8 & (1 << 7) ? -b : b
                const offs = (off >= 0 ? "+" : "") + off
                const dst =
                    resolver?.resolverPC === undefined
                        ? offs
                        : resolver?.resolverPC + 1 + off + (" (" + offs + ")")
                return (
                    `jump ${dst}` + (arg8 & (1 << 6) ? ` if ${reg0} == 0` : ``)
                )

            case OpTop.CALL: // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)
                b = (b << 6) | arg6
                return `call${callop()} ${
                    resolver?.funName?.(b) || ""
                }_F${b} #${subop} save=${d.toString(2)}`

            case OpTop.SYNC: // A:ARG[4] OP[8]
                return `sync ${syncOp()}`

            case OpTop.ASYNC: // D:SAVE_REGS[4] OP[8]
                d = (d << 4) | subop
                return `async ${asyncOp()} save=${d.toString(2)}`
        }
    }

    function jdreg(v = b) {
        return `${role()}.reg_0x${v.toString(16)}`
    }

    function role(idx = a) {
        return (resolver?.roleName?.(idx) || "") + "_r" + idx
    }

    function numfmt(v: number) {
        const fmt = v & 0xf
        const bitsz = bitSize(fmt)
        const letter = ["u", "i", "f", "x"][fmt >> 2]
        const shift = v >> 4
        if (shift) return letter + (bitsz - shift) + "." + shift
        else return letter + bitsz
    }

    function callop() {
        switch (arg8 >> 6) {
            case OpCall.SYNC:
                return ""
            case OpCall.BG:
                return " bg"
            case OpCall.BG_MAX1:
                return " bg (max1)"
            case OpCall.BG_MAX1_PEND1:
                return " bg (max1 pend1)"
        }
    }

    function uncode() {
        switch (subop) {
            case OpUnary.ID:
                return ""
            case OpUnary.NEG:
                return "-"
            case OpUnary.NOT:
                return "!"
            case OpUnary.BIT_NOT:
                return "~"
            case OpUnary.TO_BOOL:
                return "!!"
            case OpUnary.ABS:
                return "abs "
            case OpUnary.IS_NAN:
                return "isNaN "
            default:
                return "un-" + subop
        }
    }
    function bincode() {
        switch (subop) {
            case OpBinary.ADD:
                return "+"
            case OpBinary.SUB:
                return "-"
            case OpBinary.DIV:
                return "/"
            case OpBinary.MUL:
                return "*"
            case OpBinary.LT:
                return "<"
            case OpBinary.LE:
                return "<="
            case OpBinary.EQ:
                return "=="
            case OpBinary.NE:
                return "!="
            case OpBinary.BIT_AND:
                return "&"
            case OpBinary.BIT_OR:
                return "|"
            case OpBinary.BIT_XOR:
                return "^"
            case OpBinary.SHIFT_LEFT:
                return "<<"
            case OpBinary.SHIFT_RIGHT:
                return ">>"
            case OpBinary.SHIFT_RIGHT_UNSIGNED:
                return ">>>"
            default:
                return "bin-" + subop
        }
    }
    function math1code() {
        switch (a) {
            case OpMath1.FLOOR:
                return "floor"
            case OpMath1.ROUND:
                return "round"
            case OpMath1.CEIL:
                return "ceil"
            case OpMath1.LOG_E:
                return "log_e"
            case OpMath1.RANDOM:
                return "random"
            case OpMath1.RANDOM_INT:
                return "randomInt"
            default:
                return "m1-" + subop
        }
    }
    function math2code() {
        switch (a) {
            case OpMath2.MIN:
                return "min"
            case OpMath2.MAX:
                return "max"
            case OpMath2.POW:
                return "pow"
            default:
                return "m1-" + subop
        }
    }
    function celldesc() {
        const cellkind = (arg8 >> 4) as CellKind
        const idx = a
        const r = resolver?.describeCell?.(cellkind, a) || ""
        switch (cellkind) {
            case CellKind.LOCAL:
                return `${r}_L${idx}`
            case CellKind.GLOBAL:
                return `${r}_G${idx}`
            case CellKind.FLOAT_CONST:
                return `${r}_F${idx}`
            case CellKind.IDENTITY:
                return `${idx}`
            case CellKind.BUFFER:
                return `buf${d == 0 ? "" : d}[${c} @ ${numfmt(b)}]`
            case CellKind.SPECIAL:
                switch (idx) {
                    case ValueSpecial.NAN:
                        return "NAN"
                    case ValueSpecial.SIZE:
                        return "SIZE"
                    case ValueSpecial.EV_CODE:
                        return "EV_CODE"
                    case ValueSpecial.REG_GET_CODE:
                        return "REG_CODE"
                    default:
                        return `${r}_SPEC[${idx}]`
                }
            case CellKind.ROLE_PROPERTY:
                const rr = role(b)
                switch (idx) {
                    case OpRoleProperty.IS_CONNECTED:
                        return `${rr}.isConnected`
                    default:
                        return `${rr}.prop${a}`
                }
            default:
                return `C${cellkind}[${idx}]` // ??
        }
    }

    function syncOp() {
        switch (arg8) {
            case OpSync.RETURN:
                return `return`
            case OpSync.SETUP_BUFFER: // A-size
                return `setup_buffer(size=${a})`
            case OpSync.FORMAT: // A-string-index B-numargs
                return `format(str=${a} #${b}) @${c}`
            case OpSync.MEMCPY: // A-string-index
                return `memcpy(str=${a}) @${c}`
            case OpSync.STR0EQ: // A-string-index
                return `r0 := str0eq(str=${a}) @${c}`
            case OpSync.MATH1:
                return `r0 := ${math1code()}(r0)`
            case OpSync.MATH2:
                return `r0 := ${math2code()}(r0, r1)`
            case OpSync.PANIC:
                return `panic(${a})`
            default:
                return `Sync_0x${arg8.toString(16)}`
        }
    }

    function asyncOp() {
        switch (arg8) {
            case OpAsync.WAIT_ROLE:
                return `wait_role(${role()})`
            case OpAsync.SLEEP_MS:
                return `sleep(${a}ms)`
            case OpAsync.SLEEP_R0:
                return `sleep(R0 s)`
            case OpAsync.QUERY_REG: // A-role, B-code, C-timeout
                return `query(${jdreg()} timeout=${c}ms)`
            case OpAsync.QUERY_IDX_REG:
                return `queryIdx(${jdreg(b & 0xff)} str=${
                    b >> 8
                } timeout=${c}ms)`
            case OpAsync.SEND_CMD: // A-role, B-code
                return `send(${jdreg()})`
            case OpAsync.LOG_FORMAT: // A-string-index B-numargs
                return `log(str=${a} #${b})`
            default:
                return `Async_0x${arg8.toString(16)}`
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

export interface DebugInfo {
    functions: FunctionDebugInfo[]
    roles: CellDebugInfo[]
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
    error?(err: JacError): void
    getSpecs(): jdspec.ServiceSpec[]
    verifyBytecode?(buf: Uint8Array, dbgInfo?: DebugInfo): void
}

export interface JacError {
    line: number
    column: number
    message: string
    codeFragment: string
}

export function printJacError(err: JacError) {
    let msg = `(${err.line},${err.column}): ${err.message}`
    if (err.codeFragment) msg += ` (${err.codeFragment})`
    console.error(msg)
}
