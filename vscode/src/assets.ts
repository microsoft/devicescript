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

export function resolveDarkMode() {
    const { kind: colorThemeKind } = vscode.window.activeColorTheme
    const res =
        colorThemeKind === vscode.ColorThemeKind.Dark ||
        colorThemeKind === vscode.ColorThemeKind.HighContrast
            ? "dark"
            : "light"
    return res
}
