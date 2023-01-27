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
    identifierToUrlPath,
    deviceCatalogImage,
} from "jacdac-ts"
import { ExtensionState } from "./state"
import { deviceIconUri, toMarkdownString } from "./catalog"

export type RefreshFunction = (item: JDomTreeItem) => void

export interface TreeItemProps {
    refresh: RefreshFunction
    command: vscode.Command
    idPrefix?: string
    fullName?: boolean
}

export function createTreeItem(
    child: JDNode,
    props: TreeItemProps
): JDomTreeItem {
    if (!child) return undefined
    const { nodeKind } = child
    const treeItemType =
        {
            [DEVICE_NODE_NAME]: JDeviceTreeItem,
            [SERVICE_NODE_NAME]: JDServiceTreeItem,
            [REGISTER_NODE_NAME]: JDRegisterTreeItem,
            [EVENT_NODE_NAME]: JDEventTreeItem,
        }[nodeKind] ?? JDomTreeItem
    const item = new treeItemType(child, props)
    return item
}

export function createTreeItemFromId(
    bus: JDBus,
    id: string,
    props: TreeItemProps
) {
    const node = bus.node(id)
    return createTreeItem(node, props)
}

export function createChildrenTreeItems(
    node: JDNode,
    props: TreeItemProps
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
        .map(child => createTreeItem(child, props))
    return children.filter(n => !!n)
}

export class JDomTreeItem extends vscode.TreeItem {
    constructor(
        public readonly node: JDNode,
        public readonly props: TreeItemProps,
        collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    ) {
        super(node.friendlyName, collapsibleState)
        const { id, nodeKind } = node
        const { idPrefix = "", command } = props
        this.id = idPrefix + id
        this.contextValue = nodeKind
        this.command = command

        this.handleChange = this.handleChange.bind(this)
        this.mount()
        this.handleChange()
    }

    protected handleChange() {
        this.label = this.props.fullName
            ? this.node.qualifiedName
            : this.node.friendlyName
        this.refresh()
    }

    refresh() {
        this.props.refresh(this)
    }

    protected mount() {
        this.node.on(CHANGE, this.handleChange)
    }

    unmount() {
        this.node.off(CHANGE, this.handleChange)
    }

    getChildren(): Thenable<JDomTreeItem[]> {
        return Promise.resolve(createChildrenTreeItems(this.node, this.props))
    }
}

export class JDeviceTreeItem extends JDomTreeItem {
    constructor(device: JDDevice, props: TreeItemProps) {
        super(device, props)
    }

    static ICON = "circuit-board"

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

        const productIdentifier = device.productIdentifier
        const spec =
            bus.deviceCatalog.specificationFromProductIdentifier(
                productIdentifier
            )
        if (spec) {
            this.iconPath = deviceIconUri(spec)
            this.tooltip = toMarkdownString(
                `#### ${spec.name} ${spec.version || ""} by ${spec.company}

![Device image](${deviceCatalogImage(spec, "list")}) 

${spec.description}`,
                `devices/${identifierToUrlPath(spec.id)}`
            )
        } else {
            const control = device.service(SRV_CONTROL)
            const description = control?.register(ControlReg.DeviceDescription)
            this.tooltip = description?.stringValue
            this.iconPath = new vscode.ThemeIcon(JDeviceTreeItem.ICON)
        }

        this.refresh()
    }
}

export class JDServiceTreeItem extends JDomTreeItem {
    constructor(service: JDService, props: TreeItemProps) {
        super(service, props)
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
    constructor(node: JDServiceMemberNode, props: TreeItemProps) {
        super(node, props, vscode.TreeItemCollapsibleState.None)
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
    constructor(register: JDRegister, props: TreeItemProps) {
        super(register, props)
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
        const { register, props } = this
        const { fullName } = props
        const { humanValue, service, qualifiedName, name } = register

        this.label = fullName ? qualifiedName : humanify(dashify(name))
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
    constructor(event: JDEvent, props: TreeItemProps) {
        super(event, props)
    }

    iconPath = new vscode.ThemeIcon("symbol-event")

    get event() {
        return this.node as JDEvent
    }

    protected handleChange() {
        const { event, props } = this
        const { fullName } = props
        const { count, qualifiedName, name } = event
        this.label = fullName ? qualifiedName : humanify(dashify(name))
        this.description = `#${count}`

        this.refresh()
    }
}

export abstract class JDomTreeDataProvider
    implements vscode.TreeDataProvider<JDomTreeItem>
{
    constructor(readonly bus: JDBus, readonly command: vscode.Command) {}

    getTreeItem(element: JDomTreeItem): vscode.TreeItem {
        return element
    }

    getChildren(element?: JDomTreeItem): Thenable<JDomTreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getRoots())
        } else {
            return element.getChildren()
        }
    }

    protected abstract getRoots(): JDomTreeItem[]

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

export class JDomDeviceTreeDataProvider extends JDomTreeDataProvider {
    private _showInfrastructure = false
    constructor(bus: JDBus, command: vscode.Command) {
        super(bus, command)
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

    override getRoots() {
        const refresh: RefreshFunction = i => this.refresh(i)
        const props = {
            refresh,
            idPrefix: "e:",
            command: this.command,
        }
        const devices = this.bus.devices({
            ignoreInfrastructure: !this.showInfrastructure,
            announced: true,
        })
        return devices.map(child => createTreeItem(child, props))
    }
}

export class JDomWatchTreeDataProvider extends JDomTreeDataProvider {
    constructor(
        bus: JDBus,
        command: vscode.Command,
        readonly state: ExtensionState
    ) {
        super(bus, command)
        this.state.on(CHANGE, this.refresh.bind(this))
    }

    override getRoots() {
        const refresh: RefreshFunction = i => this.refresh(i)
        const props = {
            refresh,
            fullName: true,
            idPrefix: "w:",
            command: this.command,
        }
        const nodeIds = this.state.watchKeys()
        const items = nodeIds
            .map(id => createTreeItemFromId(this.bus, id, props))
            .filter(n => !!n)
        return items
    }
}
