"use strict"
const { stdout, stderr } = require("node:process")
const { readJsonSync } = require("fs-extra")

async function run(inputFile) {
    const input = readJsonSync(inputFile).input
    try {
        const host = await getHost()
        const jacscript = require("../../../compiler")
        jacscript.testCompiler(host, input)
        stdout.write(String(result))
    } catch (e) {
        stderr.write(String(e))
    }
}

const inputFile = process.argv[2]
if (!inputFile) {
    throw new Error("Usage: node compile.js <input_file>")
}
;(async () => await run(inputFile))()
