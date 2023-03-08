import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "../state"
import { GatewayExtensionState } from "./GatewayExtensionState"
import { registerGatewayStatusBar } from "./GatewayStatusBar"
import { registerCloudTreeDataProvider } from "./GatewayTreeDataProvider"

export function activateGateway(
    context: vscode.ExtensionContext,
    extensionState: DeviceScriptExtensionState
) {
    const cloudState = new GatewayExtensionState(context, extensionState)
    registerCloudTreeDataProvider(cloudState)
    registerGatewayStatusBar(cloudState)
}
