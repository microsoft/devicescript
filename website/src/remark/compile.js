"use strict"
const { stdout, stderr } = require("node:process")
const { readJsonSync } = require("fs-extra")
require("../../../compiler")

const { compile } = globalThis.deviceScript

const PREFIX = `import * as ds from "@devicescript/core"`
async function run(inputFile) {
    let input = readJsonSync(inputFile).input
    if (input.indexOf(PREFIX) < 0) input = PREFIX + "\n" + input
    const files = {}
    const log = msg => stdout.write(msg)
    const errors = []
    try {
        const result = compile(input, { log, errors, files })
        if (!result.success) stderr.write("compilation failed\n")
    } catch (e) {
        stderr.write(String(e))
    }
    errors.forEach(error => stderr.write(error.formatted + "\n"))
}

const inputFile = process.argv[2]
if (!inputFile) {
    throw new Error("Usage: node compile.js <input_file>")
}
;(async () => await run(inputFile))()
