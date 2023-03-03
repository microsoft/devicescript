import { readdirSync, readFileSync } from "node:fs"
import { getHost, validateBoard } from "./build"
import { CmdOptions, log } from "./command"
import * as path from "node:path"
import {
    testCompiler,
    RepoInfo,
    resolveBuildConfig,
    compileWithHost,
} from "@devicescript/compiler"
import { runTest } from "./run"
import { writeFile } from "node:fs/promises"
import { strcmp } from "jacdac-ts"

export interface CToolOptions {
    empty?: boolean
    test?: boolean
    fetchBoards?: string
    localBoards?: string
}

function readdir(folder: string) {
    return readdirSync(folder).map(bn => path.join(folder, bn))
}

const ctest = "devs/compiler-tests"
const samples = "devs/samples"
const rtest = "devs/run-tests"

export async function ctool(options: CToolOptions & CmdOptions) {
    if (options.fetchBoards) {
        const ginfo = await fetchBoards(options)
        await writeFile(options.fetchBoards, JSON.stringify(ginfo, null, 2))
        process.exit(0)
    }

    if (options.empty) {
        const host = await getHost(
            resolveBuildConfig(),
            { noVerify: true },
            "."
        )
        host.read = () => ""
        const res = compileWithHost("src/main.ts", host)
        const buf = res.binary
        let r = `__attribute__((aligned(sizeof(void *)))) static const uint8_t devs_empty_program[${buf.length}] = {`
        for (let i = 0; i < buf.length; ++i) {
            if ((i & 15) == 0) r += "\n"
            r += "0x" + ("0" + buf[i].toString(16)).slice(-2) + ", "
        }
        r += "\n};"
        console.log(r)
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

        process.exit(0)
    }
}

const boardRepos = [
    "https://github.com/microsoft/jacdac-esp32",
    "https://github.com/microsoft/jacdac-pico",
]

function resolveSchema(sch: string, repo: string) {
    if (/^https?:/.test(sch)) return sch
    // https:///microsoft/jacdac-pico/main/boards/rp2040archconfig.schema.json
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
            info = JSON.parse(readFileSync(p, "utf8"))
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
                fwBoards.find(b => /bare/.test(b.id)) ?? fwBoards[0]
            arch.bareUrl = bareBoard?.$fwUrl
        }
    }

    return sortJSON(ginfo)
}
