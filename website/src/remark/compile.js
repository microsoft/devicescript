"use strict"
const { stdout, stderr } = require("node:process")
const { readJsonSync } = require("fs-extra")
require("../../../compiler")

const { compile } = globalThis.deviceScript

function toHex(bytes) {
    if (!bytes) return undefined
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

const PREFIX = `import * as ds from "@devicescript/core"`
async function run(inputFile) {
    let input = readJsonSync(inputFile).input
    if (input.indexOf(PREFIX) < 0) input = PREFIX + "\n" + input
    const files = {}
    const log = msg => stdout.write(msg)
    const errors = []
    let error = undefined
    let result
    try {
        result = compile(input, { log, errors, files })
        if (!result.success) stderr.write("compilation failed\n")
    } catch (e) {
        error = e
        result = {
            success: false,
        }
        stderr.write(String(e))
    }
    errors.forEach(error => stderr.write(error.formatted + "\n"))
    return {
        files,
        success: result.success,
        binary: result.binary ? toHex(result.binary) : result.binary,
        dbg: result.dbg,
        error,
    }
}

const inputFile = process.argv[2]
if (!inputFile) {
    throw new Error("Usage: node compile.js <input_file>")
}
;(async () => await run(inputFile))()
