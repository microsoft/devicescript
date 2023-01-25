const SENDER_FIELD = "__jacdac_sender"
/* eslint-disable @typescript-eslint/no-var-requires */
const WebSocket = require("faye-websocket")
import http from "http"
import https from "https"
import url from "url"
import net from "net"
import { CmdOptions, debug, error, log } from "./command"
import { readFileSync, readJSONSync, watch } from "fs-extra"
import { prettySize } from "@devicescript/compiler"
import {
    bufferConcat,
    createNodeSPITransport,
    createNodeUSBOptions,
    createNodeWebSerialTransport,
    createProxyBridge,
    createUSBTransport,
    ERROR,
    FRAME_PROCESS,
    JDBus,
    JDFrameBuffer,
    JSONTryParse,
    serializeToTrace,
    Transport,
} from "jacdac-ts"
import { appendFileSync } from "fs"

const dasboardPath = "tools/devicescript-devtools"

function fetchProxy(localhost: boolean): Promise<string> {
    const protocol = localhost ? http : https
    const url = localhost
        ? "http://localhost:8000/devtools/proxy.html"
        : "https://microsoft.github.io/jacdac-docs/devtools/proxy"
    //debug(`fetch jacdac devtools proxy at ${url}`)
    return new Promise<string>((resolve, reject) => {
        protocol
            .get(url, res => {
                if (res.statusCode != 200)
                    reject(
                        new Error(`proxy download failed (${res.statusCode})`)
                    )
                res.setEncoding("utf8")
                let body = ""
                res.on("data", data => (body += data))
                res.on("end", () => {
                    body = body
                        .replace(
                            /https:\/\/microsoft.github.io\/jacdac-docs\/dashboard/g,
                            localhost
                                ? `http://localhost:8000/${dasboardPath}/`
                                : `https://microsoft.github.io/jacdac-docs/${dasboardPath}/`
                        )
                        .replace("Jacdac DevTools", "DeviceScript DevTools")
                        .replace(
                            "https://microsoft.github.io/jacdac-docs/favicon.svg",
                            "https://microsoft.github.io/devicescript/img/favicon.svg"
                        )
                    resolve(body)
                })
                res.on("error", reject)
            })
            .on("error", reject)
    })
}

export interface DevToolsOptions {
    internet?: boolean
    localhost?: boolean
    bytecodeFile?: string
    debugFile?: string
    trace?: string
}

export interface TransportsOptions {
    usb?: boolean
    serial?: boolean
    spi?: boolean
}

function tryRequire(name: string) {
    return require(name)
}

export function createTransports(options: TransportsOptions) {
    const transports: Transport[] = []
    if (options.usb) {
        log(`adding USB transport (requires "usb" package)`)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const usb = tryRequire("usb")
        const options = createNodeUSBOptions(usb.WebUSB)
        transports.push(createUSBTransport(options))
    }
    if (options.serial) {
        log(`adding serial transport (requires "serialport" package)`)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const SerialPort = tryRequire("serialport").SerialPort
        transports.push(createNodeWebSerialTransport(SerialPort))
    }
    if (options.spi) {
        log(`adding SPI transport (requires "rpio" package)`)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const RPIO = tryRequire("rpio")
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const SpiDev = tryRequire("spi-device")
        transports.push(createNodeSPITransport(RPIO, SpiDev))
    }

    return transports
}
export async function devtools(
    options: DevToolsOptions & CmdOptions & TransportsOptions
) {
    const { internet, localhost, bytecodeFile, debugFile, trace } = options
    const port = 8081
    const tcpPort = 8082
    const listenHost = internet ? undefined : "127.0.0.1"

    log(`starting dev tools at http://localhost:${port}`)

    // download proxy sources
    const proxyHtml = await fetchProxy(localhost)

    // start http server
    const clients: WebSocket[] = []

    // upload DeviceScript file is needed
    const sendDeviceScript = bytecodeFile
        ? () => {
              const bytecode = readFileSync(bytecodeFile)
              const dbg = debugFile ? readJSONSync(debugFile) : undefined
              debug(
                  `refresh bytecode (${prettySize(bytecode.length)}) with ${
                      clients.length
                  } clients...`
              )
              const msg = JSON.stringify({
                  type: "bytecode",
                  channel: "devicescript",
                  bytecode: bytecode.toString("hex"),
                  dbg,
              })
              clients.forEach(c => c.send(msg))
          }
        : undefined

    // passive bus to sniff packets
    const transports = createTransports(options)
    const bus = new JDBus(transports, {
        client: false,
        disableRoleManager: true,
        proxy: true,
    })
    bus.passive = true
    bus.on(ERROR, e => error(e))
    const forwardFrame = (frame: JDFrameBuffer) => {
        if (trace) appendFileSync(trace, serializeToTrace(frame, 0, bus) + "\n")
        clients
            .filter(c => (c as any)[SENDER_FIELD] !== frame._jacdac_sender)
            .forEach(c => c.send(Buffer.from(frame)))
    }
    const bridge = createProxyBridge((data, sender) => {
        // note that this is not invoked on bridge.receiveFrameOrPacket(), since these are our own frames
        // FRAME_PROCESS event below is invoked for all frames
    })
    bridge.on(FRAME_PROCESS, forwardFrame)
    bus.addBridge(bridge)
    const processMessage = (message: string, sender: string) => {
        const msg = JSONTryParse(message)
        if (!msg) return
        console.debug(msg)
    }
    const processPacket = (message: Buffer | Uint8Array, sender: string) => {
        const data = new Uint8Array(message)
        bridge.receiveFrameOrPacket(data, sender)
    }

    log(`   websocket: ws://localhost:${port}`)
    const server = http.createServer(function (req, res) {
        const parsedUrl = url.parse(req.url)
        const pathname = parsedUrl.pathname
        if (pathname === "/") {
            res.setHeader("Cache-control", "no-cache")
            res.setHeader("Content-type", "text/html")
            res.end(proxyHtml)
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
            const sender = "ws" + Math.random()
            let firstDeviceScript = false
            // store sender id to deduped packet
            client[SENDER_FIELD] = sender
            clients.push(client)
            log(`webclient: connected (${sender}, ${clients.length} clients)`)
            client.on("message", (event: any) => {
                const { data } = event
                if (typeof data === "string") processMessage(data, sender)
                else processPacket(data, sender)
                if (!firstDeviceScript && sendDeviceScript) {
                    firstDeviceScript = true
                    sendDeviceScript()
                }
            })
            client.on("close", () => removeClient(client))
            client.on("error", (ev: Error) => error(ev))
        }
    })
    server.listen(port, listenHost)

    log(`   tcpsocket: tcp://localhost:${tcpPort}`)
    const tcpServer = net.createServer((client: any) => {
        const sender = "tcp" + Math.random()
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
    bus.connect(true)

    if (bytecodeFile) {
        debug(`watching ${bytecodeFile}...`)
        watch(bytecodeFile, sendDeviceScript)
    }
}
