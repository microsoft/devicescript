import type { DeviceConfig } from "@devicescript/interop"
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
} from "jacdac-ts"
import * as vscode from "vscode"
import { Utils } from "vscode-uri"
import {
    AddResponse,
    SideAddServiceReq,
    SideAddServiceResp,
    SideAddSimReq,
    SideAddSimResp,
    SideConnectReq,
    SideStartVmReq,
    SideStopVmReq,
    SideTransportEvent,
    TransportStatus,
} from "../../cli/src/sideprotocol"
import { openDocUri } from "./commands"
import { CONNECTION_RESOURCE_GROUP } from "./constants"
import { prepareForDeploy, readRuntimeVersion } from "./deploy"
import { DeveloperToolsManager } from "./devtoolsserver"
import { checkFileExists, openFileEditor, writeFile } from "./fs"
import { sideRequest, subSideEvent } from "./jacdac"
import { JDomDeviceTreeItem } from "./JDomTreeDataProvider"
import { showConfirmBox, TaggedQuickPickItem } from "./pickers"
import { SimulatorsWebView } from "./simulatorWebView"
import { activateTelemetry, AppTelemetry, showErrorMessage } from "./telemetry"

const STATE_WATCHES_KEY = "views.watches.3"
const STATE_CURRENT_DEVICE = "devices.current"
const STATE_SIMULATOR_DEVICE = "devices.simulator"

type DeviceQuickItem = TaggedQuickPickItem<string>

export interface NodeWatch {
    id: string
    label: string
    icon: string
}

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
        return current?.services({ serviceClass: SRV_DEVICE_SCRIPT_MANAGER })[0]
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

    async resolveDeviceScriptManager(): Promise<JDService> {
        return this.deviceScriptManager || this.pickDeviceScriptManager()
    }

    async addSim() {
        const resp = await sideRequest<SideAddSimReq, SideAddSimResp>({
            req: "addSim",
            data: {},
        })
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
            `./boards/${normalize(board)}.json`,
            content
        )
    }

    async flashFirmware(device?: JDDevice) {
        await this.devtools.start()
        if (!this.devtools.connected) return
        await this.devtools.refreshSpecs()
        const { boards } = this.devtools
        if (!boards?.length) return

        const productIdentifier = await device?.resolveProductIdentifier()
        let board: DeviceConfig =
            productIdentifier &&
            boards.find(
                board => parseAnyInt(board.productId) === productIdentifier
            )
        if (!board) {
            const res = await vscode.window.showQuickPick(
                <TaggedQuickPickItem<{ board?: DeviceConfig }>[]>[
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
                ],
                {
                    title: "What kind of device are you flashing?",
                    canPickMany: false,
                    matchOnDetail: true,
                    matchOnDescription: true,
                }
            )
            if (!res) return // user escaped

            if (!res.data?.board) {
                openDocUri("devices")
                return
            }

            board = res.data.board
        }

        if (
            !(await showConfirmBox(
                "The DeviceScript runtime will be flashed on your device. There is no undo. Confirm?"
            ))
        )
            return

        // force disconnect
        await this.disconnect()

        const { id } = board
        const t = await this.devtools.createCliTerminal({
            title: "DeviceScript Flasher",
            progress: "Starting flashing tools...",
            useShell: true,
            args: ["flash", "--board", id],
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

    async connect() {
        const { simulatorScriptManagerId } = this
        const { extensionKind } = this.context.extension
        const isWorkspace = extensionKind === vscode.ExtensionKind.Workspace
        if (isWorkspace) {
            showErrorMessage(
                "connection.remote",
                "Connection to a hardware device (serial, usb, ...) is not supported in remote workspaces."
            )
            return
        }

        await this.devtools.start()
        if (!this.devtools.connected) return

        const { transports } = this.transport
        const serial = transports.find(t => t.type === "serial")
        const usb = transports.find(t => t.type === "usb")
        const sim = !!this.bus.device(this.simulatorScriptManagerId, true)
        const items: (vscode.QuickPickItem & { transport?: string })[] = [
            {
                transport: "serial",
                label: "Serial",
                detail: "ESP32, RP2040, ...",
                description: serial
                    ? `${serial.description}(${serial.connectionState})`
                    : "",
            },
            {
                transport: "usb",
                label: "USB",
                detail: "micro:bit",
                description: usb
                    ? `${usb.description}(${usb.connectionState})`
                    : "",
            },
            !sim && {
                label: "",
                kind: vscode.QuickPickItemKind.Separator,
            },
            !sim && {
                label: shortDeviceId(simulatorScriptManagerId),
                description: `Simulator`,
                detail: `A virtual DeviceScript interpreter running in a separate process.`,
                transport: simulatorScriptManagerId,
            },
            {
                label: "",
                kind: vscode.QuickPickItemKind.Separator,
            },
            {
                label: "Flash Firmware...",
                transport: "flash",
                detail: "Flash the DeviceScript runtime on new devices.",
            },
        ].filter(m => !!m)
        const res = await vscode.window.showQuickPick(items, {
            title: "Pick a DeviceScript connection",
        })
        if (res === undefined || !res.transport) return

        if (res.transport === "flash") await this.flashFirmware()
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
        options?: vscode.QuickPickOptions
    ): Promise<vscode.Uri> {
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
                            new vscode.RelativePattern(d, "src/main*.ts")
                        )
                        return res
                    })
            )
        ).flat()
        // sort
        files.sort((l, r) => l.path.localeCompare(r.path))
        // unique
        files = [...new Set(files)]

        if (!files.length) {
            showErrorMessage("pickfile.notfound", "Could not find any file.")
            return undefined
        }

        // only 1 file
        if (files.length === 1) return files[0]

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

    async pickDeviceScriptManager(skipUpdate?: boolean): Promise<JDService> {
        const { simulatorScriptManagerId } = this
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string

        await this.devtools.start()
        if (!this.devtools.connected) return

        const services = this.bus.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })
        const detail = async (srv: JDService) => {
            const runtimeVersion = await readRuntimeVersion(srv)
            const description = srv.device
                .service(0)
                .register(ControlReg.DeviceDescription)
            await description.refresh(true)

            return `${description.stringValue || ""} (${runtimeVersion || "?"})`
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
        let startVM = false
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
        const did = res?.data
        if (!did) return undefined

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
}
