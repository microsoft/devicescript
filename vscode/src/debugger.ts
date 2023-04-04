import * as vscode from "vscode"
import {
    checkDeviceScriptManagerRuntimeVersion,
    prepareForDeploy,
} from "./deploy"
import { DeviceScriptExtensionState } from "./state"
import { WorkspaceFolder, DebugConfiguration, CancellationToken } from "vscode"
import { CHANGE, SRV_DEVICE_SCRIPT_MANAGER, SRV_ROLE_MANAGER } from "jacdac-ts"
import type { StartArgs } from "@devicescript/dap"
import { Utils } from "vscode-uri"
import { checkFileExists } from "./fs"
import { showErrorMessage } from "./telemetry"

function startSimulatorsOnStart() {
    const settings = vscode.workspace.getConfiguration("devicescript.debugger")
    if (settings.get("showTerminalOnStart"))
        vscode.commands.executeCommand("extension.devicescript.terminal.show")
    if (settings.get("showSimulatorsOnStart"))
        vscode.commands.executeCommand("extension.devicescript.openSimulators")
}

export function activateDebugger(extensionState: DeviceScriptExtensionState) {
    const { context } = extensionState
    const { subscriptions } = context

    // register a configuration provider for 'devicescript' debug type
    const provider = new DeviceScriptConfigurationProvider(extensionState)
    subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider(
            "devicescript",
            provider
        )
    )
    trackRolesAndSimulators(extensionState)

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.debug.toggleFormatting",
            () => {
                const ds = vscode.debug.activeDebugSession
                if (ds) {
                    ds.customRequest("toggleFormatting")
                }
            }
        )
    )

    // register a dynamic configuration provider for 'devicescript' debug type
    subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider(
            "devicescript",
            {
                provideDebugConfigurations(
                    folder: WorkspaceFolder | undefined
                ): vscode.ProviderResult<DebugConfiguration[]> {
                    return [
                        {
                            name: "DeviceScript: Debug",
                            request: "launch",
                            type: "devicescript",
                            stopOnEntry: true,
                        },
                        {
                            name: "DeviceScript: Run",
                            request: "launch",
                            type: "devicescript",
                            stopOnEntry: false,
                            noDebug: true,
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
}

const SETTLE_DELAY = 1500
function trackRolesAndSimulators(extensionState: DeviceScriptExtensionState) {
    const { context } = extensionState
    const { subscriptions } = context
    // track role manager
    let unmount: () => void
    vscode.debug.onDidStartDebugSession(
        session => {
            if (session.type !== "devicescript") return

            const config = session.configuration
            const dsConfig = config as StartArgs
            const dev = extensionState.bus.device(dsConfig.deviceId, true)
            const srv = dev?.services({
                serviceClass: SRV_ROLE_MANAGER,
            })?.[0]
            if (!srv) return

            extensionState.bus.setRoleManagerService(srv)

            const mgr = extensionState.bus.roleManager
            unmount = mgr.subscribe(CHANGE, () => {
                if (!mgr.allRolesBound()) {
                    // nag user about starting simulators
                    unmount?.()
                    unmount = undefined
                    setTimeout(async () => {
                        if (mgr.allRolesBound()) return

                        /*
                        const start = "Start Simulators"
                        const res = await vscode.window.showWarningMessage(
                            "DeviceScript: Would you like to open the simulators view?",
                            start
                        )
                        if (res === start) {
                            vscode.commands.executeCommand(
                                "extension.devicescript.openSimulators"
                            )
                        }
                        */
                    }, SETTLE_DELAY)
                }
            })
        },
        undefined,
        subscriptions
    )
    vscode.debug.onDidTerminateDebugSession(
        session => {
            if (session.type === "devicescript") {
                unmount?.()
                unmount = undefined
            }
        },
        undefined,
        subscriptions
    )

    // finaly cleanup
    subscriptions.push({
        dispose: () => {
            extensionState.bus.setRoleManagerService(undefined)
            unmount?.()
            unmount = undefined
        },
    })
}

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
    constructor(readonly extensionState: DeviceScriptExtensionState) {}

    get bus() {
        return this.extensionState.bus
    }

    async resolveDebugConfigurationWithSubstitutedVariables(
        folder: vscode.WorkspaceFolder,
        config: vscode.DebugConfiguration,
        token?: vscode.CancellationToken
    ) {
        const sessionConfig = config as vscode.DebugSessionOptions
        const dsConfig = config as StartArgs
        let program: string = config.program
        // program can be absolute or relative...

        if (!program) {
            showErrorMessage(
                "debug.programnotfound",
                "Debug cancelled\nCannot find a program to debug."
            )
            return undefined
        }

        // TODO make sure we're running devtools in the correct folder
        // program is a file system path, potentially full path on windows
        let programUri = vscode.Uri.file(program)
        if (!/^(\/|\w+:\\)/i.test(programUri.fsPath))
            programUri = Utils.resolvePath(folder.uri, program)
        let dir = programUri
        let n = 0
        do {
            dir = Utils.dirname(dir)
            if (await checkFileExists(dir, `devsconfig.json`)) {
                await this.extensionState.devtools.setProjectFolder(dir)
                program = programUri.fsPath.slice(
                    this.extensionState.devtools.projectFolder.fsPath.length + 1
                )
                break
            }
            if (n++ > 30) {
                console.log("devsconfig not found", { dir, folder })
                showErrorMessage(
                    "debug.notrootfolder",
                    "Debug cancelled\nCould not find root folder (contains 'devsconfig.json')."
                )
                return undefined
            }
        } while (dir !== folder.uri)

        await this.extensionState.devtools.start()
        if (!this.extensionState.devtools.connected) {
            showErrorMessage(
                "debug.startfailed",
                "Debug cancelled\nCannot start development server."
            )
            return undefined
        }

        // find device
        if (!dsConfig.deviceId) {
            const service =
                await this.extensionState.resolveDeviceScriptManager({
                    autoStartSimulator: true,
                })
            if (service) {
                const idx = service.device
                    .services({ serviceClass: service.serviceClass })
                    .indexOf(service)
                dsConfig.deviceId = service.device.deviceId
                dsConfig.serviceInstance = idx
            }
        }

        if (token?.isCancellationRequested) return undefined

        if (!dsConfig.deviceId) {
            showErrorMessage(
                "debug.notdevice",
                `Debug cancelled\nNo device selected.`
            )
            return undefined
        }

        // expand device short name
        if (/^[A-Z][A-Z][0-9][0-9]$/i.test(dsConfig.deviceId)) {
            const shortIdDevice = this.bus
                .devices({
                    serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
                    lost: false,
                })
                .find(d => d.shortId === dsConfig.deviceId)
            if (shortIdDevice) dsConfig.deviceId = shortIdDevice.deviceId
        }

        // start vm if needed
        if (dsConfig.deviceId === this.extensionState.simulatorScriptManagerId)
            await this.extensionState.startSimulator()

        // find service
        const service = this.bus.device(dsConfig.deviceId, true)?.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })?.[dsConfig.serviceInstance || 0]
        if (!service || service.disposed) {
            showErrorMessage(
                "debug.nodevicebyid",
                `Debug cancelled\nCould not find device ${dsConfig.deviceId}.`
            )
            return undefined
        }

        // check version (show it's own error dialogs)
        if (
            dsConfig.deviceId !== this.extensionState.simulatorScriptManagerId
        ) {
            const versionOk = await checkDeviceScriptManagerRuntimeVersion(
                this.extensionState.devtools.runtimeVersion,
                service
            )
            if (!versionOk) {
                // don't start debugging
                return undefined
            }
        }

        // prepare for deploy
        await prepareForDeploy(this.extensionState, service)

        // build and deploy
        const buildResult = await this.extensionState.devtools.build(
            program,
            service
        )
        if (!buildResult?.success) {
            showErrorMessage(
                "debug.builderrors",
                `Debug cancelled\nProgram has build errors.`
            )
            return undefined
        }
        // save as currently debugged project
        await this.extensionState.updateCurrentDeviceScriptManagerId(
            service.device.deviceId
        )


        // show UI
        startSimulatorsOnStart()

        // run, no debug
        if (sessionConfig?.noDebug) {
            console.debug(`skip debugger`)
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
        // folder.uri is the root namespace for the auto-generate launch commandß
        if (
            !config.program &&
            ((config.request === "launch" && config.type === "devicescript") ||
                (!config.request && !config.type))
        ) {
            const file = await this.extensionState.pickDeviceScriptFile({
                title: "Pick a file to debug.",
            })
            if (!file) return undefined

            // TODO: support workspace !== projectfolder
            config.program = vscode.workspace.asRelativePath(file)
            config.request = "launch"
            config.type = "devicescript"
        }

        return config
    }
}
