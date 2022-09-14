import {
    OpStmt,
    OpExpr,
    OpCall,
    NumFmt,
    STMT_PROPS,
    BytecodeFlag,
    EXPR_PROPS,
    BinFmt,
    EXPR_PRINT_FMTS,
    STMT_PRINT_FMTS,
} from "./bytecode"

export * from "./bytecode"

export interface SMap<T> {
    [k: string]: T
}

export function stmtTakesNumber(op: OpStmt) {
    return !!(STMT_PROPS.charCodeAt(op) & BytecodeFlag.TAKES_NUMBER)
}

export function exprIsStateful(op: OpExpr) {
    return !(EXPR_PROPS.charCodeAt(op) & BytecodeFlag.IS_STATELESS)
}

export function exprTakesNumber(op: OpExpr) {
    return !!(EXPR_PROPS.charCodeAt(op) & BytecodeFlag.TAKES_NUMBER)
}

export const JACS_MAX_EXPR_DEPTH = BinFmt.MAX_EXPR_DEPTH

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
    describeCell?(fmt: string, idx: number): string
    resolverPC?: number
}

export function bitSize(fmt: NumFmt) {
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

    function expandFmt(takesNumber: boolean, fmt: string) {
        let ptr = 0
        let beg = 0
        let r = ""
        while (ptr < fmt.length) {
            if (fmt.charCodeAt(ptr) != 37) {
                ptr++
                continue
            }

            r += fmt.slice(beg, ptr)
            ptr++
            beg = ptr + 1

            let e: string
            let eNum: number = null
            if (takesNumber) {
                takesNumber = false
                eNum = decodeInt()
                e = eNum + ""
            } else {
                e = stringifyExpr()
                if (isNumber(e)) eNum = +e
            }

            const ff = fmt[ptr]
            switch (ff) {
                case "e":
                    break

                case "n":
                    e = numfmt(e)
                    break

                case "o":
                    e = callop(e)
                    break

                case "j":
                    e = jmpOffset(eNum)
                    break

                default:
                    e = "_" + ff + e
                    if (eNum != null && resolver) {
                        const pref = resolver.describeCell(ff, eNum)
                        if (pref) e = pref + e
                    }
                    break
            }

            r += e
            ptr++
        }
        r += fmt.slice(beg)
        return r
    }

    function doOp() {
        const op = getbyte()
        const fmt = STMT_PRINT_FMTS[op]
        if (!fmt) return `?stmt${op}?`
        return expandFmt(stmtTakesNumber(op), fmt)
    }

    function jmpOffset(off: number) {
        const offs = (off >= 0 ? "+" : "") + off
        return resolver?.resolverPC === undefined
            ? offs
            : resolver?.resolverPC + off + (" (" + offs + ")")
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

    function callop(op: string) {
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

    function stringifyExpr(): string {
        const op = getbyte()

        if (op >= 0x80) return "" + (op - 0x80 - 16)

        const fmt = EXPR_PRINT_FMTS[op]
        if (!fmt) return `?expr${op}?`
        return expandFmt(exprTakesNumber(op), fmt)
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
