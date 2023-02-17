import { writeFileSync } from "node:fs"

const boardRepos = [
    "https://github.com/microsoft/jacdac-esp32",
    "https://github.com/microsoft/jacdac-pico",
]

async function main() {
    const ginfo = { boards: {}, archs: {} }
    for (const repo of boardRepos) {
        const url = repo + "/releases/latest/download/info.json"
        console.log(`fetch from ${url}`)
        const resp = await fetch(url)
        const info = await resp.json()
        for (const bid of Object.keys(info.boards)) {
            const board = info.boards[bid]
            console.log(`  ${bid}: ${board.devName}`)
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
            ginfo.archs[arch.id] = arch
        }
    }
    writeFileSync("compiler/src/boards.json", JSON.stringify(ginfo, null, 2))
    process.exit(0)
}

main()
