import { DebugInfo, VersionInfo } from "@devicescript/compiler"
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

export const CLOUD_NODE = "cloud"
export const CLOUD_DEVICE_NODE = "cloudDevice"
export const CLOUD_SCRIPT_NODE = "cloudScript"
export const FETCH_ERROR = "fetchError"

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

export class CloudManager extends JDNode {
    private _devices: CloudDevice[]
    private _scripts: CloudScript[]

    constructor(
        public readonly bus: JDBus,
        public readonly apiRoot: string,
        readonly token: string
    ) {
        super()
    }

    get id(): string {
        return "brain"
    }
    get nodeKind(): string {
        throw CLOUD_NODE
    }
    get name(): string {
        return "brains"
    }
    get qualifiedName(): string {
        return this.name
    }
    get parent(): JDNode {
        return undefined
    }

    scripts(): CloudScript[] {
        return this._scripts?.slice(0) || []
    }

    devices(): CloudDevice[] {
        return this._devices?.slice(0) || []
    }

    get children(): JDNode[] {
        return [...(this._devices || []), ...(this._scripts || [])] as JDNode[]
    }

    device(deviceId: string): CloudDevice {
        return this._devices?.find(d => d.deviceId === deviceId)
    }

    script(scriptId: string): CloudScript {
        return this._scripts?.find(d => d.data.id === scriptId)
    }

    async createScript(
        name: string,
        scriptBody: CloudScriptBody
    ): Promise<CloudScript> {
        const body = {
            name,
            meta: {},
            body: scriptBody,
        }
        const resp = await this.fetchJSON<CloudScriptData>("scripts", {
            method: "POST",
            body,
        })
        if (!resp) return undefined

        const script = new CloudScript(this, resp, body.body)
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
        }
        // cleanup
        Object.keys(meta)
            .filter(k => meta[k] === undefined)
            .forEach(k => delete meta[k])
        await this.fetchJSON(`devices/${deviceId}`, {
            method: "PATCH",
            body: { name, meta },
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
        await Promise.all([this.refreshDevices(), this.refreshScripts()])
    }

    async refreshDevices() {
        const datas = (await this.fetchJSON("devices")) as CloudDeviceData[]
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
                this._devices.push(new CloudDevice(this, data))
            }
        })
        this.emit(CHANGE)
    }

    async refreshScripts() {
        const datas = (await this.fetchJSON("scripts")) as {
            headers: CloudScriptData[]
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
            else this._scripts.push(new CloudScript(this, data))
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
        if (!this.token) return undefined

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
        const resp = await fetch(route, options)
        if (!resp.ok) {
            console.debug(`${options.method} ${route} -> ${resp.statusText}`, {
                options,
                resp,
            })
            this.emit(FETCH_ERROR, resp)
            this.emit(ERROR, resp.statusText)
            return undefined
        }
        const json = (await resp.json()) as T
        return json
    }
}

export interface CloudData {
    id: string
}

export const CLOUD_DATA_CHANGE = "cloud-data-change"

export abstract class CloudNode<
    TData extends CloudData = CloudData
> extends JDNode {
    private _lastFetch = Date.now()

    constructor(
        readonly manager: CloudManager,
        readonly path: string,
        private _data: TData
    ) {
        super()
    }

    get id(): string {
        return `brains:${this.path}:${this._data.id}`
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
            this.emit(CLOUD_DATA_CHANGE)
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

export type CloudDeviceMeta = {
    productId?: number
    fwVersion?: string
} & Record<string, string | number | boolean>

export interface CloudDeviceData extends CloudData {
    displayName: string
    name: string
    conn: boolean
    lastAct: string
    scriptId?: string
    scriptVersion?: number
    deployedHash?: string
    meta?: CloudDeviceMeta
}

export interface CloudDeviceConnectionInfo {
    url: string
    protocol: string
    expires: number
}

export interface CloudTelemetry {
    brainId: string
    sensorId: string
    srv: string
    srvIdx: number
    ms: number
    avg: number
    min: number
    max: number
    nsampl: number
    dur: number
}

export class CloudDevice extends CloudNode<CloudDeviceData> {
    constructor(manager: CloudManager, data: CloudDeviceData) {
        super(manager, "devices", data)

        this.on(CHANGE, this.refreshMeta.bind(this))
        this.refreshMeta()
    }
    get nodeKind(): string {
        return CLOUD_DEVICE_NODE
    }
    get name(): string {
        const { data } = this
        return data.name || data.id
    }
    get connected(): boolean {
        const { data } = this
        return data.conn
    }
    get lastActivity(): string {
        const { data } = this
        return data.lastAct
    }
    get qualifiedName(): string {
        return this.name
    }
    get meta(): CloudDeviceMeta {
        const { data } = this
        return data.meta || {}
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

    async createConnection(): Promise<CloudDeviceConnectionInfo> {
        return await this.manager.fetchJSON(`devices/${this.data.id}/fwd`, {
            method: "GET",
        })
    }

    async telemetry(
        start?: number,
        stop?: number,
        first?: number
    ): Promise<CloudTelemetry[]> {
        return await this.manager.fetchJSON(
            `devices/${this.data.id}/telemetry`,
            {
                query: {
                    start,
                    stop,
                    first,
                },
                method: "GET",
            }
        )
    }
}

export interface CloudScriptData extends CloudData {
    name?: string
    meta?: Record<string, string | number | boolean>
    id: string
    version?: number
    updated?: number
}

export interface CloudScriptBody {
    versions?: VersionInfo
    program?: DebugInfo
}

export class CloudScript extends CloudNode<CloudScriptData> {
    private _body: CloudScriptBody
    private _versions: CloudScript[]

    constructor(
        manager: CloudManager,
        data: CloudScriptData,
        body?: CloudScriptBody
    ) {
        super(manager, "scripts", data)
        this._body = body
        this.on(CLOUD_DATA_CHANGE, () => {
            this._body = undefined
        })
    }
    get nodeKind(): string {
        return CLOUD_SCRIPT_NODE
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

        const resp: CloudScriptData = await this.manager.fetchJSON(
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

    get body(): CloudScriptBody {
        return this._body
    }

    versions(): CloudScript[] {
        return this._versions?.slice(0) || []
    }

    toString(): string {
        return `${this.name} v${this.version}`
    }

    async refreshVersions(): Promise<void> {
        const { headers: versions } =
            (await this.manager.fetchJSON<{ headers: CloudScriptData[] }>(
                `${this.apiPath}/versions`
            )) || {}
        if (
            JSON.stringify(this._versions?.map(v => v.data)) !==
            JSON.stringify(versions)
        ) {
            this._versions = versions?.map(
                v => new CloudScript(this.manager, v)
            )
            this.emit(CHANGE)
        }
    }
    async refreshBody(): Promise<CloudScriptBody> {
        const newBody = await this.manager.fetchJSON<CloudScriptBody>(
            `${this.apiPath}/versions/${this.version}/body`
        )
        if (JSON.stringify(this._body) !== JSON.stringify(newBody)) {
            this._body = newBody
            this.emit(CHANGE)
        }
        return this._body
    }

    async uploadBody(body: CloudScriptBody) {
        const resp: CloudScriptData = await this.manager.fetchJSON(
            `${this.apiPath}/body`,
            {
                method: "PUT",
                body,
            }
        )
        if (resp) this.data = resp
    }
}
