import { disassemble } from "@devicescript/compiler"
import { readFileSync } from "node:fs"
import { CmdOptions, log } from "./command"

export interface DisAsmOptions {
    detailed?: boolean
}

export async function disasm(fn: string, options: DisAsmOptions & CmdOptions) {
    let buf = readFileSync(fn)

    // hex-encoded?
    if (buf.subarray(0, 16).toString("binary") == "446576530a7e6a9a")
        buf = Buffer.from(buf.toString("binary").replace(/\s*/g, ""), "hex")

    log(disassemble(buf, options.detailed))
}
