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
    CloudConfigurationCmd,
    isAckError,
    CloudConfigurationEvent,
    EVENT,
    CloudAdapterReg,
    SRV_WIFI,
    WifiReg,
    WifiCmd,
    toHex,
    WifiAPFlags,
    unique,
    WifiEvent,
    WifiPipePack,
} from "jacdac-ts"
import { DeviceScriptExtensionState, NodeWatch } from "./state"
import { deviceIconUri, toMarkdownString } from "./catalog"
import { withProgress } from "./commands"
import { ICON_LOADING } from "./constants"

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
        this.iconPath = iconPath ? new vscode.ThemeIcon(iconPath) : undefined

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

    get loading() {
        return (this.iconPath as vscode.ThemeIcon).id === ICON_LOADING
    }
    private _restoreIconPath: () => void
    set loading(value: boolean) {
        if (this.loading === value) return

        if (value) {
            if (!this.loading) {
                const ip = this.iconPath
                this._restoreIconPath = () => (this.iconPath = ip)
            }
            this.iconPath = new vscode.ThemeIcon(ICON_LOADING)
        } else {
            this.iconPath = undefined
            this._restoreIconPath?.()
            this._restoreIconPath = undefined
        }
        this.handleChange()
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
        super(parent, device, { ...props, iconPath: JDomDeviceTreeItem.ICON })

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
        const { device, props } = this

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
                        idPrefix: this.props.idPrefix + "readings_",
                        label: humanify(`${reg.service.name} ${reg.name}`),
                    })
            )

        const wifis = device.services({ serviceClass: SRV_WIFI })
        const cloudAdapters = device.services({
            serviceClass: SRV_CLOUD_ADAPTER,
        })

        return <JDomTreeItem[]>(
            [
                ...registers,
                ...wifis.map(srv => new JDomWifiTreeItem(this, srv, props)),
                ...cloudAdapters.map(
                    srv => new JDomCloudAdapterTreeItem(this, srv, props)
                ),
                new JDomServicesTreeItem(this),
            ].filter(e => !!e)
        )
    }
}

class JDomServicesTreeItem extends JDomTreeItem {
    constructor(parent: JDomDeviceTreeItem) {
        super(parent, parent.device, {
            ...parent.props,
            iconPath: JDomServiceTreeItem.ICON,
        })
        this.contextValue = "services"
        this.label = "services"
        this.description = undefined
        this.id = this.parent.id + ":services"
    }

    get device() {
        return this.node as JDDevice
    }

    protected update(): boolean {
        return false
    }
}

class JDomServiceTreeItem extends JDomTreeItem {
    constructor(
        parent: JDomTreeItem,
        service: JDService,
        props: TreeItemProps
    ) {
        super(parent, service, { ...props, iconPath: JDomServiceTreeItem.ICON })
    }

