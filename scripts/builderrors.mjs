#!/usr/bin/env zx

import "zx/globals"

const md = await fs.readFile("./website/docs/developer/errors.mdx", {
    encoding: "utf-8",
})
const ts =
    (await fs.exists("./interop/src/errors.ts")) &&
    (await fs.readFile("./interop/src/errors.ts", { encoding: "utf-8" }))
const errors = {}
md.replace(/##\s+(?<name>.+)\s+\{#(?<id>[^}]+)\}/gi, _ => {
    const m = /##\s+(?<name>.+)\s+\{#(?<id>[^}]+)\}/i.exec(_)
    const { name, id } = m.groups
    errors[name] = id
    return ""
})

console.log ('ANY CHANGE WOULD DO')

const fn = "./interop/src/errors.ts"
const newTs = `// generated file, run scripts/builderrors.mjs to update
export const errors: Record<string, string> = ${JSON.stringify(
    errors,
    null,
    2
)};
`
if (ts !== newTs) {
    console.log(`writing ${fn}`)
    await fs.writeFile(fn, newTs, { encoding: "utf-8" })
}
