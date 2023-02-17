import { DeviceConfig, ArchConfig, RepoInfo } from "@devicescript/srvcfg"
import { DeviceCatalog, deviceCatalogImage } from "jacdac-ts"
import { parseAnyInt } from "./dcfg"
import { boardSpecifications } from "./embedspecs"

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
    markdown: string
}

export function boardInfo(cfg: DeviceConfig, arch?: ArchConfig): BoardInfo {
    const features: string[] = []

    const conn = (c: { $connector?: string }) =>
        c?.$connector ? ` using ${c.$connector} connector` : ``

    if (cfg.jacdac?.pin !== undefined)
        features.push(`Jacdac on ${cfg.jacdac.pin}${conn(cfg.jacdac)}`)

    if (cfg.i2c?.pinSDA !== undefined) {
        features.push(
            `I2C on SDA/SCL: ${cfg.i2c.pinSDA}/${cfg.i2c.pinSCL}${conn(
                cfg.i2c
            )}`
        )
    }

    if (cfg.led) {
        if (cfg.led.type === 1)
            features.push(`WS2812B RGB LED on ${cfg.led.pin}`)
        else if (cfg.led.rgb?.length == 3)
            features.push(
                `RGB LED on pins ${cfg.led.rgb.map(l => l.pin).join(", ")}`
            )
        else if (cfg.led.pin !== undefined)
            features.push(`LED on pin ${cfg.led.pin}`)
    }

    if (cfg.log?.pinTX !== undefined)
        features.push(
            `serial logging on ${cfg.log.pinTX} at ${
                cfg.log.baud || 115200
            } 8N1`
        )

    const services = (cfg._ ?? []).map(s => {
        let r = s.name
        if (s.service != s.name) r += ` (${s.service})`
        return r
    })

    const b: BoardInfo = {
        name: cfg.devName.replace(/\s*DeviceScript\s*/i, " ").trim(),
        arch: arch?.name,
        description: cfg.$description,
        urls: {
            info: cfg.url,
            firmware: cfg.$fwUrl,
        },
        features,
        services,
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

    return b
}

const arches: Record<string, string> = {
    esp32s2: "esp32",
    esp32c3: "esp32",
    rp2040w: "rp2040",
}
function deviceConfigToMarkdown(
    board: DeviceConfig,
    spec: jdspec.DeviceSpec
): string {
    const { devName, $description, url, $fwUrl, id: devId, archId } = board
    const { id } = spec || {}
    const info = boardInfo(board)
    info.markdown
    const r: string[] = [
        `---
description: ${devName}
---
# ${devName}

${$description || spec?.description || ""}

`,
        ...info.features.map(f => `- ${f}`),
        ...info.services.map(f => `- Service: ${f}`),
        url ? `- [Store](${url})` : undefined,
        id
            ? `![${devName} picture](${deviceCatalogImage(spec, "catalog")})\n`
            : undefined,
        `## Firmware update

\`\`\`bash
devicescript flash ${arches[archId] || archId} --board ${devId}
\`\`\`

`,
        $fwUrl ? `- [Firmware](${$fwUrl})` : undefined,
    ]
    return r.filter(s => s !== undefined).join("\n")
}

export function boardMarkdownFiles() {
    const { boards } = boardSpecifications
    const catalog = new DeviceCatalog()
    //const catalog = new DeviceCatalog()
    const r: Record<string, string> = {}
    Object.keys(boards).forEach(boardid => {
        const board = boards[boardid]
        const { archId, devClass, devName } = board
        if (!archId || archId === "wasm") return
        const spec: jdspec.DeviceSpec =
            catalog.specificationFromProductIdentifier(parseAnyInt(devClass))
        const aid = arches[archId] || archId
        const pa = `${aid}/${boardid.replace(/_/g, "-")}`
        r[`${pa}.mdx`] = deviceConfigToMarkdown(board, spec)

        const aidmd = `${aid}/boards.mdp`
        const img = deviceCatalogImage(spec, "avatar")
        if (img)
            r[aidmd] =
                (r[aidmd] || "") +
                `
- [![photograph of ${devName}](${img}) ${devName}](/devices/${pa})`
    })
    return r
}
