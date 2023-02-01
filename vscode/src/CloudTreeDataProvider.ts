import {
    CHANGE,
    CloudData,
    CloudDevice,
    CloudManager,
    CloudNode,
    CLOUD_DEVICE_NODE,
    CLOUD_SCRIPT_NODE,
    JDBus,
    shortDeviceId,
} from "jacdac-ts"
import * as vscode from "vscode"
import { ExtensionState } from "./state"
import "isomorphic-fetch"
import { deviceIconUri, toMarkdownString } from "./catalog"

export interface CloudTreeItem extends vscode.TreeItem {}

export class CloudTreeDataProvider
    implements vscode.TreeDataProvider<CloudNode>
{
    private _manager: CloudManager
    private firstLoad = false

    constructor(readonly bus: JDBus, readonly state: ExtensionState) {
        this.handleChange = this.handleChange.bind(this)
        const { context } = this.state
        const { subscriptions } = context

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
        state.context.secrets.onDidChange(
            async () => {
                const token = await this.token
                if (this._manager?.token !== token)
                    this.handleRefreshConnection()
            },
            undefined,
            subscriptions
        )

        // commands
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.refresh",
            async () => {
                const apiRoot = this.apiRoot
                const token = await this.token
                if (!apiRoot || !token) await this.configure()
                else await this._manager.refresh()
            },
            subscriptions
        )

        // first connection - async
        this.handleRefreshConnection()
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
            await this.setApiRoot(apiRoot)
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
        return this.state.context.secrets.get("devicescript.cloud.token")
    }

    async setToken(token: string) {
        await this.state.context.secrets.store(
            "devicescript.cloud.token",
            token
        )
    }

    private async handleRefreshConnection() {
        const token = await this.token
        const apiRoot = this.apiRoot

        // unmount
        this._manager?.off(CHANGE, this.handleChange)

        // mount new manager
        if (token && apiRoot) {
            this._manager = new CloudManager(this.bus, apiRoot, token)
            this._manager.on(CHANGE, this.handleChange)
            this.firstLoad = true
        } else {
            this._manager = undefined
        }

        // refresh tree
        this.refresh()
    }

    private handleChange() {
        console.debug(`cloud: manager change`)
        this.refresh()
    }

    getTreeItem(node: CloudNode) {
        const id = `cloud:` + node.id
        let label = node.name
        let description = ""
        let tooltip: vscode.MarkdownString = undefined
        const contextValue = node.nodeKind
        let iconPath: vscode.ThemeIcon | vscode.Uri = new vscode.ThemeIcon(
            {
                [CLOUD_DEVICE_NODE]: "circuit-board",
                [CLOUD_SCRIPT_NODE]: "file-code",
            }[contextValue] || "question"
        )

        switch (node.nodeKind) {
            case CLOUD_DEVICE_NODE: {
                const d = node as CloudDevice
                const meta = d.meta

                label = `${shortDeviceId(d.deviceId)}, ${d.name}`
                description = d.scriptId
                    ? `${d.scriptId} ${d.scriptVersion}`
                    : "no script"
                const spec =
                    this.bus.deviceCatalog.specificationFromProductIdentifier(
                        meta.productId
                    )
                if (spec) iconPath = deviceIconUri(spec)

                tooltip = toMarkdownString(
                    `
- last activity: ${d.lastActivity}
- product identifier: ${meta.productId?.toString(16) || ""}
- firmware version: ${meta.fwVersion || ""}
- deployed hash: ${d.deployedHash || ""}
`
                )

                break
            }
        }

        return <vscode.TreeItem>{
            id,
            label,
            contextValue,
            iconPath,
            tooltip,
            description,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
        }
    }

    async getChildren(element?: CloudNode) {
        if (!element) {
            if (!this._manager) return undefined
            if (this.firstLoad) {
                this.firstLoad = false
                this._manager.refresh()
            }
            return [
                ...this._manager
                    .scripts()
                    .sort((l, r) => l.name.localeCompare(r.name)),
                ...this._manager
                    .devices()
                    .sort((l, r) => l.name.localeCompare(r.name)),
            ]
        } else {
            return element?.children as CloudNode[]
        }
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
        void | CloudNode | CloudNode[]
    > = new vscode.EventEmitter<void | CloudNode | CloudNode[]>()
    readonly onDidChangeTreeData: vscode.Event<void | CloudNode | CloudNode[]> =
        this._onDidChangeTreeData.event

    refresh(treeItem?: CloudNode): void {
        this._onDidChangeTreeData.fire(treeItem)
    }
}
