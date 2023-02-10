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
} from "jacdac-ts"
import { DeviceScriptExtensionState, NodeWatch } from "./state"
import { deviceIconUri, toMarkdownString } from "./catalog"

export type AliveFunction = (item: JDomTreeItem) => boolean
export type RefreshFunction = (item: JDomTreeItem) => void

export interface TreeItemProps {
    isAlive: AliveFunction
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
                    const { client, kind } = specification
                    if (client) return undefined
                    if (!["rw", "const", "ro"].includes(kind)) return undefined
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
        this.update()
    }

    protected update(): boolean {
        return false
    }

    protected handleChange() {
        if (!this.props.isAlive(this)) {
            console.log(`dead ${this}`)
            this.unmount()
        }

        const updated = this.update()
        if (updated) this.refresh()
    }

    refresh() {
        this.props.refresh(this)
    }

    mount() {
        console.log(`mount ${this.id}`)
        this.node.on(CHANGE, this.handleChange)
    }

    unmount() {
        console.log(`unmount ${this.id}`)
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

    protected update(): boolean {
        const { service } = this
        const { role } = service

        const oldLabel = this.label
        const oldDescription = this.description

        this.label = this.props.fullName
            ? this.node.friendlyName
            : this.node.name
        this.description = role || ""

        return oldLabel !== this.label || oldDescription !== this.description
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
        this.contextValue = kind === "rw" ? "rw" : "register"
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

    mount(): void {
        console.log(`mount ${this.id}`)
        this.node.on(REPORT_UPDATE, this.handleChange)
    }

    unmount(): void {
        console.log(`unmount ${this.id}`)
        this.node.off(REPORT_UPDATE, this.handleChange)
    }

    get register() {
        return this.node as JDRegister
    }

    protected update(): boolean {
        console.log(`update ${this.id}`)
        const { register, props } = this
        const { fullName } = props
        const { humanValue, service, friendlyName, name } = register

        const oldLabel = this.label
        const oldDescription = this.description

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
    constructor(event: JDEvent, props: TreeItemProps) {
        super(event, props)
    }

    iconPath = new vscode.ThemeIcon("symbol-event")

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

    private readonly _items = new WeakSet<JDomTreeItem>()
    getTreeItem(element: JDomTreeItem): JDomTreeItem {
        this._items.add(element)
        return element
    }

    isAlive(element?: JDomTreeItem) {
        return element && this._items.has(element)
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
    constructor(
        extensionState: DeviceScriptExtensionState,
        command: vscode.Command
    ) {
        super(extensionState, command, "devs:")
        this.bus.on(DEVICE_CHANGE, () => {
            this.refresh()
        })
    }

    override getRoots() {
        const isAlive: AliveFunction = i => this.isAlive(i)
        const refresh: RefreshFunction = i => this.refresh(i)
        const props = {
            isAlive,
            refresh,
            idPrefix: this.idPrefix,
            command: this.command,
            state: this.state,
        }
        const devices = this.bus.devices({
            ignoreInfrastructure: true,
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
        const isAlive: AliveFunction = i => this.isAlive(i)
        const props = {
            isAlive,
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
                    new MissingNode(w.id, w.label, w.icon),
                    props
                )
        )
        return items
    }
}

export function activateTreeViews(extensionState: DeviceScriptExtensionState) {
    const { context, bus } = extensionState
    const { subscriptions } = context

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
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.node.copy",
            async (item: JDomTreeItem) => {
                if (!item) return
                const { node } = item
                const { nodeKind } = node
                switch (nodeKind) {
                    case REGISTER_NODE_NAME: {
                        const reg = node as JDRegister
                        const value = reg.humanValue
                        await vscode.env.clipboard.writeText(
                            `${reg.qualifiedName}: ${value}`
                        )
                        break
                    }
                }
            }
        )
    )
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.node.select",
            (item: JDomTreeItem) => {
                if (!item) return
                const { node } = item
                const { nodeKind } = node
                switch (nodeKind) {
                    case REGISTER_NODE_NAME: {
                        ;(node as JDRegister).scheduleRefresh()
                        break
                    }
                }
            }
        )
    )
    const selectNodeCommand: vscode.Command = {
        title: "select node",
        command: "extension.devicescript.node.select",
    }
    const jdomTreeDataProvider = new JDomDeviceTreeDataProvider(
        extensionState,
        selectNodeCommand
    )
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.jdom-explorer",
        jdomTreeDataProvider
    )
    const jdomWatchTreeDataProvider = new JDomWatchTreeDataProvider(
        extensionState,
        selectNodeCommand
    )
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.watch",
        jdomWatchTreeDataProvider
    )

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.register.edit",
            async (item: JDomRegisterTreeItem) => {
                if (!item) return

                const { register } = item
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
                            await register.sendSetBoolAsync(
                                res === "true",
                                true
                            )
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
                                if (isNaN(parseFloat(i)))
                                    return "invalid number format"
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
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.clear",
            async () => {
                await extensionState.updateWatches([])
                jdomWatchTreeDataProvider.refresh()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.add",
            async (item: JDomTreeItem) => {
                if (!item) return
                console.log(`Watch ${item.node}`)
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
                    jdomWatchTreeDataProvider.refresh()
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.watch.remove",
            async (item: JDomTreeItem) => {
                if (!item) return
                console.log(`Unwatch ${item.node}`)
                const id = item.node.id
                const { watches } = extensionState
                if (watches.find(w => w.id === id)) {
                    await extensionState.updateWatches(
                        watches.filter(w => w.id !== id)
                    )
                    item.refresh()
                    jdomWatchTreeDataProvider.refresh()
                }
            }
        )
    )
}
