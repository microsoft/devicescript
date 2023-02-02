/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from "vscode"
import { activateDeviceScript } from "./activateDeviceScript"

export function activate(context: vscode.ExtensionContext) {
    try {
        require("websocket-polyfill")
        global.Blob = require("buffer").Blob
    } catch (err) {
        console.error(err)
    }

    return activateDeviceScript(context)
}

export function deactivate() {
    // nothing to do
}
