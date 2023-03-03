import { parseStackFrame } from "@devicescript/compiler"
import { readFileSync } from "node:fs"
import { readDebugInfo } from "./build"
import { log } from "./command"

export interface AnnotateOptions {}

export async function annotate(options: AnnotateOptions) {
    const str = readFileSync(0, "utf-8")
    const dbg = readDebugInfo()
    log(parseStackFrame(dbg, str).markedLine)
}
