/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from "vscode"
import {
    WorkspaceFolder,
    DebugConfiguration,
    ProviderResult,
    CancellationToken,
} from "vscode"
import { startJacdacBus } from "./jacdac"
import { JDeviceTreeItem, JDomTreeDataProvider } from "./JDomTreeDataProvider"

export function activateDeviceScript(
    context: vscode.ExtensionContext,
    factory?: vscode.DebugAdapterDescriptorFactory
) {
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
                console.log("Opening Developer Tools...")
                // http://localhost:8081/
                const panel = vscode.window.createWebviewPanel(
                    "extension.devicescript.openDevTools", // Identifies the type of the webview. Used internally
                    "DeviceScript Developer Tools", // Title of the panel displayed to the user
                    vscode.ViewColumn.Nine, // Editor column to show the new webview panel in.
                    { enableScripts: true } // Webview options. More on these later.
                )
                panel.webview.html = `
<html>
<head>
<style>
body {
    margin: 0;
    padding: 0;    
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
<iframe src="http://localhost:8081/" />
</body>
</html>                
                `
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

    const bus = startJacdacBus()
    const jdomTreeDataProvider = new JDomTreeDataProvider(bus)
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.jacdac-jdom-explorer",
        jdomTreeDataProvider
    )
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
