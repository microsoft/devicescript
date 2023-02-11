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
    DOCS_ROOT,
    prettyUnit,
    JDEventSource,
    isValueOrIntensity,
    DISPOSE,
    SRV_CLOUD_CONFIGURATION,
    SRV_CLOUD_ADAPTER,
    CloudConfigurationReg,
    EventHandler,
    CloudConfigurationConnectionStatus,
} from "jacdac-ts"
import { DeviceScriptExtensionState, NodeWatch } from "./state"
import { deviceIconUri, toMarkdownString } from "./catalog"

export type RefreshFunction = (item: JDomTreeItem) => void

export interface TreeItemProps {
    refresh: RefreshFunction
    command: vscode.Command
    state: DeviceScriptExtensionState
    idPrefix?: string
    fullName?: boolean
    collapsibleState?: vscode.TreeItemCollapsibleState
    label?: string
    contextValue?: string
    description?: string
    iconPath?: string
}

export function createTreeItem(
    parent: JDomTreeItem,
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
    const item = new treeItemType(parent, child, { ...props })
    return item
}

export function createTreeItemFromId(
    bus: JDBus,
    id: string,
    props: TreeItemProps
) {
    const node = bus.node(id)
    return createTreeItem(undefined, node, props)
}

export class JDomTreeItem extends vscode.TreeItem {
    private children: JDomTreeItem[]
    private unsubs: (() => void)[]
    constructor(
        public readonly parent: JDomTreeItem,
        public readonly node: JDNode,
        public readonly props: TreeItemProps
    ) {
        super(
            props.label ?? (props.fullName ? node.friendlyName : node.name),
            props.collapsibleState ?? vscode.TreeItemCollapsibleState.Collapsed
        )
        const { id, nodeKind } = node
        const {
            idPrefix = "",
            command,
            contextValue,
            description,
            iconPath,
        } = props
        this.id = idPrefix + id
        this.contextValue = contextValue ?? nodeKind
        this.command = command ? { ...command, arguments: [this] } : undefined
        this.description = description
        this.iconPath = iconPath ?? new vscode.ThemeIcon(iconPath)

        this.handleChange = this.handleChange.bind(this)
        this.handleParentUnmount = this.handleParentUnmount.bind(this)
        this.mount()
        this.handleChange()
    }

    protected update(): boolean {
        return false
    }

    private handleParentUnmount() {
        this.unmount()
    }

    protected handleChange() {
        const updated = this.update()
        if (updated) this.refresh()
    }

    selected(): void {}

    refresh() {
        this.props.refresh(this)
    }
    copy() {}

    edit() {}

    mountChildren() {
        this.children?.forEach(c => c.mount())
    }

    unmountChildren() {
        this.children?.forEach(c => c.unmount())
    }

    protected subscribe(
        node: JDNode,
        eventName: string | string[],
        handler: EventHandler
    ) {
        const unsub = node.subscribe(eventName, handler)
        if (!this.unsubs) this.unsubs = []
        this.unsubs.push(unsub)
    }

    mount() {
        this.subscribe(this.node, CHANGE, this.handleChange)
        this.handleChange()
        this.mountChildren()
    }

    unmount() {
        this.unsubs?.forEach(unsub => unsub())
        this.unsubs = undefined
        this.unmountChildren()
    }

    protected createChildrenTreeItems(): JDomTreeItem[] {
        const { node, parent, props } = this
        const children = node.children
            .filter(child => {
                const { nodeKind } = child
                switch (nodeKind) {
                    case FIELD_NODE_NAME: // ignore fields
                        return undefined
                    case REGISTER_NODE_NAME: {
                        const reg = child as JDRegister
                        const { specification } = reg
                        const { client, kind } = specification
                        if (client) return undefined
                        if (!["rw", "const", "ro"].includes(kind))
                            return undefined
                        if (JDomRegisterTreeItem.probablyIgnore(reg))
                            return undefined
                        break
                    }
                }
                return child
            })
            .filter(child => !!child)
            .map(child => createTreeItem(parent, child, props))
        return children.filter(n => !!n)
    }

    getChildren(): Thenable<JDomTreeItem[]> {
        this.children?.forEach(child => child.unmount())
        this.children = this.createChildrenTreeItems()
        return Promise.resolve(this.children)
    }

    resolveTreeItem(token: vscode.CancellationToken): Promise<vscode.TreeItem> {
        return Promise.resolve(this)
    }
}

export class JDomDeviceTreeItem extends JDomTreeItem {
    constructor(parent: JDomTreeItem, device: JDDevice, props: TreeItemProps) {
        super(parent, device, props)

        if (device.deviceId === this.props.state.simulatorScriptManagerId)
            this.contextValue = "simulator"
    }

