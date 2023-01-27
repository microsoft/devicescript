import * as vscode from "vscode"
import { deviceCatalogImage } from "jacdac-ts"

export function deviceIconUri(spec: jdspec.DeviceSpec) {
    return vscode.Uri.parse(deviceCatalogImage(spec, "avatar"))
}

const DOCS_ROOT = "https://microsoft.github.io/jacdac-docs/"
export function toMarkdownString(value: string, jacdacDocsPath?: string) {
    let text = value
    if (jacdacDocsPath)
        text += ` ([Documentation](${DOCS_ROOT}${jacdacDocsPath}))`
    const tooltip = new vscode.MarkdownString(text, true)
    tooltip.supportHtml = true
    return tooltip
}
