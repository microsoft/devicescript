import { CHANGE, ConnectionState } from "jacdac-ts"
import * as vscode from "vscode"
import { toMarkdownString } from "./catalog"
import { Utils } from "vscode-uri"

import { DeviceScriptExtensionState } from "./state"
export function activateMainStatusBar(
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
        const { transport } = extensionState
        const {
            connectionState,
            runtimeVersion,
            nodeVersion,
            version,
            projectFolder,
        } = extensionState.devtools
        const connected = connectionState === ConnectionState.Connected
        const devices = bus.devices({
            ignoreInfrastructure: true,
            announced: true,
        })
        statusBarItem.tooltip = !connected
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

${runtimeVersion?.slice(1) || "?"} - runtime version<br/>
${version?.slice(1) || "?"} - tools version<br/>
${nodeVersion?.slice(1) || "?"} - node version<br/>

---

project: ${
                  projectFolder
                      ? `[${Utils.basename(projectFolder)}](${Utils.joinPath(
                            projectFolder,
                            "devsconfig.json"
                        )})`
                      : ""
              }

`)
        statusBarItem.text = [
            connectionState === ConnectionState.Connected
                ? "$(devicescript-logo)"
                : connectionState === ConnectionState.Disconnected
                ? "$(plug)"
                : "$(loading~spin)",
            "DeviceScript",
            ...transport.transports.map(
                tr =>
                    `$(${
                        tr.connectionState === ConnectionState.Connected
                            ? "plug"
                            : "debug-disconnect"
                    }) ${tr.type}`
            ),
            mgr ? `$(play) ${mgr?.shortId}` : "",
            devices.length > 0 ? `$(circuit-board) ${devices.length}` : "",
        ]
            .filter(p => !!p)
            .join(" ")
    }
    extensionState.on(CHANGE, updateStatusBar)
    extensionState.devtools.on(CHANGE, updateStatusBar)
    updateStatusBar()
    context.subscriptions.push(statusBarItem)
    statusBarItem.show()
}
