import {
    DeviceConfig,
    ArchConfig,
    serializeDcfg,
    decodeDcfg,
    decompileDcfg,
    DcfgSettings,
    parseAnyInt,
    UF2File,
    DCFG_MAGIC0,
    DCFG_MAGIC1,
    expandDcfgJSON,
    jsonToDcfg,
} from "@devicescript/compiler"
import { HexInt, RepoInfo } from "@devicescript/srvcfg"
import { readFile, writeFile } from "fs/promises"
import { JSONTryParse, read32, toHex } from "jacdac-ts"
import { basename, dirname, join, resolve } from "path"
import { error, isVerbose, log, verboseLog } from "./command"
import { EspImage } from "./esp"

export interface FileTypes {
    uf2?: string
    bin?: string
    esp?: string
}

export interface BinPatchOptions extends FileTypes {
    slug?: string
    outdir?: string
    elf?: string
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
    const off0 = parseAnyInt(arch.dcfgOffset)
    const shift = parseAnyInt(arch.binFlashOffset) ?? 0
    const off = off0 - shift
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

export async function compileDcfgFile(fn: string) {
    if (!fn.endsWith(".board.json"))
        throw new Error("board file has to match *.board.json")
    const folder = dirname(fn)
    const readF = (f: string) => readFile(resolve(folder, f), "utf-8")
    const arch: ArchConfig = JSONTryParse(await readF("arch.json"))
    if (arch?.dcfgOffset === undefined || arch?.id === undefined)
        throw new Error(`no dcfgOffset or id in arch.json`)
    const json: DeviceConfig = await expandDcfgJSON(basename(fn), readF)
    json.id = basename(fn, ".board.json")
    json.archId = arch.id
    try {
        const dcfg = jsonToDcfg(json, true)
        if (!dcfg["devName"]) throw new Error(`no devName`)
        if (!dcfg["devClass"]) throw new Error(`no devClass`)
        if (isVerbose) {
            verboseLog(JSON.stringify(dcfg, null, 4))
            const ser = serializeDcfg(dcfg)
            const dec = decodeDcfg(ser)
            verboseLog(dec.errors.join("\n"))
            verboseLog(JSON.stringify(decompileDcfg(dec.settings), null, 4))
        }
        return { json, dcfg, arch }
    } catch (e) {
        throw new Error(`${fn}: ${e.message}`)
    }
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
    const outext = options.uf2 ? ".uf2" : ".bin"
    const binext = (off: HexInt) => {
        const v = parseAnyInt(off)
        return v == undefined ? outext : `-0x${v.toString(16)}${outext}`
    }

    const infoPath = join(outpath, "info.json")

    const info: RepoInfo = {
        archs: {},
        boards: {},
    }

    if (options.slug) info.repoUrl = "https://github.com/" + options.slug

    const ex: RepoInfo = JSONTryParse(
        await readFile(infoPath, "utf-8").then(
            r => r,
            _ => ""
        )
    )
    if (ex) Object.assign(info, ex)

    try {
        for (const fn of files) {
            log(`processing ${fn}...`)
            const { dcfg, json, arch } = await compileDcfgFile(fn)
            const suff = binext(arch.binFlashOffset)
            const outname = (devid: string, ext = suff) =>
                join(outpath, `devicescript-${arch.id}-${devid}${ext}`)
            const patched = await patchFile(binFileBuf, arch, dcfg)
            const outp = outname(json.id)
            if (info.repoUrl)
                json.$fwUrl =
                    info.repoUrl + "/releases/latest/download/" + basename(outp)
            log(`writing ${outp}: ${patched.length} bytes`)
            await writeFile(outp, patched)
            if (options.generic || arch.binGenericFlashOffset !== undefined) {
                const offpatched = parseAnyInt(arch.binFlashOffset)
                const offgen = parseAnyInt(arch.binGenericFlashOffset)
                let off = 0
                if (offgen !== undefined) off = offgen - offpatched
                await writeFile(
                    outname("generic", binext(offgen ?? offpatched)),
                    binFileBuf.slice(off)
                )
                const elfFileBuf = await readFile(
                    options.elf ?? binFn.replace(/\.[^\.]+$/, ".elf")
                )
                await writeFile(outname("generic", ".elf"), elfFileBuf)
            }
            info.archs[arch.id] = arch
            info.boards[json.id] = json
        }
    } catch (e) {
        verboseLog(e.stack)
        fatal(e.message)
    }

    await writeFile(infoPath, JSON.stringify(info))
    await writeFile(
        join(outpath, "info.md"),
        boardInfos(info)
            .map(b => b.markdown)
            .join("\n\n")
    )
}

export function boardInfos(info: RepoInfo) {
    return Object.values(info.boards).map(b =>
        boardInfo(b, info.archs[b.archId])
    )
}

export interface BoardInfo {
    name: string
    arch: string
    description: string
    urls: { info: string; firmware: string } & Record<string, string>
    features: string[]
    services: string[]
    markdown: string
}

export function boardInfo(cfg: DeviceConfig, arch?: ArchConfig): BoardInfo {
    const features: string[] = []

    const conn = (c: { $connector?: string }) =>
        c?.$connector ? ` using ${c.$connector} connector` : ``

    if (cfg.jacdac?.pin !== undefined)
        features.push(`Jacdac on ${cfg.jacdac.pin}${conn(cfg.jacdac)}`)

    if (cfg.i2c?.pinSDA !== undefined) {
        features.push(
            `I2C on SDA/SCL: ${cfg.i2c.pinSDA}/${cfg.i2c.pinSCL}${conn(
                cfg.i2c
            )}`
        )
    }

    if (cfg.led) {
        if (cfg.led.type === 1)
            features.push(`WS2812B RGB LED on ${cfg.led.pin}`)
        else if (cfg.led.rgb?.length == 3)
            features.push(
                `RGB LED on pins ${cfg.led.rgb.map(l => l.pin).join(", ")}`
            )
        else if (cfg.led.pin !== undefined)
            features.push(`LED on pin ${cfg.led.pin}`)
    }

    if (cfg.log?.pinTX !== undefined)
        features.push(
            `serial logging on ${cfg.log.pinTX} at ${
                cfg.log.baud || 115200
            } 8N1`
        )

    const services = (cfg._ ?? []).map(s => {
        let r = s.name
        if (s.service != s.name) r += ` (${s.service})`
        return r
    })

    const b: BoardInfo = {
        name: cfg.devName.replace(/\s*DeviceScript\s*/i, " "),
        arch: arch?.name,
        description: cfg.$description,
        urls: {
            info: cfg.url,
            firmware: cfg.$fwUrl,
        },
        features,
        services,
        markdown: "",
    }

    const lines = [`## ${b.name}`, b.description]
    const urlkeys = Object.keys(b.urls || {}).filter(k => !!b.urls[k])
    if (urlkeys.length)
        lines.push(
            "Links: " + urlkeys.map(k => `[${k}](${b.urls[k]})`).join(" ")
        )
    lines.push(...b.features.map(f => `* ${f}`))
    lines.push(...b.services.map(f => `* Service: ${f}`))
    b.markdown = lines.filter(l => !!l).join("\n")

    return b
}
