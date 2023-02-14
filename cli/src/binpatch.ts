import {
    DeviceConfig,
    ArchConfig,
    compileDcfg,
    serializeDcfg,
    decodeDcfg,
    decompileDcfg,
    DcfgSettings,
    parseAnyInt,
    UF2File,
    DCFG_MAGIC0,
    DCFG_MAGIC1,
} from "@devicescript/compiler"
import { readFile, writeFile } from "fs/promises"
import { JSONTryParse, read32, toHex } from "jacdac-ts"
import { basename, dirname, join } from "path"
import { error, isVerbose, log, verboseLog } from "./command"
import { EspImage } from "./esp"

export interface FileTypes {
    uf2?: string
    bin?: string
    esp?: string
}

export interface BinPatchOptions extends FileTypes {
    outdir?: string
    generic?: boolean
}

function fatal(msg: string) {
    error("fatal: " + msg)
    process.exit(1)
}

function isDCFG(data: Uint8Array, off = 0) {
    return (
        read32(data, off) == DCFG_MAGIC0 && read32(data, off + 4) == DCFG_MAGIC1
    )
}

async function patchUF2File(
    uf2: Uint8Array,
    arch: ArchConfig,
    devcfg: DcfgSettings
) {
    const off = parseAnyInt(arch.dcfgOffset)
    const buf = serializeDcfg(devcfg)

    if (!UF2File.isUF2(uf2)) throw new Error("not a UF2 file")

    const f = UF2File.fromFile(uf2)

    // needed for RP2040-E14
    const align = parseAnyInt(arch.uf2Align)
    if (align) {
        const amask = align - 1
        let maxAddr = 0
        for (const b of f.fromBlocks) {
            maxAddr = Math.max(b.targetAddr + b.payloadSize, maxAddr)
        }
        if (maxAddr & amask) {
            const left = align - (maxAddr & amask)
            const filler = new Uint8Array(left)
            filler.fill(0xff)
            f.writeBytes(maxAddr, filler)
        }
    }

    //const aligned = new Uint8Array((buf.length + amask) & ~amask)
    //aligned.set(buf)

    f.writeBytes(off, buf)
    return f.serialize()
}

async function patchBinFile(
    binFile: Uint8Array,
    arch: ArchConfig,
    devcfg: DcfgSettings
) {
    const off = parseAnyInt(arch.dcfgOffset)
    const buf = serializeDcfg(devcfg)

    if (UF2File.isUF2(binFile)) throw new Error("expecting BIN, not UF2 file")
    if (off > 16 * 1024 * 1024) throw new Error("offset too large for BIN")
    if (binFile.length > off) {
        if (isDCFG(binFile, off)) verboseLog("patching existing")
        else if (
            toHex(binFile.slice(off, off + 8)) == "0000000000000000" ||
            toHex(binFile.slice(off, off + 8)) == "ffffffffffffffff"
        )
            verboseLog("patching 00 or ff")
        else throw new Error("data already at patch point!")
        const res = new Uint8Array(binFile)
        res.set(buf, off)
        return res
    } else {
        verboseLog("appending to existing file")
    }

    const res = new Uint8Array(off + buf.length)
    res.fill(0xff)
    res.set(binFile)
    res.set(buf, off)
    return res
}

async function patchEspFile(
    binFile: Uint8Array,
    arch: ArchConfig,
    devcfg: DcfgSettings
) {
    if (UF2File.isUF2(binFile)) throw new Error("expecting BIN, not UF2 file")

    let imgoffset = 0
    let img = EspImage.fromBuffer(binFile)
    if (!img.looksValid) {
        imgoffset = 0x10000
        img = EspImage.fromBuffer(binFile.slice(imgoffset))
    }
    if (!img.looksValid) throw new Error("image doesn't look valid")

    verboseLog(`patching at 0x${imgoffset.toString(16)}`)

    const cfgoff = parseAnyInt(arch.dcfgOffset)

    const seg = img.getLastDROM()
    const exoff = cfgoff - seg.addr

    if (isDCFG(seg.data, exoff)) {
        verboseLog("patching existing config")
    } else {
        if (seg.data.length > exoff)
            throw new Error(
                `no space for dcfg; ${seg.data.length - exoff} B missing\n` +
                    img.toString()
            )
    }

    const cfg = serializeDcfg(devcfg)
    const newdata = new Uint8Array(exoff + cfg.length)
    newdata.set(seg.data)
    newdata.set(cfg, exoff)
    seg.data = newdata

    const res = await img.toBuffer()
    return binFile
    // return bufferConcat(binFile.slice(0, imgoffset), res)
}

export async function binPatch(files: string[], options: BinPatchOptions) {
    const patch: Record<
        keyof FileTypes,
        (
            binFile: Uint8Array,
            arch: ArchConfig,
            devcfg: DcfgSettings
        ) => Promise<Uint8Array>
    > = {
        bin: patchBinFile,
        uf2: patchUF2File,
        esp: patchEspFile,
    }

    let binFn = ""
    let ft: keyof FileTypes = undefined
    for (const k of Object.keys(patch) as (keyof FileTypes)[]) {
        const opt = options[k]
        if (!opt) continue
        if (ft) fatal(`both --${ft} and --${k} provided`)
        ft = k
        binFn = opt
    }

    if (!ft) fatal("no file type provided")

    const binFileBuf = await readFile(binFn)
    const patchFile = patch[ft]
    const outpath = options.outdir || "dist"
    const outext = options.uf2 ? "uf2" : "bin"

    for (const fn of files) {
        log(`processing ${fn}...`)
        if (!fn.endsWith(".board.json")) fatal("file has to match *.board.json")
        const devid = basename(fn, ".board.json")
        const json: DeviceConfig = JSONTryParse(await readFile(fn, "utf-8"))
        if (!json?.devName) fatal(`no devName in ${fn}`)
        const archName = join(dirname(fn), "arch.json")
        const arch: ArchConfig = JSONTryParse(await readFile(archName, "utf-8"))
        if (arch?.dcfgOffset === undefined)
            fatal(`no dcfgOffset in ${archName}`)
        const outname = (devid: string, ext = outext) =>
            join(outpath, `devicescript-${arch.id}-${devid}.${ext}`)
        const compiled = await compileDcfg(fn, f => readFile(f, "utf-8"))
        if (isVerbose) {
            verboseLog(JSON.stringify(compiled, null, 4))
            const ser = serializeDcfg(compiled)
            const dec = decodeDcfg(ser)
            verboseLog(dec.errors.join("\n"))
            verboseLog(JSON.stringify(decompileDcfg(dec.settings), null, 4))
        }
        const patched = await patchFile(binFileBuf, arch, compiled)
        const outp = outname(devid)
        log(`writing ${outp}: ${patched.length} bytes`)
        await writeFile(outp, patched)
        if (options.generic) {
            await writeFile(outname("generic"), binFileBuf)
            const elfFileBuf = await readFile(
                binFn.replace(/\.[^\.]+$/, ".elf")
            )
            await writeFile(outname("generic", "elf"), elfFileBuf)
        }
    }
}
