import { readFileSync, writeFileSync } from "node:fs"
import { CmdOptions, log } from "./command"
import {
    decodeDcfg,
    serializeDcfg,
    findDcfgOffsets,
} from "@devicescript/compiler"

export interface DcfgOptions {}

export async function dcfg(fn: string, options: DcfgOptions & CmdOptions) {
    const buf = readFileSync(fn)

    if (buf[0] == 123) {
        let json: any
        try {
            json = JSON.parse(buf.toString("utf-8"))
        } catch {}
        if (json) {
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
                for (const e of res.errors) console.error(e)
                process.exit(1)
            }
            console.log("writing settings.bin")
            writeFileSync("settings.bin", bin)
            return
        }
    }

    const idx = findDcfgOffsets(buf)
    if (idx.length == 0) {
        console.error("no binary DCFG and can't parse JSON")
        process.exit(1)
    }
    for (const off of idx) {
        console.log(`parsing at ${off}`)
        const res = decodeDcfg(buf.slice(off))
        for (const e of res.errors) console.error(e)
        console.log(res.settings)
    }
}
