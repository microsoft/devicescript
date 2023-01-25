/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from "vscode"
import { activateDeviceScript } from "./activateDeviceScript"

export function activate(context: vscode.ExtensionContext) {
    return activateDeviceScript(context, new DeviceScriptAdapterServerDescriptorFactory())
}

export function deactivate() {
    // nothing to do
}

class DeviceScriptAdapterServerDescriptorFactory
    implements vscode.DebugAdapterDescriptorFactory
{
    createDebugAdapterDescriptor(
        session: vscode.DebugSession,
        executable: vscode.DebugAdapterExecutable | undefined
    ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
        // make VS Code connect to debug server
        return new vscode.DebugAdapterServer(8083, "localhost")
    }

    dispose() {}
}
