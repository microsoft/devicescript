import { SerialPort } from "serialport"
import { delimiter, join, resolve } from "path"
import { existsSync, readFileSync, Stats, writeFileSync } from "fs"
import { spawn } from "child_process"
import { log, verboseLog, error, fatal } from "./command"
import {
    DeviceConfig,
    boardInfo,
    ResolvedBuildConfig,
    architectureFamily,
} from "@devicescript/compiler"
import { readdir, stat, writeFile } from "fs/promises"
import { mkdirp } from "fs-extra"
import { delay, groupBy } from "jacdac-ts"
import { buildConfigFromDir } from "./build"
import { patchCustomBoard } from "./binpatch"

let buildConfig: ResolvedBuildConfig

export function setupFlashBoards(dir = ".") {
    const r = buildConfigFromDir(dir)
    buildConfig = r.buildConfig
    return buildConfig
}

export interface FlashOptions {
    board?: string
    once?: boolean
    refresh?: boolean
    /**
     * Automatically install missing flashing utilities.
     * For ESP32, if {@link https://docs.espressif.com/projects/esptool/en/latest/esp32/ | esptool} is missing,
     * run `py -m pip install esptool`
     */
    install?: boolean

    /**
     * Path to the python executable.
     */
    python?: string

    /**
     * Delete settings and user program instead of flashing the firmware.
     */
    clean?: boolean
}

export interface FlashESP32Options extends FlashOptions {
    allSerial?: boolean
    baud?: string
    port?: string
    /**
     * Path to the esptool.py script.
     */
    esptool?: string
}

export interface FlashRP2040Options extends FlashOptions {
    drive?: string
}

function boardsToString(boards: DeviceConfig[], opt = "--board") {
    const byArch = groupBy(boards, b => b.archId)
    let r = ""
    for (const archId of Object.keys(byArch)) {
        const arch = buildConfig.archs[archId]
        r += `  ${arch?.name ?? archId}:\n`
        for (const b of byArch[archId]) {
            const info = boardInfo(b, buildConfig.archs[b.archId])
            r += `    ${opt} ${b.id.padEnd(25)}  ${info.name}\n`
        }
    }
    return r
}

export function showBoards(boards: DeviceConfig[], opt = "--board") {
    log("Please select board, available options:")
    log(boardsToString(boards, opt))
}

export function boardNames(arch = "", opt = "--board") {
    return boardsToString(
        Object.values(buildConfig.boards).filter(b => b.archId.includes(arch)),
        opt
    )
}

export function showAllBoards(arch: string, opt = "--board") {
    showBoards(
        Object.values(buildConfig.boards).filter(b => b.archId.includes(arch)),
        opt
    )
}

async function checkBoard(arch: string, options: FlashOptions) {
    await setupFlashBoards()
    const b = buildConfig.boards[options.board]
    if (!b) {
        showAllBoards(arch)
        if (!options.board) fatal("missing --board")
        else fatal("invalid board id: " + options.board)
    }
    return b
}

