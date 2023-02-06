import {
    CHANGE,
    ConnectionState,
    delay,
    ERROR_TRANSPORT_CLOSED,
    isCodeError,
    JDEventSource,
    loadServiceSpecifications,
} from "jacdac-ts"
import * as vscode from "vscode"
import type { SideSpecsReq, SideSpecsResp } from "../../cli/src/sideprotocol"
import { logo } from "./assets"
import { sideRequest } from "./jacdac"
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
    private _connectionState: ConnectionState = ConnectionState.Disconnected
    private _workspaceFolder: vscode.WorkspaceFolder
    private _terminalPromise: Promise<vscode.Terminal>
    version = ""
    runtimeVersion: string
    nodeVersion: string

    constructor(readonly extensionState: DeviceScriptExtensionState) {
        super()
        const { context } = this.extensionState
        const { subscriptions } = context

        vscode.workspace.onDidChangeWorkspaceFolders(
            this.handleWorkspaceFoldersChange,
            this,
            subscriptions
        )
        vscode.window.onDidCloseTerminal(
            this.handleCloseTerminal,
            this,
            subscriptions
        )
        subscriptions.push(this)
    }

    private async init() {
        let resp: SideSpecsResp
        try {
            resp = await sideRequest<SideSpecsReq, SideSpecsResp>({
                req: "specs",
                data: {},
            })
        } catch (e) {
            if (isCodeError(e, ERROR_TRANSPORT_CLOSED)) return false
            else throw e
        }
        const { specs, version, runtimeVersion, nodeVersion } = resp.data
        loadServiceSpecifications(specs)
        this.version = version
        this.runtimeVersion = runtimeVersion
        this.nodeVersion = nodeVersion

        console.log(
            `devicescript devtools version: ${version}, bytecode version: ${runtimeVersion}`
        )

        this.extensionState.bus.emit(CHANGE)
        return true
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

    get connectionState() {
        return this._connectionState
    }

    private set connectionState(state: ConnectionState) {
        if (state !== this._connectionState) {
            this._connectionState = state
            this.emit(CHANGE)
        }
    }

    async start(): Promise<boolean> {
        if (!this._workspaceFolder) {
            const ws = vscode.workspace.workspaceFolders?.filter(ws =>
                checkFileExists(ws.uri, "./devsconfig.json")
            )?.[0]
            this.workspaceFolder = ws
        }

        return (
            this._terminalPromise ||
            (this._terminalPromise = (async () => {
                try {
                    this.connectionState = ConnectionState.Connecting
                    const t = await this.uncachedSpawnDevTools()
                    if (!t) {
                        this.clear()
                        return undefined
                    }
                    this._terminalPromise = Promise.resolve(t)
                    this.connectionState = ConnectionState.Connected
                    return this._terminalPromise
                } catch (e) {
                    this.clear()
                    return undefined
                }
            })())
        ).then(() => this.connectionState === ConnectionState.Connected)
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
            !vscode.workspace.workspaceFolders?.includes(this._workspaceFolder)
        )
            this.workspaceFolder = undefined
    }

    private async handleCloseTerminal(t: vscode.Terminal) {
        if (this._terminalPromise && t === (await this._terminalPromise)) {
            this.clear()
            if (t.exitStatus.reason === vscode.TerminalExitReason.Process)
                showTerminalError(`DeviceScript Server exited unexpectedly.`)
        }
    }

    private clear() {
        this._terminalPromise = undefined
        this.version = undefined
        this.runtimeVersion = undefined
        this.nodeVersion = undefined
        this.connectionState = ConnectionState.Disconnected
    }

    private async kill() {
        if (!this._terminalPromise) return

        this.connectionState = ConnectionState.Disconnecting
        try {
            const p = this._terminalPromise
            const terminal = await p
            terminal?.dispose()
        } finally {
            this.clear()
        }
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
                    iconPath: logo(this.extensionState.context),
                    cwd,
                }
                const t = vscode.window.createTerminal(options)
                if (useShell) {
                    t.sendText("", true)
                    t.sendText(`${cli} ${args.join(" ")}`, true)
                }
                await delay(1000)
                let retry = 0
                let inited = false
                while (retry++ < 5) {
                    inited = await this.init()
                    if (inited) break
                    await delay(1000)
                }
                if (!inited) {
                    this.clear()
                    return undefined
                }

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
