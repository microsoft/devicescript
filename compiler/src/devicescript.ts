export * from "./format"
export * from "./compiler"
export * from "./logparser"
export * from "./disassemble"
export * from "./specgen"
export * from "./embedspecs"
export * from "./tsiface"
export * from "./info"

import { compile } from "./compiler"

if (typeof globalThis !== "undefined")
    (globalThis as any).deviceScript = { compile }
