import * as vscode from "vscode"
import { JDBus } from "jacdac-ts"
import { CloudExtensionState } from "./CloudExtensionState"
import { registerCloudStatusBar } from "./CloudStatusBar"
import { registerCloudTreeDataProvider } from "./CloudTreeDataProvider"

export function activateCloud(context: vscode.ExtensionContext, bus: JDBus) {
    const cloudState = new CloudExtensionState(context, bus)
    registerCloudTreeDataProvider(cloudState)
    registerCloudStatusBar(cloudState)

    //cloud
    vscode.commands.registerCommand(
        "extension.devicescript.cloud.configure",
        async () => cloudState.configure()
    )
}
