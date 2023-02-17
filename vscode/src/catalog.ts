import * as vscode from "vscode"
import { deviceCatalogImage, DOCS_ROOT } from "jacdac-ts"
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
