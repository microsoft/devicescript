import * as ds from "@devicescript/core"

declare var ds_impl: typeof ds

export class Server implements ds.ServerInterface {
    serviceIndex: number
    constructor(public spec: ds.ServiceSpec) {}
    async _send(pkt: ds.Packet) {
        await ds._serverSend(this.serviceIndex, pkt)
    }
}

let servers: ds.ServerInterface[]
let restartCnt = 1

class ControlServer extends Server implements ds.IControlServer {
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
        r.unshift(flags)
        const pktCount = 0 // not yet supported
        r.unshift(pktCount)
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
    const methods = server as unknown as Record<
        string,
        (v?: any) => Promise<any>
    >

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
                const resp = pkt.spec.encode(await m())
                await server._send(resp)
                return
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

    await server._send(pkt.notImplemented())
}

export function startServer(s: ds.ServerInterface) {
    if (!servers) {
        servers = [new ControlServer()]
        ds_impl._onServerPacket = _onServerPacket
        setInterval(async () => {
            const iserv = servers[0] as ds.IControlServer
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
}
