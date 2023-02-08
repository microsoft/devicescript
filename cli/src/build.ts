import { join, resolve } from "node:path"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { ensureDirSync, readJSONSync, mkdirp } from "fs-extra"
import {
    compile,
    jacdacDefaultSpecifications,
    DevsDiagnostic,
    formatDiagnostics,
    DEVS_DBG_FILE,
    prettySize,
    DebugInfo,
    CompileFlags,
    SrcMapResolver,
    preludeFiles,
} from "@devicescript/compiler"
import {
    BINDIR,
    CmdOptions,
    debug,
    error,
    LIBDIR,
    log,
    verboseLog,
} from "./command"

import type { DevsModule } from "@devicescript/vm"
import { readFile, writeFile } from "node:fs/promises"
import { printDmesg } from "./vmworker"

export function readDebugInfo() {
    let dbg: DebugInfo
    try {
        dbg = readJSONSync(join(BINDIR, DEVS_DBG_FILE))
    } catch {}
    return dbg
}

let devsInst: DevsModule
export function setDevsDmesg() {
    if (devsInst) {
        const dbg = readDebugInfo()
        devsInst.dmesg = (s: string) => {
            printDmesg(dbg, "WASM", s)
        }
    }
}

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
        setDevsDmesg()
        m.devsInit()
        return m
    })
}

export async function devsStartWithNetwork(options: {
    tcp?: boolean
    test?: boolean
    deviceId?: string
    gcStress?: boolean
}) {
    const inst = await devsFactory()

    if (options.deviceId) inst.devsSetDeviceId(options.deviceId)

    inst.devsGcStress(!!options.gcStress)

    if (options.tcp)
        await inst.setupNodeTcpSocketTransport(require, "127.0.0.1", 8082)
    else await inst.setupWebsocketTransport("ws://127.0.0.1:8081")

    inst.devsStart()

    return inst
}

export async function getHost(options: BuildOptions & CmdOptions) {
    const inst = options.noVerify ? undefined : await devsFactory()
    const outdir = resolve(options.cwd ?? ".", options.outDir || BINDIR)
    ensureDirSync(outdir)

    const devsHost = {
        write: (fn: string, cont: string) => {
            const p = join(outdir, fn)
            verboseLog(`write ${p}`)
            writeFileSync(p, cont)
            if (
                fn.endsWith(".jasm") &&
                typeof cont == "string" &&
                cont.indexOf("???oops") >= 0
            )
                throw new Error("bad disassembly")
        },
        log: verboseLog,
        error: (err: DevsDiagnostic) => {
            if (!options.quiet) error(formatDiagnostics([err]))
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
    const exists = existsSync(fn)
    if (!exists) throw new Error(`source file "${fn}" not found`)
    const source = readFileSync(fn)
    return compileBuf(source, { ...options, mainFileName: fn })
}

export async function saveLibFiles(options: BuildOptions) {
    const prelude = preludeFiles()
    const pref = resolve(options.cwd ?? ".")
    await mkdirp(join(pref, LIBDIR))
    for (const fn of Object.keys(prelude)) {
        const fnpath = join(pref, fn)
        const ex = await readFile(fnpath, "utf-8").then(
            r => r,
            _ => null
        )
        if (prelude[fn] != ex) await writeFile(fnpath, prelude[fn])
    }
}

export async function compileBuf(buf: Buffer, options: BuildOptions = {}) {
    const host = await getHost(options)
    const flags = (options.flag ?? {}) as CompileFlags
    const res = compile(buf.toString("utf8"), {
        host,
        flags,
    })
    await saveLibFiles(options)
    setDevsDmesg() // set again after we have re-created -dbg.json file
    return res
}

export interface BuildOptions {
    noVerify?: boolean
    outDir?: string
    stats?: boolean
    flag?: Record<string, boolean>
    cwd?: string
    quiet?: boolean

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
}

async function buildOnce(file: string, options: BuildOptions & CmdOptions) {
    const { stats } = options
    const { success, binary, dbg } = await compileFile(file, options)
    if (!success) throw new CompilationError("compilation failed")

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
