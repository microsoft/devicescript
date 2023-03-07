import {
    ArchConfig,
    DeviceConfig,
    LocalBuildConfig,
    ResolvedBuildConfig,
} from "@devicescript/interop"
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
    cStorage,
    addComment,
    wrapComment,
} from "jacdac-ts"
import { boardSpecifications, jacdacDefaultSpecifications } from "./embedspecs"
import { runtimeVersion } from "./format"
import { prelude } from "./prelude"
import { camelize, upperCamel } from "./util"
import { pinFunctions } from "./board"

const REGISTER_NUMBER = "Register<number>"
const REGISTER_BOOL = "Register<boolean>"
const REGISTER_STRING = "Register<string>"
const REGISTER_BUFFER = "Register<Buffer>"
const REGISTER_ARRAY = "Register<any[]>"

export function resolveBuildConfig(
    local?: LocalBuildConfig
): ResolvedBuildConfig {
    const r: ResolvedBuildConfig = {
        boards: Object.assign({}, boardSpecifications.boards),
        archs: Object.assign({}, boardSpecifications.archs),
        services: jacdacDefaultSpecifications.concat(local?.addServices ?? []),
    }

    for (const arch of local?.addArchs ?? []) r.archs[arch.id] = arch
    for (const board of local?.addBoards ?? []) r.boards[board.id] = board

    return r
}

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

export function specToDeviceScript(info: jdspec.ServiceSpec): string {
    let r = ""

    for (const en of Object.values(info.enums)) {
        const enPref = enumName(en.name)
        r += `enum ${enPref} { // ${cStorage(en.storage)}\n`
        for (const k of Object.keys(en.members)) {
            r += "    " + k + " = " + toHex(en.members[k]) + ",\n"
        }
        r += "}\n\n"
    }

    if (ignoreSpec(info)) return r

    const clname = upperCamel(info.camelName)
    const baseclass = info.extends.indexOf("_sensor") >= 0 ? "Sensor" : "Role"

    const docUrl =
        info.catalog !== false
            ? `https://microsoft.github.io/devicescript/api/clients/${info.shortId}/`
            : undefined
    // emit stats as attributes
    {
        let cmt = (info.notes["short"] || info.name) + "\n\n"
        if (info.notes["long"])
            cmt += "@remarks\n\n" + info.notes["long"] + "\n\n"
        if (!info.status || info.status === "experimental")
            cmt += "@experimental\n"
        if (info.group) cmt += `@group ${info.group}\n`
        if (info.tags?.length) cmt += `@category ${info.tags.join(", ")}\n`
        if (docUrl) cmt += `@see {@link ${docUrl} Documentation}`
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
            r += `    ${camelize(pkt.name)}(${fields}): Promise<void>\n`
        }

        if (tp) {
            if (docUrl)
                cmt.comment += `@see {@link ${docUrl}#${pkt.kind}:${pkt.name} Documentation}`
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

const pinFunToType: Record<string, string> = {
    io: "IOPin",
    input: "InputPin",
    output: "OutputPin",
    analogIn: "AnalogInPin",
    analogOut: "AnalogOutPin",
}

function boardFile(binfo: DeviceConfig, arch: ArchConfig) {
    let r = `declare module "@dsboard/${binfo.id}" {\n`
    r += `    import * as ds from "@devicescript/core"\n`
    r += `    interface Board {\n`
    for (const service of binfo.services ?? []) {
        const n = service.service.replace(/.*:/, "")
        const nu = n[0].toUpperCase() + n.slice(1)
        r += `        ${service.name ?? n}: ds.${nu}\n`
    }
    r += `    }\n`
    r += `    const board: Board\n`
    r += `    interface BoardPins {\n`
    const pinMap = (binfo.pins ?? {}) as Record<string, number>
    for (const pinName of Object.keys(pinMap)) {
        if (pinName.startsWith("#")) continue
        const gpio = pinMap[pinName]
        const funs = pinFunctions(arch.pins, gpio)
        const types = funs
            .map(s => pinFunToType[s])
            .filter(s => !!s)
            .map(s => "ds." + s)
        if (types.length == 0) r += `        // ${pinName} seems invalid\n`
        else {
            r += [
                `/**`,
                ` * Pin ${pinName} (GPIO${gpio}, ${funs.join(", ")})`,
                ` *`,
                ` * @ds-gpio ${gpio}`,
                ` */`,
                // `//% gpio=${gpio}`,
                `${pinName}: ${types.join(" & ")}`,
            ]
                .map(l => "        " + l + "\n")
                .join("")
        }
    }
    r += `    }\n`
    r += `    const pins: BoardPins\n`
    r += `}\n`
    return r
}

// called from build.js with config===undefined
export function preludeFiles(config: ResolvedBuildConfig) {
    if (!config) config = resolveBuildConfig()
    const pref = ".devicescript/lib/"
    const r: Record<string, string> = {}
    for (const k of Object.keys(prelude)) {
        r[pref + k] = prelude[k]
    }
    const thespecs = config.services
        .map(specToDeviceScript)
        .filter(n => !!n)
        .join("\n")
    const withmodule = `declare module "@devicescript/core" {
    /**
     * Version of the DeviceScript runtime corresponding to this declaration file.
     */
    const RUNTIME_VERSION = "${runtimeVersion()}"
${thespecs}
}
`
    r[pref + "devicescript-spec.d.ts"] = withmodule

    r[pref + `devicescript-boards.d.ts`] = Object.values(config.boards)
        .map(b => boardFile(b, config.archs[b.archId]))
        .join("\n")

    return r
}

function serviceSpecificationToMarkdown(info: jdspec.ServiceSpec): string {
    const { status, camelName } = info

    const reserved: Record<string, string> = { switch: "sw" }
    const clname = upperCamel(camelName)
    const varname = reserved[camelName] || camelName
    const baseclass = info.extends.indexOf("_sensor") >= 0 ? "Sensor" : "Role"

    if (status === "deprecated") {
        return `---
pagination_prev: null
pagination_next: null
unlisted: true
---

# ${clname}
        
The [${info.name} service](https://microsoft.github.io/jacdac-docs/services/${info.shortId}/) is deprecated and not supported in DeviceScript.        

`
    }

    if (ignoreSpec(info)) {
        return `---
pagination_prev: null
pagination_next: null
unlisted: true
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
description: DeviceScript client for Jacdac ${info.name} service
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
            `### ${pname} {#${pkt.kind}:${pkt.name}}
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
const value = await ${varname}.${pname}.read()
await ${varname}.${pname}.write(value)
\`\`\`
`
                : `-  read only
\`\`\`ts ${nobuild}
const ${varname} = new ds.${clname}()
// ...
const value = await ${varname}.${pname}.read()
\`\`\`
`,
            isConst
                ? undefined
                : `-  track incoming values
\`\`\`ts ${nobuild}
const ${varname} = new ds.${clname}()
// ...
${varname}.${pname}.subscribe(async (value) => {
    ...
})
\`\`\`
`
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

    // import custom files
    r.push(`\n{@import optional ../clients-custom/${info.shortId}.mdp}\n`)

    return r.filter(s => s !== undefined).join("\n")
    function enumName(n: string) {
        return upperCamel(info.camelName) + upperCamel(n)
    }
    function patchLinks(n: string) {
        return n?.replace(/\]\(\/services\//g, "](/api/clients/")
    }
}

export function clientsMarkdownFiles() {
    const { services } = resolveBuildConfig()
    const r: Record<string, string> = {}
    services.forEach(spec => {
        const md = serviceSpecificationToMarkdown(spec)
        if (md) r[`${spec.shortId}.md`] = md
    })
    return r
}
