import { log } from "./command"
import {
    CONNECTION_STATE,
    createNodeSPITransport,
    createNodeUSBOptions,
    createNodeWebSerialTransport,
    createUSBTransport,
    createWebSocketTransport,
    JDBus,
    shortDeviceId,
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
    SideUploadBinFromDevice,
    SideUploadJsonFromDevice,
} from "@devicescript/interop"
import { printDmesg } from "./vmworker"
import { askForPackageInstallation } from "./packageInstaller"

export interface TransportsOptions {
    usb?: boolean
    serial?: boolean
    spi?: boolean
}

function tryRequire(name: string) {
    return require(name)
}

async function createSPI() {
    await askForPackageInstallation('rpio');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RPIO = tryRequire("rpio")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SpiDev = tryRequire("spi-device")
    return createNodeSPITransport(RPIO, SpiDev)
}
async function createUSB() {
    await askForPackageInstallation('usb');
    const usb = tryRequire("usb")
    const options = createNodeUSBOptions(usb.WebUSB)
    return createUSBTransport(options)
}
async function createSerial() {
    await askForPackageInstallation('serialport');
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
        const pref = shortDeviceId(msg.deviceId) || "G"
        switch (type) {
            case "uploadJson": {
                const m = msg as SideUploadJsonFromDevice
                console.log(`${pref}> ${m.topic}`, m.value)
                break
            }
            case "uploadBin": {
                const m = msg as SideUploadBinFromDevice
                console.log(`${pref}> ${m.topic}`, m.payload64)
                break
            }
            case "logs": {
                const m = msg as SideLogsFromDevice
                m.logs?.forEach(line => printDmesg(undefined, pref, line))
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
            newTransport = await createSPI()
            break
        }
        case "serial": {
            newTransport = await createSerial()
            break
        }
        case "usb": {
            newTransport = await createUSB()
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

export async function createTransports(options: TransportsOptions) {
    const transports: Transport[] = []
    if (options.usb) transports.push(await createUSB())
    if (options.serial) transports.push(await createSerial())
    if (options.spi) transports.push(await createSPI())
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
