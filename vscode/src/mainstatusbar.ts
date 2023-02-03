import { CHANGE } from "jacdac-ts"
import * as vscode from "vscode"
import { toMarkdownString } from "./catalog"

import { DeviceScriptExtensionState } from "./state"
export function registerMainStatusBar(
    extensionState: DeviceScriptExtensionState
) {
    const { bus, context } = extensionState

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        120
    )
    statusBarItem.command = "extension.devicescript.pickDeviceScriptManager"
    const updateStatusBar = () => {
        const service = extensionState.deviceScriptManager
        const mgr = service?.device
        const { runtimeVersion, version, transport } = extensionState
        const devices = bus.devices({
            ignoreInfrastructure: true,
            announced: true,
        })
        statusBarItem.tooltip = !runtimeVersion
            ? `Starting DeviceScript Development Server...`
            : toMarkdownString(`
${
    mgr
        ? `Deploy and Debug on device ${mgr.shortId}`
        : `Click to pick a DeviceScript device`
}

---

${transport.transports.map(
    ({ type, connectionState, description }) => `
${type} - ${connectionState} ${description || ""}
`
)}

---

${runtimeVersion.slice(1)} - Runtime version   
${version.slice(1)} - Tools version     
        `)
        statusBarItem.text = [
            !runtimeVersion ? "$(loading~spin)" : "$(devicescript-logo)",
            "DeviceScript",
            mgr ? `$(play) ${mgr?.shortId}` : "",
            devices.length > 0 ? `$(circuit-board) ${devices.length}` : "",
        ]
            .filter(p => !!p)
            .join(" ")
    }
    extensionState.on(CHANGE, updateStatusBar)
    updateStatusBar()
    context.subscriptions.push(statusBarItem)
    statusBarItem.show()
}