export async function flashESP32(options: FlashESP32Options) {
    const vendors = [
        0x10c4, // SiLabs CP2102
        0x303a, // Espressif (C3, S2, ...)
        0x1a86, // CH340 etc
        0x0403, // M5stick
    ]

    const board = await checkBoard("esp32", options)

    const listPorts = async () => {
        const ports = await SerialPort.list()
        if (process.platform == "darwin")
            for (const p of ports)
                p.path = p.path.replace("/dev/tty.", "/dev/cu.")
        return ports
    }

    let ports0 = await listPorts()
    let ports = ports0
    const plugin = "try plugging in your board while holding IO0/BOOT button"
    let msg = ""
    if (ports.length == 0) msg = "no serial ports found; " + plugin

    const filterPorts = () => {
        if (!options.allSerial) {
            ports = ports.filter(p =>
                vendors.includes(parseInt(p.vendorId, 16))
            )
            if (!msg && ports.length == 0) {
                printPorts()
                msg = "no viable ports found; try --all-serial or " + plugin
            }
        }
    }

    if (options.port) {
        ports = ports.filter(p => p.path == options.port)
        if (ports.length == 0) {
            printPorts()
            fatal(`port ${options.port} not found`)
        }
    } else {
        filterPorts()
        ports = await rescan(
            options,
            async () => {
                ports0 = await listPorts()
                ports = ports0
                filterPorts()
                return ports
            },
            msg
        )
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
        const tools: string[] = []
        for (const dir of dirs) {
            const fn = resolve(dir, "esptool.py")
            if (!tools.includes(fn) && existsSync(fn)) {
                tools.push(fn)
            }
        }

        if (tools.length > 1)
            log("found multiple esptools: " + tools.join(", "))

        // prefer tool not installed with esp-idf - it's easier to upgrade with pip
        options.esptool =
            tools.find(t => !/components.esptool_py/.test(t)) ?? tools[0]
    }

    if (!options.esptool) {
        await findEsptool()
    }

    if (!options.esptool && options.install) {
        log("trying to install esptool with pip...")
        for (const cmd of pythonPaths().map(
            py => `${py} -m pip install esptool`
        )) {
            const { stdout } = await runTool({ cmd, quiet: true })
            if (/esptool/.test(stdout)) {
                console.log(`esptool installed`)
                break
            }
        }
        await findEsptool()
    }

    if (!options.esptool) {
        error(
            "esptool.py not found; please install it by running:\n" +
                "    pip install esptool\n" +
                "or specify esptool location with --esptool <path-to-esptool.py>"
        )
        process.exit(1)
    }

    log(`esptool: ${options.esptool}`)

    const cachePath = await fetchFW(board, options)

    if (options.clean) {
        const { code } = await runEsptool("erase_flash")
        if (code === 0) {
            log("erase flash OK!")
            process.exit(0)
        } else {
            error("erase flash failed")
            process.exit(1)
        }
    } else {
        const moff = /-(0x[a-f0-9]+)\.bin$/.exec(cachePath)
        if (!moff)
            fatal("invalid $fwUrl format, should end in -0x1000.bin or similar")

        const { code } = await runEsptool("write_flash", moff[1], cachePath)

        if (code === 0) {
            log("flash OK, you can connect again to the device.")
            process.exit(0)
        } else {
            error("flash failed")
            process.exit(1)
        }
    }

    function pythonPaths() {
        if (options.python) return [options.python]
        else return ["py", "python", "python3", "/usr/local/bin/python"]
    }

    async function findEsptool() {
        for (const tool of pythonPaths().map(py => `${py} -m esptool`)) {
            const { stdout } = await runTool({ cmd: tool, quiet: true })
            if (oldEsptool(stdout) === "") {
                options.esptool = tool
                break
            }
        }
    }

    function printPorts(all = true) {
        console.log(all ? "All serial ports:" : "Viable serial ports:")
        for (const p of all ? ports0 : ports) {
            console.log(
                `${p.path}: ${p.manufacturer ?? ""} ${p.vendorId}:${
                    p.productId
                }`
            )
        }
        console.log("")
    }

    function oldEsptool(stdout: string) {
        let m = /esptool\.py v(\d+)\.(\d+)/.exec(stdout)
        if (m) {
            const v = +m[1] * 1000 + +m[2]
            if (v < 4005) return `v${m[1]}.${m[2]}`
            else return ""
        } else {
            return undefined
        }
    }

    async function runEsptool(...args: string[]) {
        const allargs = [
            "--port",
            portinfo.path,
            "--baud",
            "" + baudrate,
        ].concat(args)
        const res = await runTool({ cmd: options.esptool, args: allargs })
        if (res.code !== 0) {
            const ver = oldEsptool(res.stdout)
            if (ver) {
                error(
                    `detected esptool.py ${ver}; please update your esptool to v4.5+ by running:\n` +
                        `  pip install esptool`
                )
            }

            let m = /Chip is (ESP32[A-Z0-9-]+)/.exec(res.stdout)
            let chipId = "unknown"
            let boards: DeviceConfig[] = []
            if (m) {
                chipId = m[1]
                    .replace(/-D0.*/, "")
                    .replace(/-/g, "")
                    .toLowerCase()
                if (buildConfig.archs[chipId]) {
                    boards = Object.values(buildConfig.boards).filter(
                        b => b.archId == chipId
                    )
                }
            }

            if (
                /Unable to verify flash chip connection|No serial data received/.test(
                    res.stdout
                )
            ) {
                error(
                    `Can't start flashing; plug in the board while holding BOOT/IO0 button and try flashing again`
                )
                process.exit(1)
            }

            if (/Unexpected chip id in image/.test(res.stdout)) {
                error(
                    `Chip mismatch: connected device has '${chipId}' chip; ` +
                        `${board.devName} (${board.id}) uses '${board.archId}' chip`
                )
                if (boards.length) {
                    log(`Please use one of the boards below:`)
                    showBoards(boards)
                }
                process.exit(1)
            }

            if (
                /Hash of data verified/.test(res.stdout) &&
                /was placed into download mode using GPIO0/.test(res.stdout)
            ) {
                error(`flashed OK but please reset or unplug the board`)
                process.exit(0)
            }
        }
        return res
    }
}

