import { CHANGE, ConnectionState, JDService } from "jacdac-ts"
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
    statusBarItem.command = "extension.devicescript.configure"
    const updateStatusBar = () => {
        const service = extensionState.deviceScriptManager
        const mgr = service?.device
        const { transport } = extensionState
        const {
            connectionState,
            runtimeVersion,
            nodeVersion,
            devsVersion,
            projectFolder,
            currentFilename,
            currentDeviceScriptManager,
        } = extensionState.devtools
        const deviceScriptManager = bus.node(
            currentDeviceScriptManager
        ) as JDService
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
        : `Click to pick a DeviceScript project`
}

---

${transport.transports.map(
    ({ type, connectionState, description }) => `
${type} - ${connectionState} ${description || ""}
`
)}

---

${runtimeVersion?.slice(1) || "?"} - firmware runtime version<br/>
${devsVersion?.slice(1) || "?"} - compiler tools version<br/>
${nodeVersion?.slice(1) || "?"} - node.js version<br/>

---

${
    projectFolder
        ? `[${Utils.basename(projectFolder)}](${Utils.joinPath(
              projectFolder,
              "devsconfig.json"
          )})`
        : ""
} - project<br/>
${
    projectFolder && currentFilename
        ? `[${currentFilename}](${Utils.joinPath(
              projectFolder,
              currentFilename
          )})`
        : ""
} - entry point file<br/>
${deviceScriptManager?.qualifiedName || "..."} - deploy to device</br>
`)
        statusBarItem.text = [
            connectionState === ConnectionState.Connected
                ? "$(devicescript-logo)"
                : connectionState === ConnectionState.Disconnected
                ? "$(plug)"
                : "$(loading~spin)",
            projectFolder ? Utils.basename(projectFolder) : "DeviceScript",
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
