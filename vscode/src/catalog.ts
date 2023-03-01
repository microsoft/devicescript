import * as vscode from "vscode"
import {
    ControlReg,
    deviceCatalogImage,
    DOCS_ROOT,
    identifierToUrlPath,
    JDDevice,
    SRV_CONTROL,
} from "jacdac-ts"
import { DEVICESCRIPT_DOCS_ROOT } from "./constants"

export function deviceIconUri(spec: jdspec.DeviceSpec) {
    return vscode.Uri.parse(deviceCatalogImage(spec, "avatar"))
}

export function toMarkdownString(value: string, docsPath?: string) {
    let text = value
    if (docsPath)
        text += ` ([Documentation](${docsPath
            .replace(/^jacdac:\/*/i, DOCS_ROOT)
            .replace(/^devicescript:\.*/i, DEVICESCRIPT_DOCS_ROOT)}))`
    const tooltip = new vscode.MarkdownString(text, true)
    tooltip.supportHtml = true
    return tooltip
}

export async function deviceCatalogTooltip(
    device: JDDevice
): Promise<string | vscode.MarkdownString> {
    const { bus } = device
    if (!bus) return undefined

    const productIdentifier = await device.resolveProductIdentifier()
    const spec =
        bus.deviceCatalog.specificationFromProductIdentifier(productIdentifier)
    if (spec) {
        return toMarkdownString(
            `#### ${spec.name} ${spec.version || ""} by ${spec.company}

![Device image](${deviceCatalogImage(spec, "list")}) 

${spec.description}`,
            `jacdac:devices/${identifierToUrlPath(spec.id)}`
        )
    } else {
        const control = device.service(SRV_CONTROL)
        const description = control?.register(ControlReg.DeviceDescription)
        await description?.refresh(true)
        return description?.stringValue
    }
}
