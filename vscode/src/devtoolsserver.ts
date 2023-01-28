import { delay } from "jacdac-ts"
import * as vscode from "vscode"
import { logo } from "./assets"

let terminalPromise: Promise<vscode.Terminal>
export function initDevTools(disposables: vscode.Disposable[]) {
    vscode.window.onDidCloseTerminal(
        async t => {
            if (terminalPromise && t === (await terminalPromise)) {
                terminalPromise = undefined
                vscode.window.showInformationMessage(
                    `DeviceScript Server exited. Make sure to install '@devicescript/cli' in your project.`
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
    return (
        terminalPromise ||
        (terminalPromise = uncachedSpawnDevTools(context).then(t => t))
    )
}

async function uncachedSpawnDevTools(context: vscode.ExtensionContext) {
    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    const transportsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools.transports"
    )
    const useShell = !!devToolsConfig.get("shell")
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
        iconPath: logo(context),
    }
    const t = vscode.window.createTerminal(options)
    if (useShell) {
        t.sendText("", true)
        t.sendText(`${cli} ${args.join(" ")}`, true)
    }

    // TODO: wait for message
    await delay(2000)

    return t
}

export async function showDevToolsTerminal() {
    if (terminalPromise) {
        const terminal = await terminalPromise
        terminal?.show()
    }
}

export async function killDevTools() {
    if (terminalPromise) {
        const terminal = await terminalPromise
        terminalPromise = undefined
        terminal?.dispose()
    }
}
