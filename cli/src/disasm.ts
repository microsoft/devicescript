import { disassemble } from "@devicescript/compiler"
import { CmdOptions, log } from "./command"
import { readCompiled } from "./run"

export interface DisAsmOptions {
    detailed?: boolean
}

export async function disasm(fn: string, options: DisAsmOptions & CmdOptions) {
    const tmp = await readCompiled(fn)
    log(disassemble(tmp.dbg ?? tmp.binary, options.detailed))
}
