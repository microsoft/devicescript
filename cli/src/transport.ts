import { log } from "./command"
import {
    CONNECTION_STATE,
    createNodeSPITransport,
    createNodeUSBOptions,
    createNodeWebSerialTransport,
    createUSBTransport,
    JDBus,
    Transport,
} from "jacdac-ts"
import { DevToolsIface, sendEvent } from "./sidedata"
import { SideTransportEvent, TransportStatus } from "./sideprotocol"

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

export async function connectTransport(
    bus: JDBus,
    type: string,
    background: boolean
) {
    let transports = bus.transports.filter(tr => !type || type === tr.type)
    if (!transports.length && type) {
        const excluded = ["serial", "spi", "usb"].filter(t => t !== type)
        // stop other transports
        for (const transport of bus.transports.filter(({ type }) =>
            excluded.includes(type)
        )) {
            console.log(`stopping ${transport.type} transport`)
            await transport.disconnect()
            transport.dispose()
            console.log(bus.transports.map(tr => tr.type).join(","))
        }
        // need to start transport
        switch (type) {
            case "spi": {
                bus.addTransport(createSPI())
                break
            }
            case "serial": {
                bus.addTransport(createSerial())
                break
            }
            case "usb": {
                bus.addTransport(createUSB())
                break
            }
        }
        transports = bus.transports.filter(tr => !type || type === tr.type)
    }

    await Promise.all(transports.map(tr => tr.connect(background)))
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
