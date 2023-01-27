import { delay } from "jacdac-ts"
import * as vscode from "vscode"

let terminal: vscode.Terminal
export function initDevTools(disposables: vscode.Disposable[]) {
    vscode.window.onDidCloseTerminal(
        t => {
            if (t === terminal) {
                terminal = undefined
                vscode.window.showInformationMessage(
                    `DeviceScript Server exited. Make sure to install "@devicescript/cli" in your project.`
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

export async function spawnDevTools(context: vscode.ExtensionContext) {
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

    const options: vscode.TerminalOptions = {
        name: "DeviceScript",
        hideFromUser: true,
        message: "Launching DeviceScript Server...",
        isTransient: true,
        shellPath: useShell ? undefined : cli,
        shellArgs: useShell ? undefined : args,
        iconPath: {
            light: vscode.Uri.joinPath(
                vscode.Uri.file(context.extensionPath),
                "images",
                "jacdac.light.svg"
            ),
            dark: vscode.Uri.joinPath(
                vscode.Uri.file(context.extensionPath),
                "images",
                "jacdac.dark.svg"
            ),
        },
    }
    terminal = vscode.window.createTerminal(options)
    if (useShell) {
        terminal.sendText("", true)
        terminal.sendText(`${cli} ${args.join(" ")}`, true)
    }

    // TODO: wait for message
    await delay(2000)
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
