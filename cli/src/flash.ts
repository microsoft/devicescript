import { ESPLoader } from "../esptool-js/src/esploader"
import { NodeSerialIO } from "../esptool-js/src/nodeserial"
import { Transport } from "../esptool-js/src/transport"
import { SerialPort } from "serialport"
import { error } from "console"
import { createHash } from "crypto"
import { readFile } from "fs/promises"
import { isVerbose } from "./command"

export interface FlashOptions {
    allSerial?: boolean
    baud?: string
    port?: string
    bin?: string
}

function fatal(msg: string) {
    error("fatal: " + msg)
    process.exit(1)
}

export async function flash(options: FlashOptions) {
    const vendors = [
        0x10c4, // SiLabs CP2102
        0x303a, // Espressif (C3, S2, ...)
        0x1a86, // CH340 etc
    ]
    const ports0 = await SerialPort.list()
    if (process.platform == "darwin")
        for (const p of ports0) p.path = p.path.replace("/dev/tty.", "/dev/cu.")

    let ports = ports0
    if (ports.length == 0) fatal("no serial ports found")
    if (options.port) {
        ports = ports.filter(p => p.path == options.port)
        if (ports.length == 0) {
            printPorts()
            fatal(`port ${options.port} not found`)
        }
    } else if (!options.allSerial) {
        ports = ports.filter(p => vendors.includes(parseInt(p.vendorId, 16)))
        if (ports.length == 0) {
            printPorts()
            fatal("no viable ports found; try --all-serial")
        }
    }

    if (ports.length > 1) {
        printPorts(false)
        fatal(
            `more than one port viable; use '--port ${ports[0].path}' or similar`
        )
    }

    const portinfo = ports[0]
    const baudrate = parseInt(options.baud) || 1500000

    console.log(`using serial port ${portinfo.path} at ${baudrate}`)

    const serial = new SerialPort({
        autoOpen: false,
        path: portinfo.path,
        baudRate: 115200,
    })
    const io = new NodeSerialIO(serial, portinfo)
    const transport = new Transport(io)
    const debug = isVerbose

    const loader = new ESPLoader(
        transport,
        baudrate,
        {
            clean: () => {},
            write: ln => console.log(ln),
            writeLine: ln => console.log(ln),
        },
        115200,
        debug
    )

    await loader.main_fn()

    try {
        await loader.chip.read_mac(loader)
    } catch {
        fatal("changing speed failed; try --baud 115200")
    }

    console.log(loader.chip.CHIP_NAME)

    const flash_size = "keep",
        flash_mode = "keep",
        flash_freq = "keep",
        erase_all = false,
        compress = true

    const prog = (fileIndex: number, written: number, total: number) => {}
    const md5 = (image: string) => {
        const h = createHash("md5")
        h.update(Buffer.from(image, "binary"))
        return h.digest().toString("hex")
    }

    const f = await readFile(options.bin)

    await loader.write_flash(
        [
            {
                data: f.toString("binary"),
                address: 0x1000,
            },
        ],
        flash_size,
        flash_mode,
        flash_freq,
        erase_all,
        compress,
        prog,
        md5
    )

    await loader.hard_reset()
    process.exit(0)

    function printPorts(all = true) {
        console.log(all ? "All serial ports:" : "Viable serial ports:")
        for (const p of all ? ports0 : ports) {
            console.log(
                `${p.path}: ${p.manufacturer ?? ""} ${p.vendorId}:${
                    p.productId
                }`
            )
        }
    }
}
