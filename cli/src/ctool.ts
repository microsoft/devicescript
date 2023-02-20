import { readdirSync, readFileSync } from "node:fs"
import { compileBuf, getHost } from "./build"
import { CmdOptions, log } from "./command"
import * as path from "node:path"
import { testCompiler, RepoInfo } from "@devicescript/compiler"
import { runTest } from "./run"
import { writeFile } from "node:fs/promises"

export interface CToolOptions {
    empty?: boolean
    test?: boolean
    fetchBoards?: string
}

function readdir(folder: string) {
    return readdirSync(folder).map(bn => path.join(folder, bn))
}

const ctest = "devs/compiler-tests"
const samples = "devs/samples"
const rtest = "devs/run-tests"

export async function ctool(options: CToolOptions & CmdOptions) {
    if (options.fetchBoards) {
        const ginfo = await fetchBoards()
        await writeFile(options.fetchBoards, JSON.stringify(ginfo, null, 2))
        process.exit(0)
    }

    if (options.empty) {
        const res = await compileBuf(Buffer.from(""), { noVerify: true })
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
            const host = await getHost({
                mainFileName: fn,
            })
            testCompiler(host, readFileSync(fn, "utf8"))
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

async function fetchBoards() {
    const ginfo: RepoInfo = { boards: {}, archs: {} }
    for (const repo of boardRepos) {
        const url = repo + "/releases/latest/download/info.json"
        log(`fetch from ${url}`)
        const resp = await fetch(url)
        const info: RepoInfo = await resp.json()
        for (const bid of Object.keys(info.boards)) {
            const board = info.boards[bid]
            board.$schema = resolveSchema(board.$schema, repo)
            log(`  ${bid}: ${board.devName}`)
            if (board.id != bid) throw new Error("board.id wrong")
            const arch = info.archs[board.archId]
            if (!arch) throw new Error("board.archId wrong")
            if (arch.id != board.archId) throw new Error("arch.id wrong")
            if (ginfo.boards[bid])
                throw new Error(`board ${bid} already defined`)
            ginfo.boards[bid] = board
            const ex = ginfo.archs[arch.id]
            if (ex && ex !== arch)
                throw new Error(`arch ${arch.id} already defined`)
            arch.$schema = resolveSchema(arch.$schema, repo)
            arch.repoUrl = repo
            ginfo.archs[arch.id] = arch
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
    return ginfo
}
