import { log } from "./command"
import {
    CONNECTION_STATE,
    createNodeSPITransport,
    createNodeUSBOptions,
    createNodeWebSerialTransport,
    createUSBTransport,
    createWebSocketTransport,
    JDBus,
    SIDE_DATA,
    Transport,
} from "jacdac-ts"
import { DevToolsIface, sendEvent } from "./sidedata"
import {
    ConnectReqArgs,
    SideTransportEvent,
    TransportStatus,
    WebSocketConnectReqArgs,
} from "./sideprotocol"
import { setupWebsocket } from "./build"
import type {
    SideDeviceMessage,
    SideLogsFromDevice,
} from "@devicescript/interop"

export interface TransportsOptions {
    usb?: boolean
    serial?: boolean
    spi?: boolean
}

function tryRequire(name: string) {
    return require(name)
}

function createSPI() {
    log(`adding SPI transport (requires "rpio" package)`)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RPIO = tryRequire("rpio")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SpiDev = tryRequire("spi-device")
    return createNodeSPITransport(RPIO, SpiDev)
}
function createUSB() {
    log(`adding USB transport (requires "usb" package)`)
    const usb = tryRequire("usb")
    const options = createNodeUSBOptions(usb.WebUSB)
    return createUSBTransport(options)
}
function createSerial() {
    log(`adding serial transport (requires "serialport" package)`)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SerialPort = tryRequire("serialport").SerialPort
    return createNodeWebSerialTransport(SerialPort)
}

function createWebSocket(url: string, protocol: string) {
    setupWebsocket()
    const transport = createWebSocketTransport(url, {
        protocols: protocol,
        WebSocket: WebSocket,
    })
    transport.on(SIDE_DATA, (msg: SideDeviceMessage) => {
        const { type } = msg
        switch (type) {
            case "logs": {
                const m = msg as SideLogsFromDevice
                m.logs?.forEach(line => {
                    console.log(line)
                })
            }
            default: {
                console.debug(JSON.stringify(msg, null, 2))
            }
        }
    })
    return transport
}

export async function connectTransport(bus: JDBus, req: ConnectReqArgs) {
    const { transport: type, background, resourceGroupId } = req
    // no type, reconnect all
    if (!type) {
        await Promise.all(bus.transports.map(tr => tr.connect(background)))
        return
    }

    // cancel all existing connectin in resource group
    const old = bus.transports.filter(
        tr => resourceGroupId === tr.resourceGroupId
    )
    for (const transport of old) {
        console.log(`stopping ${transport.type} transport`)
        await transport.disconnect()
        transport.dispose()
    }

    // need to start transport
    let newTransport: Transport
    switch (type) {
        case "websocket": {
            const { url, protocol } = req as WebSocketConnectReqArgs
            newTransport = createWebSocket(url, protocol)
            break
        }
        case "spi": {
            newTransport = createSPI()
            break
        }
        case "serial": {
            newTransport = createSerial()
            break
        }
        case "usb": {
            newTransport = createUSB()
            break
        }
        case "none": {
            // disconnect
            break
        }
    }

    if (newTransport) {
        newTransport.resourceGroupId = resourceGroupId
        bus.addTransport(newTransport)
    }

    await Promise.all(bus.transports.map(tr => tr.connect(background)))
}

export function createTransports(options: TransportsOptions) {
    const transports: Transport[] = []
    if (options.usb) transports.push(createUSB())
    if (options.serial) transports.push(createSerial())
    if (options.spi) transports.push(createSPI())
    return transports
}

export function initTransportCmds(devtools: DevToolsIface, bus: JDBus) {
    const snapshot = () =>
        <TransportStatus>{
            autoConnect: bus.autoConnect,
            transports: bus.transports.map(tr => ({
                type: tr.type,
                connectionState: tr.connectionState,
                description: tr.description(),
            })),
        }
    const send = () =>
        sendEvent<SideTransportEvent>(
            devtools?.mainClient,
            "transport",
            snapshot()
        )

    // notify about connection
    bus.on(CONNECTION_STATE, send)

    send()
}
