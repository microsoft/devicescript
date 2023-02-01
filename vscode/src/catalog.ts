import * as vscode from "vscode"
import { deviceCatalogImage } from "jacdac-ts"

export function deviceIconUri(spec: jdspec.DeviceSpec) {
    return vscode.Uri.parse(deviceCatalogImage(spec, "avatar"))
}

const JACDAC_DOCS_ROOT = "https://microsoft.github.io/jacdac-docs/"
const DEVICESCRIPT_DOCS_ROOT = "https://microsoft.github.io/devicescript/"
export function toMarkdownString(value: string, docsPath?: string) {
    let text = value
    if (docsPath)
        text += ` ([Documentation](${docsPath
            .replace(/^jacdac:\/*/i, JACDAC_DOCS_ROOT)
            .replace(/^devicescript:\.*/i, DEVICESCRIPT_DOCS_ROOT)}))`
    const tooltip = new vscode.MarkdownString(text, true)
    tooltip.supportHtml = true
    return tooltip
}
