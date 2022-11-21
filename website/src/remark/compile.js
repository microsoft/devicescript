"use strict"
const { stdout, stderr } = require("node:process")
const { readJsonSync } = require("fs-extra")
require("../../../compiler")

const compiler = globalThis.jacscriptCompile

function toHex(bytes) {
    if (!bytes) return undefined
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

async function run(inputFile) {
    const input = readJsonSync(inputFile).input
    const files = {}
    const log = msg => stdout.write(msg)
    let error = undefined
    let result
    try {
        const host = await getHost()
        result = compiler.compile(input, { host, log, files })
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
