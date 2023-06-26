import {
    CHANGE,
    ConnectionState,
    delay,
    ERROR_TIMEOUT,
    ERROR_TRANSPORT_CLOSED,
    Flags,
    groupBy,
    isCodeError,
    JDEventSource,
    JDService,
    prettySize,
    semverCmp,
    throwError,
    unique,
} from "jacdac-ts"
import * as vscode from "vscode"
import type {
    BuildStatus,
    BuildOptions,
    SideBuildReq,
    SideBuildResp,
    SideKillReq,
    SideKillResp,
    SideSpecsReq,
    SideSpecsResp,
} from "../../cli/src/sideprotocol"
import { sideRequest, tryConnectDevtools } from "./jacdac"
import { DeviceScriptExtensionState } from "./state"
import { Utils } from "vscode-uri"
import { showConfirmBox, TaggedQuickPickItem } from "./pickers"
import { EXIT_CODE_EADDRINUSE } from "../../cli/src/exitcodes"
import { showInformationMessageWithHelp } from "./commands"
import { checkFileExists } from "./fs"
import { ResolvedBuildConfig, VersionInfo } from "@devicescript/interop"
import { extensionVersion } from "./version"
import { showError, showErrorMessage } from "./telemetry"
import { BUILD, MESSAGE_PREFIX } from "./constants"
import { tryGetNodeVersion } from "./spawn"

function showTerminalError(message: string) {
    showInformationMessageWithHelp(
        message,
        "getting-started/vscode#setting-up-the-project"
    )
}

function normalizeUsedFiles(dir: vscode.Uri, usedFiles: string[]) {
    const dirPath = Utils.resolvePath(dir).fsPath + "/"
    const fs = usedFiles
    const rel = fs.filter(f => f.startsWith(dirPath))
    const cor = rel.map(f => f.slice(dirPath.length))
    return unique(cor)
}

const PROJECT_FOLDER_KEY = "devicescript.devtools.projectFolder"

export class DeveloperToolsManager extends JDEventSource {
    private _connectionState: ConnectionState = ConnectionState.Disconnected
    private _projectFolder: vscode.Uri

    // watch is tied to currentFilename and devicescript manager
    private _watcher: vscode.FileSystemWatcher
    private _currentFilename: string
    private _currentDeviceScriptManager: string

    private _versions: VersionInfo
    private _buildConfig: ResolvedBuildConfig
    private _terminalPromise: Promise<vscode.Terminal>
    private _diagColl: vscode.DiagnosticCollection
    private _buildOutputChannel: vscode.OutputChannel

    constructor(readonly extensionState: DeviceScriptExtensionState) {
        super()
        const { context } = this.extensionState
        const { subscriptions } = context

        vscode.workspace.onDidChangeWorkspaceFolders(
            this.handleWorkspaceFoldersChange,
            this,
            subscriptions
        )
        vscode.workspace.onDidDeleteFiles(
            this.handleDidDeleteFiles,
            this,
            subscriptions
        )
        vscode.workspace.onDidRenameFiles(
            this.handleDidRenameFiles,
            this,
            subscriptions
        )
        vscode.window.onDidCloseTerminal(
            this.handleCloseTerminal,
            this,
            subscriptions
        )
        vscode.workspace.onDidOpenTextDocument(
            this.handleOpenTextDocument,
            this,
            subscriptions
        )
        subscriptions.push(this)
        subscriptions.push(
            vscode.commands.registerCommand(
                "extension.devicescript.terminal.show",
                () => this.show()
            )
        )

        this._buildOutputChannel = vscode.window.createOutputChannel(
            "DeviceScript - Compiler",
            "devicescript"
        )
        subscriptions.push(this._buildOutputChannel)

        this._diagColl =
            vscode.languages.createDiagnosticCollection("DeviceScript")
        subscriptions.push(this._diagColl)

        // clear errors when file edited
        vscode.workspace.onDidChangeTextDocument(
            ev => {
                this._diagColl.set(ev.document.uri, [])
            },
            undefined,
            subscriptions
        )

        // clean context
        subscriptions.push({
            dispose: () => this.clearContext(),
        })
    }

