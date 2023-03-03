import {
    CHANGE,
    CloudManager,
    ERROR,
    FETCH_ERROR,
    JDDevice,
    JDEventSource,
    SRV_CLOUD_ADAPTER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "../state"
import "isomorphic-fetch"

export class GatewayExtensionState extends JDEventSource {
    private _manager: CloudManager

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly deviceScriptState: DeviceScriptExtensionState
    ) {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.handleError = this.handleError.bind(this)
        this.handleFetchError = this.handleFetchError.bind(this)
        const { subscriptions, secrets } = this.context

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
        secrets.onDidChange(
            async () => {
                const token = await this.token
                if (this._manager?.token !== token)
                    this.handleRefreshConnection()
            },
            undefined,
            subscriptions
        )

        subscriptions.push(
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.refresh",
                async () => {
                    const apiRoot = this.apiRoot
                    const token = await this.token
                    if (!apiRoot || !token) await this.configure()
                    else await this.connect(true)
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.registerDevice",
                async () => {
                    const manager = this.manager
                    if (!manager) return

                    const devices = this.bus.devices({
                        serviceClass: SRV_CLOUD_ADAPTER,
                    })
                    const cloudDevices = manager.devices()
                    const unregisteredDevices = devices.filter(
                        dev => !cloudDevices.find(cd => cd.deviceId === dev.id)
                    )

                    if (!unregisteredDevices.length) {
                        vscode.window.showInformationMessage(
                            "DeviceScript Gateway: no cloud adapter device found to register."
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
                        title: `Enter a friendly name for ${device.shortId}`,
                        placeHolder: "my device",
                    })

                    if (!name) return

                    await this.withProgress("Registering Device", async () => {
                        await manager.registerDevice(device, name)
                    })
                }
            )
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

    private async handleFetchError(resp: Response) {
        switch (resp.status) {
            case 401: {
                // unauthorized
                await this.setToken(undefined)
                break
            }
        }

        await vscode.window.showErrorMessage(
            `DeviceScript Gateway: ${resp.statusText} (${resp.status})`
        )
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
            this._manager.on(FETCH_ERROR, this.handleFetchError)
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
        return (
            vscode.workspace
                .getConfiguration("devicescript.gateway")
                .get("apiRoot") as string
        )?.replace(/\/\s*$/, "")
    }

    async setApiRoot(apiRoot: string) {
        await vscode.workspace
            .getConfiguration("devicescript.gateway")
            .update("apiRoot", apiRoot?.replace(/\/\s*$/, ""))
    }

    async configure() {
        let changed = false
        const newConnectionString = await vscode.window.showInputBox({
            placeHolder: "Enter DevelopmentGateway connection string",
        })
        if (newConnectionString === undefined) return
        if (newConnectionString === "") {
            await this.setApiRoot(undefined)
            changed = true
        } else {
            const parts = newConnectionString
                .trim()
                .split(";")
                .map(chunk => chunk.split("=", 2))
            const webAppName = parts.find(
                ([name]) => name === "WebAppName"
            )?.[1]
            const accountName = parts.find(
                ([name]) => name === "AccountName"
            )?.[1]
            const accountKey = parts.find(
                ([name]) => name === "AccountKey"
            )?.[1]
            const endPointSuffix = parts.find(
                ([name]) => name === "EndPointSuffix"
            )?.[1]

            if (!webAppName || !accountName || !accountKey || !endPointSuffix) {
                vscode.window.showErrorMessage(
                    "DeviceScript Gateway: invalid connection string"
                )
                return
            }
            const apiRoot = `https://${webAppName}.${endPointSuffix}`
            const token = `${accountName}:${accountKey}`
            await this.setApiRoot(apiRoot)
            await this.setToken(token)
            changed = true
        }
        if (changed) this.handleRefreshConnection()
    }

    get token() {
        return this.context.secrets.get("devicescript.gateway.token")
    }

    async setToken(token: string) {
        await this.context.secrets.store("devicescript.gateway.token", token)
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
                        "DeviceScript Gateway: Updated failed."
                    )
                    // async
                    this.manager.refresh()
                }
            }
        )
    }
}
