import {
    Op,
    OpCall,
    NumFmt,
    BytecodeFlag,
    BinFmt,
    OP_PROPS,
    OP_PRINT_FMTS,
    ObjectType,
    OP_TYPES,
    OBJECT_TYPE,
} from "./bytecode"

export * from "./bytecode"

export interface SMap<T> {
    [k: string]: T
}

export function opTakesNumber(op: Op) {
    return !!(OP_PROPS.charCodeAt(op) & BytecodeFlag.TAKES_NUMBER)
}

export function opNumArgs(op: Op) {
    return OP_PROPS.charCodeAt(op) & BytecodeFlag.NUM_ARGS_MASK
}

export function opType(op: Op): ObjectType {
    return OP_TYPES.charCodeAt(op)
}

export function opIsStmt(op: Op) {
    return !!(OP_PROPS.charCodeAt(op) & BytecodeFlag.IS_STMT)
}

export function exprIsStateful(op: Op) {
    return !(OP_PROPS.charCodeAt(op) & BytecodeFlag.IS_STATELESS)
}

export const JACS_MAX_EXPR_DEPTH = BinFmt.MAX_STACK_DEPTH // TODO

export enum ValueType {
    ANY = ObjectType.ANY,
    NUMBER = ObjectType.NUMBER,
    BUFFER = ObjectType.BUFFER,
    MAP = ObjectType.MAP,
    ARRAY = ObjectType.ARRAY,
    NULL = ObjectType.NULL,
    FIBER = ObjectType.FIBER,
    BOOL = ObjectType.BOOL,
    ROLE = ObjectType.ROLE,
    VOID = ObjectType.VOID,

    ERROR = 0x100,
    JD_EVENT,
    JD_REG,
    JD_VALUE_SEQ,
    JD_COMMAND,
    JD_CLIENT_COMMAND,
}

export const valueTypes = [
    "(error node)",
    "Jacdac event",
    "Jacdac register",
    "multi-field value",
    "Jacdac command",
    "Jacdac client command",
]

export function valueTypeToString(vk: ValueType) {
    return OBJECT_TYPE[vk] || valueTypes[vk - 0x100] || "ValueType " + vk
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
    const ops: number[] = []
    const opargs: number[] = []

    for (;;) {
        const op = getbyte()
        ops.push(op)

        if (opTakesNumber(op)) {
            opargs.push(decodeInt())
        } else {
            opargs.push(null)
        }

        if (opIsStmt(op)) break
    }

    let res = "    " + stringifyExpr()

    const pc = resolver?.resolverPC
    if (pc !== undefined)
        res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res

    return res

    function expandFmt(fmt: string, intarg: number) {
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

            if (intarg != null) {
                eNum = intarg
                e = eNum + ""
                intarg = null
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
        const op = ops.pop()
        const intarg = opargs.pop()

        if (op >= BinFmt.DIRECT_CONST_OP)
            return (
                "" + (op - BinFmt.DIRECT_CONST_OP - BinFmt.DIRECT_CONST_OFFSET)
            )

        const fmt = OP_PRINT_FMTS[op]
        if (!fmt) return `?op${op}?`
        return expandFmt(fmt, intarg)
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
