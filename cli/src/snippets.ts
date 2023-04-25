import { compileWithHost, Host } from "@devicescript/compiler"
import glob from "fast-glob"
import { ensureDirSync } from "fs-extra"
import { readFile, writeFile } from "fs/promises"
import { relative, resolve, dirname } from "path"
import { buildConfigFromDir, getHost } from "./build"
import { BINDIR, error, log } from "./command"
import { BuildOptions } from "./sideprotocol"

export interface SnippetsOptions {
    include: string
    exclude?: string
}

const fn = "devs/tmp/snippets.ts"

async function snippetHost(options: BuildOptions) {
    ensureDirSync(BINDIR)
    ensureDirSync(dirname(fn))

    const folder = resolve(".")
    const entryPoint = relative(folder, fn)
    const { errors, buildConfig } = buildConfigFromDir(
        folder,
        entryPoint,
        options
    )

    if (errors.length) process.exit(1)

    const host = await getHost(buildConfig, options, folder)
    return host
}

async function buildSnippet(snip: string, host: Host) {
    await writeFile(fn, snip)
    const res = compileWithHost(fn, host)
    return res
}

export async function snippets(options: SnippetsOptions) {
    const files = await glob(options.include, {
        ignore: options.exclude ? [options.exclude] : [],
    })
    const pref = 'import * as ds from "@devicescript/core"'
    const host = await snippetHost({})
    let numerr = 0
    for (const fn of files) {
        const md = await readFile(fn, "utf-8")
        const snips: string[] = []
        md.replace(
            /```(.*)\n([^]*?)```/g,
            (_, optline: string, snip: string) => {
                const opts = optline.split(/\s+/).filter(Boolean)
                if (
                    !opts.includes("skip") &&
                    opts[0] == "ts" &&
                    !optline.includes("/sim/")
                ) {
                    if (!snip.includes(pref)) snip = pref + "\n" + snip
                    snips.push(snip)
                }
                return ""
            }
        )

        for (let idx = 0; idx < snips.length; ++idx) {
            console.log(`${fn} / ${idx}`)
            const res = await buildSnippet(snips[idx], host)
            if (!res.success) numerr++
        }
    }

    if (numerr) {
        error(`${numerr} error(s)`)
        process.exit(1)
    } else log("OK!")
}
