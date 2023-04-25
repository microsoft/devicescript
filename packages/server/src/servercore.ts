import * as ds from "@devicescript/core"

export interface ServerOptions {}

export class Server implements ds.ServerInterface {
    serviceIndex: number
    debug: boolean
    private readonly _instanceName: string
    private _stateCode: number = undefined

    constructor(public spec: ds.ServiceSpec, options?: ServerOptions) {}

    async _send(pkt: ds.Packet) {
        if (this.debug) console.debug("Out SRV", pkt, pkt.spec)
        await ds._serverSend(this.serviceIndex, pkt)
    }

    statusCode(): ds.AsyncValue<[number, number]> {
        const v = this._stateCode
        return v !== undefined ? [(v & 0xffff) >> 16, v & 0xffff] : [0, 0]
    }

    set_statusCode(code: number, vendorCode: number) {
        this._stateCode = (code << 16) | (vendorCode & 0xffff)
    }
}

let servers: ds.ServerInterface[]
let restartCnt = 1

export class ControlServer extends Server implements ds.ControlServerSpec {
    constructor() {
        super(ds.Control.spec)
    }
    services(): ds.AsyncValue<any[]> {
        if (restartCnt < ds.ControlAnnounceFlags.RestartCounterSteady)
            restartCnt++

        const flags = restartCnt | ds.ControlAnnounceFlags.SupportsACK
        // | ds.ControlAnnounceFlags.SupportsBroadcast
        // | ds.ControlAnnounceFlags.SupportsFrames

        const r = servers.map(s => s.spec.classIdentifier)
        r.shift() // drop the ctrl service
        const reserved = 0,
            pktCount = 0 // not yet supported
        r.unshift(flags, pktCount, reserved)
        return r
    }
    noop() {}

    identify(): ds.AsyncValue<void> {
        // TODO?
    }
    reset(): ds.AsyncValue<void> {
        ds.reboot()
    }

    setStatusLight(
        to_red: number,
        to_green: number,
        to_blue: number,
        speed: number
    ) {
        // TODO?
    }

    deviceDescription() {
        return "DeviceScript user-provided servers"
    }

    productIdentifier() {
        return 0x355724dd
    }

    bootloaderProductIdentifier() {
        return 0x355724dd
    }

    firmwareVersion(): ds.AsyncValue<string> {
        return ds._dcfgString("@version")
    }

    uptime() {
        return ds.millis() * 1000
    }
}

async function _onServerPacket(pkt: ds.Packet) {
    if (pkt.isReport) return
    if (!servers) return
    // TODO b-cast packets
    const server = servers[pkt.serviceIndex]
    if (!server) return

    server.spec.assign(pkt)
    if (server.debug) console.debug("In SRV", pkt, server.spec, pkt.spec)
    const methods = server as unknown as Record<
        string,
        (v?: any) => Promise<any>
    >

    if (pkt.spec) {
        if (pkt.isRegSet) {
            const m = methods["set_" + pkt.spec.name]
            if (m) {
                await m(pkt.decode())
                return
            }
        } else {
            const m = methods[pkt.spec.name]
            if (m) {
                if (pkt.isRegGet) {
                    const mr = await m()
                    if (mr !== undefined) {
                        // treat undefined as not implemented
                        const resp = pkt.spec.encode(mr)
                        await server._send(resp)
                        return
                    }
                } else if (pkt.isAction) {
                    const v = await m(pkt.decode())
                    if (pkt.spec.response)
                        await server._send(pkt.spec.response.encode(v))
                    return
                } else {
                    // what's this?
                }
            }
        }
    }

    await server._send(pkt.notImplemented())
}

function attachName(s: ds.BaseServerSpec, name: string) {
    if (name) s.instanceName = () => name
}

export function startServer(s: ds.ServerInterface, name?: string) {
    if (!servers) {
        servers = [new ControlServer()]
        ;(ds as typeof ds)._onServerPacket = _onServerPacket
        setInterval(async () => {
            const iserv = servers[0] as ds.ControlServerSpec
            const spec = ds.Control.spec.lookup("services")
            const pkt = spec.response.encode(await iserv.services())
            await iserv._send(pkt)
        }, 500)
    }
    if (s.spec.classIdentifier === 0) {
        // allow overriding the control server
        s.serviceIndex = 0
        servers[0] = s
    } else {
        s.serviceIndex = servers.length
        servers.push(s)
    }
    let off = 0
    for (const o of servers) {
        if (o === s) break
        if (o.spec.classIdentifier === s.spec.classIdentifier) off++
    }
    let roleName = name
    if (!roleName) roleName = s.spec.name + "_" + off
    attachName(s, roleName)
    return `${roleName}[app:${off}]`
}
