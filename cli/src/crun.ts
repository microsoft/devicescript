import { parseStackFrame } from "@devicescript/compiler"
import { ensureDir } from "fs-extra"
import { spawn } from "node:child_process"
import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { createInterface } from "node:readline"
import { BuildOptions, readDebugInfo } from "./build"
import { BINDIR, error, log } from "./command"
import { readCompiled } from "./run"
import { printDmesg } from "./vmworker"

export interface CRunOptions {
    net?: boolean
    serial?: string
    lazyGc?: boolean
    settings?: boolean
}

export async function crunScript(
    fn: string,
    options: CRunOptions & BuildOptions
) {
    options.verify = false
    if (!options.flag) options.flag = {}

    const compfn = BINDIR + "/crun.devs"
    const args = [compfn]

    if (options.serial) args.unshift(options.serial)
    else if (options.net) args.unshift("8082", "-w")
    else options.flag.testHarness = true

    const prog = await readCompiled(fn, options)
    await ensureDir(BINDIR)
    writeFileSync(compfn, prog.binary)

    if (!options.lazyGc) args.unshift("-X")
    if (!options.settings) args.unshift("-n")

    const executable = resolve(__dirname, "../../runtime/built/jdcli")
    log(`run: ${executable} ${args.join(" ")}`)

    const child = spawn(executable, args, {
        stdio: ["inherit", "pipe", "pipe"],
    })

    let recentLines: string[] = []
    const dbg = readDebugInfo()
    createInterface({ input: child.stdout }).on("line", line => {
        if (!printDmesg(dbg, "C", line)) {
            recentLines.push(line)
            if (recentLines.length > 100) recentLines = recentLines.slice(50)
        }
    })
    createInterface({ input: child.stderr }).on("line", line => {
        printDmesg(dbg, "C", "! " + line)
    })

    child.on("exit", (code, err) => {
        if (!code && err) code = 2
        if (code) {
            log(recentLines.join("\n"))
            error(`exit code: ${code} ${err ?? ""}`)
        }
        setTimeout(() => process.exit(code), 200)
    })
}
