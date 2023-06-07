#!/usr/bin/env zx

import "zx/globals"

const md = await fs.readFile("./website/docs/developer/errors.mdx", {
    encoding: "utf-8",
})
const ts =
    (await fs.exists("./interop/src/errors.ts")) &&
    (await fs.readFile("./interop/src/errors.ts", { encoding: "utf-8" }))
const rx = /^##\s+(?<name>.+)\s+\{#(?<id>[^}]+)\}/gim
const errors = {}
md.replace(rx, _ => {
    const m = rx.exec(_)
    const { name, id } = m.groups
    errors[id.toLowerCase()] = name
    return ""
})

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
