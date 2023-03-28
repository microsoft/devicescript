import { parse } from "json5"

export function parseJSON<T = unknown>(text: string): T {
    const res = parse(text)
    return res as T
}
