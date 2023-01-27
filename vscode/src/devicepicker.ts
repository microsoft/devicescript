import * as vscode from "vscode"
import { JDBus, JDDevice, SRV_DEVICE_SCRIPT_MANAGER } from "jacdac-ts"
import { JDeviceTreeItem } from "./JDomTreeDataProvider"

export async function pickDeviceManager(
    bus: JDBus,
    currentDeviceId?: string
): Promise<JDDevice> {
    const devices = bus.devices({ serviceClass: SRV_DEVICE_SCRIPT_MANAGER })
    if (devices.length === 1) return devices[0]
    else if (devices.length > 0) {
        const items = devices.map(
            dev =>
                <vscode.QuickPickItem & { deviceId: string }>{
                    label: `${JDeviceTreeItem.ICON} ${dev.friendlyName}`,
                    description: dev.deviceId,
                    detail: dev.describe(),
                    deviceId: dev.deviceId,
                    picked: dev.deviceId === currentDeviceId,
                }
        )
        const res = await vscode.window.showQuickPick(items, {
            title: "Select a Device to Deploy",
            matchOnDescription: true,
            matchOnDetail: true,
            canPickMany: false,
        })
        const did = res?.deviceId
        const device = devices.find(d => d.deviceId === did)
        if (device) return device
    }
    return undefined
}
