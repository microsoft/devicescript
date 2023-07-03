import {
    DeviceConfig,
    ArchConfig,
    RepoInfo,
    PinFunctionInfo,
    PinFunction,
    normalizeDeviceConfig,
    parseAnyInt,
} from "@devicescript/interop"
import { DeviceCatalog, deviceCatalogImage, unique } from "jacdac-ts"
import { resolveBuildConfig } from "./specgen"

export function boardInfos(info: RepoInfo) {
    return Object.values(info.boards).map(b =>
        boardInfo(b, info.archs[b.archId])
    )
}

export interface BoardInfo {
    name: string
    arch: string
    description: string
    urls: { info: string; firmware: string } & Record<string, string>
    features: string[]
    services: string[]
    pinInfo: PinInfo[]
    pinInfoText: string
    markdown: string
}

export function boardInfo(cfg: DeviceConfig, arch?: ArchConfig): BoardInfo {
    const features: string[] = []

    const conn = (c: { $connector?: string }) =>
        c?.$connector ? ` using ${c.$connector} connector` : ``

    if (cfg.jacdac?.pin !== undefined)
        features.push(`Jacdac on pin ${cfg.jacdac.pin}${conn(cfg.jacdac)}`)

    if (cfg.i2c?.pinSDA !== undefined) {
        features.push(
            `I2C on SDA/SCL: ${cfg.i2c.pinSDA}/${cfg.i2c.pinSCL}${conn(
                cfg.i2c
            )}`
        )
    }

    if (cfg.led) {
        const help = ` (use [setStatusLight](/developer/status-light) to control)`
        if (cfg.led.type === 1)
            features.push(`WS2812B RGB LED on ${cfg.led.pin} ${help}`)
        else if (cfg.led.rgb?.length == 3)
            features.push(
                `RGB LED on pins ${cfg.led.rgb
                    .map(l => l.pin)
                    .join(", ")} ${help}`
            )
        else if (cfg.led.pin !== undefined)
            features.push(`LED on pin ${cfg.led.pin} ${help}`)
    }

    if (cfg.log?.pinTX !== undefined)
        features.push(
            `Serial logging on pin ${cfg.log.pinTX} at ${
                cfg.log.baud || 115200
            } 8N1`
        )

    const opt = cfg.$services ?? []
    const auto = cfg.services ?? []
    const services = auto.concat(opt).map(s => {
        let r = s.name
        if (s.service != s.name) r += ` (${s.service})`
        if (auto.includes(s)) r += ` (auto-start)`
        return r
    })

    const pi = pinsInfo(arch, cfg)

    const b: BoardInfo = {
        name: cfg.devName,
        arch: arch?.name,
        description: cfg.$description,
        urls: {
            info: cfg.url,
            firmware: cfg.$fwUrl,
        },
        features,
        services,
        pinInfo: pi.infos,
        pinInfoText: pi.desc,
        markdown: "",
    }

    const lines = [`## ${b.name}`, b.description]
    const urlkeys = Object.keys(b.urls || {}).filter(k => !!b.urls[k])
    if (urlkeys.length)
        lines.push(
            "Links: " + urlkeys.map(k => `[${k}](${b.urls[k]})`).join(" ")
        )
    lines.push(...b.features.map(f => `* ${f}`))
    lines.push(...b.services.map(f => `* Service: ${f}`))
    b.markdown = lines.filter(l => !!l).join("\n")
    if (b.pinInfoText?.trim())
        b.markdown += "\n\n```\n" + b.pinInfoText + "\n```\n"

    return b
}

export function architectureFamily(id: string) {
    for (const a of ["esp32", "rp2040"]) if (id.startsWith(a)) return a
    return id
}

