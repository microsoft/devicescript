import { DebugInfo, parseStackFrame } from "@devicescript/compiler"
import { readJSONSync } from "fs-extra"
import { readFileSync } from "node:fs"
import { BINDIR, CmdOptions, log } from "./command"

export interface AnnotateOptions {}

export async function annotate(options: AnnotateOptions & CmdOptions) {
    const str = readFileSync(0, "utf-8")
    const dbg = readJSONSync(BINDIR + "/bytecode-dbg.json") as DebugInfo
    log(parseStackFrame(dbg, str).markedLine)
}
