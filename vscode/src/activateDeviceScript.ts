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
