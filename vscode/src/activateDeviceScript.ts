/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
    CHANGE,
    CONNECTION_STATE,
    DEVICE_CHANGE,
    Flags,
    FRAME_PROCESS,
    JDFrameBuffer,
    JDRegister,
    loadServiceSpecifications,
    REGISTER_NODE_NAME,
    serializeToTrace,
} from "jacdac-ts"
import * as vscode from "vscode"
import {
    WorkspaceFolder,
    DebugConfiguration,
    ProviderResult,
    CancellationToken,
} from "vscode"
import type {
    SideConnectReq,
    SideOutputEvent,
    SideSpecsReq,
    SideSpecsResp,
} from "../../cli/src/sideprotocol"
import { logo } from "./assets"
import { build, initBuild } from "./build"
import {
    spawnDevTools,
    showDevToolsTerminal,
    initDevTools,
} from "./devtoolsserver"
import {
    sideRequest,
    startJacdacBus,
    stopJacdacBus,
    subSideEvent,
} from "./jacdac"
import {
    JDeviceTreeItem,
    JDomDeviceTreeDataProvider,
    JDomTreeItem,
    JDomWatchTreeDataProvider,
} from "./JDomTreeDataProvider"
import { ExtensionState } from "./state"

export function activateDeviceScript(
    context: vscode.ExtensionContext,
    factory?: vscode.DebugAdapterDescriptorFactory
) {
    const { subscriptions, workspaceState, extensionMode } = context
    const debugConfig = vscode.workspace.getConfiguration(
        "devicescript.debugger"
    )
    const outputConfig = vscode.workspace.getConfiguration(
        "devicescript.output"
    )
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
    const extensionState = new ExtensionState(bus, workspaceState)

    let unsub = bus.subscribe(CHANGE, async () => {
        if (bus.connected && unsub) {
            unsub()
            unsub = null
            await initDevtoolsConnection(extensionState)
        }
    })

    // devtool web panel
    let developerToolsPanel: vscode.WebviewPanel
    const updateDeveloperToolsPanelUrl = () => {
        if (!developerToolsPanel) return

        const { kind: colorThemeKind } = vscode.window.activeColorTheme
        const darkMode =
            colorThemeKind === vscode.ColorThemeKind.Dark ||
            colorThemeKind === vscode.ColorThemeKind.HighContrast
                ? "dark"
                : "light"
        developerToolsPanel.webview.html = `
        <html>
        <head>
        <style>
        body {
            margin: 0;
            padding: 0; 
            background-color: transparent;  
        }
        iframe {
            position: absolute;
            left: 0; right: 0;
            width: 100%; height: 100%;
            border: none;
        }
        </style>
        </head>
        <body>
        <iframe src="http://localhost:8081/?${darkMode}=1" />
        </body>
        </html>                
                        `
    }

    // build
    initBuild()
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.runEditorContents",
            async (resource: vscode.Uri) => {
                let targetResource = resource
                if (!targetResource && vscode.window.activeTextEditor) {
                    targetResource = vscode.window.activeTextEditor.document.uri
                }
                if (targetResource) {
                    const service =
                        await extensionState.resolveDeviceScriptManager()
                    if (!service) {
                        vscode.window.showWarningMessage(
                            "No DeviceScript device found."
                        )
                        return
                    }

                    await vscode.window.activeTextEditor?.document?.save()
                    await build(targetResource.fsPath, service.device.deviceId)
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.debugEditorContents",
            async (resource: vscode.Uri) => {
                let targetResource = resource
                if (!targetResource && vscode.window.activeTextEditor) {
                    targetResource = vscode.window.activeTextEditor.document.uri
                }
                if (targetResource) {
                    const service =
                        await extensionState.resolveDeviceScriptManager()
                    if (!service) {
                        vscode.window.showWarningMessage(
                            "No DeviceScript device found."
                        )
                        return
                    }
                    if (
                        await build(
                            targetResource.fsPath,
                            service.device.deviceId
                        )
                    ) {
                        vscode.debug.startDebugging(undefined, {
                            type: "devicescript",
                            name: "Debug File",
                            request: "launch",
                            program: targetResource.fsPath,
                            stopOnEntry: true,
                        })
                        if (debugConfig.get("showOutputOnStart"))
                            vscode.commands.executeCommand(
                                "extension.devicescript.showOutput"
                            )
                        if (debugConfig.get("showDevToolsOnStart"))
                            vscode.commands.executeCommand(
                                "extension.devicescript.openSimulators"
                            )
                    }
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.toggleFormatting",
            variable => {
                const ds = vscode.debug.activeDebugSession
                if (ds) {
                    ds.customRequest("toggleFormatting")
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.showServerTerminal",
            () => {
                console.log("Showing terminal...")
                showDevToolsTerminal()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.identifyDevice",
            async (item: JDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (await extensionState.pickDeviceScriptManager(true))?.device
                await device?.identify()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.resetDevice",
            async (item: JDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (await extensionState.pickDeviceScriptManager(true))?.device
                await device.reset() // async
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.connect",
            async () => {
                await spawnDevTools(context)
                await bus.connect()
                await sideRequest<SideConnectReq>({
                    req: "connect",
                    data: {},
                })
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.openSimulators",
            async () => {
                if (developerToolsPanel) {
                    developerToolsPanel.reveal(vscode.ViewColumn.Nine)
                } else {
                    console.log("Opening Developer Tools...")
                    await spawnDevTools(context)
                    // http://localhost:8081/
                    developerToolsPanel = vscode.window.createWebviewPanel(
                        "extension.devicescript.simulators",
                        "DeviceScript Simulators",
                        vscode.ViewColumn.Nine,
                        { enableScripts: true, retainContextWhenHidden: true }
                    )
                    developerToolsPanel.iconPath = logo(context)
                    developerToolsPanel.onDidDispose(
                        () => {
                            developerToolsPanel = undefined
                        },
                        undefined,
                        context.subscriptions
                    )
                    updateDeveloperToolsPanelUrl()
                }
            }
        )
    )

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.getProgramName",
            config => {
                return vscode.window.showInputBox({
                    placeHolder:
                        "Please enter the name of a typescript file in the workspace folder",
                    value: "main.ts",
                })
            }
        )
    )

    // track color theme
    vscode.window.onDidChangeActiveColorTheme(updateDeveloperToolsPanelUrl)

    // register a configuration provider for 'devicescript' debug type
    const provider = new DeviceScriptConfigurationProvider()
    subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider(
            "devicescript",
            provider
        )
    )

    // register a dynamic configuration provider for 'devicescript' debug type
    subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider(
            "devicescript",
            {
                provideDebugConfigurations(
                    folder: WorkspaceFolder | undefined
                ): ProviderResult<DebugConfiguration[]> {
                    return [
                        {
                            name: "Dynamic Launch",
                            request: "launch",
                            type: "devicescript",
                            program: "${file}",
                        },
                        {
                            name: "Another Dynamic Launch",
                            request: "launch",
                            type: "devicescript",
                            program: "${file}",
                        },
                        {
                            name: "devicescript Launch",
                            request: "launch",
                            type: "devicescript",
                            program: "${file}",
                        },
                    ]
                },
            },
            vscode.DebugConfigurationProviderTriggerKind.Dynamic
        )
    )

    subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory(
            "devicescript",
            factory
        )
    )
    if ("dispose" in factory) {
        subscriptions.push(factory as any)
    }

    const output = vscode.window.createOutputChannel("DeviceScript", {
        log: true,
    })
    subSideEvent<SideOutputEvent>("output", msg => {
        const tag = msg.data.from
        let fn = output.info
        if (tag.endsWith("err")) fn = output.error
        for (const l of msg.data.lines) fn(tag + ":", l)
    })
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.showOutput",
            () => output.show()
        )
    )
    const redirectConsoleOutput =
        !!outputConfig.get("redirectConsole") ||
        extensionMode == vscode.ExtensionMode.Production
    if (redirectConsoleOutput) {
        // note that this is local to this extension - see inject.js
        console.debug = output.debug
        console.log = output.info
        console.warn = output.warn
        console.error = output.error
        console.info = console.log
    }

    // launch devtools in background
    initDevTools(context.subscriptions)
    if (devToolsConfig.get("autoStart")) {
        spawnDevTools(context)
        if (devToolsConfig.get("showOnStart")) showDevToolsTerminal()
    }

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.selectNode",
            (item: JDomTreeItem) => {
                const { node } = item
                const { nodeKind } = node
                console.log(`Select ${node}`)
                switch (nodeKind) {
                    case REGISTER_NODE_NAME: {
                        ;(node as JDRegister).scheduleRefresh()
                        break
                    }
                }
            }
        )
    )
    const selectNodeCommand: vscode.Command = {
        title: "select node",
        command: "extension.devicescript.selectNode",
    }
    const jdomTreeDataProvider = new JDomDeviceTreeDataProvider(
        bus,
        selectNodeCommand
    )
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.jacdac-jdom-explorer",
        jdomTreeDataProvider
    )

    const jdomWatchTreeDataProvider = new JDomWatchTreeDataProvider(
        bus,
        selectNodeCommand,
        extensionState
    )
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.jacdac-jdom-watch",
        jdomWatchTreeDataProvider
    )

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.stopVirtualDevice",
            async () => {
                await spawnDevTools(context)
                // TODO wait till ready
                await extensionState.stopVM()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.startVirtualDevice",
            async () => {
                await spawnDevTools(context)
                await extensionState.startVM()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.pickDeviceScriptManager",
            () => extensionState.pickDeviceScriptManager()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watchNode",
            (item: JDomTreeItem) => {
                console.log(`Watch ${item.node}`)
                const id = item.node.id
                const watches = extensionState.watchKeys()
                if (!watches.includes(id)) {
                    extensionState
                        .updateWatchKeys([...watches, id])
                        .then(() => {
                            jdomWatchTreeDataProvider.refresh()
                        })
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.unwatchNode",
            (item: JDomTreeItem) => {
                console.log(`Unwatch ${item.node}`)
                const id = item.node.id
                const watches = extensionState.watchKeys()
                if (watches.includes(id)) {
                    extensionState
                        .updateWatchKeys(watches.filter(i => i !== id))
                        .then(() => {
                            jdomWatchTreeDataProvider.refresh()
                        })
                }
            }
        )
    )

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    )
    statusBarItem.command = "extension.devicescript.pickDeviceScriptManager"
    const updateStatusBar = () => {
        const service = extensionState.deviceScriptManager
        const mgr = service?.device
        const { runtimeVersion } = extensionState
        const devices = bus.devices({
            ignoreInfrastructure: true,
            announced: true,
        })
        statusBarItem.tooltip = mgr
            ? `Deploy and Debug on device ${mgr.shortId}`
            : `Click to pick a DeviceScript device`
        statusBarItem.text = `DeviceScript ${runtimeVersion} $(play) ${
            mgr?.shortId || "???"
        } $(${JDeviceTreeItem.ICON}) ${devices.length}`
    }
    extensionState.on(CHANGE, updateStatusBar)
    bus.on([DEVICE_CHANGE, CONNECTION_STATE], updateStatusBar)
    updateStatusBar()
    context.subscriptions.push(statusBarItem)
    statusBarItem.show()

    vscode.window.onDidChangeActiveColorTheme(colorTheme => {
        // TODO
    }, context.subscriptions)

    // packet trace
    let jacdacPacketsOutputChannel: vscode.OutputChannel = undefined
    const logFrame = (frame: JDFrameBuffer) => {
        const output = jacdacPacketsOutputChannel
        if (!output) return
        const msg = serializeToTrace(frame, 0, bus)
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
        const showInfrastructure = !!jacdacConfig.get("showInfrastructure")
        jdomTreeDataProvider.showInfrastructure = showInfrastructure
    }

    // hook up to configurations
    vscode.workspace.onDidChangeConfiguration(
        configure,
        undefined,
        context.subscriptions
    )
    configure()
}

