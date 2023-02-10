/// <reference path="../../runtime/jacdac-c/dcfg/srvcfg.d.ts" />

import { ArchConfig, DeviceConfig } from "@devicescript/srvcfg"
import { serializeDcfg, parseAnyInt, DcfgSettings } from "./dcfg"
import { UF2File } from "./uf2"

export function patchUF2File(
    uf2: Uint8Array,
    arch: ArchConfig,
    devcfg: DcfgSettings
) {
    const off = parseAnyInt(arch.dcfgOffset)
    const buf = serializeDcfg(devcfg)

    if (!UF2File.isUF2(uf2)) throw new Error("not a UF2 file")

    const f = UF2File.fromFile(uf2)
    f.writeBytes(off, buf)
    return f.serialize()
}

export function patchBinFile(
    binFile: Uint8Array,
    arch: ArchConfig,
    devcfg: DcfgSettings
) {
    const off = parseAnyInt(arch.dcfgOffset)
    const buf = serializeDcfg(devcfg)

    if (UF2File.isUF2(binFile)) throw new Error("expecting BIN, not UF2 file")
    if (off > 16 * 1024 * 1024) throw new Error("offset too large for BIN")
    if (binFile.length > off) throw new Error("file too large?")

    const res = new Uint8Array(off + buf.length)
    res.fill(0xff)
    res.set(binFile)
    res.set(buf, off)
    return res
}

export type { ArchConfig, DeviceConfig }
