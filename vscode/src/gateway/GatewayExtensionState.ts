import {
    CHANGE,
    ERROR,
    JDDevice,
    JDEventSource,
    SRV_CLOUD_ADAPTER,
    toMap,
} from "jacdac-ts"
import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "../state"
import "isomorphic-fetch"
import { GatewayManager, FETCH_ERROR } from "./gatewaydom"
import { showError, showErrorMessage } from "../telemetry"

export class GatewayExtensionState extends JDEventSource {
    private _manager: GatewayManager

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
            //cloud
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.configure",
                async () => await this.configure()
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.refresh",
                async () => await this.refresh()
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.devices.register",
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

    async refresh() {
        const apiRoot = this.apiRoot
        const token = await this.token
        if (!apiRoot || !token) await this.configure()
        else await this.connect(true)
    }

    private handleChange() {
        this.emit(CHANGE)
    }

    private handleError(err: any) {
        console.error(err)
    }

    private async handleFetchError(error: Response | Error) {
        if (error instanceof Response) {
            const resp = error as Response
            switch (resp.status) {
                case 401: {
                    // unauthorized
                    await this.setToken(undefined)
                    break
                }
            }
            await showErrorMessage(
                "gateway.fetch",
                `${resp.statusText} (${resp.status})`
            )
        } else {
            const e = error as Error
            await showError(e)
        }
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
            this._manager = new GatewayManager(this.bus, apiRoot, token)
            this._manager.on(CHANGE, this.handleChange)
            this._manager.on(ERROR, this.handleError)
            this._manager.on(FETCH_ERROR, this.handleFetchError)
            forceRefresh = true
        }
        if (this._manager && forceRefresh) await this.backgroundRefresh()
    }

    private async backgroundRefresh() {
        try {
            await this._manager?.refresh()
        } catch (e) {
            showError(e)
        }
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
        if (apiRoot !== this.apiRoot) {
            await vscode.workspace
                .getConfiguration("devicescript.gateway")
                .update("apiRoot", apiRoot?.replace(/\/\s*$/, ""))
            this.handleRefreshConnection()
        }
    }

    async configure() {
        const newConnectionString = await vscode.window.showInputBox({
            placeHolder: "Enter DevelopmentGateway connection string",
        })
        if (newConnectionString === undefined) return

        if (newConnectionString === "") {
            await this.setApiRoot(undefined)
        } else {
            let {
                AccountName,
                AccountKey,
                ApiRoot,
                Subscription,
                ResourceGroup,
            } = toMap(
                newConnectionString
                    .trim()
                    .split(";")
                    .map(chunk => chunk.split("=", 2)),
                ([name, _]) => name,
                ([_, val]) => val
            )

            if (!ApiRoot || !AccountName || !AccountKey) {
                showErrorMessage(
                    "gateway.invalidconnstring",
                    `invalid connection string`
                )
                return
            }
            const token = `${AccountName}:${AccountKey}`
            await this.setApiRoot(ApiRoot)
            await this.setToken(token)
        }
        if (this.apiRoot && this.token) await this.connect(true)
    }

    get token() {
        return this.context.secrets.get("devicescript.gateway.token")
    }

    async setToken(token: string) {
        const t = await this.token
        if (token !== t) {
            await this.context.secrets.store(
                "devicescript.gateway.token",
                token
            )
            this.handleRefreshConnection()
        }
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
                    showError(e)
                    // async
                    this.backgroundRefresh()
                }
            }
        )
    }
}
