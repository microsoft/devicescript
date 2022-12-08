import { disassemble } from "@devicescript/compiler"
import { CmdOptions, log } from "./command"
import { readCompiled } from "./run"

export interface DisAsmOptions {}

export async function disasm(fn: string, options: DisAsmOptions & CmdOptions) {
    const prog = await readCompiled(fn)
    log(disassemble(prog))
}
