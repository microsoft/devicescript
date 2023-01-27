import {
    CHANGE,
    DEVICE_CHANGE,
    JDBus,
    JDDevice,
    JDEventSource,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { JDeviceTreeItem } from "./JDomTreeDataProvider"

const STATE_WATCHES_KEY = "views.watch.ids"
const STATE_CURRENT_DEVICE = "devices.current"

export class ExtensionState extends JDEventSource {
    constructor(readonly bus: JDBus, readonly state: vscode.Memento) {
        super()
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

    async pickDeviceScriptManager(): Promise<JDDevice> {
        const cid = this.state.get(STATE_CURRENT_DEVICE) as string
        const devices = this.bus.devices({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })
        if (devices.length > 0) {
            const items = devices.map(
                dev =>
                    <vscode.QuickPickItem & { deviceId: string }>{
                        label: `$(${JDeviceTreeItem.ICON}) ${dev.friendlyName}`,
                        description: dev.deviceId,
                        detail: dev.describe(),
                        deviceId: dev.deviceId,
                        picked: dev.deviceId === cid,
                    }
            )
            const res = await vscode.window.showQuickPick(items, {
                title: "Pick a DeviceScript device",
                matchOnDescription: true,
                matchOnDetail: true,
                canPickMany: false,
            })
            const did = res?.deviceId
            const device = devices.find(d => d.deviceId === did)
            if (device) {
                await this.updateCurrentDeviceScriptManagerId(device.deviceId)
                return device
            }
        }
        return undefined
    }
}
