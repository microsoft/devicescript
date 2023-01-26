import * as vscode from "vscode"

let terminal: vscode.Terminal
export function spawnDevTools(): { dispose: () => void } {
    if (!terminal) {
        terminal = vscode.window.createTerminal({
            name: "DeviceScript Server",
            hideFromUser: true,
            message: "Launching DeviceScript server process.",
            isTransient: true,
        })
        terminal.sendText("", true)
        terminal.sendText(
            `node ../../node_modules/@devicescript/cli/built/devicescript-cli.cjs devtools`,
            true
        )
    }
    return {
        dispose: killDevTools,
    }
}

export function showDevToolsTerminal() {
    terminal?.show()
}

export function killDevTools() {
    const p = terminal
    terminal = undefined
    if (p) {
        p.dispose()
    }
}
