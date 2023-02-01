import {
    CHANGE,
    CloudManager,
    ERROR,
    JDDevice,
    JDEventSource,
    SRV_CLOUD_ADAPTER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "./state"
import "isomorphic-fetch"

export class CloudExtensionState extends JDEventSource {
    private _manager: CloudManager

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly deviceScriptState: DeviceScriptExtensionState
    ) {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.handleError = this.handleError.bind(this)
        const { subscriptions } = this.context

        // track config changes
        vscode.workspace.onDidChangeConfiguration(
            () => {
                if (this._manager?.apiRoot !== this.apiRoot)
                    this.handleRefreshConnection()
            },
            undefined,
            subscriptions
        )

        // track secret changes
        deviceScriptState.context.secrets.onDidChange(
            async () => {
                const token = await this.token
                if (this._manager?.token !== token)
                    this.handleRefreshConnection()
            },
            undefined,
            subscriptions
        )

        vscode.commands.registerCommand(
            "extension.devicescript.cloud.refresh",
            async () => {
                const apiRoot = this.apiRoot
                const token = await this.token
                if (!apiRoot || !token) await this.configure()
                else await this.connect(true)
            },
            subscriptions
        )
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.registerDevice",
            async () => {
                const manager = this.manager
                if (!manager) return

                const simId = this.deviceScriptState.simulatorScriptManagerId
                const devices = this.bus
                    .devices({
                        serviceClass: SRV_CLOUD_ADAPTER,
                    })
                    .filter(d => d.deviceId !== simId)
                const cloudDevices = manager.devices()
                const unregisteredDevices = devices.filter(
                    dev => !cloudDevices.find(cd => cd.deviceId === dev.id)
                )

                if (!unregisteredDevices.length) {
                    vscode.window.showInformationMessage(
                        "DeviceScript Cloud: no cloud adapter device found to register."
                    )
                    return
                }

                const res = await vscode.window.showQuickPick(
                    unregisteredDevices.map(
                        device =>
                            <vscode.QuickPickItem & { device: JDDevice }>{
                                device,
                                label: device.shortId,
                                description: device.deviceId,
                                detail: device.describe(),
                            }
                    ),
                    {
                        title: "Register a Device",
                        placeHolder: "Select a device",
                        matchOnDescription: true,
                        matchOnDetail: true,
                    }
                )
                if (res === undefined) return
                const device = res.device
                const name = await vscode.window.showInputBox({
                    title: "Enter a name for your device",
                    placeHolder: "my device",
                })

                if (!name) return

                await this.withProgress("Registering Device", async () => {
                    await manager.registerDevice(device, name)
                })
            },
            subscriptions
        )

        // first connection - async
        this.handleRefreshConnection()
    }

    private handleChange() {
        this.emit(CHANGE)
    }

    private handleError(err: any) {
        console.error(err)
    }

    private async handleRefreshConnection() {
        if (this._manager) {
            this._manager.off(CHANGE, this.handleChange)
            this._manager.off(ERROR, this.handleError)
            this._manager = undefined
            this.emit(CHANGE)
        }
    }

    async connect(forceRefresh?: boolean) {
        const token = await this.token
        const apiRoot = this.apiRoot
        if (token && apiRoot && !this._manager) {
            this._manager = new CloudManager(this.bus, apiRoot, token)
            this._manager.on(CHANGE, this.handleChange)
            this._manager.on(ERROR, this.handleError)
            forceRefresh = true
        }
        if (this._manager && forceRefresh) await this._manager.refresh()
    }

    get manager() {
        return this._manager
    }

    get bus() {
        return this.deviceScriptState.bus
    }

    get apiRoot(): string {
        return vscode.workspace
            .getConfiguration("devicescript.cloud")
            .get("apiRoot")
    }

    async setApiRoot(apiRoot: string) {
        await vscode.workspace
            .getConfiguration("devicescript.cloud")
            .update("apiRoot", apiRoot)
    }

    async configure() {
        let changed = false
        const apiRoot = this.apiRoot
        const newApiRoot = await vscode.window.showInputBox({
            placeHolder: "Enter Cloud Web API Root",
            value: apiRoot || "https://jacdac-portal2.azurewebsites.net",
        })
        if (newApiRoot !== undefined && newApiRoot !== apiRoot) {
            await this.setApiRoot(newApiRoot)
            changed = true
        }
        const token = await vscode.window.showInputBox({
            placeHolder: "Enter Cloud Authentication Token",
            value: "",
        })
        if (token !== undefined) {
            await this.setToken(token)
            changed = true
        }
        if (changed) this.handleRefreshConnection()
    }

    get token() {
        return this.deviceScriptState.context.secrets.get(
            "devicescript.cloud.token"
        )
    }

    async setToken(token: string) {
        await this.deviceScriptState.context.secrets.store(
            "devicescript.cloud.token",
            token
        )
    }

    withProgress(title: string, transaction: () => Promise<void>) {
        return vscode.window.withProgress(
            {
                title,
                location: vscode.ProgressLocation.SourceControl,
            },
            async () => {
                try {
                    await transaction()
                } catch (e) {
                    console.error(e)
                    vscode.window.showErrorMessage(
                        "DeviceScript Cloud: Updated failed."
                    )
                    // async
                    this.manager.refresh()
                }
            }
        )
    }
}
