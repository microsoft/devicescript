import {
    DeviceConfig,
    ArchConfig,
    patchBinFile,
    patchUF2File,
    compileDcfg,
    serializeDcfg,
    decodeDcfg,
    decompileDcfg,
} from "@devicescript/compiler"
import { readFile, writeFile } from "fs/promises"
import { JSONTryParse } from "jacdac-ts"
import { basename, dirname, join } from "path"
import { error, isVerbose, log, verboseLog } from "./command"

export interface BinPatchOptions {
    uf2?: string
    bin?: string
    outdir?: string
    generic?: boolean
}

function fatal(msg: string) {
    error("fatal: " + msg)
    process.exit(1)
}

export async function binPatch(
    files: string[],
    options: BinPatchOptions,
    rest: any
) {
    const binFn = options.uf2 ?? options.bin
    if ((options.uf2 && options.bin) || !binFn)
        fatal("need exactly one of --uf2 or --bin")
    const binFileBuf = await readFile(binFn)
    const patchFile = options.uf2 ? patchUF2File : patchBinFile
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
        const patched = patchFile(binFileBuf, arch, compiled)
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
