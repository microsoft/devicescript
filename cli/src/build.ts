import { join } from "node:path"
import { existsSync, watch } from "node:fs"
import {
    readFileSync,
    writeFileSync,
    ensureDirSync,
    pathExistsSync,
} from "fs-extra"
const debounce = require("debounce-promise")
import {
    compile,
    jacdacDefaultSpecifications,
    JacsDiagnostic,
    DEVS_BYTECODE_FILE,
    formatDiagnostics,
} from "devicescript-compiler"
import { BINDIR, CmdOptions, debug, error, log } from "./command"
import { devtools } from "./devtools"

function jacsFactory() {
    let d = require("devicescript-vm")
    try {
        require("websocket-polyfill")
        // @ts-ignore
        global.Blob = require("buffer").Blob
    } catch {
        log("can't load websocket-polyfill")
    }
    return d()
}

async function getHost(options: BuildOptions & CmdOptions) {
    const inst = options.noVerify ? undefined : await jacsFactory()
    inst?.jacsInit()

    const outdir = options.outDir
    ensureDirSync(outdir)

    const jacsHost = {
        write: (fn: string, cont: string) => {
            const p = join(outdir, fn)
            if (options.verbose) debug(`write ${p}`)
            writeFileSync(p, cont)
            if (
                fn.endsWith(".jasm") &&
                typeof cont == "string" &&
                cont.indexOf("???oops") >= 0
            )
                throw new Error("bad disassembly")
        },
        log: (msg: string) => {
            if (options.verbose) log(msg)
        },
        error: (err: JacsDiagnostic) => {
            error(formatDiagnostics([err]))
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

export interface BuildOptions {
    noVerify?: boolean
    library?: boolean
    outDir?: string
    watch?: boolean

    // internal option
    mainFileName?: string
}

export async function build(file: string, options: BuildOptions & CmdOptions) {
    file = file || "main.ts"
    options = options || {}
    options.outDir = options.outDir || BINDIR
    options.mainFileName = file

    if (!existsSync(file)) {
        // otherwise we throw
        error(`${file} does not exist`)
        return
    }

    ensureDirSync(options.outDir)
    await buildOnce(file, options)
    if (options.watch) await buildWatch(file, options)
}

async function buildWatch(file: string, options: BuildOptions) {
    const bytecodeFile = join(options.outDir, DEVS_BYTECODE_FILE)

    // start watch source file
    log(`watching ${file}...`)
    const work = debounce(
        async () => {
            debug(`change detected...`)
            await buildOnce(file, options)
        },
        500,
        { leading: true }
    )
    watch(file, work)

    // start watching bytecode file
    await devtools({ ...options, bytecodeFile })
}

async function buildOnce(file: string, options: BuildOptions & CmdOptions) {
    try {
        if (!pathExistsSync(file))
            throw new Error(`source file ${file} not found`)
        const buf = readFileSync(file)
        await compileBuf(buf, { ...options, mainFileName: file })
    } catch (e) {
        if (options.verbose) {
            debug(e.message)
            debug(e.stack)
        }
        throw e
    }
}
