import { DsDapSession, DevsDbgClient } from "@devicescript/dap"
import { CmdOptions } from "./command"
import { readCompiled } from "./run"
import { createNodeSocketTransport, Flags, JDBus } from "jacdac-ts"
import { createServer } from "node:net"

export interface DbgSrvOptions {
    port?: string
}

export async function dbgsrv(fn: string, options: DbgSrvOptions & CmdOptions) {
    const tmp = await readCompiled(fn)

    if (!tmp.dbg) throw new Error("need debug info")

    Flags.diagnostics = true

    const bus = new JDBus([createNodeSocketTransport()])
    console.log("connecting the bus")
    await bus.connect()
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
