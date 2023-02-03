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
import { addReqHandler, DevToolsIface, sendEvent } from "./sidedata"
import {
    SideTransportEvent,
    SideTransportReq,
    SideTransportResp,
    TransportStatus,
} from "./sideprotocol"

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

    // handle commandts
    addReqHandler<SideTransportReq, SideTransportResp>(
        "transport",
        async msg => {
            const { data } = msg
            const { type, action } = data
            const transports = bus.transports.filter(tr => tr.type === type)
            switch (action) {
                case "unmount": {
                    await Promise.all(transports.map(tr => tr.disconnect()))
                    transports.forEach(tr => tr.dispose())
                    break
                }
                case "connect": {
                    await Promise.all(transports.map(tr => tr.connect()))
                    break
                }
                case "disconnect": {
                    await Promise.all(transports.map(tr => tr.disconnect()))
                    break
                }
                case "status": {
                    // do nothing
                    break
                }
            }

            return snapshot()
        }
    )

    send()
}