    static ICON = "circuit-board"

    get device() {
        return this.node as JDDevice
    }

    protected update(): boolean {
        const { device, props } = this
        const { state } = props
        const { bus, friendlyName, deviceId } = device
        const { simulatorScriptManagerId } = state

        if (!bus) {
            this.unmount()
            return false
        }

        const oldLabel = this.label
        const oldDescription = this.description
        const oldIconPath = this.iconPath

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

        if (!this.iconPath) {
            const productIdentifier = device.productIdentifier
            const spec =
                bus.deviceCatalog.specificationFromProductIdentifier(
                    productIdentifier
                )
            if (spec) {
                this.iconPath = deviceIconUri(spec)
            } else {
                this.iconPath = new vscode.ThemeIcon(JDomDeviceTreeItem.ICON)
            }
        }

        return (
            oldLabel !== this.label ||
            oldDescription !== this.description ||
            oldIconPath !== this.iconPath
        )
    }

    resolveTreeItem(token: vscode.CancellationToken): Promise<vscode.TreeItem> {
        if (!this.tooltip) {
            const { device } = this
            const { bus } = device
            if (bus) {
                const productIdentifier = device.productIdentifier
                const spec =
                    bus.deviceCatalog.specificationFromProductIdentifier(
                        productIdentifier
                    )
                if (spec) {
                    this.tooltip = toMarkdownString(
                        `#### ${spec.name} ${spec.version || ""} by ${
                            spec.company
                        }

![Device image](${deviceCatalogImage(spec, "list")}) 

${spec.description}`,
                        `jacdac:devices/${identifierToUrlPath(spec.id)}`
                    )
                } else {
                    const control = device.service(SRV_CONTROL)
                    const description = control?.register(
                        ControlReg.DeviceDescription
                    )
                    this.tooltip = description?.stringValue
                }
            }
        }
        return Promise.resolve(this)
    }

    protected override createChildrenTreeItems(): JDomTreeItem[] {
        const { device } = this

        // interresting registers
        const registers = device
            .services({ specification: true })
            .filter(({ specification }) => !isInfrastructure(specification))
            .map(srv =>
                srv
                    .registers()
                    .filter(
                        reg =>
                            isReading(reg.specification) ||
                            isValueOrIntensity(reg.specification)
                    )
            )
            .flat(2)
            .filter(r => !!r)
            .map(
                reg =>
                    new JDomRegisterTreeItem(this, reg, {
                        ...this.props,
                        idPrefix: this.props.idPrefix + "readings:",
                        label: humanify(`${reg.service.name} ${reg.name}`),
                    })
            )

        // cloud
        const cloudAdapter = device.hasService(SRV_CLOUD_ADAPTER)
            ? new JDomCloudTreeItem(this, this.props)
            : undefined

        return [
            ...registers,
            cloudAdapter,
            new JDomServicesTreeItem(this),
        ].filter(e => !!e)
    }
}

export class JDomServicesTreeItem extends JDomTreeItem {
    constructor(parent: JDomDeviceTreeItem) {
        super(parent, parent.device, parent.props)
        this.contextValue = "services"
        this.label = "services"
        this.description = undefined
        this.id = this.parent.id + ":services"
        this.iconPath = new vscode.ThemeIcon(JDomServiceTreeItem.ICON)
    }

    get device() {
        return this.node as JDDevice
    }

    protected update(): boolean {
        return false
    }
}

export class JDomServiceTreeItem extends JDomTreeItem {
    constructor(
        parent: JDomTreeItem,
        service: JDService,
        props: TreeItemProps
    ) {
        super(parent, service, props)
    }

    static ICON = "symbol-class"
    iconPath = new vscode.ThemeIcon(JDomServiceTreeItem.ICON)

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

    protected update(): boolean {
        const { service } = this
        const { role, specification } = service

        const oldLabel = this.label
        const oldDescription = this.description

        this.label = this.props.fullName
            ? this.node.friendlyName
            : specification?.name?.toLocaleLowerCase() ?? this.node.name
        this.description = role || ""

        return oldLabel !== this.label || oldDescription !== this.description
    }
}

