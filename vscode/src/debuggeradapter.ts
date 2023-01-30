import * as vscode from "vscode"
import { build } from "./build"
import { checkDeviceScriptManagerRuntimeVersion } from "./deploy"
import { ExtensionState } from "./state"

export class DeviceScriptAdapterServerDescriptorFactory
    implements vscode.DebugAdapterDescriptorFactory
{
    constructor(readonly extensionState: ExtensionState) {}

    async createDebugAdapterDescriptor(
        session: vscode.DebugSession,
        executable: vscode.DebugAdapterExecutable | undefined
    ) {
        const { configuration } = session
        const { program } = configuration

        const service = await this.extensionState.resolveDeviceScriptManager()
        if (
            !checkDeviceScriptManagerRuntimeVersion(
                this.extensionState.runtimeVersion,
                service
            )
        ) {
            return undefined
        }
        if (!(await build(program, service.device.deviceId))) {
            return undefined
        }

        // make VS Code connect to debug server
        return new vscode.DebugAdapterServer(8083, "localhost")
    }

    dispose() {
        console.debug(`debugger adapter: dispose`)
    }
}
