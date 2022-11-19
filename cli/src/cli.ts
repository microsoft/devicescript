import { join } from "node:path"
import { readFileSync, writeFileSync } from "node:fs"

import { program as commander } from "commander"
import { compile, Host } from "jacscript-compiler"

const specs: any = require("../../runtime/jacdac-c/jacdac/dist/services.json")
// import * as specs from "../../runtime/jacdac-c/jacdac/dist/services.json" - slows down intellisense?

interface CmdOptions {
    verbose?: boolean
    noVerify?: boolean
    library?: boolean
    _file?: string
}

let options: CmdOptions

const distPath = "built"

function jacsFactory() {
    let d = require("jacscript-vm")
    try {
        require("websocket-polyfill")
        // @ts-ignore
        global.Blob = require("buffer").Blob
    } catch {
        console.log("can't load websocket-polyfill")
    }
    return d()
}

let jacsHost: Host
async function getHost() {
    if (jacsHost) return jacsHost
    const inst = await jacsFactory()
    inst.jacsInit()
    jacsHost = {
        write: (fn, cont) => {
            const p = join(distPath, fn)
            console.log(`write ${p}`)
            writeFileSync(p, cont)
            if (fn.endsWith(".jasm") && typeof cont == "string" && cont.indexOf("???oops") >= 0)
                throw new Error("bad disassembly")
        },
        log: msg => { if (options.verbose) console.log(msg) },
        mainFileName: () => options._file || "",
        getSpecs: () => specs,
        verifyBytecode: buf => {
            if (options.noVerify) return
            const res = inst.jacsDeploy(buf)
            if (res != 0)
                throw new Error("verification error: " + res)
        }
    }
    return jacsHost
}

async function compileBuf(buf: Buffer) {
    const res = compile(await getHost(), buf.toString("utf8"), { isLibrary: options.library })
    if (!res.success)
        throw new Error("compilation failed")
    return res.binary
}

export async function mainCli() {
    const pkg = require("../package.json")
    commander
        .version(pkg.version)
        .option("-v, --verbose", "more logging")
        .option("-l, --library", "build library")
        .option("--no-verify", "don't verify resulting bytecode")
        .arguments("<file.ts>")
        .parse(process.argv)

    options = commander as CmdOptions

    if (commander.args.length != 1) {
        console.error("exactly one argument expected")
        process.exit(1)
    }

    options._file = commander.args[0]

    try {
        await compileBuf(readFileSync(options._file))
    } catch (e) {
        console.error(e.stack)
    }
}

if (require.main === module) mainCli()
