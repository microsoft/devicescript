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
import {
    range,
    read32,
    read16,
    fromUTF8,
    uint8ArrayToString,
    toHex,
    stringToUint8Array,
    assert,
} from "./jdutil"

function error(msg: string) {
    console.error("DevS disasm error: " + msg)
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

export function disassemble(img: Uint8Array, verbose = false): string {
    if (!img || img.length < 100) {
        error(`img too small`)
        return ""
    }
    if (read32(img, 0) != BinFmt.MAGIC0 || read32(img, 4) != BinFmt.MAGIC1) {
        error(`invalid magic`)
        return ""
    }
    if (read32(img, 8) != BinFmt.IMG_VERSION) {
        error(`invalid version ${read32(img, 8)} (exp: ${BinFmt.IMG_VERSION})`)
        return ""
    }
    const numGlobals = read16(img, 12)
    const numSpecs = read16(img, 14)
    let r = `; img size ${img.length}\n` + `; ${numGlobals} globals\n`

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

    function funName(idx: number) {
        return getString1(
            read16(funDesc, idx * BinFmt.FUNCTION_HEADER_SIZE + 12)
        )
    }

    function roleName(idx: number) {
        return getString1(read16(roleData, idx * BinFmt.ROLE_HEADER_SIZE + 4))
    }

    function describeString(tp: StrIdx, idx: number) {
        if (tp == StrIdx.BUFFER) return getString(tp, idx)
        else return JSON.stringify(getString(tp, idx))
    }

    let funDescFlags = 0
    let funDescNumArgs = 0

    const floatArr = new Float64Array(floatData.buffer)
    const intFloatArr = new Int32Array(floatData.buffer)

    const getFlt = (idx: number) => {
        if (intFloatArr[idx * 2 + 1] == -1) return intFloatArr[idx * 2] + ""
        const rr = floatArr[idx] + ""
        if (/^-?\d+$/.test(rr)) return rr + ".0"
        return rr
    }

    const resolver: InstrArgResolver = {
        resolverPC: 0,
        verboseDisasm: verbose,
        describeCell: (ff, idx) => {
            switch (ff) {
                case "R":
                    return roleName(idx)
                case "B":
                    return describeString(StrIdx.BUFFER, idx)
                case "U":
                    return describeString(StrIdx.UTF8, idx)
                case "A":
                    return describeString(StrIdx.ASCII, idx)
                case "I":
                    return describeString(StrIdx.BUILTIN, idx)
                case "O":
                    return BUILTIN_OBJECT__VAL[idx] || "???"
                case "F":
                    return funName(idx) + "_F" + idx
                case "L":
                    if (funDescFlags & FunctionFlag.NEEDS_THIS) {
                        if (idx == 0) return "this"
                        idx--
                    }
                    if (idx < funDescNumArgs) return "par" + idx
                    idx -= funDescNumArgs
                    return "loc" + idx
                case "G":
                    return "" // global
                case "D":
                    return getFlt(idx)
            }
        },
    }

    let fnid = 0
    for (
        let off = 0;
        off < funDesc.length;
        off += BinFmt.FUNCTION_HEADER_SIZE
    ) {
        const body = decodeSection(funDesc, off, img)
        funDescNumArgs = funDesc[off + 10]
        funDescFlags = funDesc[off + 11]
        const numlocals = read16(funDesc, off + 8) - funDescNumArgs
        const fnname = funName(fnid)
        const txtArgs = range(funDescNumArgs).map(i => "par" + i)
        if (funDescFlags & FunctionFlag.NEEDS_THIS) {
            txtArgs.pop()
            txtArgs.unshift("this")
        }
        const imgoff = read32(funDesc, off)
        r += `\n${fnname}_F${fnid}(${txtArgs.join(", ")}): @${imgoff}\n`
        if (numlocals)
            r += `  locals: ${range(numlocals).map(i => "loc" + i)}\n`

        let ptr = 0
        const getbyte = () => body[ptr++]
        while (ptr < body.length) {
            resolver.resolverPC = ptr
            r += stringifyInstr(getbyte, resolver) + `\n`
            if (body[ptr] == 0 && body.length - ptr < 4) break // skip final padding
        }
        fnid++
    }

    // printStrings("builtin", StrIdx.BUILTIN, BUILTIN_STRING__SIZE)
    printStrings(
        "ASCII",
        StrIdx.ASCII,
        asciiDesc.length / BinFmt.ASCII_HEADER_SIZE
    )
    printStrings(
        "UTF8",
        StrIdx.UTF8,
        utf8Desc.length / BinFmt.SECTION_HEADER_SIZE
    )
    printStrings(
        "buffer",
        StrIdx.BUFFER,
        bufferDesc.length / BinFmt.SECTION_HEADER_SIZE
    )

    r += `\nDoubles:\n`
    for (let i = 0; i < floatArr.length; ++i) {
        r += ("     " + i).slice(-4) + ": " + getFlt(i) + "\n"
    }

    r += `\n`
    for (let i = 0; i < numSpecs; i++) {
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
            const numfmt = isOffset ? "{...}" : numfmtToString(numfmtOrOffset)
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

    function printStrings(lbl: string, tp: StrIdx, num: number) {
        r += `\nStrings ${lbl}:\n`
        for (let i = 0; i < num; ++i) {
            r += ("     " + i).slice(-4) + ": " + describeString(tp, i) + "\n"
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
}