export class JDomServiceMemberTreeItem extends JDomTreeItem {
    constructor(
        parent: JDomTreeItem,
        node: JDServiceMemberNode,
        props: TreeItemProps
    ) {
        super(parent, node, {
            ...props,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
        })
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
    constructor(
        parent: JDomTreeItem,
        register: JDRegister,
        props: TreeItemProps
    ) {
        super(parent, register, props)
        const { specification, code } = register
        const { kind } = specification || {}
        this.contextValue = props.contextValue || `register:${kind}`
        this.iconPath = new vscode.ThemeIcon(
            code === SystemReg.Reading
                ? "symbol-numeric"
                : kind === "const"
                ? "symbol-constant"
                : kind === "ro"
                ? "symbol-property"
                : "symbol-field"
        )
    }

    override async edit() {
        const { register } = this
        const { specification } = register

        if (!specification) {
            vscode.window.showWarningMessage(
                `DeviceScript: no specification found for register.`
            )
            return
        }

        const { kind, fields, description } = specification
        if (kind !== "rw") {
            vscode.window.showWarningMessage(
                "DeviceScript: register cannot be modified."
            )
            return
        }

        await register.refresh()
        const { name, unpackedValue } = register
        const title = `Edit register ${name}`
        if (fields?.length === 1) {
            const field = fields[0]
            const { type, unit, isFloat } = field
            const prompt = `${description} ${
                unit ? `(${prettyUnit(unit)})` : ""
            }`
            const value = unpackedValue?.[0]

            // strings
            if (type === "string" || type === "string0") {
                const v = value as string
                const res = await vscode.window.showInputBox({
                    title,
                    prompt,
                    value: v || "",
                })
                if (res !== undefined && v !== res) {
                    await register.sendSetStringAsync(res, true)
                }
                return
            }
            // boolean
            else if (type === "bool") {
                const v = value ? "yes" : "no"
                const res = await vscode.window.showQuickPick(
                    ["true", "false"],
                    <vscode.QuickPickOptions>{
                        title,
                    }
                )
                if (res !== undefined && v !== res) {
                    await register.sendSetBoolAsync(res === "true", true)
                }
                return
            }
            // float
            else if (isFloat) {
                const v = (value as number)?.toLocaleString()
                // TODO: min, max
                const res = await vscode.window.showInputBox({
                    title,
                    prompt,
                    value: v || "0",
                    validateInput: i => {
                        if (isNaN(parseFloat(i))) return "invalid number format"
                        return undefined
                    },
                })
                if (res !== undefined && v !== res) {
                    const newValue = parseFloat(res)
                    await register.sendSetPackedAsync([newValue], true)
                }
                return
            }
            // int, uint
            else if (field.unit) {
                const v = (value as number)?.toLocaleString()
                // TODO: min, max
                const res = await vscode.window.showInputBox({
                    title,
                    prompt,
                    value: v || "0",
                    validateInput: i => {
                        if (isNaN(parseInt(i)))
                            return `invalid ${field.type} number format`
                        return undefined
                    },
                })
                if (res !== undefined && v !== res) {
                    const newValue = parseInt(res)
                    await register.sendSetPackedAsync([newValue], true)
                }
                return
            }
        }

        vscode.window.showWarningMessage(
            "DeviceScript: Sorry, this register cannot be edited by the extension."
        )
    }

    override async copy() {
        const { register } = this
        const { humanValue, qualifiedName } = register
        await vscode.env.clipboard.writeText(`${qualifiedName}: ${humanValue}`)
    }

    override async selected() {
        await this.register.refresh()
    }

    mount(): void {
        this.subscribe(this.node, REPORT_UPDATE, this.handleChange)
    }

    get register() {
        return this.node as JDRegister
    }

    protected update(): boolean {
        const { register, props } = this
        const { fullName } = props
        const { humanValue, service, friendlyName, name } = register

        const oldLabel = this.label
        const oldDescription = this.description

        if (!this.props.label)
            this.label = fullName ? friendlyName : humanify(dashify(name))
        this.description = humanValue

        if (JDomRegisterTreeItem.probablyIgnore(register)) {
            this.unmount()
            service.emit(CHANGE)
        }

        return oldLabel !== this.label || oldDescription !== this.description
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
    constructor(parent: JDomTreeItem, event: JDEvent, props: TreeItemProps) {
        super(parent, event, props)
    }

    static ICON = "symbol-event"
    iconPath = new vscode.ThemeIcon(JDomEventTreeItem.ICON)

    get event() {
        return this.node as JDEvent
    }

    protected update(): boolean {
        const { event, props } = this
        const { fullName } = props
        const { count, friendlyName, name } = event

        const oldLabel = this.label
        const oldDescription = this.description

        this.label = fullName ? friendlyName : humanify(dashify(name))
        this.description = `#${count}`

        return oldLabel !== this.label || oldDescription !== this.description
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
    constructor(parent: JDomTreeItem, node: MissingNode, props: TreeItemProps) {
        super(parent, node, {
            ...props,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
        })
        this.iconPath = new vscode.ThemeIcon(node.icon)
        this.description = "?"
    }
}

export abstract class JDomTreeDataProvider
    extends JDEventSource
    implements vscode.TreeDataProvider<JDomTreeItem>
{
    private roots: JDomTreeItem[]

    constructor(
        readonly state: DeviceScriptExtensionState,
        readonly command: vscode.Command,
        readonly idPrefix: string
    ) {
        super()
    }

    get bus() {
        return this.state.bus
    }

    dispose() {
        this.unmount()
        this.emit(DISPOSE)
    }

    mount() {
        this.roots.forEach(r => r.mount())
    }

    unmount() {
        this.roots.forEach(r => r.unmount())
    }

    getTreeItem(element: JDomTreeItem): JDomTreeItem {
        return element
    }

    getChildren(element?: JDomTreeItem): Thenable<JDomTreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getRoots())
        } else {
            return element.getChildren()
        }
    }

