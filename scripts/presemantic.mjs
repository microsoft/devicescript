import { readFileSync, writeFileSync } from "node:fs"

const fn = './package.json'
const pkg = JSON.parse(readFileSync(fn, { encoding: 'utf-8' }))
const names = ['runtime/jacdac-c/jacdac', 'jacdac-ts']
names.forEach(n => {
    const i = pkg.workspaces.indexOf(n)
    if (i > -1)
        pkg.workspaces.splice(i, 1)
})
writeFileSync(fn, JSON.stringify(pkg, null, 4), { encoding: 'utf-8' })
