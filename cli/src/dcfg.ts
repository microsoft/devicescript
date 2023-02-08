import { readFileSync, writeFileSync } from "node:fs"
import { CmdOptions, error, log, verboseLog } from "./command"
import {
    decodeDcfg,
    serializeDcfg,
    findDcfgOffsets,
    compileDcfg,
    decompileDcfg,
} from "@devicescript/compiler"
import { toHex } from "jacdac-ts"

export interface DcfgOptions {
    update?: string
    output?: string
}

export async function dcfg(fn: string, options: DcfgOptions & CmdOptions) {
    const buf = readFileSync(fn)

    if (fn.endsWith(".json")) {
        const json = await compileDcfg(fn, async fn => {
            return readFileSync(fn, "utf-8")
        })
        verboseLog(JSON.stringify(json, null, 4))
        const bin = serializeDcfg(json)
        const res = decodeDcfg(bin)
        if (res.errors.length == 0) {
            for (const k of Object.keys(json)) {
                if (json[k] != res.settings[k])
                    res.errors.push(`mismatch at ${k}`)
            }
            for (const k of Object.keys(res.settings)) {
                if (json[k] != res.settings[k])
                    res.errors.push(`mismatch at ${k}`)
            }
        }
        if (res.errors.length) {
            for (const e of res.errors) error(e)
            process.exit(1)
        }

        try {
            const decomp = decompileDcfg(res.settings)
            verboseLog(JSON.stringify(decomp, null, 4))
        } catch (e) {
            fatal(e.message)
        }

        if (options.output) {
            console.log(`writing ${options.output}`)
            writeFileSync(options.output, bin)
        } else if (options.update) {
            const f = readFileSync(options.update, "utf-8")
            let hits = 0
            const f2 = f.replace(/\/\/ DCFG_BEGIN[^]*\/\/ DCFG_END\n?/g, () => {
                hits++
                const inner = [...toHex(bin).match(/../g)]
                    .map(e => `0x${e}`)
                    .join(",")
                return `// DCFG_BEGIN\n${inner}\n// DCFG_END\n`
            })
            if (hits == 0)
                fatal(`DCFG_BEGIN/END markers not found in ${options.update}`)
            else if (hits > 1)
                fatal(
                    `too many DCFG_BEGIN/END markers found in ${options.update}`
                )
            writeFileSync(options.update, f2)
        } else {
            fatal("either --update or --output required")
        }
        return
    }

    const idx = findDcfgOffsets(buf)
    if (idx.length == 0) {
        fatal("no binary DCFG and can't parse JSON")
    }
    for (const off of idx) {
        console.log(`parsing at ${off}`)
        const res = decodeDcfg(buf.slice(off))
        for (const e of res.errors) error(e)
        console.log(res.settings)
    }

    function fatal(msg: string) {
        error(msg)
        process.exit(1)
    }
}
