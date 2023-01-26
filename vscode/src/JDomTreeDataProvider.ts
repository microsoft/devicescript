import * as vscode from "vscode"
import { CHANGE, DEVICE_CHANGE, JDBus, JDNode } from "jacdac-ts"

class JDomTreeItem extends vscode.TreeItem {
    constructor(
        public readonly node: JDNode,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(node.friendlyName, collapsibleState)

        this.node.on(CHANGE, this.handleChange.bind(this))
        this.handleChange()
    }

    private handleChange() {
        this.label = this.node.friendlyName
        this.tooltip = this.node.name
        this.description = this.node.toString()
    }
}

export class JDomTreeDataProvider
    implements vscode.TreeDataProvider<JDomTreeItem>
{
    constructor(readonly bus: JDBus) {
        this.bus.on(CHANGE, () => {
            this.refresh()
        })
    }

    getTreeItem(element: JDomTreeItem): vscode.TreeItem {
        return element
    }

    getChildren(element?: JDomTreeItem): Thenable<JDomTreeItem[]> {
        const createTreeItem = (child: JDNode) => {
            const item = new JDomTreeItem(
                child,
                vscode.TreeItemCollapsibleState.Collapsed
            )
            child.on(CHANGE, this.refresh.bind(this, child))
            return item
        }

        if (!element) {
            const devices = this.bus.devices({ ignoreInfrastructure: false })
            return Promise.resolve(devices.map(createTreeItem))
        } else {
            const children = element?.node.children.map(createTreeItem)
            return Promise.resolve(children)
        }
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
        JDomTreeItem | undefined | null | void
    > = new vscode.EventEmitter<JDomTreeItem | undefined | null | void>()
    readonly onDidChangeTreeData: vscode.Event<
        JDomTreeItem | undefined | null | void
    > = this._onDidChangeTreeData.event

    refresh(treeItem?: JDomTreeItem): void {
        this._onDidChangeTreeData.fire(treeItem)
    }
}
