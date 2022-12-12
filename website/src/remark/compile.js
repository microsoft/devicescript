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

async function run(inputFile) {
    const input = readJsonSync(inputFile).input
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
        stderr.write(String(e))
    }
    errors.forEach(error => stderr.write(error.formatted + "\n"))
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
