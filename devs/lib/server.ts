import * as ds from "@devicescript/core"

class Server implements ds.ServerInterface {
    serviceIndex: number
    constructor(public spec: ds.ServiceSpec) {}
    async send(pkt: ds.Packet) {
        // TODO
    }
}

class ControlServer extends Server implements ds.IControlServer {
    constructor() {
        super(ds.Control.spec)
    }
    services(): ds.AsyncValue<any[]> {
        // TODO?
        return []
    }
    noop() {}

    identify(): ds.AsyncValue<void> {
        // TODO?
    }
    reset(): ds.AsyncValue<void> {
        // TODO?
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

let servers: Server[]

function startServer(s: Server) {
    if (!servers) {
        servers = [new ControlServer()]
    }
    if (s.spec.classIdentifier == 0) {
        // allow overriding the control server
        s.serviceIndex = 0
        servers[0] = s
    } else {
        s.serviceIndex = servers.length
        servers.push(s)
    }
    // TODO sub handleServerPacket
    // TODO start announce interval
}

async function handleServerPacket(pkt: ds.Packet) {
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
                await server.send(resp)
                return
            } else if (pkt.isAction) {
                const v = await m(pkt.decode())
                if (pkt.spec.response)
                    await server.send(pkt.spec.response.encode(v))
                return
            } else {
                // what's this?
            }
        }
    }

    await server.send(pkt.notImplemented())
}
