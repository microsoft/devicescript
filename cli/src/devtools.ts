const SENDER_FIELD = "__jacdac_sender"
/* eslint-disable @typescript-eslint/no-var-requires */
const WebSocket = require("faye-websocket")
import http from "http"
import https from "https"
import url from "url"
import net from "net"
import { CmdOptions, error, log } from "./command"
import { watch } from "fs-extra"
import { jacdacDefaultSpecifications } from "@devicescript/compiler"
import {
    bufferConcat,
    bufferEq,
    debounce,
    DEVICE_ANNOUNCE,
    ERROR,
    FRAME_PROCESS,
    JDBus,
    JDDevice,
    JDFrameBuffer,
    JDService,
    JSONTryParse,
    loadServiceSpecifications,
    serializeToTrace,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import { readCompiled } from "./run"
import { deployToBus, deployToService } from "./deploy"
import { open } from "fs/promises"
import { createTransports, TransportsOptions } from "./transport"
import { fetchDevToolsProxy } from "./devtoolsproxy"

export interface DevToolsOptions {
    internet?: boolean
    localhost?: boolean
    trace?: string
}

export async function devtools(
    fn: string | undefined,
    options: DevToolsOptions & CmdOptions & TransportsOptions = {}
) {
    const port = 8081
    const tcpPort = 8082
    const listenHost = options.internet ? undefined : "127.0.0.1"

    let clientId = 0

    log(`starting dev tools at http://localhost:${port}`)

    loadServiceSpecifications(jacdacDefaultSpecifications)

    const traceFd = options.trace ? await open(options.trace, "w") : null

    // start http server
    const clients: WebSocket[] = []

    let prevBytecode: Uint8Array
    const refreshProg = async (service?: JDService) => {
        if (!fn) return
        const { binary } = await readCompiled(fn, options)
        if (prevBytecode && bufferEq(prevBytecode, binary)) {
            if (service) await deployToService(service, binary)
            else {
                console.log("skipping identical deploy")
            }
        } else {
            prevBytecode = binary
            const num = await deployToBus(bus, binary)
            if (num == 0) console.log(`no clients to deploy to`)
        }
    }

    // passive bus to sniff packets
    const transports = createTransports(options)
    const bus = new JDBus(transports, {
        client: false,
        disableRoleManager: true,
        proxy: true,
    })
    bus.passive = false
    bus.on(ERROR, e => error(e))
    bus.on(FRAME_PROCESS, (frame: JDFrameBuffer) => {
        if (traceFd)
            traceFd.write(
                serializeToTrace(frame, 0, bus, { showTime: false }) + "\n"
            )
        clients
            .filter(c => (c as any)[SENDER_FIELD] !== frame._jacdac_sender)
            .forEach(c => c.send(Buffer.from(frame)))
    })

    const processMessage = (message: string, sender: string) => {
        const msg = JSONTryParse(message)
        if (!msg) return
        console.debug(msg)
    }
    const processPacket = (message: Buffer | Uint8Array, sender: string) => {
        const data: JDFrameBuffer = new Uint8Array(message)
        data._jacdac_sender = sender
        bus.sendFrameAsync(data)
    }

    log(`   websocket: ws://localhost:${port}`)
    const server = http.createServer(function (req, res) {
        const parsedUrl = url.parse(req.url)
        const pathname = parsedUrl.pathname
        if (pathname === "/") {
            fetchDevToolsProxy(options.localhost)
                .then(proxyHtml => {
                    res.setHeader("Cache-control", "no-cache")
                    res.setHeader("Content-type", "text/html")
                    res.end(proxyHtml)
                })
                .catch(e => {
                    console.error(e)
                    res.statusCode = 3
                })
        } else {
            res.statusCode = 404
        }
    })
    function removeClient(client: WebSocket) {
        const i = clients.indexOf(client)
        clients.splice(i, 1)
        log(`client: disconnected (${clients.length} clients)`)
    }
    server.on("upgrade", (request, socket, body) => {
        // is this a socket?
        if (WebSocket.isWebSocket(request)) {
            const client = new WebSocket(request, socket, body)
            const sender = "ws" + ++clientId
            // store sender id to deduped packet
            client[SENDER_FIELD] = sender
            clients.push(client)
            log(`webclient: connected (${sender}, ${clients.length} clients)`)
            client.on("message", (event: any) => {
                const { data } = event
                if (typeof data === "string") processMessage(data, sender)
                else processPacket(data, sender)
            })
            client.on("close", () => removeClient(client))
            client.on("error", (ev: Error) => error(ev.message))
        }
    })
    server.listen(port, listenHost)

    log(`   tcpsocket: tcp://localhost:${tcpPort}`)
    const tcpServer = net.createServer((client: any) => {
        const sender = "tcp" + ++clientId
        client[SENDER_FIELD] = sender
        client.send = (pkt0: Buffer | string) => {
            if (typeof pkt0 == "string") return
            const pkt = new Uint8Array(pkt0)
            const b = new Uint8Array(1 + pkt.length)
            b[0] = pkt.length
            b.set(pkt, 1)
            try {
                client.write(b)
            } catch {
                try {
                    client.end()
                } catch {} // eslint-disable-line no-empty
            }
        }
        clients.push(client)
        log(`tcpclient: connected (${sender} ${clients.length} clients)`)
        let acc: Uint8Array
        client.on("data", (buf: Uint8Array) => {
            if (acc) {
                buf = bufferConcat(acc, buf)
                acc = null
            } else {
                buf = new Uint8Array(buf)
            }
            while (buf) {
                const endp = buf[0] + 1
                if (buf.length >= endp) {
                    const pkt = buf.slice(1, endp)
                    if (buf.length > endp) buf = buf.slice(endp)
                    else buf = null
                    processPacket(pkt, sender)
                } else {
                    acc = buf
                    buf = null
                }
            }
        })
        client.on("end", () => removeClient(client))
        client.on("error", (ev: Error) => error(ev))
    })
    tcpServer.listen(tcpPort, listenHost)

    // if (logging) enableLogging(bus)

    bus.start()
    await bus.connect(true)
    if (fn) {
        console.log(`watching ${fn}...`)
        await refreshProg()
        bus.on(DEVICE_ANNOUNCE, (d: JDDevice) => {
            d.services({ serviceClass: SRV_DEVICE_SCRIPT_MANAGER }).forEach(s =>
                refreshProg(s)
            )
        })
        watch(
            fn,
            debounce(() => refreshProg(), 500)
        )
    }
}
