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
    SystemReg,
    dashify,
    JDServiceMemberNode,
    ellipseJoin,
    isInfrastructure,
    isReading,
} from "jacdac-ts"

export type RefreshFunction = (item: JDomTreeItem) => void

export function createChildrenTreeItems(
    node: JDNode,
    refresh: RefreshFunction
): JDomTreeItem[] {
    if (!node) return []

    const children = node.children
        .filter(child => {
            const { nodeKind } = child
            switch (nodeKind) {
                case FIELD_NODE_NAME: // ignore fields
                    return undefined
                case REGISTER_NODE_NAME: {
                    const reg = child as JDRegister
                    const { specification } = reg
                    const { client } = specification
                    if (client) return undefined
                    if (JDRegisterTreeItem.probablyIgnore(reg)) return undefined
                    break
                }
            }
            return child
        })
        .filter(child => !!child)
        .map(child => {
            const { nodeKind } = child
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
    return children
}

export class JDomTreeItem extends vscode.TreeItem {
    constructor(
        public readonly node: JDNode,
        private readonly _refresh: RefreshFunction,
        collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    ) {
        super(node.friendlyName, collapsibleState)
        const { id, nodeKind } = node
        this.id = id
        this.contextValue = nodeKind

        this.handleChange = this.handleChange.bind(this)
        this.mount()
        this.handleChange()
    }

    protected handleChange() {
        this.label = this.node.friendlyName
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

    getChildren(): Thenable<JDomTreeItem[]> {
        return Promise.resolve(
            createChildrenTreeItems(this.node, this._refresh)
        )
    }
}

export class JDeviceTreeItem extends JDomTreeItem {
    constructor(device: JDDevice, refresh: RefreshFunction) {
        super(device, refresh)
        this.device.resolveProductIdentifier()
    }

    static ICON = "circuit-board"
    iconPath = new vscode.ThemeIcon(JDeviceTreeItem.ICON)

    get device() {
        return this.node as JDDevice
    }

    protected handleChange() {
        const { device } = this
        const { bus, friendlyName } = device

        if (!bus) {
            this.unmount()
            return
        }

        this.label = friendlyName
        if (!this.description) {
            const services = device.services({ mixins: false })
            const serviceNames = ellipseJoin(
                services
                    .filter(srv => !isInfrastructure(srv.specification))
                    .map(service => service.name),
                18
            )
            this.description = serviceNames
        }
        if (!this.tooltip) {
            const control = device.service(SRV_CONTROL)
            const description = control?.register(ControlReg.DeviceDescription)
            this.tooltip = description?.stringValue
            description.on(CHANGE, this.refresh.bind(this))
            description.scheduleRefresh()
        }

        this.refresh()
    }
}

export function toMarkdownString(value: string, jacdacDocsPath?: string) {
    let text = value
    if (jacdacDocsPath)
        text += ` ([Documentation](https://microsoft.github.io/jacdac-docs/${jacdacDocsPath}))`
    const tooltip = new vscode.MarkdownString(text, true)
    tooltip.supportHtml = true
    return tooltip
}

export class JDServiceTreeItem extends JDomTreeItem {
    constructor(service: JDService, refresh: RefreshFunction) {
        super(service, refresh)
        const { specification } = service
        if (specification) {
            const { notes, shortId } = specification
            this.tooltip = toMarkdownString(
                notes["short"],
                `services/${shortId}/`
            )
        }
    }

    iconPath = new vscode.ThemeIcon("symbol-class")

    get service() {
        return this.node as JDService
    }

    getChildren(): Thenable<JDomTreeItem[]> {
        const nodeKindOrder: Record<string, number> = {
            [REGISTER_NODE_NAME]: 0,
            [EVENT_NODE_NAME]: 1,
            [FIELD_NODE_NAME]: 2,
        }
        const sort = (
            l: JDomServiceMemberTreeItem,
            r: JDomServiceMemberTreeItem
        ) => {
            let c =
                (isReading(l.member.specification) ? 0 : 1) -
                (isReading(r.member.specification) ? 0 : 1)
            if (c) return c
            c =
                (nodeKindOrder[l.node.nodeKind] ?? 50) -
                (nodeKindOrder[r.node.nodeKind] ?? 50)
            if (c) return c
            c = l.node.name.localeCompare(r.node.name)
            return c
        }

        return super
            .getChildren()
            .then(children =>
                (children as JDomServiceMemberTreeItem[]).sort(sort)
            )
    }

    protected handleChange() {
        const { service } = this
        const { specification, instanceName, serviceClass, role } = service

        this.label =
            instanceName ||
            humanify(dashify(specification?.shortName?.toLowerCase())) ||
            `0x${serviceClass.toString(16)}`
        this.description = role || ""
        this.refresh()
    }
}

export class JDomServiceMemberTreeItem extends JDomTreeItem {
    constructor(node: JDServiceMemberNode, refresh: RefreshFunction) {
        super(node, refresh, vscode.TreeItemCollapsibleState.None)
        const { specification } = node
        const { description } = specification || {}
        this.tooltip = toMarkdownString(
            description,
            `services/${node.service.specification.shortId}/`
        )
    }

    get member() {
        return this.node as JDServiceMemberNode
    }

    getChildren(): Thenable<JDomTreeItem[]> {
        return Promise.resolve([])
    }
}

export class JDRegisterTreeItem extends JDomServiceMemberTreeItem {
    constructor(register: JDRegister, refresh: RefreshFunction) {
        super(register, refresh)
        const { specification, code } = register
        const { kind } = specification || {}
        this.iconPath = new vscode.ThemeIcon(
            code === SystemReg.Reading
                ? "symbol-numeric"
                : kind === "const"
                ? "symbol-constant"
                : kind === "ro"
                ? "symbol-property"
                : "symbol-field"
        )
        this.handleChange = this.handleChange.bind(this)
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
            dashify(`${name || `0x${code.toString(16)}${optional ? "?" : ""}`}`)
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

export class JDEventTreeItem extends JDomServiceMemberTreeItem {
    constructor(event: JDEvent, refresh: RefreshFunction) {
        super(event, refresh)
    }

    iconPath = new vscode.ThemeIcon("symbol-event")

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
    private _showInfrastructure = false
    constructor(readonly bus: JDBus) {
        this.bus.on(DEVICE_CHANGE, () => {
            this.refresh()
        })
    }

    get showInfrastructure() {
        return this._showInfrastructure
    }

    set showInfrastructure(value: boolean) {
        if (value !== this._showInfrastructure) {
            this._showInfrastructure = value
            this.refresh()
        }
    }

    getTreeItem(element: JDomTreeItem): vscode.TreeItem {
        return element
    }

    getChildren(element?: JDomTreeItem): Thenable<JDomTreeItem[]> {
        if (!element) {
            const refresh = (i: JDomTreeItem) => this.refresh(i)
            const devices = this.bus.devices({
                ignoreInfrastructure: !this.showInfrastructure,
                announced: true,
            })
            return Promise.resolve(
                devices.map(
                    child => new JDeviceTreeItem(child as JDDevice, refresh)
                )
            )
        } else {
            return element.getChildren()
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
