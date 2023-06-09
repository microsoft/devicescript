import { decodeDcfg, decompileDcfg } from "./dcfg"
import {
    BinFmt,
    BUILTIN_OBJECT__VAL,
    BUILTIN_STRING__VAL,
    FieldSpecFlag,
    FunctionFlag,
    InstrArgResolver,
    numfmtToString,
    Op,
    OpCall,
    opIsStmt,
    opNumRealArgs,
    opTakesNumber,
    OP_PRINT_FMTS,
    PacketSpecCode,
    PacketSpecFlag,
    parseImgVersion,
    stmtIsFinal,
    StrIdx,
} from "./format"
import {
    DeviceConfig,
    SrcMapResolver,
    DebugInfo,
    FunctionDebugInfo,
} from "@devicescript/interop"
import {
    range,
    read32,
    read16,
    fromUTF8,
    uint8ArrayToString,
    toHex,
    stringToUint8Array,
    assert,
    fromHex,
} from "./jdutil"
import { IMAGE_MIN_LENGTH, checkMagic } from "./magic"

export class OpTree {
    args: OpTree[] = undefined
    intArg: number = undefined
    constructor(public opcode: number) {}
}

export class OpStmt extends OpTree {
    index: number
    pc: number
    pcEnd: number
    srcPos: number
    srcLen: number
    jmpTrg: OpStmt
    error: string
}

export class ImgFunction {
    numArgs: number
    numSlots: number
    flags: number
    numTryFrames: number
    imgOffset: number
    dbg: FunctionDebugInfo
    private stmtsCache: OpStmt[]

    get numLocals() {
        return this.numSlots - this.numArgs
    }

    constructor(
        public parent: Image,
        public index: number,
        public bytecode: Uint8Array,
        public name: string
    ) {}

