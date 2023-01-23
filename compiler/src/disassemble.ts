import { SrcMapResolver } from "./debug"
import {
    BinFmt,
    BUILTIN_OBJECT__VAL,
    BUILTIN_STRING__VAL,
    FieldSpecFlag,
    FunctionFlag,
    InstrArgResolver,
    numfmtToString,
    PacketSpecCode,
    PacketSpecFlag,
    StrIdx,
    stringifyInstr,
} from "./format"
import { DebugInfo, FunctionDebugInfo, RoleDebugInfo } from "./info"
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

export class ImgRole {
    constructor(
        public parent: Image,
        public index: number,
        public serviceClass: number,
        public name: string,
        public dbg: RoleDebugInfo
    ) {}
}

export class ImgFunction {
    numArgs: number
    numSlots: number
    flags: number
    numTryFrames: number
    imgOffset: number
    dbg: FunctionDebugInfo

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
            resolverPC: 0,
            verboseDisasm: verbose,
            describeCell: (ff, idx) => {
                switch (ff) {
                    case "R":
                        return this.parent.roles[idx]?.name
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

        const body = this.bytecode
        let ptr = 0
        const getbyte = () => body[ptr++]
        while (ptr < body.length) {
            resolver.resolverPC = ptr
            r += stringifyInstr(getbyte, resolver) + `\n`
            if (body[ptr] == 0 && body.length - ptr < 4) break // skip final padding
        }

        return r
    }
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
    bufferTable: Uint8Array[]

    functions: ImgFunction[]
    roles: ImgRole[]
    dbg: DebugInfo

    srcmap: SrcMapResolver

    private specData: Uint8Array

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
            this.devsBinary = fromHex(this.dbg.binary)

        this.srcmap = SrcMapResolver.from(this.dbg)

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
                return this.asciiTable
            case StrIdx.BUILTIN:
                return this.bultinTable
        }
        return undefined
    }

    describeString(tp: StrIdx, idx: number): string {
        const v = this.getString(tp, idx)
        if (v === undefined) return undefined
        if (v instanceof Uint8Array) return toHex(v)
        else return JSON.stringify(v)
    }

    getString(tp: StrIdx, idx: number) {
        return this.stringTable(tp)?.[idx]
    }

    private load() {
        const img = this.devsBinary
        const error = (m: string) => this.error(m)

        if (!img || img.length < 100) {
            this.error(`img too small`)
            return
        }
        if (
            read32(img, 0) != BinFmt.MAGIC0 ||
            read32(img, 4) != BinFmt.MAGIC1
        ) {
            this.error(`invalid magic`)
            return
        }
        if (read32(img, 8) != BinFmt.IMG_VERSION) {
            this.error(
                `invalid version ${read32(img, 8)} (exp: ${BinFmt.IMG_VERSION})`
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
        ] = range(BinFmt.NUM_IMG_SECTIONS).map(i =>
            decodeSection(
                img,
                BinFmt.FIX_HEADER_SIZE + i * BinFmt.SECTION_HEADER_SIZE
            )
        )

        this.specData = specData

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

        this.utf8Table = range(
            utf8Desc.length / BinFmt.SECTION_HEADER_SIZE
        ).map(idx => getString(StrIdx.UTF8, idx))

        this.bufferTable = range(
            bufferDesc.length / BinFmt.SECTION_HEADER_SIZE
        ).map(idx => getStringBuf(StrIdx.BUFFER, idx))

        this.bultinTable = BUILTIN_STRING__VAL.slice()

        this.roles = range(roleData.length / BinFmt.ROLE_HEADER_SIZE).map(
            idx =>
                new ImgRole(
                    this,
                    idx,
                    read32(roleData, idx * BinFmt.ROLE_HEADER_SIZE),
                    getString1(
                        read16(roleData, idx * BinFmt.ROLE_HEADER_SIZE + 4)
                    ),
                    this.dbg?.roles[idx]
                )
        )

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
                return decodeSection(
                    utf8Desc,
                    idx * BinFmt.SECTION_HEADER_SIZE,
                    strData
                )
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
            `; img size ${this.devsBinary.length}\n` +
            `; ${this.numGlobals} globals\n`

        for (const fn of this.functions) r += "\n" + fn.disassemble(verbose)

        // printStrings("builtin", StrIdx.BUILTIN)
        printStrings("ASCII", StrIdx.ASCII)
        printStrings("UTF8", StrIdx.UTF8)
        printStrings("buffer", StrIdx.BUFFER)

        r += `\nDoubles:\n`
        for (let i = 0; i < this.floatTable.length; ++i) {
            r += ("     " + i).slice(-4) + ": " + this.floatTable[i] + "\n"
        }

        r += `\n`

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
                    img.describeString(tp, i) +
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

export function disassemble(data: Uint8Array, verbose = false): string {
    const img = new Image(data)
    for (const err of img.errors) console.error("DevS disasm error: " + err)
    return img.disassemble(verbose)
}
