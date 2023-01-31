/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
    CHANGE,
    CONNECTION_STATE,
    DEVICE_CHANGE,
    DOCS_ROOT,
    Flags,
    FRAME_PROCESS,
    identifierToUrlPath,
    JDDevice,
    JDFrameBuffer,
    JDRegister,
    loadServiceSpecifications,
    REGISTER_NODE_NAME,
    serializeToTrace,
} from "jacdac-ts"
import * as vscode from "vscode"
import { WorkspaceFolder, DebugConfiguration, ProviderResult } from "vscode"
import type {
    SideConnectReq,
    SideOutputEvent,
    SideSpecsReq,
    SideSpecsResp,
} from "../../cli/src/sideprotocol"
import { logo } from "./assets"
import { initBuild } from "./build"
import {
    DeviceScriptAdapterServerDescriptorFactory,
    DeviceScriptConfigurationProvider,
} from "./debugger"
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
import { ExtensionState, NodeWatch } from "./state"

class SimulatorsSerializer implements vscode.WebviewPanelSerializer {
    constructor(readonly deserialize: (view: vscode.WebviewPanel) => void) {}
    async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
    ) {
        this.deserialize(webviewPanel)
    }
}

export function activateDeviceScript(context: vscode.ExtensionContext) {
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
    const extensionState = new ExtensionState(context, bus, workspaceState)

    let unsub = bus.subscribe(CHANGE, async () => {
        if (bus.connected && unsub) {
            unsub()
            unsub = null
            await initDevtoolsConnection(extensionState)
        }
    })

    // devtool web panel
    let simulatorsWebviewPanel: vscode.WebviewPanel
    const generateSimulatorsHtml = () => {
        const { kind: colorThemeKind } = vscode.window.activeColorTheme
        const darkMode =
            colorThemeKind === vscode.ColorThemeKind.Dark ||
            colorThemeKind === vscode.ColorThemeKind.HighContrast
                ? "dark"
                : "light"
        return `
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
    const updateDeveloperToolsPanelUrl = () => {
        if (!simulatorsWebviewPanel) return
        simulatorsWebviewPanel.webview.html = generateSimulatorsHtml()
    }
    vscode.window.registerWebviewPanelSerializer(
        "extension.devicescript.simulators",
        new SimulatorsSerializer(view => {
            if (!simulatorsWebviewPanel) simulatorsWebviewPanel = view
            updateDeveloperToolsPanelUrl()
        })
    )

    // build
    initBuild()
    subscriptions.push(
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
            () => showDevToolsTerminal()
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
                if (simulatorsWebviewPanel) {
                    simulatorsWebviewPanel.reveal(vscode.ViewColumn.Nine)
                } else {
                    console.log("Opening Developer Tools...")
                    await spawnDevTools(context)
                    // http://localhost:8081/
                    simulatorsWebviewPanel = vscode.window.createWebviewPanel(
                        "extension.devicescript.simulators",
                        "DeviceScript Simulators",
                        vscode.ViewColumn.Nine,
                        { enableScripts: true, retainContextWhenHidden: true }
                    )
                    simulatorsWebviewPanel.iconPath = logo(context)
                    simulatorsWebviewPanel.onDidDispose(
                        () => {
                            simulatorsWebviewPanel = undefined
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
            "extension.devicescript.variables.askForProgramName",
            config => {
                return vscode.window.showInputBox({
                    placeHolder:
                        "Please enter the name of a typescript file in the workspace folder",
                    value: "main.ts",
                })
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.variables.simulator",
            config => extensionState.simulatorScriptManagerId
        )
    )

    // track color theme
    vscode.window.onDidChangeActiveColorTheme(updateDeveloperToolsPanelUrl)

    // register a configuration provider for 'devicescript' debug type
    const provider = new DeviceScriptConfigurationProvider(bus, extensionState)
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
                            name: "Devicescript: Launch",
                            request: "launch",
                            type: "devicescript",
                            program:
                                "${workspaceFolder}/${command:askForProgramName}",
                        },
                    ]
                },
            },
            vscode.DebugConfigurationProviderTriggerKind.Dynamic
        )
    )

    const debuggerAdapterFactory =
        new DeviceScriptAdapterServerDescriptorFactory()
    subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory(
            "devicescript",
            debuggerAdapterFactory
        )
    )
    subscriptions.push(debuggerAdapterFactory)

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
        extensionState,
        selectNodeCommand
    )
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.jacdac-jdom-explorer",
        jdomTreeDataProvider
    )
    const jdomWatchTreeDataProvider = new JDomWatchTreeDataProvider(
        bus,
        extensionState,
        selectNodeCommand
    )
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.watch",
        jdomWatchTreeDataProvider
    )

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.showFirmwareInformation",
            (device: JDDevice) => {
                if (!device) return
                const spec =
                    bus.deviceCatalog.specificationFromProductIdentifier(
                        device.productIdentifier
                    )
                if (spec) {
                    const uri = `${DOCS_ROOT}${`devices/${identifierToUrlPath(
                        spec.id
                    )}`}`
                    vscode.commands.executeCommand("vscode.open", uri)
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.stopSimulator",
            async () => {
                await spawnDevTools(context)
                await extensionState.stopSimulator()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.startSimulator",
            async () => {
                await spawnDevTools(context)
                await extensionState.startSimulator()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.pickDeviceScriptManager",
            () => extensionState.pickDeviceScriptManager()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.clear",
            async () => {
                await extensionState.updateWatches([])
                jdomWatchTreeDataProvider.refresh()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.add",
            async (item: JDomTreeItem) => {
                if (!item) return
                console.log(`Watch ${item.node}`)
                const id = item.node.id
                const watches = extensionState.watches()
                if (!watches.find(w => w.id === id)) {
                    const label = item.node.friendlyName
                    const icon = (item.iconPath as vscode.ThemeIcon)?.id
                    await extensionState.updateWatches([
                        ...watches,
                        <NodeWatch>{ id, label, icon },
                    ])
                    item.refresh()
                    jdomWatchTreeDataProvider.refresh()
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.remove",
            async (item: JDomTreeItem) => {
                if (!item) return
                console.log(`Unwatch ${item.node}`)
                const id = item.node.id
                const watches = extensionState.watches()
                if (watches.find(w => w.id === id)) {
                    await extensionState.updateWatches(
                        watches.filter(w => w.id !== id)
                    )
                    item.refresh()
                    jdomWatchTreeDataProvider.refresh()
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
        statusBarItem.text = [
            !runtimeVersion ? "$(loading~spin)" : "$(devicescript-logo)",
            "DeviceScript",
            runtimeVersion,
            mgr ? `$(play) ${mgr?.shortId}` : "",
            devices.length > 0 ? `$(circuit-board) ${devices.length}` : "",
        ]
            .filter(p => !!p)
            .join(" ")
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

/*
class InlineDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
	createDebugAdapterDescriptor(_session: vscode.DebugSession): ProviderResult<vscode.DebugAdapterDescriptor> {
		return new vscode.DebugAdapterInlineImplementation(new LoggingDebugSession());
	}
}
*/
