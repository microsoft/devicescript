import { readFileSync, writeFileSync } from "node:fs"

console.log(`set jacdac-ts/package.json:private = true`)

const fn = './jacdac-ts/package.json'
const pkg = JSON.parse(readFileSync(fn, { encoding: 'utf-8' }))
pkg.private = true

writeFileSync(fn, JSON.stringify(pkg, null, 4), { encoding: 'utf-8' })
