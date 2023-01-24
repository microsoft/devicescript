/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/*
 * extension.ts (and activateMockDebug.ts) forms the "plugin" that plugs into VS Code and contains the code that
 * connects VS Code with the debug adapter.
 *
 * extension.ts contains code for launching the debug adapter.
 *
 * Since the code in extension.ts uses node.js APIs it cannot run in the browser.
 */

"use strict"

import * as vscode from "vscode"
import { activateDeviceScript } from "./activateDeviceScript"

export function activate(context: vscode.ExtensionContext) {
    activateDeviceScript(context, new MockDebugAdapterServerDescriptorFactory())
}

export function deactivate() {
    // nothing to do
}

class MockDebugAdapterServerDescriptorFactory
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
