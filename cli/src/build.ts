import { join } from "node:path"
import { existsSync, watch } from "node:fs"
import {
    readFileSync,
    writeFileSync,
    ensureDirSync,
    pathExistsSync,
    readJSONSync,
    mkdirp,
} from "fs-extra"
const debounce = require("debounce-promise")
import {
    compile,
    jacdacDefaultSpecifications,
    DevsDiagnostic,
    DEVS_BYTECODE_FILE,
    formatDiagnostics,
    DEVS_DBG_FILE,
    prettySize,
    DebugInfo,
    parseStackFrame,
    CompileFlags,
    SrcMapResolver,
    preludeFiles,
} from "@devicescript/compiler"
import { BINDIR, CmdOptions, debug, error, LIBDIR, log } from "./command"
import { devtools } from "./devtools"

import type { DevsModule } from "@devicescript/vm"
import { readFile, writeFile } from "node:fs/promises"

export function readDebugInfo() {
    let dbg: DebugInfo
    try {
        dbg = readJSONSync(join(BINDIR, DEVS_DBG_FILE))
    } catch {}
    return dbg
}

let devsInst: DevsModule
export function devsFactory() {
    // emscripten doesn't like multiple instances
    if (devsInst) return Promise.resolve(devsInst)
    const d = require("@devicescript/vm")
    try {
        require("websocket-polyfill")
        // @ts-ignore
        global.Blob = require("buffer").Blob
    } catch {
        log("can't load websocket-polyfill")
    }

    return (d() as Promise<DevsModule>).then(m => {
        devsInst = m
        const dbg = readDebugInfo()
        if (dbg)
            m.dmesg = (s: string) => {
                console.debug(parseStackFrame(dbg, s).markedLine)
            }
        m.devsInit()
        return m
    })
}

export async function getHost(options: BuildOptions & CmdOptions) {
    const inst = options.noVerify ? undefined : await devsFactory()
    const outdir = options.outDir || BINDIR
    ensureDirSync(outdir)

    const devsHost = {
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
        error: (err: DevsDiagnostic) => {
            error(formatDiagnostics([err]))
        },
        mainFileName: () => options.mainFileName || "main.ts",
        getSpecs: () => jacdacDefaultSpecifications,
        verifyBytecode: (buf: Uint8Array) => {
            if (!inst) return
            const res = inst.devsVerify(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    return devsHost
}

export class CompilationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "CompilationError"
    }
}

export async function compileFile(fn: string, options: BuildOptions = {}) {
    if (!pathExistsSync(fn)) throw new Error(`source file ${fn} not found`)
    return compileBuf(readFileSync(fn), { ...options, mainFileName: fn })
}

export async function saveLibFiles() {
    const prelude = preludeFiles()
    await mkdirp(LIBDIR)
    for (const fn of Object.keys(prelude)) {
        const ex = await readFile(fn, "utf-8").then(
            r => r,
            _ => null
        )
        if (prelude[fn] != ex) await writeFile(fn, prelude[fn])
    }
}

export async function compileBuf(buf: Buffer, options: BuildOptions = {}) {
    const host = await getHost(options)
    const flags = (options.flag ?? {}) as CompileFlags
    const res = compile(buf.toString("utf8"), {
        host,
        flags,
    })
    await saveLibFiles()
    return res
}

export interface BuildOptions {
    noVerify?: boolean
    outDir?: string
    watch?: boolean
    stats?: boolean
    flag?: Record<string, boolean>

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

    // log(`building ${file}`)
    ensureDirSync(options.outDir)
    await buildOnce(file, options)
    // if (options.watch) await buildWatch(file, options)
}

async function buildOnce(file: string, options: BuildOptions & CmdOptions) {
    const { watch, stats } = options
    const { success, binary, dbg } = await compileFile(file, options)
    if (!success) {
        if (watch) return
        throw new CompilationError("compilation failed")
    }

    log(`bytecode: ${prettySize(binary.length)}`)
    if (stats) {
        const { sizes, functions } = dbg
        log(
            "  " +
                Object.keys(sizes)
                    .map(name => `${name}: ${prettySize(sizes[name])}`)
                    .join(", ")
        )
        log(`  functions:`)
        const resolver = SrcMapResolver.from(dbg)
        functions
            .sort((l, r) => l.size - r.size)
            .forEach(fn => {
                log(`  ${fn.name} (${prettySize(fn.size)})`)
                fn.users.forEach(user =>
                    debug(`    <-- ${resolver.posToString(user[0])}`)
                )
            })
    }
}
