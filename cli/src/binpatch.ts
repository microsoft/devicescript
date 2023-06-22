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
    boardInfos,
    RepoInfo,
    pinsInfo,
} from "@devicescript/compiler"
import { JSON5TryParse } from "@devicescript/interop"
import { HexInt } from "@devicescript/srvcfg"
import { readFile, writeFile } from "fs/promises"
import { read32, toHex } from "jacdac-ts"
import { basename, dirname, join, resolve } from "path"
import { error, isVerbose, log, verboseLog } from "./command"

export interface FileTypes {
    uf2?: string
    bin?: string
}

export interface BinPatchArgs {
    binary: Uint8Array // UF2 or BIN file
    type: keyof FileTypes
    arch: ArchConfig
    board: DeviceConfig
    dcfg?: DcfgSettings
    fstor?: Uint8Array
}

export interface BinPatchOptions extends FileTypes {
    slug?: string
    outdir?: string
    elf?: string
    generic?: boolean
    fake?: boolean
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

async function patchUF2File(args: BinPatchArgs) {
    const { binary, arch, board, fstor, dcfg } = args

    if (!UF2File.isUF2(binary)) throw new Error("not a UF2 file")

    const f = UF2File.fromFile(binary)

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

    if (dcfg) {
        const dcfgOff = parseAnyInt(arch.dcfgOffset)
        let dcfgBuf = serializeDcfg(dcfg)

        const tmp = f.readBytes(dcfgOff, 12)
        if (tmp) {
            if (isDCFG(tmp)) {
                log(`patching existing config`)
                dcfgBuf = padCfg(dcfgBuf, read32(tmp, 8))
            } else {
                throw new Error(`data already at DCFG`)
            }
        }

        f.writeBytes(dcfgOff, dcfgBuf)
    }

    if (fstor) {
        const fstorOff = parseAnyInt(board.fstorOffset ?? arch.fstorOffset)
        if (f.readBytes(fstorOff, 4))
            throw new Error(`data already at flash offset`)
        f.writeBytes(fstorOff, fstor)
    }

    return f.serialize()
}

function padCfg(cfg: Uint8Array, minsz: number) {
    if (minsz > 1024 * 1024) throw new Error("too large config!")
    const res = new Uint8Array(Math.max(cfg.length, minsz))
    res.set(cfg)
    return res
}

async function patchBinFile(args: BinPatchArgs) {
    const { binary, arch, dcfg, board, fstor } = args
    const shift = parseAnyInt(arch.binFlashOffset) ?? 0
    const dcfgOff = parseAnyInt(arch.dcfgOffset) - shift
    const fstorOff = parseAnyInt(board.fstorOffset ?? arch.fstorOffset) - shift
    const pageSize = board.flashPageSize ?? arch.flashPageSize ?? 4096
    let dcfgBuf = dcfg ? serializeDcfg(dcfg) : null

    if (UF2File.isUF2(binary)) throw new Error("expecting BIN, not UF2 file")
    if (dcfgOff > 16 * 1024 * 1024) throw new Error("offset too large for BIN")
    if (fstorOff > 16 * 1024 * 1024)
        throw new Error("fstor offset too large for BIN")

    let minSize = binary.length
    if (dcfg) minSize = Math.max(minSize, dcfgOff + dcfgBuf.length)
    if (fstor) minSize = Math.max(minSize, fstorOff + fstor.length)
    minSize = (minSize + (pageSize - 1)) & ~(pageSize - 1)

    verboseLog(`size: ${binary.length} -> ${minSize} bytes`)

    const output = new Uint8Array(minSize)
    output.fill(0xff)
    output.set(binary)

    if (dcfg) {
        if (isDCFG(output, dcfgOff)) {
            verboseLog("patching existing")
            dcfgBuf = padCfg(dcfgBuf, read32(output, dcfgOff + 8))
        } else {
            const slice = toHex(output.slice(dcfgOff, dcfgOff + 8))
            if (slice == "0000000000000000" || slice == "ffffffffffffffff")
                verboseLog("patching 00 or ff")
            else throw new Error("data already at patch point!")
        }
        output.set(dcfgBuf, dcfgOff)
    }

    if (fstor) {
        for (let i = 0; i < fstor.length; ++i)
            if (output[fstorOff + i] != 0x00 && output[fstorOff + i] != 0xff)
                throw new Error("data already at fstor patch point!")
        output.set(fstor, fstorOff)
    }

    return output
}

function compileBoard(arch: ArchConfig, devcfg: DeviceConfig) {
    const dcfg = jsonToDcfg(devcfg, true)
    if (!dcfg["devName"]) throw new Error(`no devName`)
    if (!dcfg["productId"]) throw new Error(`no productId`)
    const { desc, errors } = pinsInfo(arch, devcfg)
    if (errors.length) throw new Error(errors.join("\n"))
    if (isVerbose) {
        verboseLog(desc)
        verboseLog(JSON.stringify(dcfg, null, 4))
        const ser = serializeDcfg(dcfg)
        const dec = decodeDcfg(ser)
        verboseLog(dec.errors.join("\n"))
        verboseLog(JSON.stringify(decompileDcfg(dec.settings), null, 4))
    } else if (devcfg.$custom) {
        log(desc)
    }
    return dcfg
}

export async function compileDcfgFile(fn: string) {
    if (!fn.endsWith(".board.json"))
        throw new Error("board file has to match *.board.json")
    const folder = dirname(fn)
    const readF = (f: string) => readFile(resolve(folder, f), "utf-8")
    const arch: ArchConfig = JSON5TryParse(await readF("arch.json"))
    if (arch?.dcfgOffset === undefined || arch?.id === undefined)
        throw new Error(`no dcfgOffset or id in arch.json`)
    const json: DeviceConfig = await expandDcfgJSON(basename(fn), readF)
    for (const s of json.$services ?? []) {
        if (!s.name) s.name = s.service
    }
    for (const s of json.services ?? []) {
        if (!s.name) s.name = s.service
    }
    json.id = basename(fn, ".board.json")
    json.archId = arch.id
    try {
        const dcfg = compileBoard(arch, json)
        return { json, dcfg, arch }
    } catch (e) {
        throw new Error(`${fn}: ${e.message}`)
    }
}

const patch: Record<
    keyof FileTypes,
    (args: BinPatchArgs) => Promise<Uint8Array>
> = {
    bin: patchBinFile,
    uf2: patchUF2File,
}

export async function patchCustomBoard(
    fn: string,
    board: DeviceConfig,
    arch: ArchConfig
) {
    board.$custom = true
    const dcfg = compileBoard(arch, board)
    const type = fn.replace(/.*\./, "") as keyof FileTypes
    if (!patch[type]) throw new Error(`unknown file format: ${type}`)
    const binary = await readFile(fn)
    return await patchFile({ type, binary, arch, board, dcfg })
}

export async function patchFstorToBoard(
    fn: string,
    board: DeviceConfig,
    arch: ArchConfig,
    fstor: Uint8Array
) {
    const type = fn.replace(/.*\./, "") as keyof FileTypes
    if (!patch[type]) throw new Error(`unknown file format: ${type}`)
    const binary = await readFile(fn)
    return await patchFile({ type, binary, arch, board, fstor })
}

async function patchFile(args: BinPatchArgs) {
    const f = patch[args.type]
    return f(args)
}

export async function binPatch(files: string[], options: BinPatchOptions) {
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

    const binary = options.fake ? null : await readFile(binFn)
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

    const ex: RepoInfo = JSON5TryParse(
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
            const outp = outname(json.id)
            if (info.repoUrl)
                json.$fwUrl =
                    info.repoUrl + "/releases/latest/download/" + basename(outp)
            info.archs[arch.id] = arch
            info.boards[json.id] = json
            if (options.fake) continue

            const patched = await patchFile({
                type: ft,
                binary,
                arch,
                board: json,
                dcfg,
            })
            log(`writing ${outp}: ${patched.length} bytes`)
            await writeFile(outp, patched)
            if (options.generic || arch.binGenericFlashOffset !== undefined) {
                const offpatched = parseAnyInt(arch.binFlashOffset)
                const offgen = parseAnyInt(arch.binGenericFlashOffset)
                let off = 0
                if (offgen !== undefined) off = offgen - offpatched
                await writeFile(
                    outname("generic", binext(offgen ?? offpatched)),
                    binary.slice(off)
                )
                const elfFileBuf = await readFile(
                    options.elf ?? binFn.replace(/\.[^\.]+$/, ".elf")
                )
                await writeFile(outname("generic", ".elf"), elfFileBuf)
            }
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
