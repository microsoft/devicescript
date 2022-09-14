import { BinFmt, InstrArgResolver, stringifyInstr } from "./format"
import {
    range,
    read32,
    read16,
    fromUTF8,
    uint8ArrayToString,
    toHex,
} from "./jdutil"

function error(msg: string) {
    console.error("JacS disasm error: " + msg)
}

function decodeSection(buf: Uint8Array, off: number, img?: Uint8Array) {
    if (off < 0 || off + BinFmt.SectionHeaderSize > buf.length) {
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

    return img.slice(start, start + len)
}

export function disassemble(img: Uint8Array): string {
    if (!img || img.length < 100) {
        error(`img too small`)
        return ""
    }
    if (read32(img, 0) != BinFmt.Magic0 || read32(img, 4) != BinFmt.Magic1) {
        error(`invalid magic`)
        return ""
    }
    if (read32(img, 8) != BinFmt.ImgVersion) {
        error(`invalid version ${read32(img, 8)} (exp: ${BinFmt.ImgVersion})`)
        return ""
    }
    const numGlobals = read16(img, 12)
    let r = `; img size ${img.length}\n` + `; ${numGlobals} globals\n`

    const [
        funDesc,
        funData,
        floatData,
        roleData,
        strDesc,
        strData,
        bufferDesc,
    ] = range(7).map(i =>
        decodeSection(img, BinFmt.FixHeaderSize + i * BinFmt.SectionHeaderSize)
    )

    const resolver: InstrArgResolver = {
        resolverPC: 0,
        funName: idx =>
            getString(read16(funDesc, idx * BinFmt.FunctionHeaderSize + 12)),
        roleName: idx =>
            getString(read16(roleData, idx * BinFmt.RoleHeaderSize + 4)),
        getString: idx => {
            const buf = getStringBuf(idx)
            let isstr = true
            for (let i = 0; i < buf.length; ++i)
                if (buf[i] < 32 || buf[i] > 0x80) isstr = false
            if (isstr) return JSON.stringify(getString(idx))
            else return toHex(buf)
        },
    }

    let fnid = 0
    for (let off = 0; off < funDesc.length; off += BinFmt.FunctionHeaderSize) {
        const body = decodeSection(funDesc, off, img)
        const numlocals = read16(funDesc, off + 8)
        const numargs = funDesc[off + 10]
        const flags = funDesc[off + 11]
        const fnname = resolver.funName(fnid)
        r += `\n${fnname}_F${fnid}(${range(numargs).map(i => "P" + i)}):\n`
        if (numlocals) r += `  locals: ${range(numlocals).map(i => "L" + i)}\n`

        let ptr = 0
        const getbyte = () => body[ptr++]
        while (ptr < body.length) {
            resolver.resolverPC = ptr
            r += stringifyInstr(getbyte, resolver) + `\n`
            if (body[ptr] == 0 && body.length - ptr < 4) break // skip final padding
        }
        fnid++
    }

    return r

    function getString(idx: number) {
        let r = uint8ArrayToString(getStringBuf(idx))
        try {
            r = fromUTF8(r)
        } catch {}
        return r
    }

    function getStringBuf(idx: number) {
        return decodeSection(strDesc, idx * BinFmt.SectionHeaderSize, img)
    }
}
