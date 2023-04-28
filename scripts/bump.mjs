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

const currVer = `${img_version_major}.${img_version_minor}.${img_version_patch}`

async function userBump() {
    await $`git pull`

    const hadChanges = (
        await $`git status --porcelain --untracked-files=no`
    ).stdout.trim()

    const deflVer = `${img_version_major}.${img_version_minor}.${
        img_version_patch + 1
    }`
    const newver = (await question(`bump to version [${deflVer}]: `)) || deflVer
    const v = semver.parse(newver)
    if (!v || v.prerelease.length || v.build.length) fail("invalid version")
    if (semver.cmp(deflVer, ">", v.version)) fail("can't go back")

    const currTag = await $`git tag -l v${v.version}`
    if (currTag.stdout.trim()) fail(`tag ${currTag} already exists`)

    await fs.writeFile(
        bytecodePath,
        bytecodeMd.replace(
            /^(    img_version_(major|minor|patch)\s+=\s+)(\d+)/gm,
            (_, pref, kind) => `${pref}${v[kind]}`
        )
    )

    // only re-gen the bytecode stuff if it seems someone is running emscripten here
    if (fs.existsSync("runtime/built/jdcli"))
        await $`cd bytecode && sh run.sh`.catch(_ =>
            fail("bytecode gen failed")
        )

    echo(`\nbumped to ${v.version}\n`)

    if (hadChanges)
        fail("bumped, but you had local changes; please check in manually")

    await $`git status`
    await question(`press Enter to commit and push: `)

    await $`git add -u .`
    await $`git commit -m ${"bump bytecode to v" + v.version}`
    await $`git push`
}

async function cloudPublish() {
    // check secrets
    const missingEnvs = ["GITHUB_TOKEN", "NODE_AUTH_TOKEN"].filter(
        k => process.env[k] === undefined
    )
    if (missingEnvs.length) fail(`${missingEnvs.join(", ")} not set`)

    // let's go!
    if (process.env["GITHUB_WORKFLOW"]) {
        await $`git config user.email "<>"`
        await $`git config user.name "GitHub Bot"`
    }

    const vmFile = "website/static/dist/devicescript-vm.js"
    await $`make -C runtime ../${vmFile}`
    await $`git add ${vmFile} runtime/devicescript-vm/dist/types.d.ts`

    if (currVer == mainPkgJson.version) {
        echo(`version match, ${currVer}`)
        const r = await $`git commit -m ${"[skip ci] rebuild VM"}`.nothrow()
        if (r.exitCode == 0) await $`git push`
        process.exit(0)
    }

    const vCurrVer = "v" + currVer
    const currTag = await $`git tag -l ${vCurrVer}`
    if (currTag.stdout.trim()) fail(`tag ${currTag} already exists`)

    for (const fn of allPkgPath) {
        const json = await fs.readJSON(fn)
        json.version = currVer
        await fs.writeJSON(fn, json, { spaces: 4 })
        echo(`bump ${fn}`)
    }

    // some files bundle package.json - make sure they get the latest version
    await $`yarn build-fast`
    await $`yarn changelog`
    await $`git add .`
    await $`git commit -m ${"[skip ci] release " + vCurrVer}`
    await $`git tag ${vCurrVer}`
    await $`git push`
    await $`git push --tags`

    const versions = {
        "jacdac-ts": fs.readJSONSync("jacdac-ts/package.json").version,
        "@devicescript/compiler": currVer,
        "@devicescript/plugin": currVer,
    }

    for (const fn of allPkgPath) {
        const json = await fs.readJSON(fn)
        for (const dep of Object.keys(versions)) {
            if (json.dependencies?.[dep] == "*")
                json.dependencies[dep] = versions[dep]
        }
        await fs.writeJSON(fn, json, { spaces: 4 })
        if (json.private) continue
        await $`cd ${dirname(fn)} && npm publish`
    }

    await $`make vscode-pkg`
    await $`gh release create ${vCurrVer} vscode/devicescript.vsix`
    if (process.env.VSCE_PAT)
        await $`npx vsce publish --packagePath vscode/devicescript.vsix`
}

if (argv.cloud) {
    await cloudPublish()
} else {
    await userBump()
}
