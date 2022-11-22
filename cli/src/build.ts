import { join } from "node:path"
import { readFileSync, writeFileSync } from "node:fs"

import { compile, jacdacDefaultSpecifications, JacsDiagnostic } from "jacscript-compiler"
import { CmdOptions } from "./command"

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

async function getHost(options: BuildOptions) {
    const inst = options.noVerify ? undefined : await jacsFactory()
    inst?.jacsInit()

    const jacsHost = {
        write: (fn: string, cont: string) => {
            const p = join(options.outDir || "built", fn)
            if (options.verbose) console.debug(`write ${p}`)
            writeFileSync(p, cont)
            if (
                fn.endsWith(".jasm") &&
                typeof cont == "string" &&
                cont.indexOf("???oops") >= 0
            )
                throw new Error("bad disassembly")
        },
        log: (msg: string) => {
            if (options.verbose) console.log(msg)
        },
        error: (err: JacsDiagnostic) => {
            console.error(err)
        },
        mainFileName: () => options.mainFileName || "",
        getSpecs: () => jacdacDefaultSpecifications,
        verifyBytecode: (buf: Uint8Array) => {
            if (!inst) return
            const res = inst.jacsDeploy(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    return jacsHost
}

async function compileBuf(buf: Buffer, options: BuildOptions) {
    const host = await getHost(options)
    const res = compile(buf.toString("utf8"), {
        host,
        isLibrary: options.library,
    })
    if (!res.success) throw new Error("compilation failed")
    return res.binary
}

export interface BuildOptions extends CmdOptions {
    noVerify?: boolean
    library?: boolean
    outDir?: string

    mainFileName?: string
}

export async function build(file: string, options: BuildOptions) {
    try {
        const buf = readFileSync(file)
        await compileBuf(buf, { ...options, mainFileName: file })
    } catch (e) {
        console.error(e.stack)
    }
}