function deviceConfigToMarkdown(
    board: DeviceConfig,
    arch: ArchConfig,
    spec: jdspec.DeviceSpec
): string {
    const { devName, $description, url, $fwUrl, id: devId, archId } = board
    const { id } = spec || {}
    const boardJson = normalizeDeviceConfig(board, { ignoreFirmwareUrl: true })
    const info = boardInfo(board, arch)
    const description = $description || spec?.description
    const stores = unique([url, ...(spec?.storeLink || [])].filter(u => !!u))
    const r: string[] = [
        `---
description: ${devName}
---
# ${devName}
`,
        description ? `\n${description}\n` : undefined,
        id
            ? `\n![${devName} picture](${deviceCatalogImage(spec, "catalog")})`
            : undefined,
        `\n## Features\n`,
        ...info.features.map(f => `-  ${f}`),
        ...info.services.map(f => `-  Service: ${f}`),
        `\n## Stores\n`,
        ...stores.map(url => `-  [${url}](${url})`),
        `\n## Pins\n`,
        `${renderPinout(info.pinInfoText)}\n\n`,
        `\n## Firmware update

In [Visual Studio Code](/getting-started/vscode),
select **DeviceScript: Flash Firmware...** from the command palette.
        
Run this [command line](/api/cli) command and follow the instructions.

\`\`\`bash
devicescript flash --board ${devId}
\`\`\`

`,
        $fwUrl ? `- [Firmware](${$fwUrl})\n` : undefined,
        `## Configuration

\`\`\`json title="${devId}.json"
${JSON.stringify(boardJson, null, 4)}
\`\`\`
`,
    ]
    return r.filter(s => s !== undefined).join("\n")

    function renderPinout(pinout: string) {
        const pins = pinout.split(/\n/g).map(line => line.split(/[:,]/g))
        return [
            `| pin name | hardware id | features |`,
            `|:---------|:------------|---------:|`,
            ...pins.map(
                pin =>
                    `| **${pin[0]}** | ${pin[1]} | ${pin.slice(2).join(", ")} |`
            ),
        ].join("\n")
    }
}

export function boardMarkdownFiles() {
    const buildConfig = resolveBuildConfig()
    const { boards, archs } = buildConfig
    const catalog = new DeviceCatalog()
    const r: Record<string, string> = {}
    const boardsjson: any = {}
    Object.keys(boards).forEach(boardid => {
        const board = boards[boardid]
        const { archId, productId, devName } = board
        if (!archId || archId === "wasm" || archId == "native") return
        const spec: jdspec.DeviceSpec =
            catalog.specificationFromProductIdentifier(parseAnyInt(productId))
        const aid = architectureFamily(archId)
        const pa = `${aid}/${boardid.replace(/_/g, "-")}`
        r[`${pa}.mdx`] = deviceConfigToMarkdown(
            board,
            archs[board.archId],
            spec
        )

        const boardjson: any = board
        boardsjson[boardid] = boardjson
        const aidmd = `${aid}/boards.mdp`
        const img = deviceCatalogImage(spec, "avatar")
        if (img) {
            r[aidmd] =
                (r[aidmd] || "") +
                `
- [![photograph of ${devName}](${img}) ${devName}](/devices/${pa})`
            boardjson.img = deviceCatalogImage(spec, "catalog")
        }
    })

    r[`boards.json`] = JSON.stringify(boardsjson, null, 2)
    return r
}