    disassemble(verbose = false) {
        const tpMap: Record<string, StrIdx> = {
            B: StrIdx.BUFFER,
            U: StrIdx.UTF8,
            A: StrIdx.ASCII,
            I: StrIdx.BUILTIN,
        }
        const resolver: InstrArgResolver = {
            verboseDisasm: verbose,
            describeCell: (ff, idx) => {
                switch (ff) {
                    case "B":
                    case "U":
                    case "A":
                    case "I":
                        return this.parent.describeString(tpMap[ff], idx)
                    case "O":
                        return BUILTIN_OBJECT__VAL[idx] || "???"
                    case "F":
                        return (
                            (this.parent.functions?.[idx]?.name ?? "") +
                            "_F" +
                            idx
                        )
                    case "L":
                        if (this.flags & FunctionFlag.NEEDS_THIS) {
                            if (idx == 0) return "this"
                            idx--
                        }
                        if (idx < this.numArgs) return "par" + idx
                        idx -= this.numArgs
                        return "loc" + idx
                    case "G":
                        return "" // global
                    case "S":
                        return "serviceSpec" + idx
                    case "D":
                        return this.parent.floatTable[idx] + ""
                }
            },
        }

        const txtArgs = range(this.numArgs).map(i => "par" + i)
        let pref = "proc"
        if (this.flags & FunctionFlag.NEEDS_THIS) {
            txtArgs.pop()
            txtArgs.unshift("this")
            pref = "method"
        }
        if (this.flags & FunctionFlag.IS_CTOR) {
            pref = "ctor"
        }
        const fullname = `${pref} ${this.name}_F${this.index}`
        let r = `${fullname}(${txtArgs.join(", ")}): @${this.imgOffset}\n`
        if (this.numLocals)
            r += `  locals: ${range(this.numLocals).map(i => "loc" + i)}\n`

        const stmts = this.parseBytecode()
        const srcmap = this.parent.srcmap
        let prevPos = ""

        for (const stmt of stmts) {
            let res = stringifyInstr(stmt, resolver)
            const pos =
                srcmap && stmt.srcPos
                    ? srcmap.posToString(stmt.srcPos).replace(/.*\//, "")
                    : ""
            if (pos && pos != prevPos) {
                res = "//                           " + pos + "\n" + res
                prevPos = pos
            }
            if (verbose) {
                res += " // " + toHex(this.bytecode.slice(stmt.pc, stmt.pcEnd))
            }
            r += res + "\n"
        }

        return r
    }

    toStmts() {
        if (!this.stmtsCache) this.stmtsCache = this.parseBytecode(true)
        return this.stmtsCache
    }

    stmtByGlobalPc(pc: number) {
        pc -= this.imgOffset
        if (pc < 0 || pc > this.bytecode.length)
            throw new Error("pc out of range")
        const stmts = this.toStmts()
        for (let i = 0; i < stmts.length; ++i) {
            const s = stmts[i]
            if (s.pc <= pc && pc < s.pcEnd) return s
        }
        throw new Error("pc not found?")
    }

    findZoneExits(start: OpStmt, inZone: (s: OpStmt) => boolean) {
        const stmts = this.toStmts()
        const exits: OpStmt[] = []
        assert(stmts[start.index] === start)
        assert(inZone(start))
        const visited: boolean[] = []
        find(start.index)
        return exits

        function find(idx: number): void {
            while (!visited[idx]) {
                visited[idx] = true
                const s = stmts[idx]
                const zone = inZone(s)
                // console.log(`visit ${s.pc} ${zone ? "zone" : "exit"}`)
                if (zone) {
                    if (s.jmpTrg) {
                        if (stmtIsFinal(s.opcode)) {
                            idx = s.jmpTrg.index
                        } else if (s.opcode == Op.STMTx_TRY) {
                            idx++
                        } else if (s.opcode == Op.STMTx1_JMP_Z) {
                            find(idx + 1)
                            idx = s.jmpTrg.index
                        } else {
                            throw new Error("unknown jump: " + Op[s.opcode])
                        }
                    } else {
                        if (stmtIsFinal(s.opcode)) break
                        idx++
                    }
                } else {
                    exits.push(s)
                    break
                }
            }
        }
    }

    private parseBytecode(throwOnError = false) {
        const stmts = parseBytecode(this.bytecode, throwOnError)
        const srcmap = this.parent.srcmap
        if (srcmap)
            for (const stmt of stmts) {
                if (!stmt.error) {
                    const [pos, len] = srcmap.resolvePc(
                        this.imgOffset + stmt.pc
                    )
                    stmt.srcPos = pos
                    stmt.srcLen = len
                }
            }
        return stmts
    }
}

export function parseBytecode(bytecode: Uint8Array, throwOnError = false) {
    let pc = 0
    let stmtStart = 0
    let jmpoff = 0
    const getbyte = () => {
        return bytecode[pc++]
    }
    const stmts: OpStmt[] = []
    const byPc: OpStmt[] = []

    let bend = bytecode.length - 1
    while (bytecode[bend] === 0x00) bend--
    bend++
    bend = Math.max(bytecode.length - 4, bend)

    while (pc < bend) {
        try {
            stmtStart = pc
            jmpoff = NaN
            const op = decodeOp()
            const stmt = new OpStmt(op.opcode)
            stmt.pc = stmtStart
            stmt.pcEnd = pc
            stmt.intArg = op.intArg
            stmt.args = op.args
            if (opJumps(stmt.opcode)) {
                const trg = jmpoff + stmt.intArg
                if (!(0 <= trg && trg < bytecode.length)) {
                    error(`invalid jmp target: ${jmpoff} + ${stmt.intArg}`)
                }
                stmt.intArg = trg
            }

            stmt.index = stmts.length
            stmts.push(stmt)
            byPc[stmt.pc] = stmt
        } catch (e) {
            if (throwOnError) {
                throw e
            } else {
                const stmt = new OpStmt(Op.STMT0_DEBUGGER)
                stmt.error = e.message
                if (stmtStart == pc) pc++
                stmt.pc = stmtStart
                stmt.pcEnd = pc
                stmts.push(stmt)
            }
        }
    }

    for (const stmt of stmts) {
        try {
            if (opJumps(stmt.opcode)) {
                const trg = byPc[stmt.intArg]
                if (!trg) error(`can't find jump target ${stmt.intArg}`)
                stmt.jmpTrg = trg
            }
        } catch (e) {
            if (throwOnError) throw e
            else stmt.error = e.message
        }
    }

    return stmts

    function opJumps(op: Op) {
        return (OP_PRINT_FMTS[op] ?? "").includes("%j")
    }

    function decodeOp() {
        const stack: OpTree[] = []
        for (;;) {
            const op = getbyte()
            if (op == 0 && pc - stmtStart == 1)
                return new OpTree(Op.STMT0_DEBUGGER)
            const e = new OpTree(op)
            if (opTakesNumber(op)) {
                jmpoff = pc - 1
                e.intArg = decodeInt()
            }
            let n = opNumRealArgs(op)
            if (n) {
                if (stack.length < n) error("stack underflow")
                e.args = stack.slice(stack.length - n)
                while (n--) stack.pop()
            }
            stack.push(e)
            if (opIsStmt(op)) break
        }
        if (stack.length != 1) error(`bad stack ${stack.length}`)
        return stack[0]
    }

    function currStmt() {
        return toHex(bytecode.slice(stmtStart, pc))
    }

    function error(msg: string): never {
        throw new Error("Op-decode: " + msg + "; " + currStmt())
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
}

export function stringifyInstr(stmt: OpStmt, resolver?: InstrArgResolver) {
    if (stmt.error) return `???oops: ${stmt.error}`

    let res = "    " + stringifyExpr(resolver, stmt)

    const pc = stmt.pc
    if (pc !== undefined)
        res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res

    return res
}

function stringifyExpr(resolver: InstrArgResolver, t: OpTree): string {
    const op = t.opcode

    if (op >= BinFmt.DIRECT_CONST_OP)
        return "" + (op - BinFmt.DIRECT_CONST_OP - BinFmt.DIRECT_CONST_OFFSET)

    let fmt = OP_PRINT_FMTS[op]
    if (!fmt) return `???oops op${op}`

    let ptr = 0
    let beg = 0
    let r = ""
    const args = (t.args || []).map(e => stringifyExpr(resolver, e))
    if (t.intArg != undefined) args.unshift(t.intArg + "")
    t.intArg = undefined

    if (fmt.startsWith("{swap}")) {
        args.reverse()
        fmt = fmt.slice(6)
    }

    while (ptr < fmt.length) {
        if (fmt.charCodeAt(ptr) != 37) {
            ptr++
            continue
        }

        r += fmt.slice(beg, ptr)
        ptr++
        beg = ptr + 1

        let e = args.shift() ?? "???oops"
        const eNum = isNumber(e) ? +e : null

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
                e = eNum + ""
                break

            default:
                e = "{" + ff + e + "}"
                if (eNum != null && resolver) {
                    const pref = resolver.describeCell(ff, eNum)
                    if (pref) {
                        if (resolver.verboseDisasm) e = pref + e
                        else e = pref
                    }
                }
                break
        }

        r += e
        ptr++
    }
    r += fmt.slice(beg)
    return r
}

function isNumber(s: string) {
    return /^-?\d+$/.test(s)
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

export class Image {
    errors: string[] = []
    devsBinary: Uint8Array

    numGlobals: number
    numSpecs: number

    floatTable: Float64Array
    bultinTable: string[]
    asciiTable: string[]
    utf8Table: string[]
    utf8TableInfo: string[]
    bufferTable: Uint8Array[]

    functions: ImgFunction[]
    dbg: DebugInfo

    srcmap: SrcMapResolver

    private specData: Uint8Array
    private dcfgData: Uint8Array

    constructor(input: Uint8Array | string | DebugInfo) {
        if (typeof input == "string") {
            this.dbg = JSON.parse(input)
        } else if (input instanceof Uint8Array) {
            if (input[0] == 0x7b) {
                this.dbg = JSON.parse(fromUTF8(uint8ArrayToString(input)))
            } else {
                this.devsBinary = input
            }
        } else {
            this.dbg = input
        }

        if (!this.devsBinary && this.dbg)
            this.devsBinary = fromHex(this.dbg.binary.hex)

        if (this.dbg) this.srcmap = SrcMapResolver.from(this.dbg)

        this.load()
    }

    private error(msg: string) {
        this.errors.push(msg)
    }

    stringTable(tp: StrIdx): string[] | Uint8Array[] {
        switch (tp) {
            case StrIdx.BUFFER:
                return this.bufferTable
            case StrIdx.ASCII:
                return this.asciiTable
            case StrIdx.UTF8:
                return this.utf8Table
            case StrIdx.BUILTIN:
                return this.bultinTable
        }
        return undefined
    }

    describeString(tp: StrIdx, idx: number, detail = false): string {
        const v = this.getString(tp, idx)
        if (v === undefined) return undefined
        let r = ""
        if (v instanceof Uint8Array) r = toHex(v)
        else r = JSON.stringify(v)
        if (detail && tp == StrIdx.UTF8) {
            r = `${r} (${this.utf8TableInfo[idx]})`
        }
        return r
    }

    getString(tp: StrIdx, idx: number) {
        return this.stringTable(tp)?.[idx]
    }

    private load() {
        const img = this.devsBinary
        const error = (m: string) => this.error(m)

        if (!img || img.length < IMAGE_MIN_LENGTH) {
            this.error(`img too small`)
            return
        }
        if (!checkMagic(img)) {
            this.error(`invalid magic`)
            return
        }

        const v = parseImgVersion(read32(img, 8))
        if (
            v.major != BinFmt.IMG_VERSION_MAJOR ||
            v.minor > BinFmt.IMG_VERSION_MINOR
        ) {
            this.error(
                `invalid version ${read32(img, 8).toString(
                    16
                )} (exp: ${BinFmt.IMG_VERSION.toString(16)})`
            )
            return
        }

        this.numGlobals = read16(img, 12)
        this.numSpecs = read16(img, 14)

        const [
            funDesc,
            funData,
            floatData,
            roleData,
            asciiDesc,
            utf8Desc,
            bufferDesc,
            strData,
            specData,
            dcfgData,
        ] = range(BinFmt.NUM_IMG_SECTIONS).map(i =>
            decodeSection(
                img,
                BinFmt.FIX_HEADER_SIZE + i * BinFmt.SECTION_HEADER_SIZE
            )
        )

        this.specData = specData
        this.dcfgData = dcfgData

        const floatArr = new Float64Array(floatData.buffer).slice()
        const intFloatArr = new Int32Array(floatData.buffer)
        for (let idx = 0; idx < floatArr.length; ++idx) {
            if (intFloatArr[idx * 2 + 1] == -1)
                floatArr[idx] = intFloatArr[idx * 2]
        }
        this.floatTable = floatArr

        this.asciiTable = range(
            asciiDesc.length / BinFmt.ASCII_HEADER_SIZE
        ).map(idx => getString(StrIdx.ASCII, idx))

        this.utf8Table = range(utf8Desc.length / BinFmt.UTF8_HEADER_SIZE).map(
            idx => getString(StrIdx.UTF8, idx)
        )
        this.utf8TableInfo = range(
            utf8Desc.length / BinFmt.UTF8_HEADER_SIZE
        ).map(idx => {
            const r = utf8Info(idx)
            return `${r.size} bytes ${r.len} codepoints`
        })

        this.bufferTable = range(
            bufferDesc.length / BinFmt.SECTION_HEADER_SIZE
        ).map(idx => getStringBuf(StrIdx.BUFFER, idx))

        this.bultinTable = BUILTIN_STRING__VAL.slice()

        this.functions = range(
            funDesc.length / BinFmt.FUNCTION_HEADER_SIZE
        ).map(idx => {
            const off = idx * BinFmt.FUNCTION_HEADER_SIZE
            const name = getString1(read16(funDesc, off + 12))
            const body = decodeSection(funDesc, off, img)

            const fn = new ImgFunction(this, idx, body, name)

            fn.numArgs = funDesc[off + 10]
            fn.flags = funDesc[off + 11]
            fn.numSlots = read16(funDesc, off + 8)
            fn.imgOffset = read32(funDesc, off)

            fn.dbg = this.dbg?.functions[idx]

            return fn
        })

        return

        function getString1(idx: number) {
            const tp = idx >> StrIdx._SHIFT
            idx &= (1 << StrIdx._SHIFT) - 1
            return getString(tp, idx)
        }

        function getString(tp: StrIdx, idx: number) {
            const buf = getStringBuf(tp, idx)
            if (tp == StrIdx.BUFFER) return toHex(buf)
            else return fromUTF8(uint8ArrayToString(buf))
        }

        function utf8Info(idx: number) {
            idx *= BinFmt.UTF8_HEADER_SIZE
            assert(BinFmt.UTF8_HEADER_SIZE == 4)
            const none = {
                size: 0,
                len: 0,
                buf: new Uint8Array(0),
            }
            if (idx + 4 > utf8Desc.length) {
                error("utf8 index out of range")
                return none
            }
            const start = read32(utf8Desc, idx)
            if (start >= strData.length) {
                error("utf8 start out of range")
                return none
            }
            const size = read16(strData, start)
            const len = read16(strData, start + 2)
            const jmpent = len >> BinFmt.UTF8_TABLE_SHIFT
            const datastart = start + (2 + jmpent) * 2
            return {
                size,
                len,
                buf: strData.slice(datastart, datastart + size),
            }
        }

        function getStringBuf(tp: StrIdx, idx: number) {
            if (tp == StrIdx.BUILTIN) {
                return stringToUint8Array(BUILTIN_STRING__VAL[idx])
            } else if (tp == StrIdx.ASCII) {
                idx *= BinFmt.ASCII_HEADER_SIZE
                if (idx + 2 > asciiDesc.length) {
                    error("ascii index out of range")
                    return new Uint8Array(0)
                }
                const start = read16(asciiDesc, idx)
                if (start >= strData.length) {
                    error("ascii start out of range")
                    return new Uint8Array(0)
                }
                for (let i = start; i < strData.length; ++i) {
                    if (strData[i] === 0) return strData.slice(start, i)
                }
                error("missing NUL")
                return new Uint8Array(0)
            } else if (tp == StrIdx.UTF8) {
                return utf8Info(idx).buf
            } else if (tp == StrIdx.BUFFER) {
                return decodeSection(
                    bufferDesc,
                    idx * BinFmt.SECTION_HEADER_SIZE,
                    strData
                )
            } else {
                assert(false)
            }
        }

        function decodeSection(buf: Uint8Array, off: number, img?: Uint8Array) {
            if (off < 0 || off + BinFmt.SECTION_HEADER_SIZE > buf.length) {
                error(`section header out of range ${off}`)
                return new Uint8Array(0)
            }

            if (off & 3) error(`unaligned section: ${off}`)

            const start = read32(buf, off)
            const len = read32(buf, off + 4)
            if (!img) img = buf
            if (start + len > img.length) {
                error(`section bounds out of range at ${off}: ${start}+${len}`)
                return new Uint8Array(0)
            }

            return new Uint8Array(img.slice(start, start + len))
        }
    }

    disassemble(verbose = false) {
        const img = this
        let r =
            `// img size ${this.devsBinary.length}\n` +
            `// ${this.numGlobals} globals\n`

        for (const fn of this.functions) r += "\n" + fn.disassemble(verbose)

        // printStrings("builtin", StrIdx.BUILTIN)
        printStrings("ASCII", StrIdx.ASCII)
        printStrings("UTF8", StrIdx.UTF8)
        printStrings("buffer", StrIdx.BUFFER)

        r += `\nDoubles:\n`
        for (let i = 0; i < this.floatTable.length; ++i) {
            r += ("     " + i).slice(-4) + ": " + this.floatTable[i] + "\n"
        }

        if (this.dcfgData.length == 0) {
            r += "\nDCFG: None\n\n"
        } else {
            const settings = decodeDcfg(this.dcfgData)
            r += settings.errors.map(e => `; DCFG-error: ${e}\n`).join("\n")
            const json: DeviceConfig = decompileDcfg(settings.settings)
            if (
                Array.isArray(json.services) &&
                json.services.slice(0, 0x40).every(s => s == null)
            )
                json.services = json.services.slice(0x40)
            r +=
                `\nDCFG: h=${settings.hash} sz=${this.dcfgData.length} ` +
                JSON.stringify(json, null, 4) +
                "\n\n"
        }

        const specData = this.specData

        for (let i = 0; i < this.numSpecs; i++) {
            const sz = BinFmt.SERVICE_SPEC_HEADER_SIZE
            const servSpec = specData.slice(i * sz, i * sz + sz)
            const flags = read16(servSpec, 2)
            const cls = read32(servSpec, 4).toString(16)
            const numPackets = read16(servSpec, 8)
            const pkts_offset = read16(servSpec, 10) * 4
            const name = getString1(read16(servSpec, 0))
            r += `SPEC ${name} 0x${cls} (f=${flags})\n`
            for (let j = 0; j < numPackets; ++j) {
                const off = pkts_offset + j * BinFmt.SERVICE_SPEC_PACKET_SIZE
                const pktSpec = specData.slice(
                    off,
                    off + BinFmt.SERVICE_SPEC_PACKET_SIZE
                )
                const pname = getString1(read16(pktSpec, 0))
                const code = read16(pktSpec, 2)
                const flags = read16(pktSpec, 4)
                const numfmtOrOffset = read16(pktSpec, 6)
                const isOffset = !!(flags & PacketSpecFlag.MULTI_FIELD)
                const numfmt = isOffset
                    ? "{...}"
                    : numfmtToString(numfmtOrOffset)
                const codeType = code & PacketSpecCode.MASK
                const tpName = PacketSpecCode[codeType]
                const shortCode = (code & ~PacketSpecCode.MASK).toString(16)
                r += `    ${tpName} ${pname} : ${numfmt} @ 0x${shortCode} (f=${flags})\n`
                if (isOffset) {
                    let ptr = numfmtOrOffset << 2
                    while (ptr < specData.length) {
                        if (read32(specData, ptr) == 0) break
                        const fname = getString1(read16(specData, ptr))
                        const flags = specData[ptr + 3]
                        const fmt =
                            flags & FieldSpecFlag.IS_BYTES
                                ? `bytes[${specData[ptr + 2]}]`
                                : numfmtToString(specData[ptr + 2])
                        r += `        ${fname} : ${fmt} (f=${flags})\n`
                        ptr += BinFmt.SERVICE_SPEC_FIELD_SIZE
                    }
                }
            }
            r += "\n"
        }

        return r

        function printStrings(lbl: string, tp: StrIdx) {
            r += `\nStrings ${lbl}:\n`
            const num = img.stringTable(tp).length
            for (let i = 0; i < num; ++i) {
                r +=
                    ("     " + i).slice(-4) +
                    ": " +
                    img.describeString(tp, i, true) +
                    "\n"
            }
        }

        function getString1(idx: number) {
            const tp = idx >> StrIdx._SHIFT
            idx &= (1 << StrIdx._SHIFT) - 1
            return img.getString(tp, idx) + ""
        }
    }
}

export function disassemble(
    data: string | Uint8Array | DebugInfo,
    verbose = false
): string {
    const img = new Image(data)
    for (const err of img.errors) console.error("DevS disasm error: " + err)
    return img.disassemble(verbose)
}
