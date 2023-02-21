import { existsSync } from "fs"
import { mkdirp } from "fs-extra"
import { writeFile } from "fs/promises"
import { clone, randomUInt } from "jacdac-ts"
import { join } from "path"
import { fatal, log } from "./command"
import { setupFlashBoards, showAllBoards } from "./flash"

export interface AddBoardOptions {
    base?: string
    name?: string
    board?: string
    force?: boolean
}

const boardsPath = "boards"

export async function addBoard(options: AddBoardOptions) {
    const cfg = setupFlashBoards()
    const baseBoard = cfg.boards[options.base]
    if (!baseBoard) {
        showAllBoards("", "--base")
        fatal(
            options.base ? `invalid --base "${options.base}"` : `missing --base`
        )
    }

    if (!options.name) {
        fatal(`missing --name argument`)
    }

    if (!options.board) {
        options.board = options.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, "_")
        log(`using --board ${options.board}`)
    }

    if (cfg.boards[options.board])
        fatal(`board '${options.board}' already exists`)

    await mkdirp(boardsPath)

    const boardJsonPath = join(boardsPath, options.board + ".board.json")
    if (!options.force && existsSync(boardJsonPath)) fatal(`file ${boardJsonPath} already exists; use --force to overwrite`)

    // const arch = cfg.archs[baseBoard.archId]

    const board = clone(baseBoard)
    board.devName = options.name
    board.productId = "0x" + (randomUInt(0xfff_ffff) | 0x3000_0000).toString(16)
    delete board.id
    delete board.$fwUrl

    writeFile(boardJsonPath, JSON.stringify(board, null, 4))
    log(`created ${boardJsonPath}`)
}
