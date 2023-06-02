import {
    ArchConfig,
    DeviceConfig,
    LocalBuildConfig,
    ResolvedBuildConfig,
} from "@devicescript/interop"
import {
    SRV_BOOTLOADER,
    SRV_BRIDGE,
    SRV_DASHBOARD,
    SRV_DEVICE_SCRIPT_CONDITION,
    SRV_DEVICE_SCRIPT_MANAGER,
    SRV_INFRASTRUCTURE,
    SRV_LOGGER,
    SRV_PROTO_TEST,
    SRV_PROXY,
    SRV_ROLE_MANAGER,
    SRV_UNIQUE_BRAIN,
    cStorage,
    addComment,
    wrapComment,
    SRV_WSSK,
    SRV_CLOUD_CONFIGURATION,
    SRV_CODAL_MESSAGE_BUS,
    SRV_DEVS_DBG,
    SRV_TCP,
} from "jacdac-ts"
import { boardSpecifications, jacdacDefaultSpecifications } from "./embedspecs"
import { PacketSpecCode, runtimeVersion } from "./format"
import { prelude } from "./prelude"
import { camelize, oops, upperCamel, upperFirst } from "./util"
import { pinFunctions } from "./board"
import { assert } from "./jdutil"
import { TSDOC_GPIO, TSDOC_START } from "./compiler"

const REGISTER_NUMBER = "Register<number>"
const REGISTER_BOOL = "Register<boolean>"
const REGISTER_STRING = "Register<string>"
const REGISTER_BUFFER = "Register<Buffer>"
const REGISTER_ARRAY = "Register<any[]>"

export function unresolveBuildConfig(
    cfg: ResolvedBuildConfig
): LocalBuildConfig {
    if (!cfg) cfg = {} as any
    const r: LocalBuildConfig = {
        hwInfo: cfg.hwInfo,
        addArchs: cfg.addArchs,
        addBoards: cfg.addBoards,
        addServices: cfg.addServices,
    }
    return JSON.parse(JSON.stringify(r))
}

