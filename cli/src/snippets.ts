import glob from "fast-glob"
import { ensureDir } from "fs-extra"
import { readFile, rm, writeFile } from "fs/promises"
import { resolve, dirname } from "path"
import { compileFile } from "./build"
import { log } from "./command"

export interface SnippetsOptions {
    include: string
    exclude?: string
}

const snipFolder = "devs/snippets"

export async function snippets(options: SnippetsOptions) {
    const files = await glob(options.include, {
        ignore: options.exclude ? [options.exclude] : [],
    })

    await rm(snipFolder, { recursive: true, force: true })

    const pref = 'import * as ds from "@devicescript/core"'
    let imports = ""
    let numsnip = 0

    for (const fn of files) {
        const md = await readFile(fn, "utf-8")
        const snips: { line: number; snip: string }[] = []
        md.replace(
            /```(.*)\n([^]*?)```/g,
            (full: string, optline: string, snip: string) => {
                const line =
                    md.slice(0, md.indexOf(full)).replace(/[^\n]/g, "").length +
                    2
                const opts = optline.split(/\s+/).filter(Boolean)
                if (
                    !opts.includes("skip") &&
                    opts[0] == "ts" &&
                    !optline.includes("/sim/")
                ) {
                    if (!snip.includes(pref)) snip = pref + "\n" + snip
                    snip = `// ${fn}(${line})\n` + snip
                    snips.push({ line, snip })
                }
                return ""
            }
        )

        for (const { line, snip } of snips) {
            const bn = fn.replace(/\.\w+$/, "")
            const mod = bn.replace(/\\/g, "/") + "_" + line
            const fullname = resolve(snipFolder, mod + ".ts")
            await ensureDir(dirname(fullname))
            await writeFile(fullname, snip)
            imports += `import "./${mod}"\n`
            numsnip++
        }
    }

    const idx = resolve(snipFolder, "index.ts")
    await writeFile(idx, imports)

    const res = await compileFile(idx, {
        ignoreMissingConfig: true,
        flag: { allFunctions: true, allPrototypes: true },
    })
    if (!res.success) process.exit(1)
    log(`${numsnip} snippets OK!`)
}