    async refreshSpecs() {
        await this.findProjects()
        const res = await sideRequest<SideSpecsReq, SideSpecsResp>({
            req: "specs",
            data: {
                dir: ".", // TODO
            },
            timeout: 1000,
        })
        const { versions, buildConfig } = res.data
        if (JSON.stringify(this._versions) !== JSON.stringify(versions)) {
            this._versions = versions
            const extv = extensionVersion()
            const { devsVersion, runtimeVersion, nodeVersion, projectFolder } =
                this
            console.debug(
                `devicescript : vscode ${extv}, devtools ${devsVersion}, runtime ${runtimeVersion}, node ${nodeVersion}`
            )

            // node.js version outdated
            const MIN_NODE_VERSION = 16
            if (semverCmp(nodeVersion, `v${MIN_NODE_VERSION}.0.0`) < 0) {
                throwError(
                    `Node.js outdated (${nodeVersion}), v${MIN_NODE_VERSION}+ needed`,
                    {
                        cancel: true,
                    }
                )
            }

            // installed devs tool are outdated for the vscode addon
            if (semverCmp(devsVersion, extv) < 0) {
                const yes = await showConfirmBox(
                    `DeviceScript - @devicescript/cli is outdated (${devsVersion}), upgrade to latest (${extv}+) ?`
                )
                if (yes) {
                    await this.kill()
                    const t = vscode.window.createTerminal({
                        isTransient: true,
                        name: "@devicescript/cli upgrade",
                        cwd: projectFolder,
                    })
                    const cmd = await this.resolvePackageTool(projectFolder)
                    t.sendText(`${cmd} upgrade @devicescript/cli`)
                    t.show()
                }
                throwError("Dependencies outdated", { cancel: true })
            }
        }
        this.updateBuildConfig(buildConfig)
    }

    updateBuildConfig(data: ResolvedBuildConfig) {
        if (JSON.stringify(this._buildConfig) === JSON.stringify(data)) return

        this._buildConfig = data
        const { changed } =
            this.extensionState.bus.setCustomServiceSpecifications(
                this._buildConfig?.services || []
            )
        if (changed) this.emit(CHANGE)
    }

    private showBuildResults(st: BuildStatus) {
        this._diagColl.clear()
        const severities = [
            vscode.DiagnosticSeverity.Warning,
            vscode.DiagnosticSeverity.Error,
            vscode.DiagnosticSeverity.Hint,
            vscode.DiagnosticSeverity.Information,
        ]

        const byFile = groupBy(st.diagnostics, s => s.filename)
        for (const fn of Object.keys(byFile)) {
            const diags = byFile[fn].map(d => {
                const p0 = new vscode.Position(d.line - 1, d.column - 1)
                const p1 = new vscode.Position(d.endLine - 1, d.endColumn - 1)
                const msg =
                    typeof d.messageText == "string"
                        ? d.messageText
                        : d.messageText.messageText
                const sev =
                    severities[d.category] ?? vscode.DiagnosticSeverity.Error
                const vd = new vscode.Diagnostic(
                    new vscode.Range(p0, p1),
                    msg,
                    sev
                )
                vd.source = "DeviceScript"
                vd.code = d.code
                return vd
            })
            this._diagColl.set(vscode.Uri.file(fn), diags)
        }
        this.updateBuildConfig(st.config)
    }

    // relative to projectFolder, but most likely undef srcFolder
    get currentFilename() {
        return this._currentFilename
    }

    private set currentFileName(value: string) {
        if (this._currentFilename !== value) {
            this._currentFilename = value
            this.emit(CHANGE)
        }
    }

    get currentFile(): vscode.Uri {
        const { projectFolder, currentFilename } = this
        return projectFolder && currentFilename
            ? Utils.joinPath(projectFolder, currentFilename)
            : undefined
    }

    get currentDeviceScriptManager() {
        return this._currentDeviceScriptManager
    }

    showOutput() {
        this._buildOutputChannel.show()
    }

    async buildFile(file: vscode.Uri): Promise<BuildStatus> {
        // find project folder and relative path
        const root = vscode.workspace.getWorkspaceFolder(file)
        if (!root) {
            showErrorMessage(
                "build.workspacenotfound",
                "Build cancelled.\nCould not resolve workspace."
            )
            return undefined
        }
        let dir = Utils.dirname(Utils.resolvePath(file))
        let rel = Utils.basename(file)
        let n = 0
        while (!(await checkFileExists(dir, `devsconfig.json`))) {
            if (dir.fsPath === root.uri.fsPath) {
                showErrorMessage(
                    "build.devscriptnotfound",
                    "Build cancelled.\ndevicescript.json file not found."
                )
                return undefined
            }
            if (n++ > 30) {
                showErrorMessage(
                    "build.folderprogram",
                    "Build cancelled.\nFolder problem."
                )
                return undefined
            }

            rel = `${Utils.basename(dir)}/${rel}`
            dir = Utils.dirname(dir)
        }

        const log = (msg: string) => this._buildOutputChannel.appendLine(msg)

        log(`building ${rel}`)
        await this.setProjectFolder(dir)
        await this.start()
        const status = await this.build(rel)
        if (!status?.success) log(`build failed`)
        else {
            const { dbg } = status
            const { sizes } = dbg
            log("build success")
            log(
                Object.keys(sizes)
                    .map(name => `${name}: ${prettySize(sizes[name])}`)
                    .join(", ")
            )
            this._buildOutputChannel.show()
        }
        return status
    }

