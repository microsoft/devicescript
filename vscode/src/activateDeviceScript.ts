/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
    CONNECTION_STATE,
    DEVICE_CHANGE,
    Flags,
    FRAME_PROCESS,
    JDFrameBuffer,
    serializeToTrace,
} from "jacdac-ts"
import * as vscode from "vscode"
import {
    WorkspaceFolder,
    DebugConfiguration,
    ProviderResult,
    CancellationToken,
} from "vscode"
import { spawnDevTools, showDevToolsTerminal } from "./devtools"
import { startJacdacBus, stopJacdacBus } from "./jacdac"
import { JDeviceTreeItem, JDomTreeDataProvider } from "./JDomTreeDataProvider"

export function activateDeviceScript(
    context: vscode.ExtensionContext,
    factory?: vscode.DebugAdapterDescriptorFactory
) {
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

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.runEditorContents",
            (resource: vscode.Uri) => {
                let targetResource = resource
                if (!targetResource && vscode.window.activeTextEditor) {
                    targetResource = vscode.window.activeTextEditor.document.uri
                }
                if (targetResource) {
                    vscode.debug.startDebugging(
                        undefined,
                        {
                            type: "devicescript",
                            name: "Run File",
                            request: "launch",
                            program: targetResource.fsPath,
                        },
                        { noDebug: true }
                    )
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.debugEditorContents",
            (resource: vscode.Uri) => {
                let targetResource = resource
                if (!targetResource && vscode.window.activeTextEditor) {
                    targetResource = vscode.window.activeTextEditor.document.uri
                }
                if (targetResource) {
                    vscode.debug.startDebugging(undefined, {
                        type: "devicescript",
                        name: "Debug File",
                        request: "launch",
                        program: targetResource.fsPath,
                        stopOnEntry: true,
                    })
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
        vscode.commands.registerCommand("extension.devicescript.start", () => {
            console.log("Starting...")
        }),
        vscode.commands.registerCommand(
            "extension.devicescript.showServerTerminal",
            () => {
                console.log("Showing terminal...")
                showDevToolsTerminal()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.identifyDevice",
            (item: JDeviceTreeItem) => {
                const { device } = item
                device.identify() // async
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.resetDevice",
            (item: JDeviceTreeItem) => {
                const { device } = item
                device.reset() // async
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.openDevTools",
            () => {
                if (developerToolsPanel) {
                    developerToolsPanel.reveal(vscode.ViewColumn.Nine)
                } else {
                    console.log("Opening Developer Tools...")
                    // http://localhost:8081/
                    developerToolsPanel = vscode.window.createWebviewPanel(
                        "extension.devicescript.openDevTools", // Identifies the type of the webview. Used internally
                        "DeviceScript Developer Tools", // Title of the panel displayed to the user
                        vscode.ViewColumn.Nine, // Editor column to show the new webview panel in.
                        { enableScripts: true } // Webview options. More on these later.
                    )
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

    context.subscriptions.push(
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
    context.subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider(
            "devicescript",
            provider
        )
    )

    // register a dynamic configuration provider for 'devicescript' debug type
    context.subscriptions.push(
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

    context.subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory(
            "devicescript",
            factory
        )
    )
    if ("dispose" in factory) {
        context.subscriptions.push(factory as any)
    }

    let redirectOutput =
        context.extensionMode == vscode.ExtensionMode.Production
    if (redirectOutput) {
        const output = vscode.window.createOutputChannel("DeviceScript")
        const addMsg = (level: number, args: any[]) => {
            let msg = ""
            for (const a of args) {
                if (msg != "") msg += " "
                msg += a
            }
            output.appendLine(msg)
        }
        // note that this is local to this extension - see inject.js
        console.debug = (...a: any[]) => addMsg(0, a)
        console.log = (...a: any[]) => addMsg(1, a)
        console.warn = (...a: any[]) => addMsg(2, a)
        console.error = (...a: any[]) => addMsg(3, a)
        console.info = console.log
    }

    // launch devtools in backgroun
    context.subscriptions.push(spawnDevTools())

    const bus = startJacdacBus()
    // make sure to stop bus when unloading extension
    context.subscriptions.push({
        dispose: stopJacdacBus,
    })

    const jdomTreeDataProvider = new JDomTreeDataProvider(bus)
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.jacdac-jdom-explorer",
        jdomTreeDataProvider
    )

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    )
    statusBarItem.command = "extension.devicescript.openDevTools"
    statusBarItem.tooltip = "Click to Connect to Device"
    const updateStatusBar = () => {
        const devices = bus.devices({
            ignoreInfrastructure: true,
            announced: true,
        })
        statusBarItem.text = `DeviceScript ${devices.length} $(${JDeviceTreeItem.ICON})`
    }
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
        const jacdacConfig = vscode.workspace.getConfiguration(
            "devicescript.jacdac"
        )
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
