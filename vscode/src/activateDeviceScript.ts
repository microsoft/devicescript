/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
    Flags,
    FRAME_PROCESS,
    JDFrameBuffer,
    serializeToTrace,
} from "jacdac-ts"
import * as vscode from "vscode"
import type { SideOutputEvent } from "../../cli/src/sideprotocol"
import { activateDebugger } from "./debugger"
import { activateGateway } from "./gateway/activateGateway"
import { startJacdacBus, stopJacdacBus, subSideEvent } from "./jacdac"
import { JDomDeviceTreeItem, activateTreeViews } from "./JDomTreeDataProvider"
import { activateMainStatusBar } from "./mainstatusbar"
import { DeviceScriptExtensionState } from "./state"

export function activateDeviceScript(context: vscode.ExtensionContext) {
    const { subscriptions, extensionMode } = context
    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    const jacdacConfig = vscode.workspace.getConfiguration(
        "devicescript.jacdac"
    )
    registerOutputChannel(extensionMode)

    // setup bus
    const bus = startJacdacBus()
    context.subscriptions.push({
        dispose: stopJacdacBus,
    })
    const extensionState = new DeviceScriptExtensionState(context, bus)

    // build
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.configure",
            async () => await extensionState.configure()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.identify",
            async (item: JDomDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (await extensionState.pickDeviceScriptManager(true))?.device
                await device?.identify()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.reset",
            async (item: JDomDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (await extensionState.pickDeviceScriptManager(true))?.device
                await device.reset() // async
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.flash",
            (device?: JDomDeviceTreeItem) =>
                device ? device.flash() : extensionState.flashFirmware()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.connect",
            async () => extensionState.connect()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.sims.add",
            async () => extensionState.addSim()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.services.add",
            async () => extensionState.addService()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.boards.add",
            async () => extensionState.addBoard()
        )
    )

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.variables.simulator",
            () => extensionState.simulatorScriptManagerId
        )
    )

    activateDebugger(extensionState)
    activateGateway(context, extensionState)

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.simulator.stop",
            async () => {
                await extensionState.stopSimulator()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.simulator.start",
            async () => {
                await extensionState.startSimulator()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.pickDeviceScriptManager",
            () => extensionState.pickDeviceScriptManager()
        )
    )

    activateTreeViews(extensionState)
    activateMainStatusBar(extensionState)

    // packet trace
    let jacdacPacketsOutputChannel: vscode.OutputChannel = undefined
    const logFrame = (frame: JDFrameBuffer) => {
        const output = jacdacPacketsOutputChannel
        if (!output) return
        const msg = serializeToTrace(frame, 0, bus, {})
        if (msg) output.appendLine(msg)
    }
    // apply settings
    const configure = () => {
        Flags.diagnostics = !!jacdacConfig.get("diagnostics")
        const tracePackets = !!jacdacConfig.get("tracePackets")
        if (tracePackets) {
            if (!jacdacPacketsOutputChannel)
                jacdacPacketsOutputChannel =
                    vscode.window.createOutputChannel("Jacdac Packets")
            bus.on(FRAME_PROCESS, logFrame)
        } else if (!tracePackets && jacdacPacketsOutputChannel) {
            bus.off(FRAME_PROCESS, logFrame)
        }
    }

    // hook up to configurations
    vscode.workspace.onDidChangeConfiguration(
        configure,
        undefined,
        context.subscriptions
    )
    configure()

    // launch devtools in background
    if (devToolsConfig.get("autoStart")) {
        extensionState.devtools.start()
    }
}

function registerOutputChannel(extensionMode: vscode.ExtensionMode) {
    const output = vscode.window.createOutputChannel("DeviceScript", {
        log: true,
    })
    subSideEvent<SideOutputEvent>("output", msg => {
        const tag = msg.data.from
        let fn = output.info
        if (tag.endsWith("err")) fn = output.error
        for (const l of msg.data.lines) fn(tag + ":", l)
    })
    const redirectConsoleOutput =
        extensionMode == vscode.ExtensionMode.Production
    if (redirectConsoleOutput) {
        // note that this is local to this extension - see inject.js
        console.debug = output.debug
        console.log = output.info
        console.warn = output.warn
        console.error = output.error
        console.info = console.log
    }
}
/*
class InlineDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
	createDebugAdapterDescriptor(_session: vscode.DebugSession): ProviderResult<vscode.DebugAdapterDescriptor> {
		return new vscode.DebugAdapterInlineImplementation(new LoggingDebugSession());
	}
}
*/
