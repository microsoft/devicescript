import * as vscode from "vscode"
import { join } from "path"

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

export function spawnDevTools(useShell: boolean) {
    if (!terminal) {
        const cli = "yarn"
        const args = ["devicescript", "devtools"]
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