    /**
     * Builds a file relative to the current project folder
     */
    async build(
        relativeFileName: string | vscode.Uri,
        service?: JDService,
        buildOptions?: BuildOptions
    ): Promise<BuildStatus> {
        this._watcher?.dispose()
        this._watcher = undefined
        const { projectFolder } = this

        // absolute uri to relative file name
        if (relativeFileName instanceof vscode.Uri) {
            if (
                projectFolder &&
                relativeFileName.path.startsWith(projectFolder.path)
            ) {
                relativeFileName = relativeFileName.path.slice(
                    projectFolder.path.length + 1
                )
            } else relativeFileName = relativeFileName.path
        }

        // make sure this file is an entry foind
        const entrypoints = await this.entryPoints()
        if (entrypoints.includes(relativeFileName)) {
            this.currentFileName = relativeFileName
        } else if (entrypoints.length === 1) {
            this.currentFileName = entrypoints[0]
        } else if (!this.currentFileName) {
            const res = await vscode.window.showQuickPick(
                entrypoints.map(
                    file =>
                        ({
                            label: file,
                            description: this.projectFolder.fsPath,
                            data: file,
                        } as TaggedQuickPickItem<string>)
                ),
                {
                    title: "Pick an entry point file (main*.ts)",
                }
            )
            if (!res) return
            this.currentFileName = res.data
        }

        this._currentDeviceScriptManager = service?.id
        const res = await this.buildOnce(buildOptions)
        if (res) await this.startWatch(res.usedFiles)

        this.emit(CHANGE)

        return res
    }

    private async buildOnce(buildOptions?: BuildOptions): Promise<BuildStatus> {
        const filename = this._currentFilename

        if (!this._currentFilename) return undefined

        console.debug(`build ${filename}`)
        const service = this.extensionState.bus.node(
            this._currentDeviceScriptManager
        ) as JDService
        const deployTo = service?.device?.deviceId
        try {
            const data = {
                filename,
                buildOptions,
                deployTo,
            }
            const res = await sideRequest<SideBuildReq, SideBuildResp>({
                req: "build",
                data,
            })
            this.showBuildResults(res.data)
            this.emit(BUILD, { service, req: data, res: res.data })
            return res.data
        } catch (err) {
            showError(err)
            return undefined
        }
    }

    private async startWatch(usedFiles: string[]) {
        usedFiles = normalizeUsedFiles(this.projectFolder, usedFiles)
        const filename = this._currentFilename
        const sid = this._currentDeviceScriptManager

        console.debug(`fs.watch: ${filename}`)
        const handleChange = async (uri: vscode.Uri) => {
            console.debug(`fs changed: ${uri.fsPath}`)
            const service = this.extensionState.bus.node(sid) as JDService
            await this.build(filename, service)
        }
        const pattern = `{${usedFiles.join(",")}}`
        const glob = new vscode.RelativePattern(this.projectFolder, pattern)
        this._watcher = vscode.workspace.createFileSystemWatcher(glob)
        this._watcher.onDidChange(handleChange)
        this._watcher.onDidCreate(handleChange)
        this._watcher.onDidDelete(handleChange)
    }

    private async init() {
        try {
            await this.refreshSpecs()
        } catch (e) {
            if (
                isCodeError(e, ERROR_TRANSPORT_CLOSED) ||
                isCodeError(e, ERROR_TIMEOUT)
            )
                return false
            else throw e
        }
        return true
    }

    versions() {
        return this._versions
    }

    get devsVersion() {
        return this._versions?.devsVersion
    }

    get runtimeVersion() {
        return this._versions?.runtimeVersion
    }

    get nodeVersion() {
        return this._versions?.nodeVersion
    }

    get buildConfig() {
        return this._buildConfig
    }

