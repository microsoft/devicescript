import type { DebugInfo, VersionInfo } from "@devicescript/interop"
import {
    CHANGE,
    CloudConfigurationCmd,
    DeviceScriptManagerReg,
    ERROR,
    JDBus,
    JDDevice,
    JDNode,
    jdpack,
    SRV_CLOUD_CONFIGURATION,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"

export const GATEWAY_NODE = "cloud"
export const GATEWAY_DEVICE_NODE = "cloudDevice"
export const GATEWAY_SCRIPT_NODE = "cloudScript"
export const GATEWAY_SCRIPTS_NODE = "cloudScripts"
export const GATEWAY_DEVICES_NODE = "cloudDevices"
export const GATEWAY_DATA_CHANGE = "gatewayDataChange"
export const FETCH_ERROR = "fetchError"

export const GATEWAY_LAST_FETCH_STATUS_OK = "ok"

/*function timeKey(t?: number) {
    if (!t) t = Date.now()
    return (1e10 - Math.round(t / 1000)).toString()
}*/

function dateFromTimeKey(t: string) {
    if (t === undefined) return undefined
    return new Date((1e10 - parseInt(t.slice(0, 10))) * 1000)
}

function urlQuery(url: string, args?: Record<string, string | number>) {
    const query = Object.keys(args || {})
        .filter(k => args[k] !== undefined)
        .map(k => `${k}=${encodeURIComponent(args[k])}`)
    return query?.length ? `${url}?${query.join("&")}` : url
}

export interface GatewayInfo {
    mqtt?: {
        host: string
        path?: string
        port?: string
        username?: string
        password?: string
    }
}

export class GatewayManager extends JDNode {
    private _info: GatewayInfo
    private _devices: GatewayDevice[]
    private _scripts: GatewayScript[]
    private _lastFetchStatus: string
    private _tokenValidated: boolean = undefined

    constructor(
        public readonly bus: JDBus,
        public readonly apiRoot: string,
        readonly token: string
    ) {
        super()
    }

    get info() {
        return this._info
    }

    get id(): string {
        return "gateway"
    }
    get nodeKind(): string {
        return GATEWAY_NODE
    }
    get name(): string {
        return this.apiRoot || "gateway"
    }
    get qualifiedName(): string {
        return this.name
    }
    get parent(): JDNode {
        return undefined
    }

    get lastFetchStatus(): string {
        return this._lastFetchStatus
    }

    private set lastFetchStatus(status: string) {
        if (this._lastFetchStatus !== status) {
            this._lastFetchStatus = status
            this.emit(CHANGE)
        }
    }

    get tokenValidated(): boolean {
        return this._tokenValidated
    }

    private set tokenValidated(status: boolean) {
        if (this._tokenValidated !== status) {
            this._tokenValidated = status
            this.emit(CHANGE)
        }
    }

    scripts(): GatewayScript[] {
        return this._scripts?.slice(0) || []
    }

    devices(): GatewayDevice[] {
        return this._devices?.slice(0) || []
    }

    get children(): JDNode[] {
        return [...(this._devices || []), ...(this._scripts || [])] as JDNode[]
    }

    device(deviceId: string): GatewayDevice {
        return this._devices?.find(d => d.deviceId === deviceId)
    }

    script(scriptId: string, scriptVersion?: number): GatewayScript {
        return this._scripts?.find(d => d.data.id === scriptId)
    }

    async scriptVersion(
        scriptId: string,
        scriptVersion: number
    ): Promise<GatewayScript> {
        const script = this.script(scriptId)
        await script?.refreshVersions()
        return script?.versions()?.find(v => v.version === scriptVersion)
    }

    async createScript(
        name: string,
        scriptBody: GatewayScriptBody
    ): Promise<GatewayScript> {
        const body = {
            name,
            meta: {},
            env: {},
            body: scriptBody,
        }
        const resp = await this.fetchJSON<GatewayScriptData>("scripts", {
            method: "POST",
            body,
        })
        if (!resp) return undefined

        const script = new GatewayScript(this, resp, body.body)
        this._scripts.push(script)
        this.emit(CHANGE)
        return script
    }

    async registerDevice(device: JDDevice, name: string) {
        await device.resolveProductIdentifier()
        await device.resolveFirmwareVersion()
        const { productIdentifier, firmwareVersion, deviceId } = device

        const devsSrv = device.service(SRV_DEVICE_SCRIPT_MANAGER)
        const runtimeVersionReg = devsSrv?.register(
            DeviceScriptManagerReg.RuntimeVersion
        )
        await runtimeVersionReg?.refresh()
        const runtimeVersion = runtimeVersionReg?.stringValue

        // create new device
        const resp: { deviceId: string; connectionString: string } =
            await this.fetchJSON("devices", {
                method: "POST",
                body: { deviceId },
            })
        if (!resp) {
            this.emit(ERROR, "register failed")
            return
        }

        // patch name
        const deviceSpec =
            this.bus.deviceCatalog.specificationFromProductIdentifier(
                productIdentifier
            )
        const meta: any = {
            productId: productIdentifier,
            productName: deviceSpec?.name,
            company: deviceSpec?.company,
            runtimeVersion,
            firmwareVersion,
            services: device.serviceClasses,
        }
        const env: any = {}
        // cleanup
        Object.keys(meta)
            .filter(k => meta[k] === undefined)
            .forEach(k => delete meta[k])
        await this.fetchJSON(`devices/${deviceId}`, {
            method: "PATCH",
            body: { name, meta, env },
        })

        // patch cloud configuration service
        const { connectionString } = resp
        const service = device.services({
            serviceClass: SRV_CLOUD_CONFIGURATION,
        })[0]
        const data = jdpack<[string]>("s", [connectionString])
        await service.sendCmdAsync(
            CloudConfigurationCmd.SetConnectionString,
            data,
            true
        )

        // all good, we're done
        await this.refreshDevices()
    }

    async refresh() {
        await this.refreshInfo()
        if (this.lastFetchStatus !== GATEWAY_LAST_FETCH_STATUS_OK) return

        await this.refreshDevices()
        await this.refreshScripts()
    }

    async refreshInfo() {
        const info = (await this.fetchJSON("info")) as GatewayInfo
        if (!info) return // query failed
        this._info = info
        this.emit(CHANGE)
    }

    async refreshDevices() {
        const datas = (await this.fetchJSON("devices")) as GatewayDeviceData[]
        if (!datas) return // query failed

        // merge cloud datas with local devices
        const dids = new Set(datas.map(d => d.id))
        // remove dead devices
        this._devices = this._devices?.filter(d => dids.has(d.data.id)) || []
        // update existing devices
        datas.forEach(data => {
            const device = this._devices.find(d => d.data.id === data.id)
            if (device) {
                device.data = data
            } else {
                this._devices.push(new GatewayDevice(this, data))
            }
        })
        this.emit(CHANGE)
    }

    async refreshScripts() {
        const datas = (await this.fetchJSON("scripts")) as {
            headers: GatewayScriptData[]
        }
        if (!datas) return // query failed

        const { headers = [] } = datas
        // merge cloud datas with local devices
        const dids = new Set(headers.map(d => d.id))
        // remove dead devices
        this._scripts = this._scripts?.filter(d => dids.has(d.data.id)) || []
        // update existing devices
        headers.forEach(data => {
            const script = this._scripts.find(d => d.data.id === data.id)
            if (script) script.data = data
            else this._scripts.push(new GatewayScript(this, data))
        })
        this.emit(CHANGE)
    }

    async fetchJSON<T>(
        path: string,
        opts?: {
            method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
            body?: any
            query?: Record<string, string | number>
        }
    ) {
        if (!this.token) {
            this.lastFetchStatus = undefined
            return undefined
        }

        const { query, body } = opts || {}
        const options: RequestInit = {
            method: opts?.method || "GET",
            headers: {
                Authorization: `Basic ${btoa(this.token)}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        }
        if (body)
            (options.headers as any)["Content-Type"] =
                "application/json; charset=utf-8"
        const route = urlQuery(`${this.apiRoot}/api/${path}`, query)

        try {
            const resp = await fetch(route, options)
            if (!resp.ok) {
                console.debug(
                    `${options.method} ${route} -> ${resp.statusText}`,
                    {
                        options,
                        resp,
                    }
                )
                this.lastFetchStatus = resp.statusText
                this.emit(FETCH_ERROR, resp)
                this.emit(ERROR, resp.statusText)
                return undefined
            }
            const json = (await resp.json()) as T
            this.lastFetchStatus = GATEWAY_LAST_FETCH_STATUS_OK
            this.tokenValidated = true
            return json
        } catch (e) {
            this.lastFetchStatus = e.message
            if (e.statusCode === 401) this.tokenValidated = false
            this.emit(FETCH_ERROR, e)
            this.emit(ERROR, e)
            return undefined
        }
    }
}

export interface GatewayData {
    id: string
}

export abstract class GatewayNode<
    TData extends GatewayData = GatewayData
> extends JDNode {
    private _lastFetch = Date.now()

    constructor(
        readonly manager: GatewayManager,
        readonly path: string,
        private _data: TData
    ) {
        super()
    }

    get id(): string {
        return `gateway:${this.path}:${this._data.id}`
    }
    get parent(): JDNode {
        return this.manager
    }
    get children(): JDNode[] {
        return []
    }
    get qualifiedName(): string {
        return this.name
    }

    get data(): TData {
        if (this.expired) this.refresh()
        return this._data
    }
    set data(data: TData) {
        this._lastFetch = Date.now()
        if (!!data && JSON.stringify(data) !== JSON.stringify(this._data)) {
            this._data = data
            this.emit(GATEWAY_DATA_CHANGE)
            this.emit(CHANGE)
        }
    }

    get lastFetch(): number {
        return this._lastFetch
    }

    get expired() {
        return !this._lastFetch
    }

    private refreshPromise: Promise<void>
    refresh(): Promise<void> {
        return (
            this.refreshPromise ||
            (this.refreshPromise = this.internalRefresh())
        )
    }

    protected get apiPath() {
        return `${this.path}/${this._data.id}`
    }

    private async internalRefresh(): Promise<void> {
        const data = await this.manager.fetchJSON<TData>(this.apiPath)
        this.data = data
        this.refreshPromise = undefined
    }

    async delete() {
        await this.manager.fetchJSON<TData>(this.apiPath, {
            method: "DELETE",
        })
        await this.manager.refresh()
    }
}

export type GatewayDeviceMeta = {
    productId?: number
    fwVersion?: string
} & Record<string, string | number | boolean>

export type GatewayDeviceEnv = Record<string, any>

export interface GatewayDeviceData extends GatewayData {
    displayName: string
    name: string
    conn: boolean
    lastAct: string
    scriptId?: string
    scriptVersion?: number
    deployedHash?: string
    meta?: GatewayDeviceMeta
    env?: GatewayDeviceEnv
    mqttTopic?: string
}

export interface CloudDeviceConnectionInfo {
    url: string
    protocol: string
    expires: number
}

export class GatewayDevice extends GatewayNode<GatewayDeviceData> {
    constructor(manager: GatewayManager, data: GatewayDeviceData) {
        super(manager, "devices", data)

        this.on(CHANGE, this.refreshMeta.bind(this))
        this.refreshMeta()
    }
    get nodeKind(): string {
        return GATEWAY_DEVICE_NODE
    }
    get name(): string {
        const { data } = this
        return data.name || data.id
    }
    get connected(): boolean {
        const { data } = this
        return data.conn
    }

    private set connected(value: boolean) {
        if (this.connected !== value) {
            this.data.conn = value
            this.emit(CHANGE)
        }
    }
    get lastActivity(): string {
        const { data } = this
        return data.lastAct
    }
    get qualifiedName(): string {
        return this.name
    }
    get meta(): GatewayDeviceMeta {
        const { data } = this
        return data.meta
    }
    get env(): GatewayDeviceEnv {
        const { data } = this
        return data.env
    }
    get mqttTopic(): string {
        const { data } = this
        return data.mqttTopic
    }
    get deviceId() {
        return this.data.id
    }

    get scriptId() {
        return this.data.scriptId
    }

    get scriptVersion() {
        return this.data.scriptVersion
    }
    get deployedHash() {
        return this.data.deployedHash
    }

    resolveDevice(): JDDevice {
        return this.manager.bus.device(this.deviceId, true)
    }

    async updateScript(scriptId: string, scriptVersion?: number) {
        await this.manager.fetchJSON(this.apiPath, {
            method: "PATCH",
            body: { scriptId, scriptVersion },
        })
        // async refresh
        this.refresh()
    }
    async updateEnv(env: GatewayDeviceEnv) {
        await this.manager.fetchJSON(this.apiPath, {
            method: "PATCH",
            body: { env },
        })
        // async refresh
        this.refresh()
    }
    async refreshMeta() {
        const device = this.resolveDevice()
        if (!device) return

        const { meta } = this.data
        let changed = false
        const newMeta = JSON.parse(JSON.stringify(meta || {}))
        const productId = await device.resolveProductIdentifier()
        const fwVersion = await device.resolveFirmwareVersion()
        if (productId && meta.productId !== productId) {
            newMeta.productId = productId
            changed = true
        }
        if (fwVersion && meta.fwVersion !== fwVersion) {
            newMeta.fwVersion = fwVersion
            changed = true
        }
        if (changed) {
            await this.manager.fetchJSON(this.apiPath, {
                method: "PATCH",
                body: { newMeta },
            })
        }
    }

    async ping() {
        const res = await this.manager.fetchJSON<{ duration: number }>(
            `devices/${this.data.id}/ping`,
            { method: "POST" }
        )
        const duration = res?.duration
        this.connected = duration > 0
    }

    async createConnection(
        route: "fwd" | "logs"
    ): Promise<CloudDeviceConnectionInfo> {
        return await this.manager.fetchJSON(
            `devices/${this.data.id}/${route}`,
            {
                method: "GET",
            }
        )
    }

    async sendMessage(topic: string, payload: any) {
        await this.manager.fetchJSON(`devices/${this.data.id}/json`, {
            method: "POST",
            body: { $topic: topic, ...payload },
        })
    }
}

export interface GatewayScriptData extends GatewayData {
    name?: string
    meta?: Record<string, string | number | boolean>
    env?: Record<string, string | number | boolean>
    id: string
    version?: number
    updated?: number
}

export interface GatewayScriptBody {
    versions?: VersionInfo
    program?: DebugInfo
}

export class GatewayScript extends GatewayNode<GatewayScriptData> {
    private _body: GatewayScriptBody
    private _versions: GatewayScript[]

    constructor(
        manager: GatewayManager,
        data: GatewayScriptData,
        body?: GatewayScriptBody
    ) {
        super(manager, "scripts", data)
        this._body = body
        this.on(GATEWAY_DATA_CHANGE, () => {
            this._body = undefined
        })
    }
    get nodeKind(): string {
        return GATEWAY_SCRIPT_NODE
    }
    get version(): number {
        const { data } = this
        return data.version
    }
    get updateTime(): Date | undefined {
        if (!this.data.updated) return undefined
        return new Date(this.data.updated)
    }
    get name(): string {
        const { data } = this
        return data.name || data.id
    }
    get scriptId() {
        return this.data.id
    }
    get creationTime(): Date | undefined {
        return dateFromTimeKey(this.data.id)
    }
    async updateName(name: string) {
        if (!name || name === this.data.name) return

        const resp: GatewayScriptData = await this.manager.fetchJSON(
            this.apiPath,
            { method: "PATCH", body: { name } }
        )
        if (resp) this.data = resp
    }

    get displayName(): string {
        return `${this.name} ${
            this.data.version !== undefined ? `v${this.data.version}` : ""
        }`
    }

    get body(): GatewayScriptBody {
        return this._body
    }

    versions(): GatewayScript[] {
        return this._versions?.slice(0) || []
    }

    toString(): string {
        return `${this.name} v${this.version}`
    }

    async refreshVersions(): Promise<void> {
        const { headers: versions } =
            (await this.manager.fetchJSON<{ headers: GatewayScriptData[] }>(
                `${this.apiPath}/versions`
            )) || {}
        if (
            JSON.stringify(this._versions?.map(v => v.data)) !==
            JSON.stringify(versions)
        ) {
            this._versions = versions?.map(
                v => new GatewayScript(this.manager, v)
            )
            this.emit(CHANGE)
        }
    }
    async refreshBody(): Promise<GatewayScriptBody> {
        const newBody = await this.manager.fetchJSON<GatewayScriptBody>(
            `${this.apiPath}/versions/${this.version}/body`
        )
        if (JSON.stringify(this._body) !== JSON.stringify(newBody)) {
            this._body = newBody
            this.emit(CHANGE)
        }
        return this._body
    }

    async uploadBody(body: GatewayScriptBody) {
        const resp: GatewayScriptData = await this.manager.fetchJSON(
            `${this.apiPath}/body`,
            {
                method: "PUT",
                body,
            }
        )
        if (resp) this.data = resp
    }
}

export class GatewayCollection extends JDNode {
    constructor(
        readonly manager: GatewayManager,
        private readonly _nodeKind: string,
        private readonly _name: string,
        private readonly _children: (manager: GatewayManager) => JDNode[]
    ) {
        super()
    }
    get id(): string {
        return `${this.manager.id}.${this.nodeKind}`
    }
    get nodeKind(): string {
        return this._nodeKind
    }
    get name(): string {
        return this._name
    }
    get qualifiedName(): string {
        return `${this.parent.qualifiedName}.${this.name}`
    }
    get parent(): JDNode {
        return this.manager
    }
    get children(): JDNode[] {
        return this._children(this.manager).sort((l, r) =>
            l.name.localeCompare(r.name)
        )
    }
}
