import {
    CHANGE,
    ControlReg,
    DeviceScriptManagerReg,
    delay,
    DEVICE_CHANGE,
    JDBus,
    JDEventSource,
    JDService,
    randomDeviceId,
    shortDeviceId,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { SideStartVmReq, SideStopVmReq } from "../../cli/src/sideprotocol"
import { prepareForDeploy, readRuntimeVersion } from "./deploy"
import { spawnDevTools } from "./devtoolsserver"
import { sideRequest } from "./jacdac"
import { JDomDeviceTreeItem } from "./JDomTreeDataProvider"

const STATE_WATCHES_KEY = "views.watches.3"
const STATE_CURRENT_DEVICE = "devices.current"
const STATE_SIMULATOR_DEVICE = "devices.simulator"

type DeviceQuickItem = vscode.QuickPickItem & { deviceId: string }

export interface NodeWatch {
    id: string
    label: string
    icon: string
}

export class DeviceScriptExtensionState extends JDEventSource {
    version = ""
    runtimeVersion: string

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly bus: JDBus,
        readonly state: vscode.Memento
    ) {
        super()
        if (!this.simulatorScriptManagerId) {
            this.state.update(STATE_SIMULATOR_DEVICE, randomDeviceId())
        }
        this.bus.on(DEVICE_CHANGE, () => {
            this.emit(CHANGE)
        })
    }

    watches(): NodeWatch[] {
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

    async startSimulator() {
        const did = this.simulatorScriptManagerId
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
        await sideRequest<SideStopVmReq>({
            req: "stopVM",
            data: {},
        })
    }

    async pickDeviceScriptManager(skipUpdate?: boolean): Promise<JDService> {
        const { simulatorScriptManagerId } = this
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string

        await spawnDevTools(this.context)

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
        const items = await Promise.all(
            services.map(
                async srv =>
                    <DeviceQuickItem>{
                        label: `$(${JDomDeviceTreeItem.ICON}) ${srv.device.friendlyName}`,
                        description: srv.device.deviceId,
                        detail: await detail(srv),
                        deviceId: srv.device.deviceId,
                        picked: srv.device.deviceId === cid,
                    }
            )
        )
        let startVM = false
        if (!this.bus.device(simulatorScriptManagerId, true)) {
            startVM = true
            items.push(<DeviceQuickItem>{
                label: shortDeviceId(this.simulatorScriptManagerId),
                description: `Simulator`,
                detail: `A virtual DeviceScript interpreter running in a separate process (${this.runtimeVersion})`,
                deviceId: simulatorScriptManagerId,
            })
        }
        const res = await vscode.window.showQuickPick(items, {
            title: `Pick a DeviceScript device`,
            matchOnDescription: true,
            matchOnDetail: true,
            canPickMany: false,
        })
        const did = res?.deviceId
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