    get boards() {
        let boards = Object.values(this.buildConfig?.boards || {})
        if (!Flags.developerMode) boards = boards.filter(b => !!b.url)
        return boards.sort((l, r) => {
            let c = -(l.url ? 1 : 0) + (r.url ? 1 : 0)
            if (c) return c
            return l.devName.localeCompare(r.devName)
        })
    }

    get srcFolder() {
        return this.projectFolder
            ? vscode.Uri.joinPath(this.projectFolder, "src")
            : undefined
    }

    get projectFolder() {
        return this._projectFolder
    }

    async setProjectFolder(folder: vscode.Uri) {
        if (folder?.toString() !== this._projectFolder?.toString()) {
            if (this._projectFolder) await this.kill()
            this._projectFolder = folder
            await this.saveProjectFolder()
            vscode.commands.executeCommand(
                "setContext",
                "extension.devicescript.projectAvailable",
                !!folder
            )
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

    private async pickProject(): Promise<vscode.Uri> {
        // try sorted
        const dir = this.extensionState.state.get<string>(PROJECT_FOLDER_KEY)
        if (dir) {
            try {
                const folder = vscode.Uri.file(dir)
                const exists = await checkFileExists(
                    folder,
                    "./devsconfig.json"
                )
                if (exists) return folder

                // clear outdated key
                await this.extensionState.state.update(
                    PROJECT_FOLDER_KEY,
                    undefined
                )
            } catch {
                // clear outdated key
                await this.extensionState.state.update(
                    PROJECT_FOLDER_KEY,
                    undefined
                )
            }
        }

        return await this.showQuickPickProjects()
    }

    async showQuickPickProjects(): Promise<vscode.Uri> {
        const projects = await this.findProjects()
        if (projects.length == 0) return undefined
        else if (projects.length == 1) return projects[0]
        else {
            const items = projects.map(
                project =>
                    <TaggedQuickPickItem<vscode.Uri>>{
                        data: project,
                        description: project.fsPath,
                        label: Utils.basename(project),
                    }
            )
            const res = await vscode.window.showQuickPick(items, {
                title: "Pick a DeviceScript project",
            })
            return res?.data
        }
    }

    private async createTerminal(): Promise<vscode.Terminal> {
        if (!this._projectFolder)
            await this.setProjectFolder(await this.pickProject())
        if (!this._projectFolder) {
            this.clear()
            return undefined
        }

        // store current folder
        await this.saveProjectFolder()

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

    private async saveProjectFolder() {
        await this.extensionState.state.update(
            PROJECT_FOLDER_KEY,
            this._projectFolder?.fsPath
        )
    }

    start(options?: { build?: boolean }): Promise<void> {
        return (
            this._terminalPromise ||
            (this._terminalPromise = this.createTerminal())
        ).then(() => {
            if (options?.build) return this.startBuild()
            return undefined
        })
    }

    async entryPoints() {
        const { srcFolder } = this
        if (!srcFolder) return []
        const files = await vscode.workspace.fs.readDirectory(srcFolder)
        return files
            .filter(
                ([name, type]) =>
                    type == vscode.FileType.File &&
                    name.startsWith("main") &&
                    name.endsWith(".ts")
            )
            .map(r => "src/" + r[0])
    }

    private async startBuild() {
        const files = await this.entryPoints()
        const file = files?.[0]
        if (file) await this.build(file)
    }

    dispose() {
        this.kill()
    }

    private async sendKillRequest() {
        try {
            await sideRequest<SideKillReq, SideKillResp>({
                req: "kill",
                data: {},
                timeout: 1000,
            })
            // process acknoledged the message
            return true
        } catch {
            return false
        }
    }

    private async kill() {
        await this.sendKillRequest()
        const p = this._terminalPromise
        this.clear()
        if (p) {
            await delay(1000)
            p.then(t => {
                if (t) {
                    try {
                        t.sendText("\u001c")
                    } catch {}
                }
            })
        }
    }

    private async handleWorkspaceFoldersChange(
        e: vscode.WorkspaceFoldersChangeEvent
    ) {
        if (e.removed && this._projectFolder) {
            const projectUris = await this.findProjects()
            const projects = projectUris.map(uri => uri.toString())
            if (!projects.includes(this._projectFolder?.toString()))
                await this.setProjectFolder(undefined)
        }
    }

    private async handleDidDeleteFiles(ev: vscode.FileDeleteEvent) {
        const cf = this.currentFile
        if (!cf) return
        const pp = cf.path
        if (ev.files.find(f => f.path === pp)) await this.build(undefined)
    }

    private async handleDidRenameFiles(ev: vscode.FileRenameEvent) {
        const cf = this.currentFile
        if (!cf) return
        const pp = cf.path
        // TODO better than just stop everyhing
        if (ev.files.find(f => f.oldUri.path === pp))
            await this.build(undefined)
    }

    private async handleOpenTextDocument(e: vscode.TextDocument) {
        if (
            this.projectFolder ||
            this._terminalPromise ||
            e.languageId !== "typescript" ||
            !/src\/main.*\.ts$/i.test(e.fileName) ||
            !(await checkFileExists(
                Utils.dirname(Utils.dirname(e.uri)),
                "devsconfig.json"
            ))
        )
            return

        await this.start({ build: true })
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
        this.clearProjectContext()
        this._versions = undefined
        this._watcher?.dispose()
        this._watcher = undefined
        this._currentFilename = undefined
        this._currentDeviceScriptManager = undefined
        this.updateBuildConfig(undefined) // TODOD
        this.connectionState = ConnectionState.Disconnected
        this.emit(CHANGE)
    }

    private clearContext() {
        vscode.commands.executeCommand(
            "setContext",
            "extension.devicescript.supportedFolders",
            undefined
        )
        this.clearProjectContext()
    }

    private clearProjectContext() {
        vscode.commands.executeCommand(
            "setContext",
            "extension.devicescript.projectAvailable",
            undefined
        )
    }

    async findProjects() {
        // find file marker
        const configs = await vscode.workspace.findFiles(
            "**/devsconfig.json",
            "**​/node_modules/**"
        )
        const projectUris = configs
            .map(cfg => Utils.dirname(cfg))
            .filter(d => !/(^|\/)node_modules\//.test(d.fsPath))

        vscode.commands.executeCommand(
            "setContext",
            "extension.devicescript.supportedFolders",
            projectUris.map(p => Utils.joinPath(p, "src").fsPath)
        )

        return projectUris
    }

    async show() {
        if (!this._terminalPromise) return
        const terminal = await this._terminalPromise
        terminal?.show()
    }

    private async resolvePackageTool(cwd: vscode.Uri) {
        if (!cwd) return "npm"
        const yarn = await checkFileExists(cwd, "yarn.lock")
        const cmd = yarn ? "yarn" : "npm"
        return cmd
    }

    private get nodePath() {
        const devToolsConfig = vscode.workspace.getConfiguration(
            "devicescript.devtools"
        )
        const nodePath = devToolsConfig.get("node") as string
        return nodePath || "node"
    }

    public async createCliTerminal(options: {
        title?: string
        progress: string
        useShell?: boolean
        diagnostics?: boolean
        developerMode?: boolean
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
            const v = await tryGetNodeVersion(
                this.nodePath,
                Utils.joinPath(cwd, ".devicescript/node.version")
            )
            if (!v) {
                showErrorMessage(
                    "terminal.nodemissing",
                    "Unable to locate Node.JS v16+."
                )
                return undefined
            }
            if (!(v.major >= 18)) {
                showErrorMessage(
                    "terminal.nodeversion",
                    `Node.JS version outdated, found ${v.major}.${v.minor} but needed v16+.`
                )
                return undefined
            }

            showErrorMessage(
                "terminal.notinstalled",
                "Install Node.JS dependencies to enable tools.",
                "Install"
            ).then(async (res: string) => {
                if (res === "Install") {
                    const t = vscode.window.createTerminal({
                        name: "Install Node.JS dependencies",
                        cwd: cwd.fsPath,
                        isTransient: true,
                    })
                    const cmd = await this.resolvePackageTool(cwd)
                    t.sendText(`${cmd} install`)
                    t.show()
                }
            })
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
                const nodePath = this.nodePath
                const diagnostics =
                    options.diagnostics ?? jacdacConfig.get("diagnostics")
                const developerMode =
                    options.developerMode ?? devToolsConfig.get("developerMode")
                let cli = nodePath || "node"
                if (isWindows) {
                    cli = "node_modules\\.bin\\devicescript.cmd"
                } else args.unshift("./node_modules/.bin/devicescript")
                if (diagnostics) args.push("--diagnostics", "--verbose")
                if (developerMode) args.push("--dev")
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
                    iconPath: new vscode.ThemeIcon("devicescript-logo"),
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
                    await tryConnectDevtools()
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
