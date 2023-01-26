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
    humanify,
    JDRegister,
    REGISTER_NODE_NAME,
    JDEvent,
    FIELD_NODE_NAME,
    EVENT_NODE_NAME,
    REPORT_UPDATE,
} from "jacdac-ts"

type RefreshFunction = (item: JDomTreeItem) => void

class JDomTreeItem extends vscode.TreeItem {
    constructor(
        public readonly node: JDNode,
        private readonly _refresh: RefreshFunction,
        collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    ) {
        super(node.friendlyName, collapsibleState)
        this.id = node.id

        this.handleChange = this.handleChange.bind(this)
        this.mount()
        this.handleChange()
    }

    protected handleChange() {
        this.label = this.node.friendlyName
        this.description = this.node.toString()

        this.refresh()
    }

    refresh() {
        this._refresh(this)
    }

    protected mount() {
        this.node.on(CHANGE, this.handleChange)
    }

    unmount() {
        this.node.off(CHANGE, this.handleChange)
    }
}

class JDeviceTreeItem extends JDomTreeItem {
    constructor(device: JDDevice, refresh: RefreshFunction) {
        super(device, refresh)
        this.device.resolveProductIdentifier()
    }

    get device() {
        return this.node as JDDevice
    }

    protected handleChange() {
        const { device } = this
        const { bus } = device

        if (!bus) {
            this.unmount()
            return
        }

        this.label = device.friendlyName
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
            const control = device.service(SRV_CONTROL)
            const description = control?.register(ControlReg.DeviceDescription)
            this.tooltip = description?.stringValue
            description.on(CHANGE, this.refresh)
            description.scheduleRefresh()
        }
        this.refresh()
    }
}

class JDServiceTreeItem extends JDomTreeItem {
    constructor(service: JDService, refresh: RefreshFunction) {
        super(service, refresh)
    }

    get service() {
        return this.node as JDService
    }

    protected handleChange() {
        const { service } = this
        const { specification, instanceName, serviceClass } = service

        this.label =
            instanceName ||
            humanify(specification?.shortName?.toLowerCase()) ||
            `0x${serviceClass.toString(16)}`

        this.refresh()
    }
}

class JDRegisterTreeItem extends JDomTreeItem {
    constructor(register: JDRegister, refresh: RefreshFunction) {
        super(register, refresh, vscode.TreeItemCollapsibleState.None)
    }

    protected mount(): void {
        this.node.on(REPORT_UPDATE, this.handleChange)
    }

    unmount(): void {
        this.node.off(REPORT_UPDATE, this.handleChange)
    }

    get register() {
        return this.node as JDRegister
    }

    protected handleChange() {
        const { register } = this
        const { humanValue, specification, code, service } = register
        const { optional, name } = specification || {}

        this.label = humanify(
            `${name || `0x${code.toString(16)}${optional ? "?" : ""}`}`
        )
        this.description = humanValue
        this.refresh()

        if (JDRegisterTreeItem.probablyIgnore(register)) {
            this.unmount()
            service.emit(CHANGE)
        }
    }

    public static probablyIgnore(register: JDRegister) {
        const { notImplemented } = register
        if (notImplemented) return true

        const { data, specification, lastGetAttempts } = register
        const { optional } = specification || {}

        return optional && lastGetAttempts > 2 && data === undefined
    }
}

class JDEventTreeItem extends JDomTreeItem {
    constructor(event: JDEvent, refresh: RefreshFunction) {
        super(event, refresh, vscode.TreeItemCollapsibleState.None)
    }

    get event() {
        return this.node as JDEvent
    }

    protected handleChange() {
        const { event } = this
        const { specification, code, count } = event
        this.label = humanify(specification?.name) || `0x${code.toString(16)}`
        this.description = `#${count}`

        this.refresh()
    }
}

export class JDomTreeDataProvider
    implements vscode.TreeDataProvider<JDomTreeItem>
{
    constructor(readonly bus: JDBus) {
        this.bus.on(DEVICE_CHANGE, () => {
            this.refresh()
        })
    }

    getTreeItem(element: JDomTreeItem): vscode.TreeItem {
        return element
    }

    getChildren(element?: JDomTreeItem): Thenable<JDomTreeItem[]> {
        const refresh = (i: JDomTreeItem) => this.refresh(i)
        if (!element) {
            const devices = this.bus.devices({
                ignoreInfrastructure: true,
                announced: true,
            })
            return Promise.resolve(
                devices.map(
                    child => new JDeviceTreeItem(child as JDDevice, refresh)
                )
            )
        } else {
            const children = element?.node.children
                .filter(child => {
                    const { nodeKind } = child
                    switch (nodeKind) {
                        case FIELD_NODE_NAME: // ignore fields
                            return undefined
                        case REGISTER_NODE_NAME: {
                            const reg = child as JDRegister
                            if (JDRegisterTreeItem.probablyIgnore(reg))
                                return undefined
                            break
                        }
                    }
                    return child
                })
                .filter(child => !!child)
                .map(child => {
                    const { nodeKind, name } = child
                    const treeItemType =
                        {
                            [DEVICE_NODE_NAME]: JDeviceTreeItem,
                            [SERVICE_NODE_NAME]: JDServiceTreeItem,
                            [REGISTER_NODE_NAME]: JDRegisterTreeItem,
                            [EVENT_NODE_NAME]: JDEventTreeItem,
                        }[nodeKind] ?? JDomTreeItem
                    const item = new treeItemType(child, refresh)
                    return item
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