    getParent?(element: JDomTreeItem): vscode.ProviderResult<JDomTreeItem> {
        return element?.parent
    }

    resolveTreeItem(
        item: vscode.TreeItem,
        element: JDomTreeItem,
        token: vscode.CancellationToken
    ) {
        return element.resolveTreeItem(token)
    }

    protected getRoots(): JDomTreeItem[] {
        this.roots?.forEach(root => root.unmount())
        this.roots = this.createRoots()
        return this.roots
    }

    protected abstract createRoots(): JDomTreeItem[]

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

export class JDomCloudTreeItem extends JDomTreeItem {
    constructor(parent: JDomDeviceTreeItem, props: TreeItemProps) {
        super(parent, parent.device, {
            ...props,
            contextValue: "cloud",
            idPrefix: props.idPrefix + "cloud:",
        })
        this.label = "cloud"
        this.iconPath = new vscode.ThemeIcon("cloud")
    }

    protected createChildrenTreeItems(): JDomTreeItem[] {
        const device = this.node as JDDevice
        const props = this.props
        const configurations = device
            .services({ serviceClass: SRV_CLOUD_CONFIGURATION })
            .map(srv => new JDomCloudConfigurationTreeItem(this, srv, props))

        return [...configurations]
    }
}

export class JDomCloudConfigurationTreeItem extends JDomTreeItem {
    constructor(
        parent: JDomTreeItem,
        service: JDService,
        props: TreeItemProps
    ) {
        super(parent, service, {
            ...props,
            contextValue: props.idPrefix + "configuration:",
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: "settings-gear",
        })
    }

    get service() {
        return this.node as JDService
    }

    mount() {
        const { service } = this
        this.subscribe(service, REPORT_UPDATE, this.handleChange)
    }

    update() {
        const { service } = this
        const oldLabel = this.label
        const oldDescription = this.description

        const cloudType = service.register(
            CloudConfigurationReg.CloudType
        ).stringValue
        const connectionState = service.register(
            CloudConfigurationReg.ConnectionStatus
        ).uintValue
        const serverName = service.register(
            CloudConfigurationReg.ServerName
        ).stringValue

        this.label = cloudType || "cloud"
        this.description = serverName
            ? serverName
            : !isNaN(connectionState)
            ? CloudConfigurationConnectionStatus[connectionState] ||
              connectionState.toString()
            : "..."

        return oldLabel !== this.label || oldDescription !== this.description
    }
}

export class JDomDeviceTreeDataProvider extends JDomTreeDataProvider {
    constructor(
        extensionState: DeviceScriptExtensionState,
        command: vscode.Command
    ) {
        super(extensionState, command, "devs:")
        const unsub = this.bus.subscribe(DEVICE_CHANGE, () => {
            this.refresh()
        })
        this.on(DISPOSE, () => {
            unsub()
        })
    }

    get devices() {
        const { bus } = this
        const devices = bus.devices({
            ignoreInfrastructure: true,
            announced: true,
        })
        return devices
    }

    override createRoots() {
        const { devices } = this
        const refresh: RefreshFunction = i => this.refresh(i)
        const props = {
            refresh,
            idPrefix: this.idPrefix,
            command: this.command,
            state: this.state,
        }
        return devices.map(child => createTreeItem(undefined, child, props))
    }
}

export class JDomWatchTreeDataProvider extends JDomTreeDataProvider {
    constructor(state: DeviceScriptExtensionState, command: vscode.Command) {
        super(state, command, "watch:")
        const unsub = this.state.subscribe(CHANGE, this.refresh.bind(this))
        this.on(DISPOSE, unsub)
    }

