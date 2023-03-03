import * as fsp from "node:fs/promises"
import { parseLog } from "@devicescript/compiler"

export interface LogParseOptions {
    stats?: boolean
    generation?: string
}

export async function logParse(fn: string, options: LogParseOptions) {
    const h = await fsp.open(fn, "r")
    const r = await parseLog((off, size) => {
        const r = Buffer.alloc(size)
        return h.read(r, 0, r.length, off).then(() => r)
    })
    console.log(await r.dump())
    if (options.generation != undefined) {
        const genidx = parseInt(options.generation)
        if (genidx) {
            const gen = await r.generation(genidx)
            if (options.stats) console.log(await gen.computeStats())
            else await gen.forEachEvent()
        }
    }
}
