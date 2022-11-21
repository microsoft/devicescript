export * from "./format"
export * from "./compiler"
export * from "./logparser"
export * from "./disassemble"

import { compile } from "./compiler"

if (typeof globalThis !== "undefined")
    (globalThis as any).jacscriptCompile = compile