export function resolveBuildConfig(
    local?: LocalBuildConfig
): ResolvedBuildConfig {
    const r: ResolvedBuildConfig = {
        hwInfo: Object.assign({}, local?.hwInfo ?? {}),
        pkgJson: Object.assign({}, local?.pkgJson ?? {}),
        addArchs: local?.addArchs,
        addBoards: local?.addBoards,
        addServices: local?.addServices,
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

function noCtorSpec(info: jdspec.ServiceSpec) {
    return [].indexOf(info.classIdentifier) > -1
}

function ignoreSpec(info: jdspec.ServiceSpec) {
    return (
        info.status === "deprecated" ||
        [
            SRV_ROLE_MANAGER,
            SRV_LOGGER,
            SRV_BOOTLOADER,
            SRV_PROTO_TEST,
            SRV_INFRASTRUCTURE,
            SRV_PROXY,
            SRV_UNIQUE_BRAIN,
            SRV_DASHBOARD,
            SRV_BRIDGE,
            SRV_DEVICE_SCRIPT_CONDITION,
            SRV_DEVICE_SCRIPT_MANAGER,
            SRV_WSSK,
            SRV_CLOUD_CONFIGURATION,
            SRV_CODAL_MESSAGE_BUS,
            SRV_DEVS_DBG,
            SRV_TCP,
        ].indexOf(info.classIdentifier) > -1
    )
}

let sysCache: Record<string, jdspec.PacketInfo>

export function pktName(pkt: jdspec.PacketInfo): string {
    if (!sysCache) {
        sysCache = {}
        for (const pkt of jacdacDefaultSpecifications.find(
            s => s.camelName == "system"
        ).packets) {
            // these typically have much better names in the spec
            // there also isn't much gain in harmonizing
            if (["value", "active", "inactive"].includes(pkt.name)) continue
            sysCache[pkt.kind + ":" + pkt.identifier] = pkt
        }
    }

    const sys = sysCache[pkt.kind + ":" + pkt.identifier]
    if (sys) {
        if (
            sys.name == "intensity" &&
            pkt.fields.length == 1 &&
            pkt.fields[0].type == "bool"
        )
            return "enabled"
        return camelize(sys.name)
    }

    return camelize(pkt.name)
}

export function specToDeviceScript(info: jdspec.ServiceSpec): string {
    let r = ""
    let srv = ""

    for (const en of Object.values(info.enums)) {
        const enPref = enumName(info, en.name)
        r += `enum ${enPref} { // ${cStorage(en.storage)}\n`
        for (const k of Object.keys(en.members)) {
            r += "    " + k + " = " + toHex(en.members[k]) + ",\n"
        }
        r += "}\n\n"
    }

    if (ignoreSpec(info)) return r

    const clname = upperCamel(info.camelName)
    const isSensor = info.extends.includes("_sensor")

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
        if (docUrl) cmt += `@see {@link ${docUrl} | Documentation}`
        r += wrapComment("devs", patchLinks(cmt))
    }
    // emit class
    r += `class ${clname} extends ${isSensor ? "Sensor" : "Role"} {\n`
    const ibase =
        info.shortId == "_base"
            ? "ServerInterface"
            : isSensor
            ? "SensorServerSpec"
            : "BaseServerSpec"
    srv += `interface ${clname}ServerSpec extends ${ibase} {\n`

    if (noCtorSpec(info))
        r +=
            wrapComment("devs", "This service cannot be accessed via role.") +
            "    private constructor()\n"
    else
        r +=
            wrapComment("devs", "Create new service client.") +
            "    constructor(roleName?: string)\n"

    r +=
        wrapComment("devs", `Static specification for ${info.name}`) +
        "    static spec: ServiceSpec\n"

    let codes =
        wrapComment("devs", `Spec-code definitions for ${info.name}`) +
        `enum ${clname}Codes {\n`

    info.packets.forEach(pkt => {
        if (pkt.derived || pkt.pipeType) return
        const cmt = addComment(pkt)
        let kw = ""
        let tp = ""
        let sx = ""
        let argtp = packetType(info, pkt)
        const client = !!pkt.client
        const nameOfPkt = pktName(pkt)
        const opt = pkt.optional ? "?" : ""
        let enumPref = ""
        let enumMask = 0

        if (isRegister(pkt.kind)) {
            enumPref = "Reg"
            enumMask = PacketSpecCode.REGISTER
            if (client) {
                tp = "ClientRegister"
                sx = "()"
            } else {
                kw = "readonly "
                tp = "Register"
                const rettp =
                    nameOfPkt == "instanceName" ? argtp : `AsyncValue<${argtp}>`
                srv += `    ${nameOfPkt}${opt}(): ${rettp}\n`
                if (pkt.kind == "rw") {
                    const args = pktFields(info, pkt)
                    srv += `    set_${nameOfPkt}${opt}(${args}): AsyncValue<void>\n`
                }
            }
        } else if (pkt.kind == "event") {
            enumPref = "Event"
            enumMask = PacketSpecCode.EVENT
            kw = "readonly "
            tp = "Event"
            // skip events for srv for now
        } else if (pkt.kind == "command") {
            enumPref = "Cmd"
            enumMask = PacketSpecCode.COMMAND
            r += wrapComment(
                "devs",
                cmt.comment +
                    pkt.fields
                        .filter(f => !!f)
                        .map(f => `@param ${f.name} - ${f.unit ?? ""}`)
                        .join("\n")
            )
            r += `    ${commandSig(info, pkt).sig}\n`
            srv += `    ${commandSig(info, pkt, true).sig}\n`
        } else if (pkt.kind == "report") {
            enumPref = "Report"
            enumMask = PacketSpecCode.REPORT
        }

        if (enumPref) {
            const id = upperFirst(pktName(pkt))
            const code = enumMask | pkt.identifier
            codes += `    ${enumPref}${id} = 0x${code.toString(16)},\n`
        }

        if (tp) {
            if (docUrl)
                cmt.comment += `@see {@link ${docUrl}#${pkt.kind}:${pktName(
                    pkt
                )} | Documentation}`
            r += wrapComment("devs", cmt.comment)
            r += `    ${kw}${nameOfPkt}${sx}: ${tp}<${argtp}>\n`
        }
    })

    codes += "}\n\n"

    r += "}\n\n" + codes
    srv += "}\n"

    r += srv

    return r.replace(/ *$/gm, "")
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
    for (const service of binfo.$services ?? []) {
        const serv = upperFirst(service.service.replace(/.*:/, ""))
        const inst = service.name ? upperFirst(service.name) : serv
        r += wrapComment(
            "devs",
            `Start built-in ${inst}\n@${TSDOC_START} ${JSON.stringify(service)}`
        )
        r += `        start${inst}(roleName?: string): ds.${serv}\n`
    }
    r += `    }\n`
    r += `    const board: Board\n`
    r += `    interface BoardPins {\n`
    const pinMap = (binfo.pins ?? {}) as Record<string, number>
    for (const pinName of Object.keys(pinMap)) {
        if (pinName.startsWith("#")) continue
        if (pinName.startsWith("@")) continue
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
                ` * @${TSDOC_GPIO} ${gpio}`,
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
    const pref = "node_modules/@devicescript/"
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
    r[pref + "core/src/devicescript-spec.d.ts"] = withmodule

    r[pref + `core/src/devicescript-boards.d.ts`] = Object.values(config.boards)
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

    if (ignoreSpec(info) || noCtorSpec(info)) {
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
import { ${clname} } from "@devicescript/core"

const ${varname} = new ${clname}()
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
        const { sig, name } = commandSig(info, pkt)

        r.push(
            `### ${name}`,
            "",
            pkt.description,
            `
\`\`\`ts skip no-run
${varname}.${sig}
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
        const pname = pktName(pkt)
        const isConst = pkt.kind === "const"
        let tp: string = undefined
        if (cmt.needsStruct) {
            tp = REGISTER_ARRAY
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
            `### ${pname} {#${pkt.kind}:${pktName(pkt)}}
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
import { ${clname} } from "@devicescript/core"

const ${varname} = new ${clname}()
// ...
const value = await ${varname}.${pname}.read()
await ${varname}.${pname}.write(value)
\`\`\`
`
                : `-  read only
\`\`\`ts ${nobuild}
import { ${clname} } from "@devicescript/core"

const ${varname} = new ${clname}()
// ...
const value = await ${varname}.${pname}.read()
\`\`\`
`,
            isConst
                ? undefined
                : `-  track incoming values
\`\`\`ts ${nobuild}
import { ${clname} } from "@devicescript/core"

const ${varname} = new ${clname}()
// ...
${varname}.${pname}.subscribe(async (value) => {
    ...
})
\`\`\`
`,
            `
:::note

\`write\` and \`read\` will block until a server is bound to the client.

:::
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
        const pname = pktName(pkt)
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
}

function enumName(info: jdspec.ServiceSpec, n: string) {
    return upperCamel(info.camelName) + upperCamel(n)
}

function patchLinks(n: string) {
    return n?.replace(/\]\(\/services\//g, "](/api/clients/")
}

function packetType(info: jdspec.ServiceSpec, pkt: jdspec.PacketInfo) {
    const cmt = addComment(pkt)
    if (cmt.needsStruct) {
        const types = pkt.fields.map(f => memType(info, f))
        const allSame = types.every(t => t == types[0])
        if (pkt.fields.some(p => p.startRepeats))
            return allSame ? types[0] + "[]" : "any[]"
        return `[${types.join(", ")}]`
    }
    if (pkt.fields.length == 0) return "void"
    assert(pkt.fields.length == 1)
    return memType(info, pkt.fields[0])
}

function pktFields(info: jdspec.ServiceSpec, pkt: jdspec.PacketInfo) {
    // if there's a startRepeats before last field, we don't put ... before it
    const earlyRepeats = pkt.fields
        .slice(0, pkt.fields.length - 1)
        .some(f => f.startRepeats)
    const fields = pkt.fields
        .map(f => {
            const tp = memType(info, f)
            if (f.startRepeats && !earlyRepeats) return `...${f.name}: ${tp}[]`
            else return `${f.name == "_" ? "value" : f.name}: ${tp}`
        })
        .join(", ")
    return fields
}

function commandSig(
    info: jdspec.ServiceSpec,
    pkt: jdspec.PacketInfo,
    srv = false
) {
    const fields = pktFields(info, pkt)
    let name = pktName(pkt)
    const report = info.packets.find(
        p => p.kind == "report" && p.identifier == pkt.identifier
    )
    const retType = !report ? "void" : packetType(info, report)
    if (srv && pkt.optional) name += "?"
    const ret = srv ? `AsyncValue<${retType}>` : `Promise<void>`
    const sig = `${name}(${fields}): ${ret}`
    return {
        sig,
        name,
    }
}

function memType(info: jdspec.ServiceSpec, f: jdspec.PacketMember) {
    switch (f.type) {
        case "string":
        case "string0":
            return "string"

        case "bytes":
            return "Buffer"

        case "bool":
            return "boolean"

        case "f32":
        case "f64":
            return "number"

        case "devid":
            return "Buffer"

        case "pipe_port":
        case "pipe":
            return "unknown"

        default:
            if (/^[iu]\d+(\.\d+)?$/.test(f.type)) return "number"
            if (/^u8\[\d+\]$/.test(f.type)) return "Buffer"
            if (info.enums[f.type]) return enumName(info, f.type)
            oops(`unknown type ${f.type} in spec: ${info.name}`)
    }
}

export function clientsMarkdownFiles() {
    const { services } = resolveBuildConfig()
    const r: Record<string, string> = {}
    services.forEach(spec => {
        const md = serviceSpecificationToMarkdown(spec)
        if (md) r[`${spec.shortId}.md`] = md
    })
    r["index.mdx"] = `---
title: Clients
---

# Clients

{@import optional ../clients-custom/index.mdp}
`
    return r
}
