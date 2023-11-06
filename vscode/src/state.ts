import type {
    DeviceConfig,
    ServerInfo,
    ServerInfoFile,
} from "@devicescript/interop"
import { normalizeDeviceConfig, parseAnyInt } from "@devicescript/interop"
import {
    CHANGE,
    ControlReg,
    delay,
    DEVICE_CHANGE,
    JDBus,
    JDEventSource,
    JDService,
    randomDeviceId,
    shortDeviceId,
    SRV_DEVICE_SCRIPT_MANAGER,
    CONNECTION_STATE,
    ConnectionState,
    JDDevice,
    DEVICE_ANNOUNCE,
} from "jacdac-ts"
import * as vscode from "vscode"
import { Utils } from "vscode-uri"
import {
    AddResponse,
    SideAddNpmReq,
    SideAddNpmResp,
    SideAddServiceReq,
    SideAddServiceResp,
    SideAddSettingsReq,
    SideAddSettingsResp,
    SideAddSimReq,
    SideAddSimResp,
    SideAddTestReq,
    SideAddTestResp,
    SideConnectReq,
    SideMissingPackageEvent,
    SideStartVmReq,
    SideStopVmReq,
    SideTransportEvent,
    TransportStatus,
} from "../../cli/src/sideprotocol"
import { openDocUri, showInformationMessageWithHelp } from "./commands"
import { CONNECTION_RESOURCE_GROUP } from "./constants"
import { prepareForDeploy, readRuntimeVersion } from "./deploy"
import { DeveloperToolsManager, resolveDevtoolsPath } from "./devtoolsserver"
import { checkFileExists, openFileEditor, writeFile } from "./fs"
import { sideRequest, subSideEvent } from "./jacdac"
import { JDomDeviceTreeItem } from "./JDomTreeDataProvider"
import { showConfirmBox, TaggedQuickPickItem } from "./pickers"
import { SimulatorsWebView } from "./simulatorWebView"
import { showErrorMessage } from "./telemetry"
import _serverInfo from "./server-info.json"
import { resolvePythonEnvironment } from "./python"

const serverInfo = _serverInfo as ServerInfoFile

const STATE_WATCHES_KEY = "views.watches.3"
const STATE_CURRENT_DEVICE = "devices.current"
const STATE_SIMULATOR_DEVICE = "devices.simulator"

type DeviceQuickItem = TaggedQuickPickItem<string>

export interface NodeWatch {
    id: string
    label: string
    icon: string
}

export type ServerQuickPickItem = TaggedQuickPickItem<{
    command: "test" | "settings" | "search" | "server" | "sim" | "npm"
    info?: ServerInfo
}>

export class DeviceScriptExtensionState extends JDEventSource {
    readonly devtools: DeveloperToolsManager
    readonly simulators: SimulatorsWebView

