import * as vscode from "vscode"
import { build } from "./build"
import { checkDeviceScriptManagerRuntimeVersion } from "./deploy"
import { ExtensionState } from "./state"
import {
    WorkspaceFolder,
    DebugConfiguration,
    ProviderResult,
    CancellationToken,
} from "vscode"

export class DeviceScriptAdapterServerDescriptorFactory
    implements vscode.DebugAdapterDescriptorFactory
{
    async createDebugAdapterDescriptor(
        session: vscode.DebugSession,
        executable: vscode.DebugAdapterExecutable | undefined
    ) {
        return new vscode.DebugAdapterServer(8083, "localhost")
    }

    dispose() {}
}

export class DeviceScriptConfigurationProvider
    implements vscode.DebugConfigurationProvider
{
    constructor(readonly extensionState: ExtensionState) {}

    async resolveDebugConfigurationWithSubstitutedVariables(
        folder: vscode.WorkspaceFolder,
        config: vscode.DebugConfiguration,
        token?: vscode.CancellationToken
    ) {
        if (token?.isCancellationRequested) return undefined

        const service = await this.extensionState.resolveDeviceScriptManager()
        if (
            !checkDeviceScriptManagerRuntimeVersion(
                this.extensionState.runtimeVersion,
                service
            )
        ) {
            // don't start debugging
            return undefined
        }

        const idx = service.device
            .services({ serviceClass: service.serviceClass })
            .indexOf(service)

        config.devicescript = {
            deviceId: service.device.deviceId,
            serviceInstance: idx,
        }

        if (token?.isCancellationRequested) return undefined

        if (!(await build(config.program, service.device.deviceId))) {
            // don't start debugging
            return undefined
        }

        return config
    }

    /**
     * Massage a debug configuration just before a debug session is being launched,
     * e.g. add all missing attributes to the debug configuration.
     */
    async resolveDebugConfiguration(
        folder: WorkspaceFolder | undefined,
        config: DebugConfiguration,
        token?: CancellationToken
    ) {
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
            await vscode.window.showInformationMessage(
                "Debug cancelled. Cannot find a program to debug."
            )
            return undefined
        }
        return config
    }
}
