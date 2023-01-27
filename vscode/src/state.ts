import {
    CHANGE,
    delay,
    DEVICE_CHANGE,
    JDBus,
    JDDevice,
    JDEventSource,
    randomDeviceId,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { SideStartVmReq } from "../../cli/src/sideprotocol"
import { sideRequest } from "./jacdac"
import { JDeviceTreeItem } from "./JDomTreeDataProvider"

const STATE_WATCHES_KEY = "views.watch.ids"
const STATE_CURRENT_DEVICE = "devices.current"
const STATE_VM_DEVICE = "devices.virtual"

type DeviceQuickItem = vscode.QuickPickItem & { deviceId: string }

export class ExtensionState extends JDEventSource {
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
        return current
    }

    private async updateCurrentDeviceScriptManagerId(id: string) {
        await this.state.update(STATE_CURRENT_DEVICE, id)
        this.emit(CHANGE)
    }

    async resolveDeviceScriptManager(): Promise<JDDevice> {
        return this.deviceScriptManager || this.pickDeviceScriptManager()
    }

    async pickDeviceScriptManager(skipUpdate?: boolean): Promise<JDDevice> {
        const { virtualDeviceScriptManagerId } = this
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string
        const devices = this.bus.devices({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })
        const items = devices.map(
            dev =>
                <DeviceQuickItem>{
                    label: `$(${JDeviceTreeItem.ICON}) ${dev.friendlyName}`,
                    description: dev.deviceId,
                    detail: dev.describe(),
                    deviceId: dev.deviceId,
                    picked: dev.deviceId === cid,
                }
        )
        if (!this.bus.device(virtualDeviceScriptManagerId, true))
            items.push(<DeviceQuickItem>{
                label: `Virtual Device`,
                description: `A device simulator running in a separate process.`,
                deviceId: virtualDeviceScriptManagerId,
            })
        const res = await vscode.window.showQuickPick(items, {
            title: "Pick a DeviceScript device",
            matchOnDescription: true,
            matchOnDetail: true,
            canPickMany: false,
        })
        const did = res?.deviceId

        if (did) {
            const config = vscode.workspace.getConfiguration("devicescript")
            await sideRequest<SideStartVmReq>({
                req: "startVM",
                data: {
                    nativePath: config.get("nativeVmPath") || undefined,
                },
            })
            await delay(1000)
        }
        const device = devices.find(d => d.deviceId === did)
        if (device && !skipUpdate) {
            await this.updateCurrentDeviceScriptManagerId(device.deviceId)
            return device
        }
        return undefined
    }
}
