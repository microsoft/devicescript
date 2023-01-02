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
    NumFmtSpecial,
} from "./bytecode"
import { toHex } from "./jdutil"
import { DebugInfo } from "./info"

export * from "./bytecode"
export * from "./type"

import type ts from "typescript"

export interface SMap<T> {
    [k: string]: T
}

export function opTakesNumber(op: Op) {
    return !!(OP_PROPS.charCodeAt(op) & BytecodeFlag.TAKES_NUMBER)
}

export function opNumRealArgs(op: Op) {
    return OP_PROPS.charCodeAt(op) & BytecodeFlag.NUM_ARGS_MASK
}

export function opNumArgs(op: Op) {
    let n = opNumRealArgs(op)
    if (opTakesNumber(op)) n++
    return n
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

export interface InstrArgResolver {
    describeCell?(fmt: string, idx: number): string
    resolverPC?: number
}

export function bitSize(fmt: NumFmt) {
    return 8 << (fmt & 0b11)
}

class OpTree {
    args: OpTree[]
    arg: number
    constructor(public opcode: number) {}
}

export function numfmtToString(v: number) {
    const fmt = v & 0xf
    const bitsz = bitSize(fmt)
    const letter = ["u", "i", "f", "x"][fmt >> 2]
    if (letter == "x") {
        const idx = (v >> 4) | ((v & 3) << 4)
        return NumFmtSpecial[idx] ?? "Spec." + idx
    }
    const shift = v >> 4
    if (shift) return letter + (bitsz - shift) + "." + shift
    else return letter + bitsz
}

export function stringifyInstr(
    getbyte0: () => number,
    resolver?: InstrArgResolver
) {
    const bytebuf: number[] = []
    const getbyte = () => {
        const v = getbyte0()
        bytebuf.push(v)
        return v
    }

    const stack: OpTree[] = []
    let jmpoff = NaN

    for (;;) {
        const op = getbyte()
        if (op == 0 && bytebuf.length == 1) return "          .fill 0x00"
        const e = new OpTree(op)
        if (opTakesNumber(op)) {
            jmpoff = resolver?.resolverPC + bytebuf.length - 1
            e.arg = decodeInt()
        }
        let n = opNumRealArgs(op)
        if (n) {
            if (stack.length < n)
                return "???oops stack underflow; " + toHex(bytebuf)
            e.args = stack.slice(stack.length - n)
            while (n--) stack.pop()
        }
        stack.push(e)
        if (opIsStmt(op)) break
    }
    if (stack.length != 1)
        return "???oops bad stack: " + stack.length + "; " + toHex(bytebuf)

    let res = "    " + stringifyExpr(stack[0]) + " // " + toHex(bytebuf)

    const pc = resolver?.resolverPC
    if (pc !== undefined)
        res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res

    return res

    function expandFmt(fmt: string, t: OpTree) {
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

            if (t.arg != undefined) {
                eNum = t.arg
                e = eNum + ""
                t.arg = undefined
            } else {
                if (!t.args || !t.args.length) e = "???oops"
                else e = stringifyExpr(t.args.shift())
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
        return isNaN(jmpoff) ? offs : jmpoff + off + (" (" + offs + ")")
    }

    function isNumber(s: string) {
        return /^\d+$/.test(s)
    }

    function numfmt(vv: string) {
        if (!isNumber(vv)) return vv
        return numfmtToString(+vv)
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
        if (v < BinFmt.FIRST_MULTIBYTE_INT) return v

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

    function stringifyExpr(t: OpTree): string {
        const op = t.opcode

        if (op >= BinFmt.DIRECT_CONST_OP)
            return (
                "" + (op - BinFmt.DIRECT_CONST_OP - BinFmt.DIRECT_CONST_OFFSET)
            )

        const fmt = OP_PRINT_FMTS[op]
        if (!fmt) return `???oops op${op}`
        return expandFmt(fmt, t)
    }
}

export interface DevsDiagnostic extends ts.Diagnostic {
    filename: string
    line: number
    column: number
    formatted: string
}

export interface Host {
    write(filename: string, contents: Uint8Array | string): void
    log(msg: string): void
    mainFileName?(): string
    error?(err: DevsDiagnostic): void
    getSpecs(): jdspec.ServiceSpec[]
    verifyBytecode?(buf: Uint8Array, dbgInfo?: DebugInfo): void
}
