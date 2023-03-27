import * as vscode from "vscode"

export function logo(context: vscode.ExtensionContext) {
    return {
        light: vscode.Uri.joinPath(
            vscode.Uri.file(context.extensionPath),
            "images",
            "devs.light.svg"
        ),
        dark: vscode.Uri.joinPath(
            vscode.Uri.file(context.extensionPath),
            "images",
            "devs.dark.svg"
        ),
    }
}
