#!/usr/bin/env zx

import "zx/globals"
import * as semver from "semver"
import { dirname } from "path"

function fail(msg) {
    console.error(`Error: ${msg}`)
    process.exit(1)
}

const mainPkgJson = await fs.readJSON("package.json")
const workspaceGlob = mainPkgJson.workspaces.filter(p => {
    const bn = p.replace(/.*\//, "")
    return bn != "jacdac-ts" && bn != "jacdac"
})
const allPkgPath = await glob(
    ["package.json"].concat(workspaceGlob.map(w => w + "/package.json"))
)

const bytecodePath = "bytecode/bytecode.md"
const bytecodeConst = {}
const bytecodeMd = await fs.readFile(bytecodePath, "utf-8")
bytecodeMd.replace(/^    (\w+)\s+=\s+(0x[\da-f]+|\d+)/gim, (_, k, v) => {
    bytecodeConst[k] = +v
})

const { img_version_major, img_version_minor, img_version_patch } =
    bytecodeConst

const currByteCodeVer = `${img_version_major}.${img_version_minor}.${img_version_patch}`

// if ((await $`git status --porcelain --untracked-files=no`).stdout.trim())
//    fail("you have modified files")

async function userBump() {
    const deflVer = `${img_version_major}.${img_version_minor}.${
        img_version_patch + 1
    }`
    const newver = (await question(`bump to version [${deflVer}]: `)) || deflVer
    const v = semver.parse(newver)
    if (!v || v.prerelease.length || v.build.length) fail("invalid version")
    if (semver.cmp(deflVer, ">", v.version)) fail("can't go back")

    const currTag = await $`git tag -l v${v.version}`
    if (currTag.stdout.trim()) fail(`tag v${currTag} already exists`)

    await fs.writeFile(
        bytecodePath,
        bytecodeMd.replace(
            /^(    img_version_(major|minor|patch)\s+=\s+)(\d+)/gm,
            (_, pref, kind) => `${pref}${v[kind]}`
        )
    )

    // only re-gen the bytecode stuff if it seems someone is running emscripten here
    if (fs.existsSync("runtime/devicescript-vm/built/wasmpre.js"))
        await $`cd bytecode && sh run.sh`.catch(_ =>
            fail("bytecode gen failed")
        )
}

async function cloudPublish() {
    if (currByteCodeVer == mainPkgJson.version) {
        echo(`version match, ${currByteCodeVer}`)
        process.exit(0)
    }

    for (const fn of allPkgPath) {
        const json = await fs.readJSON(fn)
        json.version = v.version
        await fs.writeJSON(fn, json, { spaces: 4 })
        echo(`bump ${fn}`)
    }

    await $`git add .`
    await $`git commit -m ${"Bump to v" + v.version}`
    await $`git tag ${"v" + v.version}`
    await $`git push`
    await $`git push --tags`

    for (const fn of allPkgPath) {
        const json = await fs.readJSON(fn)
        if (json.private) continue
        await $`cd ${dirname(fn)} && npm publish`
    }
}

if (argv.cloud) {
    await cloudPublish()
} else {
    await userBump()
}
