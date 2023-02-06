import { delay } from "jacdac-ts"
import * as vscode from "vscode"
import { logo } from "./assets"

let terminalPromise: Promise<vscode.Terminal>
export function initDevTools(disposables: vscode.Disposable[]) {
    vscode.window.onDidCloseTerminal(
        async t => {
            if (terminalPromise && t === (await terminalPromise)) {
                terminalPromise = undefined
                const help = "Open Help..."
                const res = vscode.window.showInformationMessage(
                    `DeviceScript Server exited. Make sure to install '@devicescript/cli' in your project.`,
                    help
                )
                if (res) {
                    vscode.commands.executeCommand(
                        "vscode.open",
                        "https://microsoft.github.io/devicescript/getting-started/vscode#setting-up-the-project"
                    )
                }
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
    return vscode.window.withProgress<vscode.Terminal>(
        {
            location: vscode.ProgressLocation.Notification,
            title: "Starting DeviceScript Development Server...",
            cancellable: false,
        },
        async () => {
            const devToolsConfig = vscode.workspace.getConfiguration(
                "devicescript.devtools"
            )
            const useShell = !!devToolsConfig.get("shell")

            const cli = "node"
            const args = [
                "./node_modules/.bin/devicescript",
                "devtools",
                "--vscode",
            ]

            const options: vscode.TerminalOptions = {
                name: "DeviceScript",
                hideFromUser: true,
                message: "DeviceScript Development Server",
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
    )
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
