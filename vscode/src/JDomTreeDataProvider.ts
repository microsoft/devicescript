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
    isInfrastructure,
    isReading,
    identifierToUrlPath,
    deviceCatalogImage,
    capitalize,
} from "jacdac-ts"
import { DeviceScriptExtensionState } from "./state"
import { deviceIconUri, toMarkdownString } from "./catalog"

export type RefreshFunction = (item: JDomTreeItem) => void

export interface TreeItemProps {
    refresh: RefreshFunction
    command: vscode.Command
    state: DeviceScriptExtensionState
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
            [DEVICE_NODE_NAME]: JDomDeviceTreeItem,
            [SERVICE_NODE_NAME]: JDomServiceTreeItem,
            [REGISTER_NODE_NAME]: JDomRegisterTreeItem,
            [EVENT_NODE_NAME]: JDomEventTreeItem,
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
                    if (JDomRegisterTreeItem.probablyIgnore(reg))
                        return undefined
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
        super(props.fullName ? node.friendlyName : node.name, collapsibleState)
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

    resolveTreeItem(token: vscode.CancellationToken): Promise<vscode.TreeItem> {
        return Promise.resolve(this)
    }
}

export class JDomDeviceTreeItem extends JDomTreeItem {
    constructor(device: JDDevice, props: TreeItemProps) {
        super(device, props)

        if (device.deviceId === this.props.state.simulatorScriptManagerId)
            this.contextValue = "simulator"
    }

    static ICON = "circuit-board"

    get device() {
        return this.node as JDDevice
    }

    protected handleChange() {
        const { device, props } = this
        const { state } = props
        const { bus, friendlyName, deviceId } = device
        const { simulatorScriptManagerId } = state

        if (!bus) {
            this.unmount()
            return
        }

        this.label = friendlyName
        if (deviceId === simulatorScriptManagerId) this.label += " (simulator)"
        if (!this.description) {
            const services = device.services({ mixins: false })
            const serviceNames = services
                .filter(srv => !isInfrastructure(srv.specification))
                .map(service => service.name)
                .join(" ")
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
                `jacdac:devices/${identifierToUrlPath(spec.id)}`
            )
        } else {
            const control = device.service(SRV_CONTROL)
            const description = control?.register(ControlReg.DeviceDescription)
            this.tooltip = description?.stringValue
            this.iconPath = new vscode.ThemeIcon(JDomDeviceTreeItem.ICON)
        }

        this.refresh()
    }
}

export class JDomServiceTreeItem extends JDomTreeItem {
    constructor(service: JDService, props: TreeItemProps) {
        super(service, props)
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

    override async resolveTreeItem(
        token: vscode.CancellationToken
    ): Promise<vscode.TreeItem> {
        const { service } = this
        const { specification } = service

        if (!specification) this.tooltip = "Unknown service specification"
        else {
            const { notes, shortId, camelName, status } = specification
            const clname = capitalize(camelName)
            const reserved: Record<string, string> = { switch: "sw" }
            const varname = reserved[camelName] || camelName
            const snippet =
                status !== "deprecated" && !isInfrastructure(specification)
                    ? `
            
\`\`\`ts
const ${varname} = new ds.${clname}()
\`\`\`

`
                    : `This service is not directly programmable in DeviceScript/`
            this.tooltip = toMarkdownString(
                `${notes["short"]}
${snippet}
`,
                `devicescript:api/clients/${shortId}`
            )
        }
        return this
    }

    protected handleChange() {
        const { service } = this
        const { role } = service

        this.label = this.props.fullName
            ? this.node.friendlyName
            : this.node.name
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
            `devicescript:api/clients/${node.service.specification.shortId}/`
        )
    }

    get member() {
        return this.node as JDServiceMemberNode
    }

    getChildren(): Thenable<JDomTreeItem[]> {
        return Promise.resolve([])
    }
}

export class JDomRegisterTreeItem extends JDomServiceMemberTreeItem {
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
        const { humanValue, service, friendlyName, name } = register

        this.label = fullName ? friendlyName : humanify(dashify(name))
        this.description = humanValue
        this.refresh()

        if (JDomRegisterTreeItem.probablyIgnore(register)) {
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

export class JDomEventTreeItem extends JDomServiceMemberTreeItem {
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
        const { count, friendlyName, name } = event
        this.label = fullName ? friendlyName : humanify(dashify(name))
        this.description = `#${count}`

        this.refresh()
    }
}

class MissingNode extends JDNode {
    constructor(
        readonly _id: string,
        readonly label: string,
        readonly icon: string
    ) {
        super()
    }
    get id(): string {
        return this._id
    }
    get nodeKind(): string {
        return "missing"
    }
    get name(): string {
        return this.label
    }
    get qualifiedName(): string {
        return this.name
    }
    get parent(): JDNode {
        return null
    }
    get children(): JDNode[] {
        return []
    }
}

class JDMissingTreeItem extends JDomTreeItem {
    constructor(node: MissingNode, props: TreeItemProps) {
        super(node, props, vscode.TreeItemCollapsibleState.None)
        this.iconPath = new vscode.ThemeIcon(node.icon)
        this.description = "?"
    }
}

export abstract class JDomTreeDataProvider
    implements vscode.TreeDataProvider<JDomTreeItem>
{
    constructor(
        readonly state: DeviceScriptExtensionState,
        readonly command: vscode.Command,
        readonly idPrefix: string
    ) {}

    get bus() {
        return this.state.bus
    }

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

    resolveTreeItem(
        item: vscode.TreeItem,
        element: JDomTreeItem,
        token: vscode.CancellationToken
    ) {
        return element.resolveTreeItem(token)
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
    constructor(
        extensionState: DeviceScriptExtensionState,
        command: vscode.Command
    ) {
        super(extensionState, command, "devs:")
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
            idPrefix: this.idPrefix,
            command: this.command,
            state: this.state,
        }
        const devices = this.bus.devices({
            ignoreInfrastructure: !this.showInfrastructure,
            announced: true,
        })
        return devices.map(child => createTreeItem(child, props))
    }
}

export class JDomWatchTreeDataProvider extends JDomTreeDataProvider {
    constructor(state: DeviceScriptExtensionState, command: vscode.Command) {
        super(state, command, "watch:")
        this.state.on(CHANGE, this.refresh.bind(this))
    }

    override getRoots() {
        const refresh: RefreshFunction = i => this.refresh(i)
        const props = {
            refresh,
            fullName: true,
            idPrefix: this.idPrefix,
            command: this.command,
            state: this.state,
        }
        const watches = this.state.watches()
        const items = watches.map(
            w =>
                createTreeItemFromId(this.bus, w.id, props) ||
                new JDMissingTreeItem(
                    new MissingNode(w.id, w.label, w.icon),
                    props
                )
        )
        return items
    }
}
