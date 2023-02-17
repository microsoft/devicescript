import { SerialPort } from "serialport"
import { error } from "console"
import { delimiter, join, resolve } from "path"
import { existsSync, readFile, readFileSync, Stats, writeFileSync } from "fs"
import { spawn } from "child_process"
import { log, verboseLog } from "./command"
import { boardSpecifications } from "@devicescript/compiler"
import { DeviceConfig } from "@devicescript/srvcfg"
import { boardInfo } from "./binpatch"
import { readdir, stat, writeFile } from "fs/promises"
import { mkdirp } from "fs-extra"

export interface FlashOptions {
    board?: string
}

export interface FlashESP32Options extends FlashOptions {
    allSerial?: boolean
    baud?: string
    port?: string
    esptool?: string
}

export interface FlashRP2040Options extends FlashOptions {
    drive?: string
}

function fatal(msg: string) {
    error("fatal: " + msg)
    process.exit(1)
}

function showBoards(boards: DeviceConfig[]) {
    log("Please select board, available options:")
    for (const b of boards) {
        const info = boardInfo(b, boardSpecifications.archs[b.archId])
        log(`    --board ${b.id.padEnd(25)}  ${info.name}`)
    }
}

function showAllBoards(arch: string) {
    showBoards(
        Object.values(boardSpecifications.boards).filter(b =>
            b.archId.includes(arch)
        )
    )
}

function checkBoard(arch: string, options: FlashOptions, force = false) {
    if (options.board || force) {
        const b = boardSpecifications.boards[options.board]
        if (!b) {
            showAllBoards(arch)
            if (!options.board) fatal("missing --board")
            else fatal("invalid board id: " + options.board)
        }
        return b
    }
    return null
}

export async function flashESP32(options: FlashESP32Options) {
    const vendors = [
        0x10c4, // SiLabs CP2102
        0x303a, // Espressif (C3, S2, ...)
        0x1a86, // CH340 etc
    ]

    checkBoard("esp32", options)

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

    if (!options.board) {
        log("Identify arch")
        const { stdout } = await runEsptool("--after", "no_reset", "chip_id")
        const m = /Chip is (ESP32[A-Z0-9-]+)/.exec(stdout)
        if (m) {
            const id = m[1].replace(/-D0.*/, "").replace(/-/g, "").toLowerCase()
            if (boardSpecifications.archs[id]) {
                const boards = Object.values(boardSpecifications.boards).filter(
                    b => b.archId == id
                )
                showBoards(boards)
                process.exit(1)
            }
        }

        showAllBoards("esp32")
        fatal("Failed to auto-detect architecture")
    }

    const board = boardSpecifications.boards[options.board]

    const cachePath = await fetchFW(board)

    const moff = /-(0x[a-f0-9]+)\.bin$/.exec(board.$fwUrl)
    if (!moff)
        fatal("invalid $fwUrl format, should end in -0x1000.bin or similar")

    const { code } = await runEsptool("write_flash", moff[1], cachePath)

    process.exit(code === 0 ? 0 : 1)

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
        const allargs = [
            "--port",
            portinfo.path,
            "--baud",
            "" + baudrate,
        ].concat(args)
        return runTool(options.esptool, ...allargs)
    }
}

async function fetchFW(board: DeviceConfig) {
    if (!board.$fwUrl) fatal("no $fwUrl for this board, sorry...")
    const bn = board.$fwUrl.replace(/.*\//, "")
    const cachedFolder = ".devicescript/cache/"
    const cachePath = cachedFolder + bn
    const st = await stat(cachePath, { bigint: false }).catch<Stats>(_ => null)
    if (st && Date.now() - st.mtime.getTime() < 24 * 3600 * 1000) {
        log(`using cached ${cachePath}`)
    } else {
        log(`fetch ${board.$fwUrl}`)
        const resp = await fetch(board.$fwUrl)
        if (resp.status != 200)
            fatal(`can't fetch: ${resp.status} ${resp.statusText}`)
        const buf = Buffer.from(await resp.arrayBuffer())
        await mkdirp(cachedFolder)
        writeFileSync(cachePath, buf)
        log(`saved ${cachePath} ${buf.length} bytes`)
    }

    return cachePath
}

function runTool(prog: string, ...allargs: string[]) {
    return new Promise<ProcResult>((resolve, reject) => {
        verboseLog(`run: ${prog} ${allargs.join(" ")}`)
        const proc = spawn(prog, allargs, {
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
                resolve({ code, signal, stdout, stderr })
            }
        })
    })
}

interface ProcResult {
    code: number
    signal: string
    stdout: string
    stderr: string
}

async function getDrives(deployDrivesRx: string): Promise<string[]> {
    if (process.platform == "win32") {
        const rx = new RegExp("^([A-Z]:)\\s+(\\d+).* " + deployDrivesRx)
        const { stdout } = await runTool(
            "wmic",
            "PATH",
            "Win32_LogicalDisk",
            "get",
            "DeviceID,",
            "VolumeName,",
            "FileSystem,",
            "DriveType"
        )
        let res: string[] = []
        stdout.split(/\n/).forEach(ln => {
            let m = rx.exec(ln)
            if (m && m[2] == "2") {
                res.push(m[1] + "/")
            }
        })
        return res
    } else if (process.platform == "darwin") {
        const rx = new RegExp(deployDrivesRx)
        const lst = await readdir("/Volumes")
        return lst.filter(s => rx.test(s)).map(s => "/Volumes/" + s + "/")
    } else if (process.platform == "linux") {
        const rx = new RegExp(deployDrivesRx)
        const user = process.env["USER"]
        if (existsSync(`/media/${user}`)) {
            const lst = await readdir(`/media/${user}`)
            return lst.filter(s => rx.test(s)).map(s => `/media/${user}/${s}/`)
        }
        return []
    } else {
        return []
    }
}

export async function flashRP2040(options: FlashRP2040Options) {
    const board = checkBoard("rp2040", options, true)
    if (!options.drive) {
        const drives = await getDrives("RPI-RP2")
        if (drives.length == 0)
            fatal(
                "no drives found; please plug your board while holding BOOTSEL button (or specify --drive)"
            )
        if (drives.length > 1) {
            fatal(
                `multiple drives found, please specify one of: ${drives
                    .map(d => `--drive "${d}"`)
                    .join(", ")}`
            )
        }
        options.drive = drives[0]
    }
    log(`using drive ${options.drive}`)
    const fn = await fetchFW(board)
    const buf = readFileSync(fn)
    log(`cp ${fn} ${options.drive}`)
    await writeFile(join(options.drive, "fw.uf2"), buf)
    log("OK")
}
