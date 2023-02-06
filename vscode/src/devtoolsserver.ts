import { CHANGE, delay, JDEventSource, JDNode } from "jacdac-ts"
import * as vscode from "vscode"
import { logo } from "./assets"
import { DeviceScriptExtensionState } from "./state"

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

export class DeveloperToolsManager extends JDEventSource {
    private _workspaceFolder: vscode.WorkspaceFolder
    private _terminalPromise: Promise<vscode.Terminal>

    constructor(readonly context: vscode.ExtensionContext) {
        super()

        vscode.workspace.onDidChangeWorkspaceFolders(
            this.handleWorkspaceFoldersChange,
            this,
            context.subscriptions
        )
        vscode.window.onDidCloseTerminal(
            this.handleCloseTerminal,
            this,
            context.subscriptions
        )
        context.subscriptions.push(this)
    }

    get workspaceFolder() {
        return this._workspaceFolder
    }

    set workspaceFolder(folder: vscode.WorkspaceFolder) {
        if (folder !== this._workspaceFolder) {
            this.kill()
            this._workspaceFolder = folder
            this.emit(CHANGE)
        }
    }

    async spawn() {
        if (!this._workspaceFolder) {
            const ws = vscode.workspace.workspaceFolders.filter(ws =>
                checkFileExists(ws.uri, "./devsconfig.json")
            )?.[0]
            this.workspaceFolder = ws
        }

        return (
            this._terminalPromise ||
            (this._terminalPromise = this.uncachedSpawnDevTools().then(t => {
                return t
            }))
        )
    }

    dispose() {
        // not awaited
        this.kill()
    }

    private async handleWorkspaceFoldersChange(
        e: vscode.WorkspaceFoldersChangeEvent
    ) {
        // make sure current workspace folder still exists
        if (
            this._workspaceFolder &&
            !vscode.workspace.workspaceFolders.includes(this._workspaceFolder)
        )
            this.workspaceFolder = undefined
    }

    private async handleCloseTerminal(t: vscode.Terminal) {
        if (this._terminalPromise && t === (await this._terminalPromise)) {
            this._terminalPromise = undefined
            if (t.exitStatus.reason === vscode.TerminalExitReason.Process)
                showTerminalError(`DeviceScript Server exited unexpectedly.`)
            this.emit(CHANGE)
        }
    }

    private async kill() {
        if (!this._terminalPromise) return

        const terminal = await this._terminalPromise
        this._terminalPromise = undefined
        terminal?.dispose()
        this.emit(CHANGE)
    }

    async show() {
        if (!this._terminalPromise) return
        const terminal = await this._terminalPromise
        terminal?.show()
    }

    private async uncachedSpawnDevTools(): Promise<vscode.Terminal> {
        if (!this._workspaceFolder) return undefined

        const cwd = this._workspaceFolder.uri
        const devsConfig = await checkFileExists(cwd, "./devsconfig.json")
        if (!devsConfig) return undefined // not a devicescript folder

        const cliBin = "./node_modules/.bin/devicescript"
        const cliInstalled = await checkFileExists(cwd, cliBin)
        if (!cliInstalled) {
            showTerminalError(
                "DeviceScript: Install Node.JS dependencies to enable tools."
            )
            return undefined
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
                const nodePath =
                    (devToolsConfig.get("node") as string) || "node"

                const cli = nodePath
                const args = [cliBin, "devtools", "--vscode"]

                console.debug(
                    `create terminal: ${
                        useShell ? "shell>" : ""
                    } ${cli} ${args.join(" ")}`
                )
                console.debug(`cwd: ${cwd}`)
                const options: vscode.TerminalOptions = {
                    name: "DeviceScript",
                    hideFromUser: true,
                    message: "DeviceScript Development Server\n",
                    isTransient: true,
                    shellPath: useShell ? undefined : cli,
                    shellArgs: useShell ? undefined : args,
                    iconPath: logo(this.context),
                    cwd,
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
}

async function checkFileExists(
    cwd: vscode.Uri,
    filePath: string
): Promise<boolean> {
    try {
        const file = vscode.Uri.joinPath(cwd, filePath)
        await vscode.workspace.fs.stat(file)
        return true
    } catch (error) {
        return false
    }
}
