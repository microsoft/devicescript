import * as vscode from "vscode"
import {
    CHANGE,
    ControlReg,
    DEVICE_CHANGE,
    DEVICE_NODE_NAME,
    JDBus,
    JDDevice,
    JDNode,
    JDService,
    SERVICE_NODE_NAME,
    SRV_CONTROL,
} from "jacdac-ts"

class JDomTreeItem extends vscode.TreeItem {
    constructor(
        public readonly node: JDNode,
        public readonly refresh: () => void
    ) {
        super(node.friendlyName, vscode.TreeItemCollapsibleState.Collapsed)

        this.node.on(CHANGE, this.handleChange.bind(this))
        this.handleChange()
    }

    protected handleChange() {
        this.label = this.node.friendlyName
        this.description = this.node.toString()

        this.refresh()
    }
}

class JDeviceTreeItem extends JDomTreeItem {
    constructor(device: JDDevice, refresh: () => void) {
        super(device, refresh)
        this.device.resolveProductIdentifier()
    }

    get device() {
        return this.node as JDDevice
    }

    protected handleChange() {
        const { device } = this
        this.label = device.friendlyName
        const control = device.service(SRV_CONTROL)
        if (!this.description) {
            const pid = device.productIdentifier
            if (pid) {
                const spec =
                    device.bus.deviceCatalog.specificationFromProductIdentifier(
                        pid
                    )
                this.description = spec.name || `0x${pid.toString(16)}`
            }
        }

        if (!this.tooltip) {
            const description = control.register(ControlReg.DeviceDescription)
            this.tooltip = description.stringValue
            description.on(CHANGE, this.refresh)
            description.scheduleRefresh()
        }
        this.refresh()
    }
}

class JDServiceTreeItem extends JDomTreeItem {
    constructor(service: JDService, refresh: () => void) {
        super(service, refresh)
    }

    get service() {
        return this.node as JDService
    }

    protected handleChange() {
        const { service } = this
        const { specification, instanceName } = service

        this.label = instanceName || specification?.shortName || service.name
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
        if (!element) {
            const devices = this.bus.devices({ ignoreInfrastructure: false })
            return Promise.resolve(
                devices.map(
                    child =>
                        new JDeviceTreeItem(
                            child as JDDevice,
                            this.refresh.bind(this, child)
                        )
                )
            )
        } else {
            const children = element?.node.children.map(child => {
                const refresh = this.refresh.bind(this, child)
                const { nodeKind } = child
                const treeItemType =
                    {
                        [DEVICE_NODE_NAME]: JDeviceTreeItem,
                        [SERVICE_NODE_NAME]: JDServiceTreeItem,
                    }[nodeKind] || JDomTreeItem
                return new treeItemType(child, refresh)
            })
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
