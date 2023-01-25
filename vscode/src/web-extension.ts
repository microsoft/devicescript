/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from "vscode"
import { activateDeviceScript } from "./activateDeviceScript"

export function activate(context: vscode.ExtensionContext) {
    return activateDeviceScript(context) // activateMockDebug without 2nd argument launches the Debug Adapter "inlined"
}

export function deactivate() {
    // nothing to do
}