    override createRoots() {
        const refresh: RefreshFunction = i => this.refresh(i)
        const props = {
            refresh,
            fullName: true,
            idPrefix: this.idPrefix,
            command: this.command,
            state: this.state,
        }
        const { watches } = this.state
        const items = watches.map(
            w =>
                createTreeItemFromId(this.bus, w.id, props) ||
                new JDMissingTreeItem(
                    undefined,
                    new MissingNode(w.id, w.label, w.icon),
                    props
                )
        )
        return items
    }
}

function activateTreeView(
    extensionState: DeviceScriptExtensionState,
    viewId: string,
    treeDataProvider: JDomTreeDataProvider
) {
    const { context, bus } = extensionState
    const { subscriptions } = context
    const view = vscode.window.createTreeView(viewId, { treeDataProvider })
    subscriptions.push(view)
    view.onDidChangeVisibility(
        ({ visible }) => {
            if (visible) treeDataProvider.mount()
            else treeDataProvider.unmount()
        },
        undefined,
        subscriptions
    )
    view.onDidExpandElement(
        ({ element }) => element.mountChildren(),
        undefined,
        subscriptions
    )
    view.onDidCollapseElement(
        ({ element }) => element.unmountChildren(),
        undefined,
        subscriptions
    )
    return view
}

function activateWatchTreeView(extensionState: DeviceScriptExtensionState) {
    const { context, bus } = extensionState
    const { subscriptions } = context
    const treeDataProvider = new JDomWatchTreeDataProvider(extensionState, {
        title: "select node",
        command: "extension.devicescript.node.select",
    })
    subscriptions.push(treeDataProvider)
    activateTreeView(
        extensionState,
        "extension.devicescript.watch",
        treeDataProvider
    )
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.watch.clear",
            async () => {
                await extensionState.updateWatches([])
                treeDataProvider.refresh()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.add",
            async (item: JDomTreeItem) => {
                if (!item) return
                const id = item.node.id
                const { watches } = extensionState
                if (!watches.find(w => w.id === id)) {
                    const label = item.node.friendlyName
                    const icon = (item.iconPath as vscode.ThemeIcon)?.id
                    await extensionState.updateWatches([
                        ...watches,
                        <NodeWatch>{ id, label, icon },
                    ])
                    item.refresh()
                    treeDataProvider.refresh()
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.remove",
            async (item: JDomTreeItem) => {
                if (!item) return
                const id = item.node.id
                const { watches } = extensionState
                if (watches.find(w => w.id === id)) {
                    await extensionState.updateWatches(
                        watches.filter(w => w.id !== id)
                    )
                    item.refresh()
                    treeDataProvider.refresh()
                }
            }
        )
    )
}

function activateNodeCommands(extensionState: DeviceScriptExtensionState) {
    const { context, bus } = extensionState
    const { subscriptions } = context

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.node.copy",
            (item: JDomTreeItem) => item?.copy()
        )
    )
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.node.select",
            (item: JDomTreeItem) => item?.selected()
        )
    )
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.register.edit",
            (item: JDomTreeItem) => item?.edit()
        )
    )
}

function activateDevicesTreeView(extensionState: DeviceScriptExtensionState) {
    const { context, bus } = extensionState
    const { subscriptions } = context
    const treeDataProvider = new JDomDeviceTreeDataProvider(extensionState, {
        title: "select node",
        command: "extension.devicescript.node.select",
    })
    subscriptions.push(treeDataProvider)
    const explorer = activateTreeView(
        extensionState,
        "extension.devicescript.jdom-explorer",
        treeDataProvider
    )
    const updateBadge = () => {
        const devices = treeDataProvider.devices
        explorer.badge = {
            tooltip: `DeviceScript: ${devices.length} devices`,
            value: devices.length,
        }
    }
    // subscriptions.push({
    //     dispose: bus.subscribe(DEVICE_CHANGE, updateBadge),
    // })
    // updateBadge()

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.device.showFirmwareInformation",
            (device: JDDevice) => {
                if (!device) return
                const spec =
                    bus.deviceCatalog.specificationFromProductIdentifier(
                        device.productIdentifier
                    )
                if (spec) {
                    const uri = `${DOCS_ROOT}${`devices/${identifierToUrlPath(
                        spec.id
                    )}`}`
                    vscode.env.openExternal(vscode.Uri.parse(uri))
                }
            }
        )
    )
}

export function activateTreeViews(extensionState: DeviceScriptExtensionState) {
    activateNodeCommands(extensionState)
    activateDevicesTreeView(extensionState)
    activateWatchTreeView(extensionState)
}
