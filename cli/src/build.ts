import { join } from "node:path"
import { watch } from "node:fs"
import { readFileSync, writeFileSync, ensureDirSync } from "fs-extra"
const debounce = require("debounce-promise")
import {
    compile,
    jacdacDefaultSpecifications,
    JacsDiagnostic,
} from "devicescript-compiler"
import { CmdOptions } from "./command"

function jacsFactory() {
    let d = require("devicescript-vm")
    try {
        require("websocket-polyfill")
        // @ts-ignore
        global.Blob = require("buffer").Blob
    } catch {
        console.log("can't load websocket-polyfill")
    }
    return d()
}

async function getHost(options: BuildOptions) {
    const inst = options.noVerify ? undefined : await jacsFactory()
    inst?.jacsInit()

    const outdir = options.outDir || "./built"
    ensureDirSync(outdir)

    const jacsHost = {
        write: (fn: string, cont: string) => {
            const p = join(outdir, fn)
            if (options.verbose) console.debug(`write ${p}`)
            writeFileSync(p, cont)
            if (
                fn.endsWith(".jasm") &&
                typeof cont == "string" &&
                cont.indexOf("???oops") >= 0
            )
                throw new Error("bad disassembly")
        },
        log: (msg: string) => {
            if (options.verbose) console.log(msg)
        },
        error: (err: JacsDiagnostic) => {
            console.error(err)
        },
        mainFileName: () => options.mainFileName || "",
        getSpecs: () => jacdacDefaultSpecifications,
        verifyBytecode: (buf: Uint8Array) => {
            if (!inst) return
            const res = inst.jacsDeploy(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    return jacsHost
}

async function compileBuf(buf: Buffer, options: BuildOptions) {
    const host = await getHost(options)
    const res = compile(buf.toString("utf8"), {
        host,
        isLibrary: options.library,
    })
    if (!res.success) throw new Error("compilation failed")
    return res.binary
}

export interface BuildOptions extends CmdOptions {
    noVerify?: boolean
    library?: boolean
    outDir?: string
    watch?: boolean

    // internal option
    mainFileName?: string
}

export async function build(file: string, options: BuildOptions) {
    await buildOnce(file, options)
    if (options.watch) await buildWatch(file, options)
}

async function buildWatch(file: string, options: BuildOptions) {
    console.log(`watching ${file}...`)
    const work = debounce(
        async () => {
            console.debug(`change detected...`)
            await buildOnce(file, options)
        },
        500,
        { leading: true }
    )
    watch(file, work)
}

async function buildOnce(file: string, options: BuildOptions) {
    try {
        const buf = readFileSync(file)
        await compileBuf(buf, { ...options, mainFileName: file })
    } catch (e) {
        console.error(e.stack)
        throw e
    }
}
