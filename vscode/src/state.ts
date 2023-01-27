import {
    CHANGE,
    ControlReg,
    DeviceScriptManagerReg,
    DEVICE_CHANGE,
    JDBus,
    JDEventSource,
    JDService,
    randomDeviceId,
    shortDeviceId,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { JDeviceTreeItem } from "./JDomTreeDataProvider"

const STATE_WATCHES_KEY = "views.watch.ids"
const STATE_CURRENT_DEVICE = "devices.current"
const STATE_VM_DEVICE = "devices.virtual"

type DeviceQuickItem = vscode.QuickPickItem & { deviceId: string }

export class ExtensionState extends JDEventSource {
    // TODO CHANGE
    version = ""
    bytecodeVersion = ""

    constructor(readonly bus: JDBus, readonly state: vscode.Memento) {
        super()
        if (!this.virtualDeviceScriptManagerId) {
            this.state.update(STATE_VM_DEVICE, randomDeviceId())
        }
        this.bus.on(DEVICE_CHANGE, () => {
            this.emit(CHANGE)
        })
    }

    watchKeys(): string[] {
        return this.state.get(STATE_WATCHES_KEY) || []
    }

    async updateWatchKeys(keys: string[]) {
        await this.state.update(
            STATE_WATCHES_KEY,
            Array.from(new Set(keys || []).entries())
        )
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
        this.emit(CHANGE)
    }

    async resolveDeviceScriptManager(): Promise<JDService> {
        return this.deviceScriptManager || this.pickDeviceScriptManager()
    }

    async pickDeviceScriptManager(skipUpdate?: boolean): Promise<JDService> {
        const { virtualDeviceScriptManagerId } = this
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string
        const services = this.bus.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })
        const detail = async (srv: JDService) => {
            const runtimeVersion = srv.register(
                DeviceScriptManagerReg.RuntimeVersion
            )
            await runtimeVersion.refresh(true)
            const v = runtimeVersion.unpackedValue || []
            const [patch, minor, major] = v as [number, number, number]
            const description = srv.device
                .service(0)
                .register(ControlReg.DeviceDescription)
            await description.refresh(true)

            return `${description.stringValue || ""} ${
                patch !== undefined ? `(devs v${major}.${minor}.${patch})` : ""
            }`
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
        if (!this.bus.device(virtualDeviceScriptManagerId, true))
            items.push(<DeviceQuickItem>{
                label: shortDeviceId(this.virtualDeviceScriptManagerId),
                description: `Virtual Device`,
                detail: `A virtual DeviceScript interpreter running in a separate process (devs ${this.bytecodeVersion})`,
                deviceId: virtualDeviceScriptManagerId,
            })
        const res = await vscode.window.showQuickPick(items, {
            title: `Pick a DeviceScript device`,
            matchOnDescription: true,
            matchOnDetail: true,
            canPickMany: false,
        })
        const did = res?.deviceId

        if (did) {
            // todo: start VM
            console.log(`todo: start vm`)
        }
        const service = services.find(srv => srv.device.deviceId === did)
        if (service && !skipUpdate) {
            await this.updateCurrentDeviceScriptManagerId(
                service.device.deviceId
            )
            return service
        }
        return undefined
    }
}
