/* eslint-disable @typescript-eslint/no-var-requires */
const WebSocket = require("faye-websocket")
import http from "http"
import url from "url"
import net from "net"
import { error, log } from "./command"
import { watch } from "fs-extra"
import { resolveBuildConfig, SrcFile } from "@devicescript/compiler"
import {
    bufferConcat,
    debounce,
    delay,
    ERROR,
    Flags,
    FRAME_PROCESS,
    JDBus,
    JDFrameBuffer,
    loadServiceSpecifications,
    serializeToTrace,
    SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts"
import { deployToService } from "./deploy"
import { open, readFile } from "fs/promises"
import EventEmitter from "events"
import {
    connectTransport,
    createTransports,
    initTransportCmds,
    TransportsOptions,
} from "./transport"
import { fetchDevToolsProxy } from "./devtoolsproxy"
import {
    DevToolsClient,
    DevToolsIface,
    initSideProto,
    processSideMessage,
} from "./sidedata"
import { FSWatcher } from "fs"
import { compileFile } from "./build"
import { resolve } from "path"
import {
    BuildStatus,
    BuildReqArgs,
    ConnectReqArgs,
    BuildOptions,
} from "./sideprotocol"
import { DsDapSession } from "@devicescript/dap"
import { initVMCmds, overrideConsoleDebug, stopVmWorker } from "./vmworker"
import { enableLogging } from "./logging"
import { cliVersion } from "./version"
import { EXIT_CODE_EADDRINUSE } from "./exitcodes"
import { initAddCmds } from "./init"

export interface DevToolsOptions {
    internet?: boolean
    localhost?: boolean
    trace?: string
    vscode?: boolean
    diagnostics?: boolean
}

let devtoolsSelf: DevToolsIface
let watcher: FSWatcher

function loadProjectServiceSpecifications() {
    const { added, errors } = loadServiceSpecifications(
        resolveBuildConfig().services
    )
    if (added?.length)
        console.debug(`services: added ${added.map(a => a.shortId).join(", ")}`)
    if (errors?.length)
        errors.forEach(err =>
            console.error(
                `services: error adding ${err.spec.shortId}, ${err.message}`
            )
        )
}

export async function devtools(
    fn: string | undefined,
    options: DevToolsOptions & BuildOptions & TransportsOptions = {}
) {
    const port = 8081
    const tcpPort = 8082
    const dbgPort = 8083

    if (options.diagnostics) Flags.diagnostics = true

    overrideConsoleDebug()

    log(`${cliVersion()} running in ${process.cwd()}`)

    loadProjectServiceSpecifications()

    const traceFd = options.trace ? await open(options.trace, "w") : null

    // passive bus to sniff packets
    const transports = createTransports(options)
    const bus = new JDBus(transports, {
        client: false,
        disableRoleManager: true,
        proxy: true,
    })

    devtoolsSelf = {
        clients: [],
        bus,
        lastOKBuild: null,
        mainClient: null,
        build: buildCmd,
        watch: watchCmd,
        connect: connectCmd,
    }
    initSideProto(devtoolsSelf)
    initVMCmds()
    initTransportCmds(devtoolsSelf, bus)
    initAddCmds()

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

    startProxyServers(port, tcpPort, options)
    startDbgServer(dbgPort, options)

    enableLogging(bus)

    bus.autoConnect = true
    bus.start()
    await bus.connect(true)

    if (fn) {
        const args: BuildReqArgs = {
            filename: fn,
            deployTo: "*",
            buildOptions: options,
        }
        if (transports.length) {
            console.log("waiting for enumeration...")
            await delay(1000)
        }
        console.log(`building ${fn}...`)
        logBuildStatus(await buildCmd(args))
        console.log(`watching ${fn}...`)
        await watchCmd(args, logBuildStatus)
    }

    function logBuildStatus(st: BuildStatus) {
        console.log(`build ${fn} ${st.success ? "OK" : "Failed"}`)
        for (const msg of st.diagnostics) console.error(msg.formatted)
        if (st.deployStatus) {
            console.log(`deploy status: ${st.deployStatus}`)
        }
    }
}

function startProxyServers(
    port: number,
    tcpPort: number,
    options: DevToolsOptions
) {
    let clientId = 0

    const bus = devtoolsSelf.bus

    const listenHost = options.internet ? undefined : "127.0.0.1"
    const domain = listenHost || "localhost"
    log(`   http     : http://${domain}:${port}`)
    log(`   websocket: ws://${domain}:${port}`)
    const server = http.createServer(function (req, res) {
        const parsedUrl = url.parse(req.url)
        const pathname = parsedUrl.pathname
        if (pathname === "/") {
            fetchDevToolsProxy(options.localhost, options.vscode)
                .then(proxyHtml => {
                    res.setHeader("Cache-control", "no-cache")
                    res.setHeader("Content-type", "text/html")
                    res.end(proxyHtml)
                })
                .catch(e => {
                    error(e)
                    res.statusCode = 3
                })
        } else {
            res.statusCode = 404
        }
    })
    server.on("error", handleError)
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

    log(`   tcpsocket: tcp://${domain}:${tcpPort}`)
    const tcpServer = net.createServer(socket => {
        const sender = "tcp" + ++clientId
        const client: DevToolsClient = socket as any
        client.__devsSender = sender
        client.send = (pkt0: Buffer | string) => {
            if (typeof pkt0 == "string") return
            if (socket.readyState !== "open") return
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
    tcpServer.on("error", handleError)
    tcpServer.listen(tcpPort, listenHost)

    function handleError(err: Error) {
        if (/EADDRINUSE/.test(err.message)) process.exit(EXIT_CODE_EADDRINUSE)
        else {
            error(err)
            process.exit(1)
        }
    }

    function removeClient(client: DevToolsClient) {
        const i = devtoolsSelf.clients.indexOf(client)
        devtoolsSelf.clients.splice(i, 1)
        if (devtoolsSelf.mainClient == client) devtoolsSelf.mainClient = null
        log(`client: disconnected (${devtoolsSelf.clients.length} clients)`)
    }

    function processPacket(message: Buffer | Uint8Array, sender: string) {
        const data: JDFrameBuffer = new Uint8Array(message)
        data._jacdac_sender = sender
        bus.sendFrameAsync(data)
    }
}

function startDbgServer(port: number, options: DevToolsOptions) {
    let fnResolveMap: Record<string, string> = {}

    const resolvePath = (s: SrcFile) => fnResolveMap[s.path]

    async function checkFiles() {
        fnResolveMap = {}
        const folder = process.cwd()
        const dbg = devtoolsSelf.lastOKBuild.dbg
        for (const f of dbg.sources) {
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

    const listenHost = options.internet ? undefined : "127.0.0.1"
    const domain = listenHost || "localhost"
    console.log(`   dbgserver: tcp://${domain}:${port}`)
    net.createServer(async socket => {
        console.log("dbgserver: connection")
        let session: DsDapSession
        socket.on("end", async () => {
            console.log("dbgserver: connection closed")
            await session?.finish()
            await stopVmWorker()
        })
        const dbg = devtoolsSelf.lastOKBuild?.dbg
        if (!dbg) {
            error("dbgserver: can't find any build to debug")
            // TODO compare sha256
            socket.end()
            return
        }
        await checkFiles()
        session = new DsDapSession(devtoolsSelf.bus, dbg, resolvePath)
        session.setRunAsServer(true)
        session.start(socket, socket)
    }).listen(port, listenHost)
}

async function connectCmd(req: ConnectReqArgs) {
    await connectTransport(devtoolsSelf.bus, req)
}

async function buildCmd(args: BuildReqArgs) {
    args = { ...args }
    return await rebuild(args)
}

async function watchCmd(
    args: BuildReqArgs,
    watchCb?: (st: BuildStatus) => void
) {
    args = { ...args }
    watcher?.close()
    if (!args.filename) watcher = undefined
    else
        watcher = watch(
            args.filename,
            debounce(async () => {
                let res: BuildStatus
                try {
                    res = await rebuild(args)
                } catch (err) {
                    res = {
                        success: false,
                        dbg: null,
                        binary: null,
                        diagnostics: [],
                        usedFiles: [args.filename],
                        deployStatus: err.message || "" + err,
                    }
                }
                watchCb(res)
            }, 500)
        )
}

async function rebuild(args: BuildReqArgs) {
    const opts = { ...args.buildOptions }
    if (!opts.cwd) opts.cwd = process.cwd()
    opts.verify = false
    opts.quiet = true

    const res = await compileFile(args.filename, opts)

    let deployStatus = ""
    if (args.deployTo && res.success) {
        const binary = res.binary
        try {
            const service = deployService(args)
            await deployToService(service, binary)
            deployStatus = `OK`
        } catch (err) {
            deployStatus = err.message || "" + err
            error("Deploy error: " + deployStatus)
        }
    }

    delete res.binary
    res.diagnostics.forEach(d => {
        d.filename = resolve(d.filename)
    })
    const r: BuildStatus = {
        ...res,
        deployStatus,
    }
    if (res.success) devtoolsSelf.lastOKBuild = r
    return r
}

function deployService(args: BuildReqArgs) {
    const bus = devtoolsSelf.bus
    if (args.deployTo == "*") {
        const services = bus.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
            lost: false,
        })
        if (services.length > 1)
            throw new Error(`Multiple DeviceScript Managers found.`)
        else if (services.length == 0)
            throw new Error(`No DeviceScript Managers found.`)

        return services[0]
    }

    const dev = bus.device(args.deployTo, true)
    if (!dev) throw new Error(`Device ${args.deployTo} not found`)

    const service = dev.services({
        serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
    })[0]
    if (!service)
        throw new Error(`Device ${dev} doesn't have a DeviceScript Manager.`)
    return service
}
