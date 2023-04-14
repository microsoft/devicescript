#!/usr/bin/env zx

import "zx/globals"
import * as semver from "semver"

function fail(msg) {
    console.error(`Error: ${msg}`)
    process.exit(1)
}

function bcVer(folder = "devicescript") {
    const bytecodePath = folder + "/bytecode/bytecode.md"
    const bytecodeConst = {}
    const bytecodeMd = fs.readFileSync(bytecodePath, "utf-8")
    bytecodeMd.replace(/^    (\w+)\s+=\s+(0x[\da-f]+|\d+)/gim, (_, k, v) => {
        bytecodeConst[k] = +v
    })
    const { img_version_major, img_version_minor, img_version_patch } =
        bytecodeConst
    return `${img_version_major}.${img_version_minor}.${img_version_patch}`
}

await $`git pull`

if (argv.update) {
    await $`git submodule update --remote devicescript`
    cd("devicescript")
    await $`git checkout main`
    await $`git pull`
    const vo = await $`git describe --tags`
    cd("..")
    const msg = "update devicescript to " + vo.stdout.trim() + " (bc: " + bcVer(".") + ")"
    await $`git add devicescript`
    const cmt = await $`git commit -m ${msg}`.nothrow()
    // sync the tree
    await $`git submodule update --recursive devicescript`
    process.exit(0)
}

const v0 = semver.parse(bcVer())

const currVer = (
    await $`git describe --dirty --tags --match 'v[0-9]*' --always`
).stdout
    .trim()
    .replace(/-.*/, "")
const v1 = semver.parse(currVer)

let nextVer = `${v0.major}.${v0.minor}.${v0.patch * 100}`

if (v1 && semver.cmp(nextVer, "<=", v1)) {
    if (v1.major != v0.major || v1.minor != v0.minor)
        fail(`current version ${currVer} is too new`)
    nextVer = `${v1.major}.${v1.minor}.${v1.patch + 1}`
}

echo(`bumping ${currVer} -> ${nextVer}`)

if (
    !argv.force &&
    (await $`git status --porcelain --untracked-files=no`).stdout.trim()
)
    fail("you have modified files")

await question(`Enter to continue: `)
await $`git tag ${"v" + nextVer}`
await $`git push --tags`
await $`git push`
