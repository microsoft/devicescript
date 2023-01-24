import { DsDapSession, DevsDbgClient, enableConsoleLog } from "@devicescript/dap"
import { CmdOptions } from "./command"
import { readCompiled } from "./run"
import {
    createNodeSocketTransport,
    Flags,
    JDBus,
    loadServiceSpecifications,
    Packet,
    PACKET_RECEIVE,
    PACKET_RECEIVE_ANNOUNCE,
    PACKET_RECEIVE_NO_DEVICE,
    printPacket,
} from "jacdac-ts"
import { createServer } from "node:net"
import { open } from "node:fs/promises"
import { jacdacDefaultSpecifications } from "@devicescript/compiler"

export interface DbgSrvOptions {
    port?: string
    trace?: string
}

export async function dbgsrv(fn: string, options: DbgSrvOptions & CmdOptions) {
    const tmp = await readCompiled(fn)

    if (!tmp.dbg) throw new Error("need debug info")

    Flags.diagnostics = true

    const bus = new JDBus([createNodeSocketTransport()])
    console.log("connecting the bus")
    await bus.connect()

    loadServiceSpecifications(jacdacDefaultSpecifications)

    enableConsoleLog()

    if (options.trace) {
        const fd = await open(options.trace, "w")
        const opts = {
            skipRepeatedAnnounce: false,
            showTime: true,
        }
        const logPkt = (pkt: Packet) => {
            fd.write(printPacket(pkt, opts) + "\n")
        }
        bus.on(PACKET_RECEIVE, logPkt)
        bus.on(PACKET_RECEIVE_ANNOUNCE, logPkt)
        bus.on(PACKET_RECEIVE_NO_DEVICE, logPkt)
    }

    console.log("creating dbg client...")
    const client = await DevsDbgClient.fromBus(bus, Infinity)
    console.log("got dbg client")

    const port = parseInt(options.port) || 8083

    console.error(`waiting for debug protocol on localhost:${port}`)
    createServer(socket => {
        console.error(">> accepted connection from client")
        socket.on("end", () => {
            console.error(">> client connection closed\n")
        })
        const session = new DsDapSession(client, tmp.dbg)
        session.setRunAsServer(true)
        session.start(socket, socket)
    }).listen(port, "127.0.0.1")
}
