import { readdirSync, writeFileSync } from "node:fs"
import { getHost, validateBoard } from "./build"
import { log } from "./command"
import * as path from "node:path"
import {
    testCompiler,
    RepoInfo,
    resolveBuildConfig,
    compileWithHost,
    serverInfo,
} from "@devicescript/compiler"
import { runTest } from "./run"
import { writeFile } from "node:fs/promises"
import { strcmp } from "jacdac-ts"
import { readJSON5Sync } from "./jsonc"

export interface CToolOptions {
    empty?: boolean
    test?: boolean
    fetchBoards?: string
    localBoards?: string
    serverInfo?: boolean
}

function readdir(folder: string) {
    return readdirSync(folder).map(bn => path.join(folder, bn))
}

const ctest = "devs/compiler-tests"
const samples = "devs/samples"
const rtest = "devs/run-tests"

export async function ctool(options: CToolOptions) {
    if (options.fetchBoards) {
        const ginfo = await fetchBoards(options)
        await writeFile(options.fetchBoards, JSON.stringify(ginfo, null, 2))
        process.exit(0)
    }

    if (options.empty) {
        const host = await getHost(
            resolveBuildConfig({
                hwInfo: {
                    // This doesn't work anyway, since settings are not fetched from the empty program
                    // "@name": "(empty)",
                    // "@version": `v${BinFmt.IMG_VERSION_MAJOR}.${BinFmt.IMG_VERSION_MINOR}.${BinFmt.IMG_VERSION_PATCH}`,
                },
            }),
            { verify: false },
            "."
        )
        host.read = fn => {
            if (fn.includes("package.json")) throw new Error("read empty")
            return ""
        }
        const res = compileWithHost("src/main.ts", host)
        const buf = res.binary
        let r = `__attribute__((aligned(sizeof(void *)))) static const uint8_t devs_empty_program[${buf.length}] = {`
        const repl: Record<string, string> = {
            8: "0x00",
            9: "0x00",
            10: "MINR",
            11: "MAJR",
        }
        for (let i = 0; i < buf.length; ++i) {
            if ((i & 15) == 0) r += "\n"
            let d = "0x" + ("0" + buf[i].toString(16)).slice(-2)
            if (repl[i]) d = repl[i]
            r += d + ", "
        }
        r += "\n};"
        console.log(r)
        process.exit(0)
    }

    if (options.serverInfo) {
        const host = await getHost(resolveBuildConfig(), { verify: false }, ".")
        const read = host.read
        host.read = fn => {
            if (fn == "src/main.ts") return " "
            else return read(fn)
        }
        const info = serverInfo(host)
        const path = "vscode/src/server-info.json"
        writeFileSync(path, JSON.stringify(info, null, 4))
        log(`wrote ${path}`)
        process.exit(0)
    }

    if (options.test) {
        const files = readdir(ctest)
            .concat(readdir(samples))
            .filter(f => /\.ts$/.test(f))
        for (const fn of files) {
            console.log(`*** test ${fn}`)
            const host = await getHost(resolveBuildConfig(), {}, ".")
            testCompiler(fn, host)
        }

        for (const fn of readdir(rtest)) {
            console.log(`*** run ${fn}`)
            await runTest(fn)
        }

        await runTest(path.join(rtest, "allcompile.ts"), {
            flag: { allFunctions: true, allPrototypes: true },
        })

        process.exit(0)
    }
}

const boardRepos = [
    "https://github.com/microsoft/devicescript-esp32",
    "https://github.com/microsoft/devicescript-pico",
]

function resolveSchema(sch: string, repo: string) {
    if (/^https?:/.test(sch)) return sch
    // https:///microsoft/devicescript-pico/main/boards/rp2040archconfig.schema.json
    const boards =
        repo.replace("github.com", "raw.githubusercontent.com") +
        "/main/boards/"
    if (sch.startsWith("../")) return boards + sch.slice(3)
    return sch
}

export function sortJSON(obj: any): any {
    if (Array.isArray(obj)) return obj.map(sortJSON)
    else if (obj && typeof obj == "object") {
        const keys = Object.keys(obj)
        keys.sort(strcmp)
        const r: any = {}
        for (const k of keys) {
            r[k] = sortJSON(obj[k])
        }
        return r
    } else {
        return obj
    }
}

async function fetchBoards(options: CToolOptions) {
    const ginfo: RepoInfo = { boards: {}, archs: {} }
    for (const repo of boardRepos) {
        let info: RepoInfo

        if (options.localBoards) {
            const p = path.join(
                options.localBoards,
                repo.replace(/.*\//, ""),
                "dist",
                "info.json"
            )
            log(`fetch from ${p}`)
            info = readJSON5Sync(p)
        } else {
            const url = repo + "/releases/latest/download/info.json"
            log(`fetch from ${url}`)
            const resp = await fetch(url)
            info = await resp.json()
        }

        // just in case
        for (const a of Object.values(info?.archs ?? {})) {
            if (a.pins) delete (a.pins as any)["#pinInfo"]
        }

        for (const archId of Object.keys(info.archs)) {
            const arch = info.archs[archId]
            log(`  ARCH ${archId}: ${arch.name}`)
            if (arch.id != archId) throw new Error(`arch.id wrong in ${archId}`)
            const ex = ginfo.archs[arch.id]
            if (ex && ex !== arch)
                throw new Error(`arch ${arch.id} already defined`)
            arch.$schema = resolveSchema(arch.$schema, repo)
            arch.repoUrl = repo
            ginfo.archs[arch.id] = arch
        }
        for (const bid of Object.keys(info.boards)) {
            const board = info.boards[bid]
            log(`  ${bid}: ${board.devName}`)
            board.$schema = resolveSchema(board.$schema, repo)
            if (board.id != bid) throw new Error("board.id wrong")
            validateBoard(board, ginfo)
            ginfo.boards[bid] = board
        }
    }
    for (const arch of Object.values(ginfo.archs)) {
        const boards = Object.values(ginfo.boards).filter(
            b => b.archId == arch.id
        )
        const fwBoards = boards.filter(b => !!b.$fwUrl)
        if (!arch.bareUrl) {
            const bareBoard =
                fwBoards.find(
                    b => /bare/.test(b.id) || ["pico", "pico_w"].includes(b.id)
                ) ?? fwBoards[0]
            arch.bareUrl = bareBoard?.$fwUrl
        }
    }

    return sortJSON(ginfo)
}
