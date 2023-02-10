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
import type {
    SideConnectReq,
    SideOutputEvent,
} from "../../cli/src/sideprotocol"
import { initBuild } from "./build"
import { CloudExtensionState } from "./CloudExtensionState"
import { registerCloudStatusBar } from "./CloudStatusBar"
import { registerCloudTreeDataProvider } from "./CloudTreeDataProvider"
import { CONNECTION_RESOURCE_GROUP } from "./constants"
import { activateDebugger } from "./debugger"
import {
    sideRequest,
    startJacdacBus,
    stopJacdacBus,
    subSideEvent,
} from "./jacdac"
import { JDomDeviceTreeItem, activateTreeViews } from "./JDomTreeDataProvider"
import { activateMainStatusBar } from "./mainstatusbar"
import { DeviceScriptExtensionState } from "./state"

export function activateDeviceScript(context: vscode.ExtensionContext) {
    const { subscriptions, extensionMode, extension } = context
    const { extensionKind } = extension
    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    const jacdacConfig = vscode.workspace.getConfiguration(
        "devicescript.jacdac"
    )

    // setup bus
    const bus = startJacdacBus()
    context.subscriptions.push({
        dispose: stopJacdacBus,
    })
    const extensionState = new DeviceScriptExtensionState(context, bus)

    // build
    initBuild()
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.terminal.show",
            () => extensionState.devtools.show()
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
            "extension.devicescript.connect",
            async () => {
                const isWorkspace =
                    extensionKind === vscode.ExtensionKind.Workspace
                if (isWorkspace) {
                    extensionState.telemetry.showErrorMessage(
                        "connection.remote",
                        "DeviceScript: Connection to a hardware device (serial, usb, ...) is not supported in remote workspaces."
                    )
                    return
                }

                await extensionState.devtools.start()
                if (!extensionState.devtools.connected) return

                const { transports } = extensionState.transport
                const serial = transports.find(t => t.type === "serial")
                const usb = transports.find(t => t.type === "usb")
                const items: (vscode.QuickPickItem & { transport: string })[] =
                    [
                        {
                            transport: "serial",
                            label: "Serial",
                            description: serial
                                ? `${serial.description}(${serial.connectionState})`
                                : "",
                        },
                        {
                            transport: "usb",
                            label: "USB",
                            description: usb
                                ? `${usb.description}(${usb.connectionState})`
                                : "",
                        },
                    ]
                const res = await vscode.window.showQuickPick(items, {
                    title: "Choose the communication channel",
                })
                if (res === undefined) return

                await sideRequest<SideConnectReq>({
                    req: "connect",
                    data: {
                        transport: res.transport,
                        background: false,
                        resourceGroupId: CONNECTION_RESOURCE_GROUP,
                    },
                })
            }
        )
    )

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.variables.simulator",
            () => extensionState.simulatorScriptManagerId
        )
    )

    activateDebugger(extensionState)

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

    const cloudState = new CloudExtensionState(context, extensionState)
    registerCloudTreeDataProvider(cloudState)
    registerCloudStatusBar(cloudState)

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

    //cloud
    vscode.commands.registerCommand(
        "extension.devicescript.cloud.configure",
        async () => cloudState.configure()
    )

    configure()

    // launch devtools in background
    if (devToolsConfig.get("autoStart")) extensionState.devtools.start()
}

/*
class InlineDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
	createDebugAdapterDescriptor(_session: vscode.DebugSession): ProviderResult<vscode.DebugAdapterDescriptor> {
		return new vscode.DebugAdapterInlineImplementation(new LoggingDebugSession());
	}
}
*/