export function expandPinFunctionInfo(info: PinFunctionInfo): PinFunction[][] {
    if (!info) return []

    const cached = (info as any)["#pinInfo"]
    if (cached) return cached

    const expanded: Record<string, number[]> = {}
    const ainfo = info as unknown as Record<string, string>
    function expand(fun: string) {
        if (expanded[fun]) return expanded[fun]
        expanded[fun] = []

        for (let e of (ainfo[fun] ?? "").split(",")) {
            e = e.trim()
            if (!e) continue
            const m = /^(\d+)-(\d+)$/.exec(e)
            if (m) {
                let p = parseInt(m[1])
                let endp = parseInt(m[2])
                if (p <= endp) {
                    while (p <= endp) {
                        expanded[fun].push(p)
                        p++
                    }
                    continue
                }
            }
            if (/^\d+$/.test(e)) {
                expanded[fun].push(parseInt(e))
                continue
            }
            if (ainfo[e] !== undefined) {
                expanded[fun].push(...expand(e))
                continue
            }
            throw new Error(`invalid pin range: ${fun}: ...${e}...`)
        }

        return expanded[fun]
    }

    const res: PinFunction[][] = []

    function set(p: number, fn: PinFunction) {
        if (res[p] === undefined) res[p] = []
        if (!res[p].includes(fn)) res[p].push(fn)
    }

    for (const k of Object.keys(info)) {
        if (k[0] == "#") continue
        for (const p of expand(k)) set(p, k as PinFunction)
    }

    for (const p of expand("io")) {
        set(p, "input")
        set(p, "output")
    }

    Object.defineProperty(info, "#pinInfo", {
        value: res,
        enumerable: false,
    })

    return res
}

export function pinFunctions(
    info: PinFunctionInfo,
    p: number,
    keepInputOutput = false
) {
    const res = expandPinFunctionInfo(info)[p] ?? []
    if (!keepInputOutput) {
        if (res.includes("io"))
            return res.filter(r => r != "input" && r != "output")
    }
    return res
}

export function pinHasFunction(
    info: PinFunctionInfo,
    p: number,
    fn: PinFunction
) {
    return pinFunctions(info, p, true).includes(fn)
}

export interface PinInfo {
    label: string
    gpio: number
    functions: PinFunction[]
}

export function pinsInfo(arch: ArchConfig, devcfg: DeviceConfig) {
    const infos: PinInfo[] = []
    const errors: string[] = []

    function addPin(label: string, gpio: number): unknown {
        const name = `${label}=${gpio}`
        if (typeof gpio != "number") return errors.push(`invalid pin: ${name}`)

        const functions = pinFunctions(arch?.pins, gpio)
        if (functions.length == 0)
            return errors.push(`invalid pin: ${name} has no functions`)

        const ex = infos.find(p => p.gpio == gpio)

        if (ex && ex.label[0] != "@" && !label.startsWith("$services"))
            return errors.push(
                `GPIO${gpio} marked as both ${ex.label} and ${label}`
            )

        for (const fn of ["flash", "psram", "usb"] as PinFunction[]) {
            if (functions.includes(fn))
                errors.push(`${name} has '${fn}' function`)
        }

        infos.push({
            label,
            gpio,
            functions,
        })
    }

    function addPinExt(label: string, refOrGpio: number | string): unknown {
        if (typeof refOrGpio == "string") {
            const ex = infos.find(p => p.label == refOrGpio)
            if (!ex)
                return errors.push(
                    `${label} is set to ${refOrGpio} which wasn't found`
                )
            ex.label = label // override
            return
        }
        return addPin(label, refOrGpio)
    }

    for (const lbl of Object.keys(devcfg?.pins ?? {})) {
        if (lbl.startsWith("#")) continue
        const gpio = (devcfg.pins as any)[lbl]
        addPin(lbl, gpio)
    }

    function validateConfig(obj: any, path0: string) {
        if (Array.isArray(obj)) {
            obj.forEach((e, i) => {
                const p = e.service
                    ? `${path0}.${e.name ?? e.service}[${i}]`
                    : `${path0}[${i}]`
                validateConfig(e, p)
            })
        } else if (obj && typeof obj == "object")
            for (const k of Object.keys(obj)) {
                if (k.startsWith("#")) continue
                const path = (path0 ? path0 + "." : "") + k
                if (k != "pins" && k.startsWith("pin")) {
                    addPinExt(path, obj[k])
                } else {
                    validateConfig(obj[k], path)
                }
            }
    }

    validateConfig(devcfg, "")

    const desc = infos
        .filter(p => !p.label.startsWith("@"))
        .map(p => `${p.label}: GPIO${p.gpio}, ${p.functions.join(", ")}`)
        .join("\n")

    return { desc, infos, errors }
}
