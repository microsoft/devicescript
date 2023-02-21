import {
    architectureFamily,
    DeviceConfig,
    parseAnyInt,
} from "@devicescript/compiler"
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
import {
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
import { sideRequest, subSideEvent } from "./jacdac"
import { JDomDeviceTreeItem } from "./JDomTreeDataProvider"
import { TaggedQuickPickItem } from "./pickers"
import { SimulatorsWebView } from "./simulatorWebView"
import { activeTelemetry, Telemetry } from "./telemetry"

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
    readonly telemetry: Telemetry

    private _transport: TransportStatus = {
        transports: [],
    }

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly bus: JDBus
    ) {
        super()
        this.telemetry = activeTelemetry(this.context)
        this.devtools = new DeveloperToolsManager(this)
        this.simulators = new SimulatorsWebView(this)

        if (!this.simulatorScriptManagerId) {
            this.state.update(STATE_SIMULATOR_DEVICE, randomDeviceId())
        }
        this.bus.on([DEVICE_CHANGE, CONNECTION_STATE], () => {
            this.emit(CHANGE)
        })

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

    async addBoard() {
        await this.devtools.start()
        if (!this.devtools.connected) return
        await this.devtools.refreshSpecs()
        const { boards } = this.devtools
        if (!boards?.length) return

        const name = await vscode.window.showInputBox({
            placeHolder: "Pick a name for the new board.",
            validateInput: value => {
                if (value.length < 4)
                    return "Name must be at least 4 characters long."
                if (value.length > 64)
                    return "Name must be at most 64 characters long."
                return undefined
            },
        })
        if (name === undefined) return

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
            validateInput: value => {
                const nvalue = normalize(value)
                if (nvalue.length < 4)
                    return `Identifier (${nvalue}) must be at least 4 characters long.`
                if (nvalue.length > 64)
                    return `Identifier (${nvalue}) must be at most 64 characters long.`
                if (boards.find(b => b.id === nvalue))
                    return `Identifier (${nvalue}) already used.`
                return undefined
            },
        })
        if (board === undefined) return

        // call cli
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

        const confirm = await vscode.window.showQuickPick(["yes", "no"], {
            title: "The DeviceScript runtime will be flashed on your device. There is no undo. Confirm?",
        })
        if (confirm !== "yes") return

        const { archId, id } = board
        const arch = architectureFamily(archId)
        const t = await this.devtools.createCliTerminal({
            title: "DeviceScript Flasher",
            progress: "Starting flashing tools...",
            useShell: true,
            args: ["flash", arch, "--board", id],
            diagnostics: false,
        })
        t.show()
    }

    async connect() {
        const { extensionKind } = this.context.extension
        const isWorkspace = extensionKind === vscode.ExtensionKind.Workspace
        if (isWorkspace) {
            this.telemetry.showErrorMessage(
                "connection.remote",
                "DeviceScript - Connection to a hardware device (serial, usb, ...) is not supported in remote workspaces."
            )
            return
        }

        await this.devtools.start()
        if (!this.devtools.connected) return

        const { transports } = this.transport
        const serial = transports.find(t => t.type === "serial")
        const usb = transports.find(t => t.type === "usb")
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
            {
                label: "",
                kind: vscode.QuickPickItemKind.Separator,
            },
            {
                label: "Flash Firmware...",
                transport: "flash",
                detail: "Flash the DeviceScript runtime on new devices.",
            },
        ]
        const res = await vscode.window.showQuickPick(items, {
            title: "Choose the communication channel",
        })
        if (res === undefined || !res.transport) return

        if (res.transport === "flash") await this.flashFirmware()
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

    async startSimulator() {
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
