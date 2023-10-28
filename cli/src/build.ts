import { basename, dirname, join, relative, resolve } from "node:path"
import { readFileSync, writeFileSync, existsSync, readdirSync, constants } from "node:fs"
import { ensureDirSync, mkdirp, removeSync } from "fs-extra"
import {
    compileWithHost,
    jacdacDefaultSpecifications,
    DevsDiagnostic,
    formatDiagnostics,
    DEVS_DBG_FILE,
    prettySize,
    DebugInfo,
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
    PkgJson,
} from "@devicescript/compiler"
import {
    BINDIR,
    consoleColors,
    debug,
    error,
    FLASHDIR,
    FLASHFILE,
    GENDIR,
    LIBDIR,
    log,
    verboseLog,
} from "./command"
import glob from "fast-glob"

import type { DevsModule } from "@devicescript/vm"
import { readFile, writeFile, access } from "node:fs/promises"
import { printDmesg } from "./vmworker"
import { EXIT_CODE_COMPILATION_ERROR } from "./exitcodes"
import {
    converters,
    parseServiceSpecificationMarkdownToJSON,
    sha256,
    toHex,
    versionTryParse,
} from "jacdac-ts"
import { execSync } from "node:child_process"
import { BuildOptions } from "./sideprotocol"
import { readJSON5Sync } from "./jsonc"

// TODO should we move this to jacdac-ts and call automatically for transports?
export function setupWebsocket() {
    if (typeof WebSocket !== "undefined") return

    try {
        require("websocket-polyfill")
        // @ts-ignore
        global.Blob = require("buffer").Blob
        global.WebSocket.prototype.send = function(this: any, data: any) {
            if (typeof data.valueOf() === "string")
                this.connection_.sendUTF(data)
            else {
                this.connection_.sendBytes(Buffer.from(data))
            }
        }
        global.WebSocket.prototype.close = function(this: any, code, reason) {
            this.state_ = WebSocket.CLOSING
            if (this.connection_) {
                if (code === undefined) this.connection_.sendCloseFrame()
                else this.connection_.sendCloseFrame(code, reason)
            }
        }
    } catch {
        log("can't load websocket-polyfill")
    }
}

export function readDebugInfo() {
    let dbg: DebugInfo
    try {
        dbg = readJSON5Sync(join(BINDIR, DEVS_DBG_FILE))
    } catch {
    }
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

    setupWebsocket()

    return (d() as Promise<DevsModule>).then(m => {
        devsInst = m
        setDevsDmesg()
        // m.devsInit() - don't init here, we may still want to do more setup
        return m
    })
}

export async function devsStartWithNetwork(options: {
    tcp?: boolean
    test?: boolean
    deviceId?: string
    gcStress?: boolean
    stateless?: boolean
    clearFlash?: boolean
}) {
    const inst = await devsFactory()

    inst.devsGcStress(!!options.gcStress)

    if (options.tcp)
        await inst.setupNodeTcpSocketTransport(require, "127.0.0.1", 8082)
    else await inst.setupWebsocketTransport("ws://127.0.0.1:8081")

    if (options.stateless) {
        inst.flashLoad = null
        inst.flashSave = null
    } else {
        ensureDirSync(FLASHDIR)
        const fn = join(FLASHDIR, FLASHFILE)
        // clear flash if needed
        if (options.clearFlash && existsSync(fn)) {
            verboseLog(`clearing flash ${fn}`)
            removeSync(fn)
        }
        verboseLog(`set up flash in ${fn}`)
        inst.flashLoad = () => {
            try {
                return new Uint8Array(readFileSync(fn))
            } catch {
                return new Uint8Array(0)
            }
        }
        inst.flashSave = buf => {
            writeFileSync(fn, buf)
        }
    }

    if (options.deviceId) inst.devsSetDeviceId(options.deviceId)

    inst.devsStart()

    return inst
}

