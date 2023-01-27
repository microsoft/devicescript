import * as vscode from "vscode"

let terminal: vscode.Terminal
export function initDevTools(disposables: vscode.Disposable[]) {
    vscode.window.onDidCloseTerminal(
        t => {
            if (t === terminal) {
                terminal = undefined
                vscode.window.showInformationMessage(
                    `DeviceScript Server exited (exit code: ${t.exitStatus.code})`
                )
            }
        },
        undefined,
        disposables
    )
    disposables.push({
        dispose: killDevTools,
    })
}

export function spawnDevTools() {
    if (terminal) return

    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    const transportsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools.transports"
    )
    const useShell = !!devToolsConfig.get("useShell")
    const serial = !!transportsConfig.get("serial")
    const usb = !!transportsConfig.get("usb")

    const cli = "yarn"
    const args = ["devicescript", "devtools", "--vscode"]
    if (serial) args.push("--serial")
    if (usb) args.push("--usb")

    terminal = vscode.window.createTerminal({
        name: "DeviceScript",
        hideFromUser: true,
        message: "Launching DeviceScript Server...",
        isTransient: true,
        shellPath: useShell ? undefined : cli,
        shellArgs: useShell ? undefined : args,
    })
    if (useShell) {
        terminal.sendText("", true)
        terminal.sendText(`${cli} ${args.join(" ")}`, true)
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
