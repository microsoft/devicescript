import {
    DsDapSession,
    DevsDbgClient,
    enableConsoleLog,
} from "@devicescript/dap"
import { BINDIR, CmdOptions } from "./command"
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
import { open, readFile } from "node:fs/promises"
import {
    DEVS_DBG_FILE,
    jacdacDefaultSpecifications,
    SrcFile,
} from "@devicescript/compiler"
import { join, resolve } from "node:path"

export interface DbgSrvOptions {
    port?: string
    trace?: string
}

export async function dbgsrv(fn: string, options: DbgSrvOptions & CmdOptions) {
    const tmp = await readCompiled(fn ?? join(BINDIR, DEVS_DBG_FILE))

    if (!tmp.dbg) throw new Error("need debug info")

    let fnResolveMap: Record<string, string> = {}

    const resolvePath = (s: SrcFile) => fnResolveMap[s.path]

    async function checkFiles() {
        fnResolveMap = {}
        const folder = process.cwd()
        for (const f of tmp.dbg.sources) {
            const fn = resolve(folder, f.path)
            try {
                const src = await readFile(fn, "utf-8")
                if (src == f.text) fnResolveMap[f.path] = fn
                else {
                    console.log(`file ${f.path} different on disk`)
                }
            } catch {
                console.log(`can't find ${f.path}`)
            }
        }
    }

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
    createServer(async socket => {
        console.error(">> accepted connection from client")
        socket.on("end", () => {
            console.error(">> client connection closed\n")
        })
        await checkFiles()
        const session = new DsDapSession(client, tmp.dbg, resolvePath)
        session.setRunAsServer(true)
        session.start(socket, socket)
    }).listen(port, "127.0.0.1")
}
