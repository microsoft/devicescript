import { parseJSON } from "@devicescript/compiler"
import { readFileSync } from "fs"

export function readJSONSync<T = unknown>(fn: string): T {
    const text = readFileSync(fn, { encoding: "utf-8" })
    return parseJSON<T>(text)
}
