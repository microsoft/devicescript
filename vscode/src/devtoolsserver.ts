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
import type {
    SideKillReq,
    SideKillResp,
    SideSpecsReq,
    SideSpecsResp,
} from "../../cli/src/sideprotocol"
import { logo } from "./assets"
import { sideRequest } from "./jacdac"
import { DeviceScriptExtensionState } from "./state"
import { Utils } from "vscode-uri"
import { TaggedQuickPickItem } from "./pickers"
import { EXIT_CODE_EADDRINUSE } from "../../cli/src/exitcodes"

const HELP_URI = vscode.Uri.parse(
    "https://microsoft.github.io/devicescript/getting-started/vscode#setting-up-the-project"
)
function showTerminalError(message: string) {
    const help = "Open Help"
    vscode.window
        .showInformationMessage("DeviceScript: " + message, help)
        .then(res => {
            if (res === help) {
                vscode.env.openExternal(HELP_URI)
            }
        })
}

export class DeveloperToolsManager extends JDEventSource {
    private _connectionState: ConnectionState = ConnectionState.Disconnected
    private _projectFolder: vscode.Uri
    version = ""
    runtimeVersion: string
    nodeVersion: string

    private _terminalPromise: Promise<vscode.Terminal>

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
            `devicescript devtools ${version}, runtime ${runtimeVersion}, node ${nodeVersion}`
        )

        this.extensionState.bus.emit(CHANGE)
        return true
    }

    get projectFolder() {
        return this._projectFolder
    }

    set projectFolder(folder: vscode.Uri) {
        if (folder?.toString() !== this._projectFolder?.toString()) {
            if (this._projectFolder) this.kill()
            this._projectFolder = folder
            this.emit(CHANGE)
        }
    }

    get connectionState() {
        return this._connectionState
    }

    get connected() {
        return this.connectionState === ConnectionState.Connected
    }

    private set connectionState(state: ConnectionState) {
        if (state !== this._connectionState) {
            this._connectionState = state
            this.emit(CHANGE)
        }
    }

    async pickProject() {
        const projects = await this.findProjects()
        if (projects.length == 0) return undefined
        else if (projects.length == 1) return projects[0]
        else {
            const items = projects.map(
                project =>
                    <TaggedQuickPickItem<vscode.Uri>>{
                        data: project,
                        description: Utils.dirname(project).fsPath,
                        label: Utils.basename(project),
                    }
            )
            const res = await vscode.window.showQuickPick(items, {
                title: "Choose a project",
            })
            return res?.data
        }
    }

    private async createTerminal(): Promise<vscode.Terminal> {
        if (!this._projectFolder) this._projectFolder = await this.pickProject()
        if (!this._projectFolder) {
            showTerminalError("No DeviceScript project in workspace.")
            return undefined
        }
        try {
            this.connectionState = ConnectionState.Connecting
            const t = await this.uncachedSpawnDevTools()
            if (!t) {
                this.clear()
                return undefined
            }
            this.connectionState = ConnectionState.Connected
            return t
        } catch (e) {
            this.clear()
            return undefined
        }
    }

    async start(): Promise<void> {
        return (
            this._terminalPromise ||
            (this._terminalPromise = this.createTerminal())
        ).then(() => {})
    }

    dispose() {
        this.kill()
    }

    private async sendKillRequest() {
        try {
            await sideRequest<SideKillReq, SideKillResp>({
                req: "kill",
                data: {},
            })
            // process acknoledged the message
            return true
        } catch {
            return false
        }
    }

    private async kill() {
        this.sendKillRequest()
        const p = this._terminalPromise
        this.clear()
        if (p) {
            const t = await p
            if (t) {
                try {
                    t.sendText("\u001c")
                } catch {}
            }
        }
    }

    private async handleWorkspaceFoldersChange(
        e: vscode.WorkspaceFoldersChangeEvent
    ) {
        if (e.removed && this._projectFolder) {
            const projects = (await this.findProjects()).map(uri =>
                uri.toString()
            )
            if (!projects.includes(this._projectFolder?.toString()))
                this.projectFolder = undefined
        }
    }

    private async handleCloseTerminal(t: vscode.Terminal) {
        if (this._terminalPromise && t === (await this._terminalPromise)) {
            this.clear()
            if (t.exitStatus.reason === vscode.TerminalExitReason.Process) {
                switch (t.exitStatus.code) {
                    case EXIT_CODE_EADDRINUSE:
                        // try to send a kill command
                        console.debug(`trying to shutdown other developement server`)
                        const killed = await this.sendKillRequest()
                        if (killed) {
                            await delay(1000)
                            await this.start()
                        } else
                            showTerminalError(
                                `Development Server ports already in use.`
                            )
                        break
                    default:
                        showTerminalError(
                            `Development Server exited unexpectedly.`
                        )
                        break
                }
            }
        }
    }

    private clear() {
        this._terminalPromise = undefined
        this._projectFolder = undefined
        this.version = undefined
        this.runtimeVersion = undefined
        this.nodeVersion = undefined
        this.connectionState = ConnectionState.Disconnected
    }

    async findProjects() {
        // find file marker
        const configs = await vscode.workspace.findFiles(
            "**/devsconfig.json",
            "**​/node_modules/**"
        )
        return configs
            .map(cfg => Utils.dirname(cfg))
            .filter(d => !/\/node_modules\//.test(d.fsPath))
    }

    async show() {
        if (!this._terminalPromise) return
        const terminal = await this._terminalPromise
        terminal?.show()
    }

    private async uncachedSpawnDevTools(): Promise<vscode.Terminal> {
        if (!this._projectFolder) {
            return undefined
        }

        const cwd = this._projectFolder
        const devsConfig = await checkFileExists(cwd, "./devsconfig.json")
        if (!devsConfig) {
            showTerminalError("Could not find file `devsconfig.json`.")
            return undefined // not a devicescript folder
        }

        const cliBin = "./node_modules/.bin/devicescript"
        const cliInstalled = await checkFileExists(cwd, cliBin)
        if (!cliInstalled) {
            showTerminalError("Install Node.JS dependencies to enable tools.")
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
                const nodePath = devToolsConfig.get("node") as string

                const args = [cliBin, "devtools", "--vscode"]
                const cli = nodePath || "node"

                console.debug(
                    `create terminal: ${
                        useShell ? "shell>" : ""
                    } ${cli} ${args.join(" ")}`
                )
                console.debug(`cwd: ${cwd}`)
                const options: vscode.TerminalOptions = {
                    name: "DeviceScript",
                    hideFromUser: false,
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
                let retry = 0
                let inited = false
                while (retry++ < 20) {
                    inited = await this.init()
                    if (inited) break
                    await delay(500)
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
