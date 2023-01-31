import { CloudData, CloudManager, CloudNode, JDBus } from "jacdac-ts"
import { JDomTreeDataProvider } from "./JDomTreeDataProvider"
import * as vscode from "vscode"
import { ExtensionState } from "./state"
import { idText } from "typescript"

export interface CloudTreeItem extends vscode.TreeItem {}

export class CloudTreeDataProvider
    implements vscode.TreeDataProvider<CloudNode>
{
    private _manager: CloudManager
    constructor(readonly bus: JDBus, readonly state: ExtensionState) {
        const { context } = this.state

        // track config changes
        vscode.workspace.onDidChangeConfiguration(
            () => {
                if (this._manager?.apiRoot !== this.apiRoot)
                    this.handleRefreshConnection()
            },
            undefined,
            context.subscriptions
        )

        // track secret changes
        state.context.secrets.onDidChange(
            async () => {
                const token = await this.token
                if (this._manager?.token !== token)
                    this.handleRefreshConnection()
            },
            undefined,
            context.subscriptions
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
        await vscode.workspace.getConfiguration("devicescript.cloud").update("apiRoot", apiRoot)
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

        // mount new manager
        if (token && apiRoot)
            this._manager = new CloudManager(this.bus, apiRoot, token)
        else this._manager = undefined

        // refresh tree
        this.refresh()
    }

    getTreeItem(node: CloudNode<CloudData>) {
        const id = `cloud:` + node.id
        const label = node.name
        return <vscode.TreeItem>{
            id,
            label,
        }
    }

    getChildren(element?: CloudNode) {
        if (!element) {
            if (!this._manager) return undefined
            return [...this._manager.devices(), ...this._manager.scripts()]
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
