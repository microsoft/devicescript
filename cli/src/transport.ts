
import { log } from "./command"
import {
    createNodeSPITransport,
    createNodeUSBOptions,
    createNodeWebSerialTransport,
    createUSBTransport,
    Transport,
} from "jacdac-ts"

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