export async function getHost(
    buildConfig: ResolvedBuildConfig,
    options: BuildOptions,
    folder: string,
) {
    console.log(" =============+> getHost")

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

function execCmd(cmd: string) {
    try {
        return execSync(cmd, { encoding: "utf-8" }).trim()
    } catch {
        return ""
    }
}

function isGit() {
    let pref = ""
    for (let i = 0; i < 10; ++i) {
        if (existsSync(pref + ".git")) return true
        pref = pref + "../"
    }
    return false
}

function compilePackageJson(
    tsdir: string,
    entryPoint: string,
    lcfg: LocalBuildConfig,
    errors: DevsDiagnostic[],
) {
    const pkgJsonPath = join(tsdir, "package.json")
    if (existsSync(pkgJsonPath)) {
        const pkgJSON = readJSON5Sync(pkgJsonPath) as PkgJson
        lcfg.pkgJson = pkgJSON
        lcfg.hwInfo["@name"] = pkgJSON.name ?? "(no name)"
        let version = pkgJSON.version ?? "(no version)"
        if (isGit()) {
            const head = execCmd(
                "git describe --tags --match 'v[0-9]*' --always",
            )
            let dirty = execCmd(
                "git status --porcelain --untracked-file=no --ignore-submodules=untracked",
            )
            if (!head) dirty = "yes"
            const exact = !dirty && head[0] == "v" && !head.includes("-")
            if (exact) {
                version = head
            } else {
                let v = versionTryParse(version)
                if (head[0] == "v") v = versionTryParse(head) || v
                let verStr = ""
                if (v) verStr = `v${v.major}.${v.minor}.${v.patch + 1}-`
                verStr += head.replace(/.*-/, "")
                if (dirty) {
                    const now = new Date()
                        .toISOString()
                        .replace(/T/, ".")
                        .replace(/:/, ".")
                        .replace(/:.*/, "")
                        .replace(/-/g, ".")
                    if (verStr) verStr += "-"
                    verStr += now
                }
                version = verStr
            }
            lcfg.hwInfo["@version"] = version
        }
    }

    if (entryPoint) {
        entryPoint = entryPoint.replace(/^src[\/\\]/, "")
        entryPoint = entryPoint.replace(/^main/, "")
        entryPoint = entryPoint.replace(/.ts$/, "")
        if (entryPoint) {
            if (lcfg.hwInfo["@name"]) lcfg.hwInfo["@name"] += " " + entryPoint
            else lcfg.hwInfo["@name"] = entryPoint
        }
    }

    verboseLog(
        `compile: ${lcfg.hwInfo["@name"]} ${lcfg.hwInfo["@version"] ?? ""}`,
    )
}

function compileServiceSpecs(
    tsdir: string,
    lcfg: LocalBuildConfig,
    errors: DevsDiagnostic[],
) {
    const dir = join(tsdir, "services")
    lcfg.addServices = []

    if (existsSync(dir)) {
        const includes: Record<string, jdspec.ServiceSpec> = {}
        jacdacDefaultSpecifications.forEach(
            spec => (includes[spec.shortId] = spec),
        )
        const markdowns = readdirSync(dir, { encoding: "utf-8" }).filter(
            fn => /\.md$/i.test(fn) && !/README\.md$/i.test(fn),
        )
        for (const mdf of markdowns) {
            const fn = join(dir, mdf)
            const content = readFileSync(fn, { encoding: "utf-8" })
            const json = parseServiceSpecificationMarkdownToJSON(
                content,
                includes,
                fn,
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
    errors: DevsDiagnostic[],
) {
    const dir = join(tsdir, "boards")
    lcfg.addBoards = []
    const baseCfg = resolveBuildConfig()

    if (existsSync(dir)) {
        const boards = readdirSync(dir, { encoding: "utf-8" }).filter(fn =>
            fn.endsWith(".board.json"),
        )
        for (const boardFn of boards) {
            const fullName = join(dir, boardFn)
            try {
                const board: DeviceConfig = JSON.parse(
                    readFileSync(fullName, "utf-8"),
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
                    }),
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

export function buildConfigFromDir(
    dir: string,
    entryPoint: string = "",
    options: BuildOptions = {},
) {
    const lcfg: LocalBuildConfig = {
        hwInfo: {},
    }
    const errors: DevsDiagnostic[] = []

    if (dir) {
        verboseLog(`build config from: ${dir}`)
        compilePackageJson(dir, entryPoint, lcfg, errors)
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
    options: BuildOptions = {},
): Promise<CompilationResult> {
    const exists = existsSync(fn)
    if (!exists) throw new Error(`source file "${fn}" not found`)

    if (
        !options.ignoreMissingConfig &&
        !existsSync("./devsconfig.json") &&
        !existsSync("./devs/run-tests/basic.ts") // hack for in-tree testing
    )
        throw new Error("./devsconfig.json file not found")

    const outDir = options.outDir || BINDIR
    ensureDirSync(outDir)

    const folder = resolve(".")
    const entryPoint = relative(folder, fn)
    const { errors, buildConfig } = buildConfigFromDir(
        folder,
        entryPoint,
        options,
    )

    await saveLibFiles(buildConfig, options)

    const host = await getHost(buildConfig, options, folder)

    const t0 = Date.now()
    const res = compileWithHost(fn, host)
    const time = Date.now() - t0
    verboseLog(`compile: ${time}ms`)

    if (res.binary) {
        res.dbg.binarySHA256 = toHex(await sha256([res.binary]))
        verboseLog(`sha: ${res.dbg.binarySHA256}`)
        writeFileSync(
            join(folder, outDir, DEVS_DBG_FILE),
            JSON.stringify(res.dbg),
        )
    }

    setDevsDmesg() // set again after we have re-created -dbg.json file

    if (errors.length) {
        res.diagnostics.unshift(...errors)
        res.success = false
    }

    return res
}

export async function saveLibFiles(
    buildConfig: ResolvedBuildConfig,
    options: BuildOptions,
) {
    // pass the user-provided services so they are included in devicescript-specs.d.ts
    const prelude = preludeFiles(buildConfig)

    const pref = resolve(options.cwd ?? ".")
    const libpath = join(pref, LIBDIR)
    if (
        existsSync(join(libpath, "core/CORE_SOURCES.md")) ||
        buildConfig.pkgJson?.devicescript?.bundle
    ) {
        verboseLog(`not saving files in ${libpath} (source build)`)
    } else {
        if (!existsSync(libpath))
            await mkdirp(libpath)

        verboseLog(`saving lib files in ${libpath}`)
        for (const fn of Object.keys(prelude)) {
            const fnpath = join(pref, fn)
            if (!existsSync(libpath))
                await mkdirp(dirname(fnpath))

            const ex = readFileSync(fnpath, { encoding: "utf-8" })

            if (prelude[fn] != ex) writeFileSync(fnpath, prelude[fn])
        }
    }

    // generate constants for non-catalog services
    const customServices =
        buildConfig.services.filter(srv => srv.catalog !== undefined) || []
    // generate source files
    await Promise.all(["ts", "c"].map(async (lang) => {
        const converter = converters()[lang]
        let constants = ""
        for (const srv of customServices) {
            constants += converter(srv) + "\n"
        }
        const dir = join(pref, GENDIR, lang)
        if (!existsSync(dir))
            await mkdirp(dir)

        if (existsSync(join(dir, `constants.${lang}`)))
            return

        await writeFile(join(dir, `constants.${lang}`), constants, {
            encoding: "utf-8",
        })
    }))
    // json specs
    {
        const dir = join(pref, GENDIR)
        if (!existsSync(dir))
            await mkdirp(dir)

        if (existsSync(join(dir, `services.json`)))
            return

        await writeFile(
            join(dir, `services.json`),
            JSON.stringify(customServices, null, 2),
            {
                encoding: "utf-8",
            },
        )
    }
}

export async function buildAll(options: BuildOptions) {
    await Promise.all((await glob("src/main*.ts")).map((file) => {
        log(`build ${file}`)
        return build(file, {
            ...options,
            outDir: BINDIR + "/" + file.slice(8, -3),
        })
    }))
}

export async function build(file: string, options: BuildOptions) {
    file = file || "src/main.ts"
    options.outDir = options.outDir || BINDIR

    try {
        await buildOnce(file, options)
    } catch (e) {
        if (e.name !== CompilationError.NAME) {
            error("exception: " + e.message)
            verboseLog(e.stack)
        }
        process.exit(EXIT_CODE_COMPILATION_ERROR)
    }
}

async function buildOnce(file: string, options: BuildOptions) {
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
                .join(", "),
        )
        log(`  functions:`)
        const resolver = SrcMapResolver.from(dbg)
        functions
            .sort((l, r) => l.size - r.size)
            .forEach(fn => {
                log(`  ${fn.name} (${prettySize(fn.size)})`)
                fn.users.forEach(user =>
                    debug(`    <-- ${resolver.posToString(user[0])}`),
                )
            })
    }
}
