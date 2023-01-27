/* eslint-disable @typescript-eslint/no-var-requires */
const WebSocket = require("faye-websocket")
import http from "http"
import url from "url"
import net from "net"
import { CmdOptions, error, log } from "./command"
import { watch } from "fs-extra"
import { jacdacDefaultSpecifications } from "@devicescript/compiler"
import {
    bufferConcat,
    bufferEq,
    debounce,
    ERROR,
    FRAME_PROCESS,
    JDBus,
    JDFrameBuffer,
    loadServiceSpecifications,
    serializeToTrace,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import { deployToService } from "./deploy"
import { open } from "fs/promises"
import EventEmitter from "events"
import { createTransports, TransportsOptions } from "./transport"
import { fetchDevToolsProxy } from "./devtoolsproxy"
import { DevToolsClient, DevToolsIface, processSideMessage } from "./sidedata"
import { FSWatcher } from "fs"
import { compileFile } from "./build"
import { dirname } from "path"
import { BuildStatus, BuildReqArgs } from "./sideprotocol"

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
    let watcher: FSWatcher

    log(`starting dev tools at http://localhost:${port}`)

    loadServiceSpecifications(jacdacDefaultSpecifications)

    const traceFd = options.trace ? await open(options.trace, "w") : null

    // passive bus to sniff packets
    const transports = createTransports(options)
    const bus = new JDBus(transports, {
        client: false,
        disableRoleManager: true,
        proxy: true,
    })

    const devtoolsSelf: DevToolsIface = {
        clients: [],
        bus,
        build,
    }

    bus.passive = false
    bus.on(ERROR, e => error(e))
    bus.on(FRAME_PROCESS, (frame: JDFrameBuffer) => {
        if (traceFd)
            traceFd.write(
                serializeToTrace(frame, 0, bus, { showTime: false }) + "\n"
            )
        devtoolsSelf.clients
            .filter(c => c.__devsSender !== frame._jacdac_sender)
            .forEach(c => c.send(Buffer.from(frame)))
    })
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
    function removeClient(client: DevToolsClient) {
        const i = devtoolsSelf.clients.indexOf(client)
        devtoolsSelf.clients.splice(i, 1)
        log(`client: disconnected (${devtoolsSelf.clients.length} clients)`)
    }
    server.on("upgrade", (request, socket, body) => {
        // is this a socket?
        if (WebSocket.isWebSocket(request)) {
            const client: DevToolsClient = new WebSocket(request, socket, body)
            const sender = "ws" + ++clientId
            // store sender id to deduped packet
            client.__devsSender = sender
            devtoolsSelf.clients.push(client)
            log(
                `webclient: connected (${sender}, ${devtoolsSelf.clients.length} clients)`
            )
            const ev = client as any as EventEmitter
            ev.on("message", (event: any) => {
                const { data } = event
                if (typeof data === "string")
                    processSideMessage(devtoolsSelf, data, client)
                else processPacket(data, sender)
            })
            ev.on("close", () => removeClient(client))
            ev.on("error", (ev: Error) => error(ev.message))
        }
    })
    server.listen(port, listenHost)

    log(`   tcpsocket: tcp://localhost:${tcpPort}`)
    const tcpServer = net.createServer(socket => {
        const sender = "tcp" + ++clientId
        const client: DevToolsClient = socket as any
        client.__devsSender = sender
        client.send = (pkt0: Buffer | string) => {
            if (typeof pkt0 == "string") return
            const pkt = new Uint8Array(pkt0)
            const b = new Uint8Array(1 + pkt.length)
            b[0] = pkt.length
            b.set(pkt, 1)
            try {
                socket.write(b)
            } catch {
                try {
                    socket.end()
                } catch {} // eslint-disable-line no-empty
            }
        }
        devtoolsSelf.clients.push(client)
        log(
            `tcpclient: connected (${sender} ${devtoolsSelf.clients.length} clients)`
        )
        let acc: Uint8Array
        socket.on("data", (buf: Uint8Array) => {
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
        socket.on("end", () => removeClient(client))
        socket.on("error", (ev: Error) => error(ev))
    })
    tcpServer.listen(tcpPort, listenHost)

    // if (logging) enableLogging(bus)

    bus.start()
    await bus.connect(true)

    if (fn) {
        console.log(`watching ${fn}...`)
        logBuildStatus(
            await build(
                {
                    filename: fn,
                    watch: true,
                    deployTo: "*",
                    buildOptions: options,
                },
                logBuildStatus
            )
        )
    }

    function logBuildStatus(st: BuildStatus) {
        console.log(`build ${fn} ${st.success ? "OK" : "Failed"}`)
        for (const msg of st.diagnostics) console.error(msg.formatted)
        if (st.deployStatus) {
            console.log(`deploy status: ${st.deployStatus}`)
        }
    }

    async function build(
        args: BuildReqArgs,
        watchCb?: (st: BuildStatus) => void
    ) {
        let prevBytecode: Uint8Array

        args = { ...args }

        const opts = { ...args.buildOptions }
        if (!opts.cwd) opts.cwd = dirname(args.filename)
        opts.noVerify = true
        opts.quiet = true
        opts.watch = false

        if (args.watch) {
            watcher?.close()
            watcher = watch(
                fn,
                debounce(async () => {
                    let res: BuildStatus
                    try {
                        res = await rebuild()
                    } catch (err) {
                        res = {
                            success: false,
                            dbg: null,
                            binary: null,
                            diagnostics: [],
                            deployStatus: err.message || "" + err,
                        }
                    }
                    watchCb(res)
                }, 500)
            )
        }

        return await rebuild()

        async function rebuild() {
            const res = await compileFile(args.filename, opts)
            const binary = res.binary

            let deployStatus = ""
            if (args.deployTo) {
                if (prevBytecode && bufferEq(prevBytecode, binary)) {
                    deployStatus = `skipping identical deploy`
                } else {
                    try {
                        const service = deployService()
                        await deployToService(service, binary)
                        deployStatus = `OK`
                    } catch (err) {
                        deployStatus = err.message || "" + err
                    }
                }
            }

            delete res.binary
            const r: BuildStatus = {
                ...res,
                deployStatus,
            }
            return r
        }

        function deployService() {
            if (args.deployTo == "*") {
                const services = bus.services({
                    serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
                })
                if (services.length > 1)
                    throw new Error(`more than one devs mgr`)
                else if (services.length == 0)
                    throw new Error(`no devs mgr found`)

                return services[0]
            }

            const dev = bus.device(args.deployTo, true)
            if (!dev) throw new Error(`device ${args.deployTo} not found`)

            const service = dev.services({
                serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
            })[0]
            if (!service) throw new Error(`device ${dev} doesn't have devsmgr`)
            return service
        }
    }
}
