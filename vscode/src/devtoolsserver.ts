import { delay } from "jacdac-ts"
import * as vscode from "vscode"
import { logo } from "./assets"

const HELP_URI = vscode.Uri.parse(
    "https://microsoft.github.io/devicescript/getting-started/vscode#setting-up-the-project"
)

function showTerminalError(message: string) {
    const help = "Open Help"
    vscode.window.showInformationMessage(message, help).then(res => {
        if (res === help) {
            vscode.env.openExternal(HELP_URI)
        }
    })
}

let terminalPromise: Promise<vscode.Terminal>
export function initDevTools(disposables: vscode.Disposable[]) {
    vscode.window.onDidCloseTerminal(
        async t => {
            if (terminalPromise && t === (await terminalPromise)) {
                terminalPromise = undefined
                showTerminalError(`DeviceScript Server exited unexpectedly.`)
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

async function checkFileExists(filePath: string): Promise<boolean> {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders[0]
        const file = vscode.Uri.joinPath(workspaceFolder.uri, filePath)
        await vscode.workspace.fs.stat(file)
        return true
    } catch (error) {
        return false
    }
}

async function uncachedSpawnDevTools(context: vscode.ExtensionContext) {
    const devsConfig = await checkFileExists("./devsconfig.json")
    if (!devsConfig) return // not a devicescript folder

    const cliBin = "./node_modules/.bin/devicescript"
    const cliInstalled = await checkFileExists(cliBin)
    if (!cliInstalled) {
        showTerminalError(
            "DeviceScript: Install Node.JS dependencies to enable tools."
        )
        return
    }

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
            const args = [cliBin, "devtools", "--vscode"]

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