async function initDevtoolsConnection(state: ExtensionState) {
    const resp = await sideRequest<SideSpecsReq, SideSpecsResp>({
        req: "specs",
        data: {},
    })
    const { specs, version, runtimeVersion } = resp.data
    loadServiceSpecifications(specs)
    console.log(
        `devicescript devtools version: ${version}, bytecode version: ${runtimeVersion}`
    )

    state.version = version
    state.runtimeVersion = runtimeVersion
    state.emit(CHANGE)
}

class DeviceScriptConfigurationProvider
    implements vscode.DebugConfigurationProvider
{
    /**
     * Massage a debug configuration just before a debug session is being launched,
     * e.g. add all missing attributes to the debug configuration.
     */
    resolveDebugConfiguration(
        folder: WorkspaceFolder | undefined,
        config: DebugConfiguration,
        token?: CancellationToken
    ): ProviderResult<DebugConfiguration> {
        // if launch.json is missing or empty
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor
            if (editor && editor.document.languageId === "typescript") {
                config.type = "devicescript"
                config.name = "Launch"
                config.request = "launch"
                config.program = "${file}"
                config.stopOnEntry = true
            }
        }

        if (!config.program) {
            return vscode.window
                .showInformationMessage("Cannot find a program to debug")
                .then(_ => {
                    return undefined // abort launch
                })
        }

        return config
    }
}

/*
class InlineDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
	createDebugAdapterDescriptor(_session: vscode.DebugSession): ProviderResult<vscode.DebugAdapterDescriptor> {
		return new vscode.DebugAdapterInlineImplementation(new LoggingDebugSession());
	}
}
*/
