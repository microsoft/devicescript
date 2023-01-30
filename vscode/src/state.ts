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
import { readRuntimeVersion } from "./deploy"
import { sideRequest } from "./jacdac"
import { JDeviceTreeItem } from "./JDomTreeDataProvider"

const STATE_WATCHES_KEY = "views.watches.3"
const STATE_CURRENT_DEVICE = "devices.current"
const STATE_VM_DEVICE = "devices.virtual"

type DeviceQuickItem = vscode.QuickPickItem & { deviceId: string }

export interface NodeWatch {
    id: string
    label: string
    icon: string
}

export class ExtensionState extends JDEventSource {
    version = ""
    runtimeVersion: string

    constructor(readonly bus: JDBus, readonly state: vscode.Memento) {
        super()
        if (!this.virtualDeviceScriptManagerId) {
            this.state.update(STATE_VM_DEVICE, randomDeviceId())
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

    get virtualDeviceScriptManagerId() {
        const id = this.state.get(STATE_VM_DEVICE) as string
        return id
    }

    get deviceScriptManager() {
        const id = this.state.get(STATE_CURRENT_DEVICE) as string
        const current = this.bus.device(id, true)
        return current?.services({ serviceClass: SRV_DEVICE_SCRIPT_MANAGER })[0]
    }

    private async updateCurrentDeviceScriptManagerId(id: string) {
        await this.state.update(STATE_CURRENT_DEVICE, id)
        if (id !== this.virtualDeviceScriptManagerId) await this.stopVM()
        this.emit(CHANGE)
    }

    async resolveDeviceScriptManager(): Promise<JDService> {
        return this.deviceScriptManager || this.pickDeviceScriptManager()
    }

    async startVM() {
        const did = this.virtualDeviceScriptManagerId
        if (this.bus.device(did, true)) return // already running
        const config = vscode.workspace.getConfiguration(
            "devicescript.virtualDevice"
        )
        const nativePath = (config.get("nativePath") as string) || undefined
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

    async stopVM() {
        await sideRequest<SideStopVmReq>({
            req: "stopVM",
            data: {},
        })
    }

    async pickDeviceScriptManager(skipUpdate?: boolean): Promise<JDService> {
        const { virtualDeviceScriptManagerId } = this
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string
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
                        label: `$(${JDeviceTreeItem.ICON}) ${srv.device.friendlyName}`,
                        description: srv.device.deviceId,
                        detail: await detail(srv),
                        deviceId: srv.device.deviceId,
                        picked: srv.device.deviceId === cid,
                    }
            )
        )
        let startVM = false
        if (!this.bus.device(virtualDeviceScriptManagerId, true)) {
            startVM = true
            items.push(<DeviceQuickItem>{
                label: shortDeviceId(this.virtualDeviceScriptManagerId),
                description: `Virtual Device`,
                detail: `A virtual DeviceScript interpreter running in a separate process (${this.runtimeVersion})`,
                deviceId: virtualDeviceScriptManagerId,
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

        if (startVM && did == virtualDeviceScriptManagerId) {
            await this.startVM()
        } else {
            startVM = false
        }

        const service = this.bus.device(did, true)?.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })?.[0]

        if (service) {
            // disable autostart (which is really auto-restart when the program stops)
            await service
                .register(DeviceScriptManagerReg.Autostart)
                .sendSetAsync(new Uint8Array([0]))
            // for VM we started, disable logging - logging will go through DMESG
            if (startVM)
                await service
                    .register(DeviceScriptManagerReg.Logging)
                    .sendSetAsync(new Uint8Array([0]))
        }

        if (service && !skipUpdate) {
            await this.updateCurrentDeviceScriptManagerId(
                service.device.deviceId
            )
            return service
        }
        return undefined
    }
}
