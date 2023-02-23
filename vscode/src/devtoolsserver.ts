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
    SideSpecsData,
    SideSpecsReq,
    SideSpecsResp,
} from "../../cli/src/sideprotocol"
import { logo } from "./assets"
import { sideRequest } from "./jacdac"
import { DeviceScriptExtensionState } from "./state"
import { Utils } from "vscode-uri"
import { TaggedQuickPickItem } from "./pickers"
import { EXIT_CODE_EADDRINUSE } from "../../cli/src/exitcodes"
import { MESSAGE_PREFIX, showInformationMessageWithHelp } from "./commands"
import { checkFileExists } from "./fs"

function showTerminalError(message: string) {
    showInformationMessageWithHelp(
        message,
        "getting-started/vscode#setting-up-the-project"
    )
}

export class DeveloperToolsManager extends JDEventSource {
    private _connectionState: ConnectionState = ConnectionState.Disconnected
    private _projectFolder: vscode.Uri

    private _specs: SideSpecsData
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

    async refreshSpecs() {
        const oldSpecs = this._specs
        const res = await sideRequest<SideSpecsReq, SideSpecsResp>({
            req: "specs",
            data: {
                dir: ".", // TODO
            },
        })
        this._specs = res.data
        loadServiceSpecifications(this._specs.buildConfig.services)
        console.log(
            `devicescript devtools ${this.version}, runtime ${this.runtimeVersion}, node ${this.nodeVersion}`
        )
        if (JSON.stringify(oldSpecs) !== JSON.stringify(this._specs)) {
            this.extensionState.bus.emit(CHANGE)
            this.emit(CHANGE)
        }
    }

    private async init() {
        try {
            await this.refreshSpecs()
        } catch (e) {
            if (isCodeError(e, ERROR_TRANSPORT_CLOSED)) return false
            else throw e
        }
        return true
    }

    get version() {
        return this._specs?.version
    }

    get runtimeVersion() {
        return this._specs?.runtimeVersion
    }

    get nodeVersion() {
        return this._specs?.nodeVersion
    }

    get buildConfig() {
        return this._specs?.buildConfig
    }

    get boards() {
        return Object.values(this.buildConfig?.boards)
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
            const t = await this.createCliTerminal({
                title: "DeviceScript",
                progress: "Starting Development Server...",
                args: ["devtools", "--vscode"],
                message: "DeviceScript Development Server\n",
            })
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
                        console.debug(
                            `trying to shutdown other development server`
                        )
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
        this._specs = undefined
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

    public async createCliTerminal(options: {
        title?: string
        progress: string
        useShell?: boolean
        diagnostics?: boolean
        message?: string
        args: string[]
    }): Promise<vscode.Terminal> {
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

        const { title, progress, args, message } = options
        return vscode.window.withProgress<vscode.Terminal>(
            {
                location: vscode.ProgressLocation.Notification,
                title: MESSAGE_PREFIX + progress,
                cancellable: false,
            },
            async () => {
                const devToolsConfig = vscode.workspace.getConfiguration(
                    "devicescript.devtools"
                )
                const jacdacConfig = vscode.workspace.getConfiguration(
                    "devicescript.jacdac"
                )
                const isWindows = globalThis.process?.platform === "win32"
                const useShell =
                    options.useShell ?? !!devToolsConfig.get("shell")
                const nodePath = devToolsConfig.get("node") as string
                const diagnostics =
                    options.diagnostics ?? jacdacConfig.get("diagnostics")
                let cli = nodePath || "node"
                if (isWindows) {
                    cli = "node_modules\\.bin\\devicescript.cmd"
                } else args.unshift("./node_modules/.bin/devicescript")
                if (diagnostics) args.push("--diagnostics")
                console.debug(
                    `create terminal: ${useShell ? "shell:" : ""}${
                        cwd.fsPath
                    }> ${cli} ${args.join(" ")}`
                )
                const terminalOptions: vscode.TerminalOptions = {
                    name: "DeviceScript" || title,
                    hideFromUser: false,
                    message,
                    isTransient: true,
                    shellPath: useShell ? undefined : cli,
                    shellArgs: useShell ? undefined : args,
                    iconPath: logo(this.extensionState.context),
                    cwd: cwd.fsPath,
                }
                const t = vscode.window.createTerminal(terminalOptions)
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
