import { parseJSON5 } from "@devicescript/interop"
import { readFileSync } from "fs"

export function readJSON5Sync<T = unknown>(fn: string): T {
    const text = readFileSync(fn, { encoding: "utf-8" })
    return parseJSON5<T>(text)
}
