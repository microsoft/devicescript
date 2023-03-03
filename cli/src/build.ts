import { basename, join, relative, resolve } from "node:path"
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { ensureDirSync, readJSONSync, mkdirp } from "fs-extra"
import {
    compileWithHost,
    jacdacDefaultSpecifications,
    DevsDiagnostic,
    formatDiagnostics,
    DEVS_DBG_FILE,
    prettySize,
    DebugInfo,
    CompileFlags,
    SrcMapResolver,
    preludeFiles,
    Host,
    LocalBuildConfig,
    ResolvedBuildConfig,
    resolveBuildConfig,
    DeviceConfig,
    RepoInfo,
    pinsInfo,
    CompilationResult,
} from "@devicescript/compiler"
import {
    BINDIR,
    CmdOptions,
    consoleColors,
    debug,
    error,
    GENDIR,
    LIBDIR,
    log,
    verboseLog,
} from "./command"

import type { DevsModule } from "@devicescript/vm"
import { readFile, writeFile } from "node:fs/promises"
import { printDmesg } from "./vmworker"
import { EXIT_CODE_COMPILATION_ERROR } from "./exitcodes"
import { converters, parseServiceSpecificationMarkdownToJSON } from "jacdac-ts"

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

export async function getHost(
    buildConfig: ResolvedBuildConfig,
    options: BuildOptions & CmdOptions,
    folder: string
) {
    const inst = options.verify === false ? undefined : await devsFactory()
    const outdir = resolve(options.cwd ?? ".", options.outDir || BINDIR)
    ensureDirSync(outdir)
    const devsHost: Host = {
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
        read: (fn: string) => {
            // verboseLog(`read ${fn} ${resolve(folder, fn)}`)
            return readFileSync(resolve(folder, fn), "utf-8")
        },
        resolvePath: fn => resolve(fn),
        relativePath: fn => relative(resolve("."), fn),
        log: verboseLog,
        isBasicOutput: () => !consoleColors,
        error: (err: DevsDiagnostic) => {
            if (!options.quiet)
                console.error(formatDiagnostics([err], !consoleColors))
        },
        getFlags: () => options.flag ?? {},
        getConfig: () => buildConfig,
        verifyBytecode: (buf: Uint8Array) => {
            if (!inst) return
            const res = inst.devsVerify(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    return devsHost
}
function toDevsDiag(d: jdspec.Diagnostic): DevsDiagnostic {
    return {
        category: 1,
        code: 9998,
        file: undefined,
        filename: d.file,
        start: 0,
        length: 1,
        messageText: d.message,
        line: d.line,
        column: 1,
        endLine: d.line,
        endColumn: 100,
        formatted: "",
    }
}

function compileServiceSpecs(
    tsdir: string,
    lcfg: LocalBuildConfig,
    errors: DevsDiagnostic[]
) {
    const dir = join(tsdir, "services")
    lcfg.addServices = []

    if (existsSync(dir)) {
        const includes: Record<string, jdspec.ServiceSpec> = {}
        jacdacDefaultSpecifications.forEach(
            spec => (includes[spec.shortId] = spec)
        )
        const markdowns = readdirSync(dir, { encoding: "utf-8" }).filter(
            fn => /\.md$/i.test(fn) && !/README\.md$/i.test(fn)
        )
        for (const mdf of markdowns) {
            const fn = join(dir, mdf)
            const content = readFileSync(fn, { encoding: "utf-8" })
            const json = parseServiceSpecificationMarkdownToJSON(
                content,
                includes,
                fn
            )
            json.catalog = false
            if (json?.errors?.length)
                errors.push(...json.errors.map(toDevsDiag))
            else {
                includes[json.shortId] = json
                verboseLog(`custom service: ${json.shortName}`)
                lcfg.addServices.push(json)
            }
        }
    }
}

export function validateBoard(board: DeviceConfig, baseCfg: RepoInfo) {
    const bid = board.id
    if (!/^\w+$/.test(bid)) throw new Error(`invalid identifier: ${bid}`)
    board.id = bid
    const arch = baseCfg.archs[board.archId]
    if (!arch) throw new Error(`board.archId ${board.archId} is invalid`)
    if (baseCfg.boards[bid]) throw new Error(`board ${bid} already defined`)
    if ((+board.productId & 0xf000_0000) != 0x3000_0000)
        throw new Error(`invalid productId ${board.productId}`)
    const { desc, errors } = pinsInfo(arch, board)
    verboseLog(desc)
    if (errors.length) throw new Error(errors.join("\n"))
}

function compileBoards(
    tsdir: string,
    lcfg: LocalBuildConfig,
    errors: DevsDiagnostic[]
) {
    const dir = join(tsdir, "boards")
    lcfg.addBoards = []
    const baseCfg = resolveBuildConfig()

    if (existsSync(dir)) {
        const boards = readdirSync(dir, { encoding: "utf-8" }).filter(fn =>
            fn.endsWith(".board.json")
        )
        for (const boardFn of boards) {
            const fullName = join(dir, boardFn)
            try {
                const board: DeviceConfig = JSON.parse(
                    readFileSync(fullName, "utf-8")
                )
                const bid = basename(boardFn, ".board.json")
                if (board.id && board.id != bid)
                    throw new Error("ignoring id: field in favor of filename")
                board.id = bid
                validateBoard(board, baseCfg)
                verboseLog(`custom board: ${board.id}`)
                lcfg.addBoards.push(board)
            } catch (e) {
                errors.push(
                    toDevsDiag({
                        file: fullName,
                        line: 1,
                        message: e.message,
                    })
                )
            }
        }
    }
}

export class CompilationError extends Error {
    static NAME = "CompilationError"
    constructor(message: string) {
        super(message)
        this.name = CompilationError.NAME
    }
}

export function buildConfigFromDir(dir: string, options: BuildOptions = {}) {
    const lcfg: LocalBuildConfig = {}
    const errors: DevsDiagnostic[] = []

    if (dir) {
        compileServiceSpecs(dir, lcfg, errors)
        compileBoards(dir, lcfg, errors)
        if (!options.quiet)
            for (const e of errors)
                console.error(`${e.filename}(${e.line}): ${e.messageText}`)
    }

    return {
        buildConfig: resolveBuildConfig(lcfg),
        errors,
    }
}

export async function compileFile(
    fn: string,
    options: BuildOptions = {}
): Promise<CompilationResult> {
    const exists = existsSync(fn)
    if (!exists) throw new Error(`source file "${fn}" not found`)

    if (
        !existsSync("./devsconfig.json") &&
        !existsSync("./devs/run-tests/basic.ts") // hack for in-tree testing
    )
        throw new Error("./devsconfig.json file not found")

    const folder = resolve(".")
    const { errors, buildConfig } = buildConfigFromDir(folder, options)
    const host = await getHost(buildConfig, options, folder)

    const res = compileWithHost(fn, host)

    await saveLibFiles(buildConfig, options)
    setDevsDmesg() // set again after we have re-created -dbg.json file

    if (errors.length) {
        res.diagnostics.unshift(...errors)
        res.success = false
    }

    return res
}

export async function saveLibFiles(
    buildConfig: ResolvedBuildConfig,
    options: BuildOptions
) {
    // pass the user-provided services so they are included in devicescript-specs.d.ts
    const prelude = preludeFiles(buildConfig)

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

    // generate constants for non-catalog services
    const customServices =
        buildConfig.services.filter(srv => srv.catalog !== undefined) || []
    // generate source files
    for (const lang of ["ts", "c"]) {
        const converter = converters()[lang]
        let constants = ""
        for (const srv of customServices) {
            constants += converter(srv) + "\n"
        }
        const dir = join(pref, GENDIR, lang)
        await mkdirp(dir)
        await writeFile(join(dir, `constants.${lang}`), constants, {
            encoding: "utf-8",
        })
    }
    // json specs
    {
        const dir = join(pref, GENDIR)
        await mkdirp(dir)
        await writeFile(
            join(dir, `services.json`),
            JSON.stringify(customServices, null, 2),
            {
                encoding: "utf-8",
            }
        )
    }
}

export interface BuildOptions {
    verify?: boolean
    outDir?: string
    stats?: boolean
    flag?: CompileFlags
    cwd?: string
    quiet?: boolean
}

export async function build(file: string, options: BuildOptions & CmdOptions) {
    file = file || "src/main.ts"
    options.outDir = options.outDir || BINDIR

    if (!existsSync(file)) {
        // otherwise we throw
        error(`${file} does not exist`)
        return
    }

    // log(`building ${file}`)
    ensureDirSync(options.outDir)
    try {
        await buildOnce(file, options)
    } catch (e) {
        if (e.name === CompilationError.NAME)
            process.exit(EXIT_CODE_COMPILATION_ERROR)
    }
}

async function buildOnce(file: string, options: BuildOptions & CmdOptions) {
    const { stats } = options
    const { success, binary, dbg } = await compileFile(file, options)
    if (!success) throw new CompilationError("compilation failed")

    if (stats) {
        log(`bytecode: ${prettySize(binary.length)}`)
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