async function fetchFW(board: DeviceConfig, options: FlashOptions) {
    let dlUrl = board.$fwUrl
    let needsPatch = false
    if (!dlUrl) {
        const arch = buildConfig.archs[board.archId]
        if (arch?.bareUrl) {
            dlUrl = arch?.bareUrl
            needsPatch = true
        } else {
            fatal(
                "no $fwUrl for this board and no .bareUrl in arch file, sorry..."
            )
        }
    }

    if (options.clean && board.archId.includes("rp2040"))
        dlUrl = "https://datasheets.raspberrypi.com/soft/flash_nuke.uf2"

    const bn = dlUrl.replace(/.*\//, "")
    const cachedFolder = ".devicescript/cache/"
    const cachePath = cachedFolder + bn
    const st = await stat(cachePath, { bigint: false }).catch<Stats>(_ => null)
    if (
        !options.refresh &&
        st &&
        Date.now() - st.mtime.getTime() < 24 * 3600 * 1000
    ) {
        log(`using cached ${cachePath}`)
    } else {
        log(`fetch ${dlUrl}`)
        const resp = await fetch(dlUrl)
        if (resp.status != 200)
            fatal(`can't fetch: ${resp.status} ${resp.statusText}`)
        const buf = Buffer.from(await resp.arrayBuffer())
        await mkdirp(cachedFolder)
        writeFileSync(cachePath, buf)
        log(`saved ${cachePath} ${buf.length} bytes`)
    }

    if (!needsPatch) return cachePath

    const bn2 = bn.replace(/(.*-)([a-z]\w+)/i, (_, p, s) => p + board.id)
    log(`patching ${bn} -> ${bn2}...`)
    const cachePath2 = cachedFolder + bn2

    const arch = buildConfig.archs[board.archId]
    const buf = await patchCustomBoard(cachePath, board, arch)
    writeFileSync(cachePath2, buf)
    log(`saved ${cachePath2} ${buf.length} bytes`)

    return cachePath2
}

function runTool(opts: { cmd: string; args?: string[]; quiet?: boolean }) {
    return new Promise<ProcResult>((resolve, reject) => {
        let { cmd, args = [] } = opts
        if (cmd.includes(" ")) {
            const w = cmd.split(/\s+/)
            cmd = w[0]
            args.unshift(...w.slice(1))
        }
        log(`run: ${cmd} ${args.join(" ")}`)
        const proc = spawn(cmd, args, {
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
            if (!opts.quiet) process.stdout.write(s)
        })
        proc.stderr.on("data", (s: string) => {
            stderr += s
            if (!opts.quiet) process.stdout.write(s)
        })
        proc.on("error", err => {
            if (!done) {
                done = true
                if (opts.quiet)
                    resolve({ code: 127, signal: "error", stdout, stderr })
                else reject(err)
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
        const { stdout } = await runTool({
            cmd: "wmic",
            args: [
                "PATH",
                "Win32_LogicalDisk",
                "get",
                "DeviceID,",
                "VolumeName,",
                "FileSystem,",
                "DriveType",
            ],
        })
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

async function rescan<T>(
    options: FlashOptions,
    fn: () => Promise<T[]>,
    msg: string
) {
    let idx = 0
    const start = Date.now()
    const nsec = 120
    while (Date.now() - start < nsec * 1000) {
        const res = await fn()
        if (res.length > 0) return res
        if (options.once) {
            fatal(msg)
        }
        if (idx == 0) {
            log(msg)
            log(
                `Re-scanning every second for the next ${nsec} seconds, Ctrl-C to stop...`
            )
        }
        idx++
        await delay(1000)
        verboseLog(`Scan ${idx}...`)
    }
    fatal(msg)
}

export async function flashRP2040(options: FlashRP2040Options) {
    const board = await checkBoard("rp2040", options)
    if (!options.drive) {
        const drives = await rescan(
            options,
            () => getDrives("RPI-RP2"),
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
    const fn = await fetchFW(board, options)
    const buf = readFileSync(fn)
    log(`cp ${fn} ${options.drive}`)
    await writeFile(join(options.drive, "fw.uf2"), buf)
    log("flash OK, you can connect again to the device.")
}

export async function flashAuto(options: FlashOptions) {
    const board = await checkBoard("", options)
    const arch = architectureFamily(board.archId)
    if (arch == "esp32") return flashESP32(options)
    else if (arch == "rp2040") return flashRP2040(options)
    else {
        fatal(`unknown arch family: ${arch}`)
    }
}
