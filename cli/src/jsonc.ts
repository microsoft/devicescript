import { readFileSync } from "fs"
import { parse } from "jsonc-parser"

export function readJSONSync<T = unknown>(fn: string): T {
    const text = readFileSync(fn, { encoding: "utf-8" })
    return parseJSON<T>(text)
}

export function parseJSON<T = unknown>(text: string): T {
    const res = parse(text)
    return res as T
}
