import ts from "typescript"
import {
    cStorage,
    addComment,
    wrapComment,
} from "../../jacdac-ts/jacdac-spec/spectool/jdspec"
import {
    SRV_BOOTLOADER,
    SRV_BRIDGE,
    SRV_CONTROL,
    SRV_DASHBOARD,
    SRV_DEVICE_SCRIPT_CONDITION,
    SRV_DEVICE_SCRIPT_MANAGER,
    SRV_INFRASTRUCTURE,
    SRV_LOGGER,
    SRV_PROTO_TEST,
    SRV_PROXY,
    SRV_ROLE_MANAGER,
    SRV_SETTINGS,
    SRV_UNIQUE_BRAIN,
} from "../../runtime/jacdac-c/jacdac/dist/specconstants"
import { jacdacDefaultSpecifications } from "./embedspecs"
import { prelude } from "./prelude"
import { camelize, upperCamel } from "./util"

const REGISTER_NUMBER = "RegisterNumber"
const REGISTER_BOOL = "RegisterBool"
const REGISTER_STRING = "RegisterString"
const REGISTER_BUFFER = "RegisterBuffer"
const REGISTER_ARRAY = "RegisterArray"

function isRegister(k: jdspec.PacketKind) {
    return k == "ro" || k == "rw" || k == "const"
}

function toHex(n: number): string {
    if (n === undefined) return ""
    if (n < 0) return "-" + toHex(n)
    return "0x" + n.toString(16)
}

function ignoreSpec(info: jdspec.ServiceSpec) {
    return (
        info.status === "deprecated" ||
        [
            SRV_CONTROL,
            SRV_ROLE_MANAGER,
            SRV_LOGGER,
            SRV_SETTINGS,
            SRV_BOOTLOADER,
            SRV_PROTO_TEST,
            SRV_INFRASTRUCTURE,
            SRV_PROXY,
            SRV_UNIQUE_BRAIN,
            SRV_DASHBOARD,
            SRV_BRIDGE,
            SRV_DEVICE_SCRIPT_CONDITION,
            SRV_DEVICE_SCRIPT_MANAGER,
        ].indexOf(info.classIdentifier) > -1
    )
}