    static ICON = "symbol-class"

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

class JDomServiceMemberTreeItem extends JDomTreeItem {
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

class JDomRegisterTreeItem extends JDomServiceMemberTreeItem {
    constructor(
        parent: JDomTreeItem,
        register: JDRegister,
        props: TreeItemProps
    ) {
        super(parent, register, props)
        const { specification, code } = register
        const { kind } = specification || {}
        this.contextValue = props.contextValue || `register_${kind}`
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

class JDomEventTreeItem extends JDomServiceMemberTreeItem {
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

// flags, reserved, rssi, channel, bssid, ssid
type ScanResult = [WifiAPFlags, number, number, number, Uint8Array, string]

// priority, flags, ssid
type NetworkResult = [number, number, string]

function toMAC(buffer: Uint8Array) {
    const hex = toHex(buffer, ":")
    return hex
}

function toIP(buffer: Uint8Array): string {
    if (!buffer) return undefined
    if (buffer.length === 4)
        return `${buffer[0]}.${buffer[1]}.${buffer[2]}.${buffer[3]}`
    else return toHex(buffer, ".")
}

class JDomWifiTreeItem extends JDomTreeItem {
    private scans: ScanResult[] = []
    private infos: NetworkResult[] = []

    constructor(
        parent: JDomDeviceTreeItem,
        service: JDService,
        props: TreeItemProps
    ) {
        super(parent, service, {
            ...props,
            idPrefix: props.idPrefix + "wifi_",
            contextValue: props.idPrefix + "wifi",
            iconPath: "radio-tower",
        })

        this.handleScanComplete()
        this.handleNetworkdCanged()
    }

    mount() {
        super.mount()

        const { service } = this
        this.subscribe(
            service.event(WifiEvent.ScanComplete),
            EVENT,
            this.handleScanComplete.bind(this)
        )
        this.subscribe(
            service.event(WifiEvent.NetworksChanged),
            EVENT,
            this.handleNetworkdCanged.bind(this)
        )
        this.subscribe(service.event(WifiEvent.GotIp), EVENT, this.handleChange)
        this.subscribe(
            service.event(WifiEvent.LostIp),
            EVENT,
            this.handleChange
        )
        this.subscribe(
            service.event(WifiEvent.ConnectionFailed),
            EVENT,
            this.handleChange
        )
        ;[WifiReg.Enabled, WifiReg.IpAddress, WifiReg.Ssid, WifiReg.Eui48]
            .map(code => service.register(code))
            .forEach(register =>
                this.subscribe(register, REPORT_UPDATE, this.handleChange)
            )

        super.mount()
    }

    get service() {
        return this.node as JDService
    }

    private async handleScanComplete() {
        const { service } = this
        const scans = await service.receiveWithInPipe<ScanResult>(
            WifiCmd.LastScanResults,
            WifiPipePack.Results,
            30000
        )
        this.scans = scans || []
        this.handleChange()
    }

    private async handleNetworkdCanged() {
        const { service } = this
        const infos = await service.receiveWithInPipe<NetworkResult>(
            WifiCmd.ListKnownNetworks,
            WifiPipePack.NetworkResults,
            30000
        )
        this.infos = infos || []
        this.handleChange()
    }

    async scan() {
        const { service } = this
        await service.sendCmdAsync(WifiCmd.Scan, undefined, true)
    }

    async reconnect() {
        const { service } = this
        await service.sendCmdAsync(WifiCmd.Reconnect, undefined, true)
    }

    update() {
        const oldLabel = this.label
        const oldDescription = this.description

        const { service } = this

        const ssid = service.register(WifiReg.Ssid).stringValue
        const ip = service.register(WifiReg.IpAddress).data

        this.label = ssid || "not connected"
        this.description = toIP(ip)

        return oldLabel !== this.label || oldDescription !== this.description
    }

    async resolveTreeItem(
        token: vscode.CancellationToken
    ): Promise<vscode.TreeItem> {
        const { service } = this
        const ssid = service.register(WifiReg.Ssid).stringValue
        const rssi = service.register(WifiReg.Rssi).unpackedValue?.[0]
        const ip = service.register(WifiReg.IpAddress).data
        const mac = service.register(WifiReg.Eui48).data
        this.tooltip = toMarkdownString(
            `
### ${ssid}

- rssi: ${rssi || ""}bB
- ip  : ${toIP(ip) || ""}
- mac : ${toMAC(mac) || ""}
`
        )
        return this
    }

    protected createChildrenTreeItems(): JDomTreeItem[] {
        const { scans, infos, service, props } = this

        const priority = (s: string) =>
            infos.find(n => n[2] === s)?.[0] || -Infinity

        const ssids = unique([
            ...(infos || []).map(kn => kn[2]),
            ...(scans || []).map(ap => ap[5]),
        ]).sort((l, r) => -priority(l) + priority(r))

        return ssids.map(
            ssid =>
                new JDomWifiAPTreeItem(this, service, {
                    ...props,
                    info: infos.find(i => i[2] === ssid),
                    scan: scans.find(s => s[5] === ssid),
                })
        )
    }
}

class JDomWifiAPTreeItem extends JDomTreeItem {
    readonly scan: ScanResult
    readonly info: NetworkResult
    constructor(
        parent: JDomWifiTreeItem,
        service: JDService,
        props: TreeItemProps & { scan?: ScanResult; info?: NetworkResult }
    ) {
        super(parent, service, {
            ...props,
            idPrefix: props.idPrefix + "ap_",
            contextValue: props.idPrefix + "ap",
            collapsibleState: vscode.TreeItemCollapsibleState.None,
        })
        this.scan = props.scan
        this.info = props.info
        this.id = this.props.idPrefix + this.ssid
        this.contextValue += this.known ? "_known" : "_unknown"
    }

    get service() {
        return this.node as JDService
    }

    get ssid() {
        return this.scan?.[5] || this.info?.[2]
    }

    get priority() {
        return this.info?.[0] || -1
    }

    get known() {
        return !!this.info
    }

    async add() {
        const { service, ssid } = this
        const res = await vscode.window.showInputBox({
            title: `Enter password for ${ssid}`,
            password: true,
        })
        if (res === undefined) return
        await service.sendCmdPackedAsync(WifiCmd.AddNetwork, [ssid, res])
    }

    async forget() {
        const { service, ssid } = this
        await service.sendCmdPackedAsync(WifiCmd.ForgetNetwork, [ssid])
    }

    update() {
        const { scan, info, known } = this
        const [priority, networkFlags, infoSsid] = info || []
        const [scanFlags, , rssi, channel, , scanSsid] = scan || []
        const ssid = infoSsid || scanSsid
        const scanned = !!scan

        this.label = ssid
        this.description = `${known ? "known, " : ""}${
            rssi ? `${rssi}dB` : "not found"
        }`

        this.tooltip = toMarkdownString(
            `
### ${ssid}

-  ${known ? "known" : "unknown"}
-  ${scanned ? "scanned" : "not found"}
-  priority: ${priority || ""}
-  network flags: ${networkFlags ?? ""}
-  channel: ${channel || ""}
-  scan flags: ${scanFlags || ""}
`
        )

        return true
    }
}

class JDomCloudAdapterTreeItem extends JDomTreeItem {
    constructor(
        parent: JDomDeviceTreeItem,
        service: JDService,
        props: TreeItemProps
    ) {
        super(parent, service, {
            ...props,
            contextValue: props.idPrefix + "cloud",
            idPrefix: props.idPrefix + "cloud_",
            iconPath: "cloud",
        })
    }

    mount(): void {
        super.mount()
        const { service } = this
        ;[CloudAdapterReg.Connected, CloudAdapterReg.ConnectionName]
            .map(code => service.register(code))
            .forEach(register =>
                this.subscribe(register, REPORT_UPDATE, this.handleChange)
            )
    }

    update() {
        const { service } = this
        const oldlabel = this.label
        const oldDescription = this.description

        const connected = service.register(CloudAdapterReg.Connected).boolValue
        const connectionName = service.register(
            CloudAdapterReg.ConnectionName
        ).stringValue

        this.label = connected ? "connected" : "disconnected"
        this.description = connectionName || "cloud adapter"

        return oldlabel !== this.label || oldDescription !== this.description
    }

    get service() {
        return this.node as JDService
    }

    get device() {
        return this.service.device
    }

    protected createChildrenTreeItems(): JDomTreeItem[] {
        const { device } = this
        const props = this.props
        const configurations = device
            .services({ serviceClass: SRV_CLOUD_CONFIGURATION })
            .map(srv => new JDomCloudConfigurationTreeItem(this, srv, props))
        return [...configurations]
    }
}

class JDomCloudConfigurationTreeItem extends JDomTreeItem {
    constructor(
        parent: JDomTreeItem,
        service: JDService,
        props: TreeItemProps
    ) {
        super(parent, service, {
            ...props,
            idPrefix: props.idPrefix + "configuration_",
            contextValue: props.idPrefix + "configuration",
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: "settings-gear",
        })
    }

    get service() {
        return this.node as JDService
    }

    async connect() {
        const { service } = this
        withProgress("Connecting...", async () => {
            await service.sendCmdAsync(
                CloudConfigurationCmd.Connect,
                undefined,
                true
            )
        })
    }

    async configure() {
        const res = await vscode.window.showInputBox({
            title: "Enter connection string",
            prompt: "Refer to the cloud configuration documentation to generate the authentication token or connection string.",
            password: true,
        })
        if (res !== undefined) {
            const { service } = this
            try {
                await service.sendCmdPackedAsync(
                    CloudConfigurationCmd.SetConnectionString,
                    [res],
                    true
                )
                this.refresh()
            } catch (e) {
                if (isAckError(e))
                    vscode.window.showErrorMessage(
                        "DeviceScript: service did not respond in time."
                    )
                throw e
            }
        }
    }

    mount() {
        super.mount()
        const { service } = this

        this.subscribe(
            this.service.event(CloudConfigurationEvent.ConnectionStatusChange),
            EVENT,
            this.refresh.bind(this)
        )
        ;[
            CloudConfigurationReg.CloudType,
            CloudConfigurationReg.CloudDeviceId,
            CloudConfigurationReg.ConnectionStatus,
            CloudConfigurationReg.ServerName,
        ]
            .map(code => service.register(code))
            .forEach(register =>
                this.subscribe(register, REPORT_UPDATE, this.handleChange)
            )
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
        const cloudDeviceId = service.register(
            CloudConfigurationReg.CloudDeviceId
        ).stringValue

        this.label = serverName || "configuration"
        this.description =
            CloudConfigurationConnectionStatus[connectionState] ||
            connectionState?.toString() ||
            "..."
        this.tooltip = toMarkdownString(
            `## cloud configuration

- cloud type ${cloudType || "?"}
- device id: ${cloudDeviceId || "?"}

`,
            `services/cloudconfiguration`
        )
        this.loading =
            connectionState === CloudConfigurationConnectionStatus.Connecting ||
            connectionState === CloudConfigurationConnectionStatus.Disconnecting

        return oldLabel !== this.label || oldDescription !== this.description
    }
}

abstract class JDomTreeDataProvider
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

class JDomDeviceTreeDataProvider extends JDomTreeDataProvider {
    constructor(
        extensionState: DeviceScriptExtensionState,
        command: vscode.Command
    ) {
        super(extensionState, command, "devs_")
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

class JDomWatchTreeDataProvider extends JDomTreeDataProvider {
    constructor(state: DeviceScriptExtensionState, command: vscode.Command) {
        super(state, command, "watch_")
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
        "extension.devicescript.jdom",
        treeDataProvider
    )
    const updateBadge = () => {
        const devices = treeDataProvider.devices
        explorer.badge = {
            tooltip: `DeviceScript: ${devices.length} devices`,
            value: devices.length,
        }
    }
    subscriptions.push({
        dispose: bus.subscribe(DEVICE_CHANGE, updateBadge),
    })
    updateBadge()

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
            "extension.devicescript.jdom.cloud.edit",
            (item: JDomCloudConfigurationTreeItem) => item?.configure()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.jdom.cloud.connect",
            (item: JDomCloudConfigurationTreeItem) => item?.connect()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.jdom.wifi.ap.add",
            (item: JDomWifiAPTreeItem) => item?.add()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.jdom.wifi.ap.forget",
            (item: JDomWifiAPTreeItem) => item?.forget()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.jdom.wifi.scan",
            (item: JDomWifiTreeItem) => item?.scan()
        )
    )
}

export function activateTreeViews(extensionState: DeviceScriptExtensionState) {
    activateNodeCommands(extensionState)
    activateDevicesTreeView(extensionState)
    activateWatchTreeView(extensionState)
}
