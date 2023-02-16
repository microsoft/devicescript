import { SerialPort } from "serialport"
import { error } from "console"
import { delimiter, resolve } from "path"
import { existsSync } from "fs"
import { spawn } from "child_process"
import { log, verboseLog } from "./command"

export interface FlashOptions {
    allSerial?: boolean
    baud?: string
    port?: string
    bin?: string
    esptool?: string
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

    log(`using serial port ${portinfo.path} at ${baudrate}`)

    const dirs = process.env.PATH.split(delimiter)
    const idfPath = process.env["IDF_PATH"]
    if (idfPath) dirs.push(resolve(idfPath, "components/esptool_py/esptool"))

    if (!options.esptool) {
        for (const dir of dirs) {
            const fn = resolve(dir, "esptool.py")
            if (existsSync(fn)) {
                options.esptool = fn
                break
            }
        }
    }

    if (!options.esptool) fatal("specify --esptool <path-to-esptool.py>")

    log(`esptool: ${options.esptool}`)
    console.log(await runEsptool("chip_id"))

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

    function runEsptool(...args: string[]) {
        return new Promise<ProcResult>((resolve, reject) => {
            const allargs = [
                "--port",
                portinfo.path,
                "--baud",
                "" + baudrate,
            ].concat(args)
            verboseLog(`run: ${options.esptool} ${allargs.join(" ")}`)
            const proc = spawn(options.esptool, allargs, {
                stdio: "pipe",
            })
            let stdout = ""
            let stderr = ""
            let done = false
            proc.stdin.end()
            proc.stdout.setEncoding("utf-8")
            proc.stderr.setEncoding("utf-8")
            proc.stdout.on("data", (s: string) => {
                stdout += s
                process.stdout.write(s)
            })
            proc.stderr.on("data", (s: string) => {
                stderr += s
                process.stdout.write(s)
            })
            proc.on("error", err => {
                if (!done) {
                    done = true
                    reject(err)
                }
            })
            proc.on("exit", (code, signal) => {
                if (!done) {
                    done = true
                    if (code === 0) resolve({ code, signal, stdout, stderr })
                    else reject(new Error(`Exit code: ${code} ${signal}`))
                }
            })
        })
    }
}

interface ProcResult {
    code: number
    signal: string
    stdout: string
    stderr: string
}
