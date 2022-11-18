"use strict"
const { stdout, stderr } = require("node:process")
const { readJsonSync } = require("fs-extra")
const fs = require("fs")
const path = require("path")

function jacsFactory() {
    let d
    try {
        d = require("../../../vm-dev")
        try {
            require("websocket-polyfill")
            // @ts-ignore
            global.Blob = require("buffer").Blob
        } catch {
            console.log("can't load websocket-polyfill")
        }
    } catch {
        console.log("using shipped VM!")
        d = require("../../../vm")
    }
    return d()
}

let jacsHost
async function getHost() {
    if (jacsHost) return jacsHost
    const inst = await jacsFactory()
    inst.jacsInit()
    const specs = JSON.parse(
        fs.readFileSync(
            path.resolve("../jacdac-c/jacdac/dist/services.json"),
            "utf8"
        )
    )
    jacsHost = {
        write: (fn, cont) => {
            console.log(`${fn}->${cont}`)
        },
        log: msg => {
            if (verbose) console.log(msg)
        },
        mainFileName: () => "main.ts",
        getSpecs: () => specs,
        verifyBytecode: buf => {
            const res = inst.jacsDeploy(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    return jacsHost
}

async function run(inputFile) {
    const input = readJsonSync(inputFile).input
    try {
        const host = await getHost()
        const jacscript = require("../../../compiler")
        const result = jacscript.compile(host, input)
        stdout.write(JSON.stringify(result))
    } catch (e) {
        stderr.write(String(e))
    }
}

const inputFile = process.argv[2]
if (!inputFile) {
    throw new Error("Usage: node compile.js <input_file>")
}
;(async () => await run(inputFile))()
