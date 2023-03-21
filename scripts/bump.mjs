#!/usr/bin/env zx

import "zx/globals"
import * as semver from "semver"

function fail(msg) {
    console.error(`Error: ${msg}`)
    process.exit(1)
}

const bytecodeConst = {}
;(await fs.readFile("bytecode/bytecode.md", "utf-8")).replace(
    /^    (\w+)\s+=\s+(0x[\da-f]+|\d+)/gim,
    (_, k, v) => {
        bytecodeConst[k] = +v
    }
)

const { img_version_major, img_version_minor, img_version_patch } =
    bytecodeConst

const deflVer = `${img_version_major}.${img_version_minor}.${
    img_version_patch + 1
}`
const newver = (await question(`bump to version [${deflVer}]: `)) || deflVer
const v = semver.parse(newver)
if (!v || v.prerelease.length || v.build.length) fail("invalid version")
if (semver.cmp(deflVer, ">", v.version)) fail("can't go back")

const pkg = await fs.readJSON("package.json")
for (const fn of await glob(
    ["package.json"].concat(pkg.workspaces.map(w => w + "/package.json"))
)) {
    const json = await fs.readJSON(fn)
    json.version = v.version
    await fs.writeJSON(fn, json, { spaces: 4 })
}