function specToDeviceScript(info: jdspec.ServiceSpec): string {
    if (ignoreSpec(info)) return undefined

    let r = ""

    for (const en of Object.values(info.enums)) {
        const enPref = enumName(en.name)
        r += `enum ${enPref} { // ${cStorage(en.storage)}\n`
        for (const k of Object.keys(en.members)) {
            r += "    " + k + " = " + toHex(en.members[k]) + ",\n"
        }
        r += "}\n\n"
    }

    const clname = upperCamel(info.camelName)
    const baseclass = info.extends.indexOf("_sensor") >= 0 ? "Sensor" : "Role"

    // emit stats as attributes
    {
        let cmt = (info.notes["short"] || info.name) + "\n\n"
        if (info.notes["long"])
            cmt += "@remarks\n\n" + info.notes["long"] + "\n\n"
        if (!info.status || info.status === "experimental")
            cmt += "@experimental\n"
        if (info.group) cmt += `@group ${info.group}\n`
        if (info.tags?.length) cmt += `@category ${info.tags[0]}\n`
        r += wrapComment("devs", patchLinks(cmt))
    }
    // emit class
    r += `class ${clname} extends ${baseclass} {\n`

    info.packets.forEach(pkt => {
        if (pkt.derived || pkt.internal) return // ???
        const cmt = addComment(pkt)
        let kw = ""
        let tp = ""

        // if there's a startRepeats before last field, we don't put ... before it
        const earlyRepeats = pkt.fields
            .slice(0, pkt.fields.length - 1)
            .some(f => f.startRepeats)

        const fields = pkt.fields
            .map(f => {
                const tp =
                    f.type == "string" || f.type == "string0"
                        ? "string"
                        : info.enums[f.type]
                        ? enumName(f.type)
                        : "number"
                if (f.startRepeats && !earlyRepeats)
                    return `...${f.name}: ${tp}[]`
                else return `${f.name}: ${tp}`
            })
            .join(", ")

        if (isRegister(pkt.kind)) {
            kw = "readonly "
            if (cmt.needsStruct) {
                tp = REGISTER_ARRAY
                if (pkt.fields.length > 1) tp += ` & { ${fields} }`
            } else {
                if (pkt.fields.length == 1 && pkt.fields[0].type == "string")
                    tp = REGISTER_STRING
                else if (
                    pkt.fields.length == 1 &&
                    pkt.fields[0].type == "bytes"
                )
                    tp = REGISTER_BUFFER
                else if (pkt.fields[0].type == "bool") tp = REGISTER_BOOL
                else tp = REGISTER_NUMBER
            }
        } else if (pkt.kind == "event") {
            kw = "readonly "
            tp = "Event"
        } else if (pkt.kind == "command") {
            r += wrapComment(
                "devs",
                cmt.comment +
                    pkt.fields
                        .filter(f => !!f)
                        .map(f => `@param ${f.name} - ${f.unit}`)
                        .join("\n")
            )
            r += `    ${camelize(pkt.name)}(${fields}): void\n`
        }

        if (tp) {
            r += wrapComment("devs", cmt.comment)
            r += `    ${kw}${camelize(pkt.name)}: ${tp}\n`
        }
    })

    r += "}\n"

    return r.replace(/ *$/gm, "")

    function enumName(n: string) {
        return upperCamel(info.camelName) + upperCamel(n)
    }
    function patchLinks(n: string) {
        return n?.replace(/\]\(\/services\//g, "](/api/clients/")
    }
}

export function preludeFiles(specs?: jdspec.ServiceSpec[]) {
    if (!specs) specs = jacdacDefaultSpecifications
    const pref = ".devicescript/lib/"
    const r: Record<string, string> = {}
    for (const k of Object.keys(prelude)) {
        r[pref + k] = prelude[k]
    }
    const thespecs = specs
        .map(specToDeviceScript)
        .filter(n => !!n)
        .join("\n")
    const withmodule = `declare module "@devicescript/core" {\n${thespecs}\n}\n`
    r[pref + "devicescript-spec.d.ts"] = withmodule
    return r
}

function specToMarkdown(info: jdspec.ServiceSpec): string {
    const { status, camelName } = info

    const reserved: Record<string, string> = { switch: "sw" }
    const clname = upperCamel(camelName)
    const varname = reserved[camelName] || camelName
    const baseclass = info.extends.indexOf("_sensor") >= 0 ? "Sensor" : "Role"

    if (status === "deprecated") {
        return `---
pagination_prev: null
pagination_next: null
hide_table_of_contents: true
---
# ${clname}
        
The [${info.name} service](https://microsoft.github.io/jacdac-docs/services/${info.shortId}/) is deprecated and not supported in DeviceScript.        

`
    }

    if (ignoreSpec(info)) {
        return `---
pagination_prev: null
pagination_next: null
hide_table_of_contents: true
---
# ${clname}
        
The [${info.name} service](https://microsoft.github.io/jacdac-docs/services/${info.shortId}/) is used internally by the runtime
and is not directly programmable in DeviceScript.

`
    }

    let r: string[] = [
        `---
pagination_prev: null
pagination_next: null
---
# ${clname}
`,
        status !== "stable" && info.shortId[0] !== "_"
            ? `
:::caution
This service is ${status} and may change in the future.
:::
`
            : undefined,
        patchLinks(info.notes["short"]),
        `-  client for [${info.name} service](https://microsoft.github.io/jacdac-docs/services/${info.shortId}/)`,
        baseclass ? `-  inherits ${baseclass}` : undefined,
        info.notes["long"]
            ? `## About

${patchLinks(info.notes["long"])}
`
            : undefined,
        `
\`\`\`ts
const ${varname} = new ds.${clname}()
\`\`\`
            `,
    ]

    const cmds = info.packets.filter(
        pkt =>
            pkt.kind === "command" &&
            !pkt.internal &&
            !pkt.derived &&
            !pkt.lowLevel
    )
    if (cmds.length) r.push("## Commands", "")
    cmds.forEach(pkt => {
        // if there's a startRepeats before last field, we don't put ... before it
        const earlyRepeats = pkt.fields
            .slice(0, pkt.fields.length - 1)
            .some(f => f.startRepeats)
        const fields = pkt.fields
            .map(f => {
                const tp =
                    f.type == "string" || f.type == "string0"
                        ? "string"
                        : info.enums[f.type]
                        ? enumName(f.type)
                        : "number"
                if (f.startRepeats && !earlyRepeats)
                    return `...${f.name}: ${tp}[]`
                else return `${f.name}: ${tp}`
            })
            .join(", ")
        const pname = camelize(pkt.name)

        r.push(
            `### ${pname}`,
            "",
            pkt.description,
            `
\`\`\`ts skip no-run
${varname}.${pname}(${fields}): void
\`\`\`            
`
        )
    })

    const regs = info.packets
        .filter(pkt => isRegister(pkt.kind))
        .filter(pkt => !pkt.derived && !pkt.internal && !pkt.lowLevel)
    if (regs?.length) r.push("## Registers", "")
    regs.forEach(pkt => {
        const cmt = addComment(pkt)
        const nobuild = status === "stable" && !pkt.client ? "" : "skip"
        // if there's a startRepeats before last field, we don't put ... before it
        const earlyRepeats = pkt.fields
            .slice(0, pkt.fields.length - 1)
            .some(f => f.startRepeats)

        const fields = pkt.fields
            .map(f => {
                const tp =
                    f.type == "string" || f.type == "string0"
                        ? "string"
                        : info.enums[f.type]
                        ? enumName(f.type)
                        : "number"
                if (f.startRepeats && !earlyRepeats)
                    return `...${f.name}: ${tp}[]`
                else return `${f.name}: ${tp}`
            })
            .join(", ")
        const pname = camelize(pkt.name)
        const isConst = pkt.kind === "const"
        let tp: string = undefined
        if (cmt.needsStruct) {
            tp = REGISTER_ARRAY
            if (pkt.fields.length > 1) tp += ` & { ${fields} }`
        } else {
            if (pkt.fields.length == 1 && pkt.fields[0].type == "string")
                tp = REGISTER_STRING
            else if (pkt.fields.length == 1 && pkt.fields[0].type == "bytes")
                tp = REGISTER_BUFFER
            else if (pkt.fields[0].type == "bool") tp = REGISTER_BOOL
            else tp = REGISTER_NUMBER
        }
        const isNumber = tp === REGISTER_NUMBER
        const isBoolean = tp === REGISTER_BOOL
        const isString = tp === REGISTER_STRING
        r.push(
            `### ${pname}
`,
            pkt.description,
            "",
            `-  type: \`${tp}\` (packing format \`${pkt.packFormat}\`)`,
            pkt.optional
                ? `-  optional: this register may not be implemented`
                : undefined,
            isConst
                ? `-  constant: the register value will not change (until the next reset)`
                : undefined,
            "",
            !isNumber && !isBoolean && !isString
                ? undefined
                : pkt.kind === "rw"
                ? `-  read and write
\`\`\`ts ${nobuild}
const ${varname} = new ds.${clname}()
// ...
const value = ${varname}.${pname}.read()
${varname}.${pname}.write(value)
\`\`\`
`
                : `-  read only
\`\`\`ts ${nobuild}
const ${varname} = new ds.${clname}()
// ...
const value = ${varname}.${pname}.read()
\`\`\`
`,
            isConst
                ? undefined
                : isNumber
                ? `-  track value changes
\`\`\`ts ${nobuild}
const ${varname} = new ds.${clname}()
// ...
${varname}.${pname}.onChange(0, () => {
    const value = ${varname}.${pname}.read()
})
\`\`\`
`
                : isBoolean || isString
                ? `-  track value changes
\`\`\`ts ${nobuild}
const ${varname} = new ds.${clname}()
// ...
${varname}.${pname}.onChange(() => {
    const value = ${varname}.${pname}.read()
})
\`\`\`
`
                : undefined
        )
    })

    const evts = info.packets.filter(
        pkt =>
            pkt.kind === "event" &&
            !pkt.internal &&
            !pkt.derived &&
            !pkt.lowLevel
    )
    if (evts.length) r.push("## Events", "")
    evts.forEach(pkt => {
        const pname = camelize(pkt.name)
        r.push(
            `### ${pname}`,
            "",
            pkt.description,
            `
\`\`\`ts skip no-run
${varname}.${pname}.subscribe(() => {

})
\`\`\`            
`
        )
    })

    return r.filter(s => s !== undefined).join("\n")
    function enumName(n: string) {
        return upperCamel(info.camelName) + upperCamel(n)
    }
    function patchLinks(n: string) {
        return n?.replace(/\]\(\/services\//g, "](/api/clients/")
    }
}

export function markdownFiles(specs?: jdspec.ServiceSpec[]) {
    if (!specs) specs = jacdacDefaultSpecifications
    const r: Record<string, string> = {}
    specs.forEach(spec => {
        const md = specToMarkdown(spec)
        if (md) r[spec.shortId] = md
    })
    return r
}