    private _transport: TransportStatus = {
        transports: [],
    }

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly bus: JDBus
    ) {
        super()
        this.devtools = new DeveloperToolsManager(this)
        this.simulators = new SimulatorsWebView(this)

        if (!this.simulatorScriptManagerId) {
            this.state.update(STATE_SIMULATOR_DEVICE, randomDeviceId())
        }
        this.bus.on([DEVICE_CHANGE, CONNECTION_STATE], () => {
            this.emit(CHANGE)
        })
        this.bus.on(DEVICE_ANNOUNCE, this.handleDeviceAnnounce.bind(this))
        this.devtools.on(CHANGE, () => this.emit(CHANGE))
        subSideEvent<SideTransportEvent>("transport", msg => {
            const _transport = msg.data
            if (
                JSON.stringify(_transport) !== JSON.stringify(this._transport)
            ) {
                this._transport = _transport
                this.emit(CHANGE)
            }
        })
        subSideEvent<SideMissingPackageEvent>("missingPackage", async msg => {
            const { packageName } = msg.data
            const projectFolder = this.projectFolder
            const install = "Install"
            const res = await showErrorMessage(
                "package.missing",
                `Failed to require '${packageName}' package. Please install and try again.`,
                install
            )
            if (res === install)
                await this.devtools.startPackageTool(
                    projectFolder,
                    `Installing ${packageName}...`,
                    "install",
                    packageName
                )
        })
    }

    get state() {
        return this.context.workspaceState
    }

    get transport() {
        return this._transport
    }

    get watches(): NodeWatch[] {
        return this.state.get(STATE_WATCHES_KEY) || []
    }

    async updateWatches(watches: NodeWatch[]) {
        await this.state.update(STATE_WATCHES_KEY, watches || [])
        this.emit(CHANGE)
    }

    get simulatorScriptManagerId() {
        const id = this.state.get(STATE_SIMULATOR_DEVICE) as string
        return id
    }

    get deviceScriptManager() {
        const id = this.state.get(STATE_CURRENT_DEVICE) as string
        const current = this.bus.device(id, true)
        const srv = current?.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })[0]
        return srv?.disposed ? undefined : srv
    }

    get projectFolder() {
        return this.devtools.projectFolder
    }

    async setProjectFolder(folder: vscode.Uri) {
        await this.devtools.setProjectFolder(folder)
    }

    public async updateCurrentDeviceScriptManagerId(id: string) {
        const oldid = this.state.get(STATE_CURRENT_DEVICE) as string
        if (oldid !== id) {
            await this.state.update(STATE_CURRENT_DEVICE, id)
            if (id !== this.simulatorScriptManagerId) await this.stopSimulator()
            this.emit(CHANGE)
        }
    }

    async resolveDeviceScriptManager(options?: {
        autoStartSimulator?: boolean
        skipUpdate?: boolean
    }): Promise<JDService> {
        return this.deviceScriptManager || this.pickDeviceScriptManager(options)
    }

    async addTest() {
        const resp = await sideRequest<SideAddTestReq, SideAddTestResp>({
            req: "addTest",
            data: {},
        })
        await this.handleAddResponse(resp.data)
    }

    async addSim() {
        const resp = await sideRequest<SideAddSimReq, SideAddSimResp>({
            req: "addSim",
            data: {},
        })
        await this.handleAddResponse(resp.data)
    }

    async addNpm() {
        const resp = await sideRequest<SideAddNpmReq, SideAddNpmResp>({
            req: "addNpm",
            data: {},
        })
        await this.handleAddResponse(resp.data)
    }

    async addSettings() {
        const resp = await sideRequest<SideAddSettingsReq, SideAddSettingsResp>(
            {
                req: "addSettings",
                data: {},
            }
        )
        await this.handleAddResponse(resp.data)
    }

    private async handleAddResponse(data: AddResponse) {
        const dir = this.devtools.projectFolder
        const { files = [] } = data || {}
        for (const file of files) {
            await openFileEditor(dir, file)
        }
    }

    async addService() {
        const name = await vscode.window.showInputBox({
            title: "Pick a service name",
        })
        if (!name) return

        const resp = await sideRequest<SideAddServiceReq, SideAddServiceResp>({
            req: "addService",
            data: { name },
        })
        await this.handleAddResponse(resp.data)
    }

    async addBoard() {
        await this.devtools.start()
        if (!this.devtools.connected) return
        await this.devtools.refreshSpecs()
        const { boards } = this.devtools
        if (!boards?.length) return

        const base = await vscode.window.showQuickPick<
            TaggedQuickPickItem<DeviceConfig>
        >(
            boards.map(board => ({
                data: board,
                label: board.devName,
                description: board.archId,
                detail: board.id,
            })),
            {
                title: "Pick a board base.",
            }
        )
        if (base === undefined) return

        const name = await vscode.window.showInputBox({
            placeHolder: "Pick a name for the new board.",
            value: base.data.devName,
            validateInput: value => {
                if (value.length < 4)
                    return "Name must be at least 4 characters long."
                if (value.length > 64)
                    return "Name must be at most 64 characters long."
                if (boards.find(b => b.devName === value))
                    return "Board name already exists."
                return undefined
            },
        })
        if (name === undefined) return

        const normalize = (v: string) =>
            v
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .trim()
                .replace(/\s+/g, "_")

        const board = await vscode.window.showInputBox({
            placeHolder: "Pick a board identifier.",
            value: base.data.id,
            prompt: `Alphanumeric characters or _ allowed. Base is ${base.data.id}.`,
            validateInput: async value => {
                const nvalue = normalize(value)
                if (nvalue.length < 4)
                    return `Identifier (${nvalue}) must be at least 4 characters long.`
                if (nvalue.length > 64)
                    return `Identifier (${nvalue}) must be at most 64 characters long.`
                if (boards.find(b => b.id === nvalue))
                    return `Identifier (${nvalue}) already used.`

                const fp = `./boards/${nvalue}.json`
                const exists = await checkFileExists(
                    this.devtools.projectFolder,
                    fp
                )
                if (exists) return `Board file ${fp} already exists.`

                return undefined
            },
        })
        if (board === undefined) return

        const newBoard = normalizeDeviceConfig(base.data, {
            ignoreFirmwareUrl: true,
            ignoreId: true,
        })
        newBoard.devName = name
        newBoard.productId = this.bus.deviceCatalog.uniqueFirmwareId()

        const content = JSON.stringify(newBoard, null, 4)
        await writeFile(
            this.devtools.projectFolder,
            `./boards/${normalize(board)}.board.json`,
            content,
            { open: true }
        )
    }

    async showQuickPickBoard(
        title: string,
        options?: { useUniqueDevice?: boolean }
    ): Promise<DeviceConfig> {
        const { useUniqueDevice } = options || {}
        const { boards } = this.devtools

        // find device on the board
        const devices = this.bus.devices({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
            lost: false,
        })
        const deviceItems = devices
            .map(device => ({
                device,
                board: boards.find(
                    b => parseAnyInt(b.productId) === device.productIdentifier
                ),
            }))
            .filter(({ board }) => !!board)
            .map(({ device, board }) => ({
                data: { board },
                description: board.devName,
                label: device.shortId,
                detail: "connected",
            }))

        if (deviceItems.length === 1 && useUniqueDevice)
            return deviceItems[0].data.board

        const res = await vscode.window.showQuickPick(
            <TaggedQuickPickItem<{ board?: DeviceConfig }>[]>[
                ...deviceItems,
                deviceItems && {
                    kind: vscode.QuickPickItemKind.Separator,
                },
                {
                    label: "Help me choose...",
                    detail: "Identify your board or find where to get one.",
                },
                ...boards.map(board => ({
                    data: { board },
                    label: board.devName,
                    description: board.id,
                    detail: board.$description,
                })),
            ].filter(i => !!i),
            {
                title,
                canPickMany: false,
                matchOnDetail: true,
                matchOnDescription: true,
            }
        )
        if (!res) return undefined // user escaped

        if (!res.data?.board) {
            openDocUri("devices")
            return undefined
        }

        return res.data.board
    }

    async configureHardware(editor: vscode.TextEditor) {
        await this.devtools.start()
        if (!this.devtools.connected) return
        await this.devtools.refreshSpecs()

        const { boards } = this.devtools
        const document = editor.document
        const { boardimport } =
            /from "@dsboard\/(?<boardimport>[^"]+)/.exec(document.getText())
                ?.groups || {}
        let board = boards.find(b => b.id === boardimport)
        if (!board) {
            board = await this.showQuickPickBoard(
                "What kind of device are you programming?",
                { useUniqueDevice: true }
            )
            if (!board) return

            // insert missing import
            await editor.edit(editBuilder => {
                editBuilder.insert(
                    document.positionAt(0),
                    `import { pins, board } from "@dsboard/${board.id}"\n`
                )
            })
            showInformationMessageWithHelp(
                `Imported ${board.devName} configuration`,
                "developer/board-configuration"
            )
            return
        }

        await this.showQuickAddFeatureOrDriver(editor)
    }

    private async handleDeviceAnnounce(dev: JDDevice) {
        // ignore simulator
        if (dev.deviceId === this.simulatorScriptManagerId) return
        // only handle devices that have a script manager
        if (!dev.hasService(SRV_DEVICE_SCRIPT_MANAGER)) return
        // check if a simulator is running
        if (!this.bus.device(this.simulatorScriptManagerId, true)) return
        // stop simulator and let other manager take over
        await this.stopSimulator()
    }

    private async showQuickAddFeatureOrDriver(editor: vscode.TextEditor) {
        const server = await vscode.window.showQuickPick(
            [
                {
                    label: "Drivers",
                    kind: vscode.QuickPickItemKind.Separator,
                },
                ...serverInfo.servers.map(
                    e =>
                        <ServerQuickPickItem>{
                            label: e.label,
                            description: e.startName,
                            detail: e.detail,
                            data: { info: e, command: "server" },
                        }
                ),
                <ServerQuickPickItem>{
                    label: "Search...",
                    description: "npmjs.com",
                    detail: "Search for packages on npmjs.com with the `devicescript` keyword.",
                    data: { command: "search" },
                },
                {
                    label: "Features",
                    kind: vscode.QuickPickItemKind.Separator,
                },
                <ServerQuickPickItem>{
                    label: "Add device settings and secrets",
                    detail: "Add .env.default and .env.local files to store configuration settings and secrets.",
                    data: { command: "settings" },
                },
                <ServerQuickPickItem>{
                    label: "Add tests",
                    detail: "Add a test file to run tests on your device.",
                    data: { command: "test" },
                },
                <ServerQuickPickItem>{
                    label: "Convert to NPM package",
                    detail: "Update package.json to support publishing as a library on npm.js.",
                    data: { command: "npm" },
                },
            ],
            {
                title: `Configure project`,
                matchOnDescription: true,
                matchOnDetail: true,
                canPickMany: false,
            }
        )
        if (server === undefined) return

        const { command, info } = server.data
        if (command === "server") await this.addStartServer(editor, info)
        else if (command === "search")
            await vscode.env.openExternal(
                vscode.Uri.parse(
                    "https://www.npmjs.com/search?q=keywords%3Adevicescript"
                )
            )
        else if (command === "test") await this.addTest()
        else if (command === "settings") await this.addSettings()
        else if (command === "sim") await this.addSim()
        else if (command === "npm") await this.addNpm()
    }

    // find first line that is not an import, comment or empty
    private async addStartServer(
        editor: vscode.TextEditor,
        server: ServerInfo
    ) {
        for (const [symName, modName] of Object.entries(server.imports)) {
            await this.addImport(editor, symName, modName)
        }

        const document = editor.document
        let line: vscode.TextLine
        let i = 0
        for (let i = 0; i < document.lineCount; ++i) {
            line = document.lineAt(i)
            if (
                !line.isEmptyOrWhitespace &&
                !/^\s*(\/\/|import\s+)/m.test(line.text)
            )
                break
        }
        const position = line?.rangeIncludingLineBreak?.start
        await editor.insertSnippet(
            new vscode.SnippetString(server.snippet),
            position
        )
    }

    private async addImport(
        editor: vscode.TextEditor,
        symName: string,
        modName: string
    ) {
        let idx = -1
        let lastImport = 0
        let add = ""

        const text = editor.document.getText()

        text.replace(
            /^(\s*import\s*\{)([^\}]*)(\}\s*from\s*"([^"]+)")/gm,
            (
                full: string,
                pref: string,
                imports: string,
                suff: string,
                mod: string
            ) => {
                if (idx == -1 && mod == modName) {
                    if (
                        imports
                            .split(/,/)
                            .map(e => e.trim())
                            .includes(symName)
                    ) {
                        idx = 0
                        add = ""
                    } else {
                        imports = imports.replace(/\s*$/, "")
                        idx = text.indexOf(full) + pref.length + imports.length
                        if (!imports.endsWith(",")) add += ","
                        add += " " + symName + " "
                    }
                }
                lastImport = text.indexOf(full) + full.length
                return full
            }
        )

        if (idx == -1) {
            idx = lastImport
            add = `\nimport { ${symName} } from "${modName}"`
        }

        await editor.edit(editBuilder => {
            editBuilder.insert(editor.document.positionAt(idx), add)
        })
    }

    private async resolveBoardDefinition(device?: JDDevice) {
        await this.devtools.start()
        if (!this.devtools.connected) return undefined
        await this.devtools.refreshSpecs()
        const { boards } = this.devtools
        if (!boards?.length) return undefined

        const productIdentifier = await device?.resolveProductIdentifier()
        let board: DeviceConfig =
            productIdentifier &&
            boards.find(
                board => parseAnyInt(board.productId) === productIdentifier
            )
        if (!board) {
            board = await this.showQuickPickBoard(
                "What kind of device are you flashing?",
                { useUniqueDevice: true }
            )
            if (!board) return undefined
        }
        return board
    }

    async cleanFirmware(device?: JDDevice) {
        if (
            !(await showConfirmBox(
                `The entire flash will be erased. There is NO undo. Confirm?`
            ))
        )
            return

        const board = await this.resolveBoardDefinition(device)
        if (!board) return

        // force disconnect
        await this.disconnect()

        const { id } = board
        const args = ["flash", "--board", id, "--install", "--clean"]
        if (this.isRemote) args.push("--remote")
        const python = await resolvePythonEnvironment()
        if (python) args.push("--python", python.path)
        const t = await this.devtools.createCliTerminal({
            title: "DeviceScript Flasher",
            progress: "Starting flashing tools...",
            useShell: true,
            args,
            diagnostics: false,
        })
        t.show()
    }

    async flashFirmware(device?: JDDevice) {
        const board = await this.resolveBoardDefinition(device)
        if (!board) return

        // same host flow
        if (
            !(await showConfirmBox(
                `DeviceScript runtime will be flashed on your ${board.devName}. There is NO undo. Confirm?`
            ))
        )
            return

        // force disconnect
        await this.disconnect()

        const { id } = board
        const args = ["flash", "--board", id, "--refresh", "--install"]
        if (this.isRemote) args.push("--remote")
        const python = await resolvePythonEnvironment()
        if (python) args.push("--python", python.path)
        const t = await this.devtools.createCliTerminal({
            title: "DeviceScript Flasher",
            progress: "Starting flashing tools...",
            useShell: true,
            args,
            diagnostics: false,
        })
        t.show()
    }

    private async disconnect() {
        if (!this.devtools.connected) return
        await sideRequest<SideConnectReq>({
            req: "connect",
            data: {
                transport: "none",
                background: true,
                resourceGroupId: CONNECTION_RESOURCE_GROUP,
            },
        })
    }

    get isRemote() {
        const config = vscode.workspace.getConfiguration("devicescript.connect")
        const { extensionKind } = this.context.extension
        return (
            extensionKind === vscode.ExtensionKind.Workspace ||
            !!config.get("web")
        )
    }

    async connect() {
        await this.devtools.start()
        if (!this.devtools.connected) return

        const { simulatorScriptManagerId, isRemote } = this
        const { transports } = this.transport
        const connecteds = transports.filter(
            tr => tr.connectionState === ConnectionState.Connected
        )
        const sim = !!this.bus.device(this.simulatorScriptManagerId, true)
        let items: (vscode.QuickPickItem & { transport?: string })[] = []
        items.push({
            label: "Hardware Connections",
            kind: vscode.QuickPickItemKind.Separator,
        })
        if (isRemote) {
            items.push({
                transport: "web",
                label: "WebSerial/WebUSB",
                detail: "ESP32, RP2040, ...",
                description:
                    "Connect through an external web page running client side.",
            })
        } else {
            const serial = transports.find(t => t.type === "serial")
            items.push({
                transport: "serial",
                label: "Serial",
                detail: "ESP32, RP2040, ...",
                description: serial
                    ? `${serial.description || ""}(${serial.connectionState})`
                    : "",
            })
        }
        items.push(
            !!connecteds.length && {
                transport: "none",
                label: "Disconnect",
                detail: `Disconnect from ${connecteds
                    .map(tr => tr.type)
                    .join(", ")}`,
            },
            !sim && {
                label: "Simulator",
                kind: vscode.QuickPickItemKind.Separator,
            },
            !sim && {
                label: shortDeviceId(simulatorScriptManagerId),
                description: `Simulator`,
                detail: `A virtual DeviceScript interpreter running in a separate process.`,
                transport: simulatorScriptManagerId,
            }
        )
        items = items.filter(m => !!m)
        const res = await vscode.window.showQuickPick(items, {
            title: "Pick a DeviceScript connection",
        })
        if (res === undefined || !res.transport) return

        if (res.transport === "web") await this.openExternalConnect()
        else if (res.transport === simulatorScriptManagerId)
            await this.startSimulator()
        else
            await sideRequest<SideConnectReq>({
                req: "connect",
                data: {
                    transport: res.transport,
                    background: false,
                    resourceGroupId: CONNECTION_RESOURCE_GROUP,
                },
            })
    }

    private async openExternalConnect() {
        const connectUri = await resolveDevtoolsPath(`connect`)
        await vscode.env.openExternal(connectUri)
    }

    async startSimulator(clearFlash?: boolean) {
        const did = this.simulatorScriptManagerId

        await this.devtools.start()
        if (!this.devtools.connected) return

        if (this.bus.device(did, true)) return // already running
        const config = vscode.workspace.getConfiguration(
            "devicescript.simulator"
        )
        const nativePath = config.get("runNative")
            ? (config.get("nativePath") as string) || undefined
            : undefined
        await sideRequest<SideStartVmReq>({
            req: "startVM",
            data: {
                nativePath,
                deviceId: did,
                clearFlash: !!clearFlash,
            },
        })
        // wait for it to enumerate
        let max = 20
        while (max-- > 0 && !this.bus.device(did, true)) await delay(200)
    }

    async stopSimulator() {
        if (this.devtools.connectionState === ConnectionState.Connected)
            await sideRequest<SideStopVmReq>({
                req: "stopVM",
                data: {},
            })
    }

    async clearSimulatorFlash() {
        await this.stopSimulator()
        await this.startSimulator(true)
    }

    async pickDeviceScriptFile(
        options?: vscode.QuickPickOptions & {
            fileSearchPattern?: string
            forcePick?: boolean
        }
    ): Promise<vscode.Uri> {
        const { fileSearchPattern = "src/main*.ts", forcePick } = options || {}
        const { projectFolder: folder } = this.devtools
        if (!folder) return undefined

        // find file marker
        const configs = await vscode.workspace.findFiles(
            new vscode.RelativePattern(folder, "**/devsconfig.json"),
            "**​/node_modules/**"
        )
        // get all typescript files next to config file
        let files = (
            await Promise.all(
                configs
                    .filter(cfg => !/\/node_modules\//.test(cfg.fsPath))
                    .map(async cfg => {
                        const d = Utils.dirname(cfg).fsPath
                        const res = await vscode.workspace.findFiles(
                            new vscode.RelativePattern(d, fileSearchPattern),
                            "**​/node_modules/**"
                        )
                        return res
                    })
            )
        ).flat()
        // ignore .devicescript files
        files = files.filter(f => !/\/\.devicescript\//.test(f.fsPath))
        // sort
        files.sort((l, r) => l.path.localeCompare(r.path))
        // unique
        files = [...new Set(files)]

        if (!files.length) {
            showErrorMessage("pickfile.notfound", "Could not find any file.")
            return undefined
        }

        // only 1 file
        if (files.length === 1 && !forcePick) return files[0]

        // ask user
        const res = await vscode.window.showQuickPick(
            files.map(
                file =>
                    <TaggedQuickPickItem<vscode.Uri>>{
                        data: file,
                        label: Utils.basename(file),
                        description: Utils.dirname(file).fsPath,
                    }
            ),
            {
                ...options,
                canPickMany: false,
            }
        )
        return res?.data
    }

    async configure() {
        const project = await this.devtools.showQuickPickProjects()
        if (project === undefined) return

        await this.devtools.setProjectFolder(project)
        await this.devtools.start()
    }

    async build(file: vscode.Uri) {
        const status = await this.devtools.buildFile(file)
        if (!status?.success)
            vscode.commands.executeCommand("workbench.action.problems.focus")
    }

    async pickDeviceScriptManager(options?: {
        autoStartSimulator?: boolean
        skipUpdate?: boolean
    }): Promise<JDService> {
        const { simulatorScriptManagerId } = this
        const { skipUpdate, autoStartSimulator } = options || {}
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string

        await this.devtools.start()
        if (!this.devtools.connected) return

        let startVM = false
        let did: string
        const services = this.bus.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
            lost: false,
        })
        if (!services.length && autoStartSimulator) {
            did = simulatorScriptManagerId
            startVM = true
        } else if (services.length === 1) {
            did = services[0].device.deviceId
        } else {
            const detail = async (srv: JDService) => {
                const runtimeVersion = await readRuntimeVersion(srv)
                const description = srv.device
                    .service(0)
                    .register(ControlReg.DeviceDescription)
                await description.refresh(true)

                return `${description.stringValue || ""} (${
                    runtimeVersion || "?"
                })`
            }
            const items: DeviceQuickItem[] = await Promise.all(
                services.map(
                    async srv =>
                        <DeviceQuickItem>{
                            label: `$(${JDomDeviceTreeItem.ICON}) ${srv.device.friendlyName}`,
                            description: srv.device.deviceId,
                            detail: await detail(srv),
                            data: srv.device.deviceId,
                            picked: srv.device.deviceId === cid,
                        }
                )
            )
            if (!items.find(({ data }) => data === simulatorScriptManagerId)) {
                startVM = true
                items.push(<DeviceQuickItem>{
                    label: shortDeviceId(simulatorScriptManagerId),
                    description: `Simulator`,
                    detail: `A virtual DeviceScript interpreter running in a separate process.`,
                    data: simulatorScriptManagerId,
                })
            }
            const res = await vscode.window.showQuickPick(items, {
                title: `Pick a DeviceScript device`,
                matchOnDescription: true,
                matchOnDetail: true,
                canPickMany: false,
            })
            did = res?.data
            if (!did) return undefined
        }

        if (startVM && did == simulatorScriptManagerId) {
            await this.startSimulator()
        } else {
            startVM = false
        }
        const service = this.bus.device(did, true)?.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })?.[0]
        if (service) await prepareForDeploy(this, service)
        if (service && !skipUpdate)
            await this.updateCurrentDeviceScriptManagerId(
                service.device.deviceId
            )
        return service
    }

    async runFile(file: vscode.Uri, options?: { debug?: boolean }) {
        if (!file) return
        const folder = vscode.workspace.getWorkspaceFolder(file)
        if (!folder) return

        const { debug } = options || {}
        await vscode.debug.startDebugging(folder, {
            type: "devicescript",
            request: "launch",
            name: "DeviceScript: Run File",
            stopOnEntry: false,
            noDebug: !debug,
            program: file.path,
        } as vscode.DebugConfiguration)
        if (!debug)
            vscode.commands.executeCommand("extension.devicescript.jdom.focus")
    }
}
