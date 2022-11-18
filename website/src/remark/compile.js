"use strict"
const { stdout, stderr } = require("node:process")
const { readJsonSync } = require("fs-extra")
const fs = require("fs")
const path = require("path")
const specs = JSON.parse(
    fs.readFileSync(
        path.resolve("../jacdac-c/jacdac/dist/services.json"),
        "utf8"
    )
)
const compiler = require("../../../compiler")

function toHex(bytes) {
    if (!bytes) return undefined
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

function jacsFactory() {
    let d
    try {
        d = require("../../../vm-dev")
        try {
            require("websocket-polyfill")
            // @ts-ignore
            global.Blob = require("buffer").Blob
        } catch {
            //console.log("can't load websocket-polyfill")
        }
    } catch {
        d = require("../../../vm")
    }
    return d()
}

async function getHost() {
    const inst = await jacsFactory()
    inst.jacsInit()
    const files = {}
    const jacsHost = {
        write: (fn, cont) => {
            files[fn] = cont
        },
        log: msg => {
            console.log(msg)
        },
        mainFileName: () => "main.ts",
        getSpecs: () => specs,
        verifyBytecode: buf => {
            const res = inst.jacsDeploy(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    jacsHost.files = files
    return jacsHost
}

async function run(inputFile) {
    const input = readJsonSync(inputFile).input
    let error = undefined
    let files
    let result
    try {
        const host = await getHost()
        result = compiler.compile(host, input)
        files = host.files
    } catch (e) {
        error = e
        stderr.write(String(e))
    }
    return {
        files,
        success: result.success,
        binary: toHex(result.binary),
        dbg: result.dbg,
        error,
    }
}

const inputFile = process.argv[2]
if (!inputFile) {
    throw new Error("Usage: node compile.js <input_file>")
}
;(async () => await run(inputFile))()
