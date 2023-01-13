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

const dashboardPath = "tools/devicescript-devtools"

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
                                ? `http://localhost:8000/${dashboardPath}/`
                                : `https://microsoft.github.io/jacdac-docs/${dashboardPath}/`
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
    tcp?: boolean

    bytecodeFile?: string
    debugFile?: string
}

export async function devtools(options: DevToolsOptions & CmdOptions) {
    const { internet, localhost, bytecodeFile, debugFile, tcp } = options
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

    if (tcp) {
        log(`   tcpsocket: tcp://localhost:${tcpPort}`)
        const tcpServer = net.createServer((client: any) => {
            const sender = "tcp" + Math.random()
            client[SENDER_FIELD] = sender
            client.send = (pkt0: Buffer) => {
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
            client.on("end", () => removeClient(client))
            client.on("error", (ev: Error) => error(ev))
        })
        tcpServer.listen(tcpPort, listenHost)
    }

    if (bytecodeFile) {
        debug(`watching ${bytecodeFile}...`)
        watch(bytecodeFile, sendDeviceScript)
    }
}
