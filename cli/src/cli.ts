import { program, CommandOptions, Command } from "commander"
import { annotate } from "./annotate"
import { build } from "./build"
import { crunScript } from "./crun"
import { ctool } from "./ctool"
import { deployScript } from "./deploy"
import { devtools } from "./devtools"
import { disasm } from "./disasm"
import {
    addNpm,
    addService,
    addSim,
    addTest,
    addSettings,
    addI2C,
    init,
} from "./init"
import { logParse } from "./logparse"
import { runScript } from "./run"
import { compileFlagHelp } from "@devicescript/compiler"
import { startVm } from "./vm"
import { cliVersion, notifyUpdates } from "./version"
import { dcfg } from "./dcfg"
import {
    incVerbose,
    setConsoleColors,
    setDeveloperMode,
    setQuiet,
} from "./command"
import { binPatch } from "./binpatch"
import { logToConsole } from "./command"
import {
    boardNames,
    flashAuto,
    flashESP32,
    flashRP2040,
    setupFlashBoards,
} from "./flash"
import { addBoard } from "./addboard"
import { LoggerPriority } from "jacdac-ts"

export async function mainCli() {
    await notifyUpdates({
        defer: false,
        isGlobal: false,
    })

    Error.stackTraceLimit = 30

    function buildCommand(nameAndArgs: string, opts?: CommandOptions) {
        return program
            .command(nameAndArgs, opts)
            .option("-s, --stats", "show additional size information")
            .option("-o, --out-dir", "output directory, default is 'built'")
            .option("--no-verify", "don't verify resulting bytecode")
            .option(
                "--ignore-missing-config",
                "don't check for ./devsconfig.json"
            )
            .option(
                "-F, --flag <compiler-flag>",
                "set compiler flag",
                (val, prev: Record<string, boolean>) => {
                    if (!compileFlagHelp[val])
                        throw new Error(`invalid compiler flag: '${val}'`)
                    prev[val] = true
                    return prev
                },
                {}
            )
    }

    program
        .name("DeviceScript")
        .description(
            "build and run DeviceScript program https://aka.ms/devicescript"
        )
        .version(cliVersion())
        .option("-v, --verbose", "more logging (can be repeated)")
        .option("--quiet", "less logging")
        .option("--no-colors", "disable color output")
        .option("--dev", "developer mode")

    buildCommand("build", { isDefault: true })
        .description("build a DeviceScript file")
        .argument("[src/mainXYZ.ts]", "entry point", "src/main.ts")
        .action(build)

    program
        .command("flags")
        .description("show description of compiler flags")
        .action(() => {
            function pad(s: string, n: number) {
                while (s.length < n) s += " "
                return s
            }
            for (const k of Object.keys(compileFlagHelp)) {
                console.log(`    -F ${pad(k, 20)} ${compileFlagHelp[k]}`)
            }
        })

    program
        .command("devtools")
        .description("launches a local development tools server")
        .option("--internet", "allow connections from non-localhost")
        .option(
            "--localhost",
            "use localhost:8000 instead of the internet dashboard"
        )
        .option("-l, --logging", "print out device log messages as they come")
        .option("-t, --trace <string>", "save all packets to named file")
        .option("-u, --usb", "listen to Jacdac over USB (requires usb)")
        .option(
            "-s, --serial",
            "listen to Jacdac over SERIAL (requires serialport)"
        )
        .option(
            "-i, --spi",
            "listen to Jacdac over SPI (requires rpio, experimental)"
        )
        .option(
            "--vscode",
            "update behavior to match executing within Visual Studio Code"
        )
        .option("--diagnostics", "enable Jacdac-ts diagnostics")
        .arguments("[file.ts]")
        .action(devtools)

    program
        .command("ctool", { hidden: true })
        .description("access to internal compilation tools")
        .option("--empty", "generate empty program embed")
        .option("-t, --test", "run compiler tests")
        .option("--fetch-boards <boards.json>", "re-create boards.json file")
        .option(
            "--local-boards <repos-path>",
            "use local, not remote info.json files"
        )
        .option("--server-info", "generate server-info.json file")
        .action(ctool)

    program
        .command("logparse", { hidden: true })
        .description("parse binary log file from SD card")
        .option(
            "-g, --generation <number>",
            "give details for a specific generation; otherwise generations are just listed"
        )
        .option("-s, --stats", "only print stats, not content")
        .arguments("<log_xxx.jdl>")
        .action(logParse)

    buildCommand("run")
        .description("run a script")
        .option(
            "--tcp",
            "use tcp jacdac proxy on 127.0.0.1:8082 (otherwise ws://127.0.0.1:8081)"
        )
        .option("-t, --test", "run in test mode (no sockets, no restarts)")
        .option("--test-self-exit", "let the test code exit the process")
        .option(
            "-T, --test-timeout <milliseconds>",
            "set timeout for --test mode (default: 2000ms)"
        )
        .option("-w, --wait", "wait for external deploy")
        .arguments("[file.ts|file.devs]")
        .action(runScript)

    // this talks direct jacdac packets, it doesn't work with current devtools (since they do not forward jacdac packets)
    // hide it until we have a better story
    program
        .command("deploy", { hidden: true })
        .description("deploy a script over jacdac proxy")
        .option(
            "--tcp",
            "use tcp jacdac proxy on 127.0.0.1:8082 (otherwise ws://127.0.0.1:8081)"
        )
        .arguments("<file.ts|file.devs>")
        .action(deployScript)

    program
        .command("vm")
        .description("start DeviceScript VM interpreter process")
        .option(
            "--tcp",
            "use tcp jacdac proxy on 127.0.0.1:8082 (otherwise ws://127.0.0.1:8081)"
        )
        .option("--gc-stress", "stress-test the GC")
        .option("--device-id <string>", "set device ID")
        .option("--devtools", "set when spawned from devtools")
        .option("--stateless", "disable 'flash'")
        .option("--clear-flash", "clear flash before starting")
        .action(startVm)

    buildCommand("crun", { hidden: true })
        .description("run a script using native runner")
        .option("-n, --net", "connect to 127.0.0.1:8082 for Jacdac proxy")
        .option(
            "--lazy-gc",
            "only run GC when full (otherwise run on every allocation for stress-test)"
        )
        .option(
            "--settings",
            "load/save settings from files (otherwise in memory only)"
        )
        .option(
            "-s, --serial <serial-port>",
            "connect to serial port, not 127.0.0.1:8082"
        )
        .option("--test-self-exit", "let the test code exit the process")
        .arguments("<file.ts|file.devs>")
        .action(crunScript)

    program
        .command("disasm")
        .description("disassemble .devs binary")
        .option("-d, --detailed", "include all details")
        .arguments("[file.ts|file-dbg.json|file.devs]")
        .action(disasm)

    program
        .command("annotate")
        .description("annotate stack frames in stdin")
        .action(annotate)

    program
        .command("dcfg", { hidden: true })
        .description("compile/decompile DCFG files")
        .option(
            "-u, --update <file.c>",
            "update given C file with compiled output"
        )
        .option("-o, --output <file.bin>", "specify output file name")
        .arguments("<file.json|file.bin>")
        .action(dcfg)

    const flash = program.command("flash")

    // inherit parent command options in the subcommand
    function inheritOpts(fn: (...args: any[]) => any) {
        return (...args: any[]) => {
            for (let i = 1; i < args.length; ++i) {
                const a = args[i] as Command
                if (typeof a?.parent?.opts == "function") {
                    args[i - 1] = { ...a.parent.opts(), ...args[i - 1] }
                    break
                }
            }
            return fn(...args)
        }
    }

    function addFlashCmd(arch: string) {
        const r = arch ? flash.command(arch) : flash
        r.description(
            arch
                ? `flash with ${arch.toUpperCase()}-specific parameters`
                : `flash DeviceScript runtime (interpreter/VM)`
        )
        if (!arch) {
            r.option("-b, --board <board-id>", "specify board to flash")
            r.option("--once", "do not wait for the board to be connected")
        }
        r.addHelpText("after", () => {
            setupFlashBoards()
            return `\nAvailable boards:\n` + boardNames(arch)
        })
        return r
    }

    addFlashCmd("").action(flashAuto)

    addFlashCmd("esp32")
        .option("--all-serial", "do not filter serial ports by vendor")
        .option(
            "--baud <rate>",
            "specify speed of serial port (default: 1500000)"
        )
        .option("--port <path>", "specify port")
        .option("--esptool <path>", "explicitly specify path to esptool.py")
        .action(inheritOpts(flashESP32))

    addFlashCmd("rp2040").action(inheritOpts(flashRP2040))

    const addcmd = program
        .command("add")
        .description("add a feature to the project")

    function addCommand(name: string, base = addcmd) {
        return base
            .command(name)
            .option("-f, --force", "force overwrite existing files")
            .option(
                "--spaces <number>",
                "number of spaces when generating JSON"
            )
            .option(
                "-I, --no-install",
                "Do not run npm install or yarn install after creating files"
            )
    }

    function dropReturn(f: (...args: any[]) => Promise<any>) {
        return (...args: any[]) => f(...args).then(() => {})
    }

    addCommand("init", program)
        .argument("[dir]", "path to create or update project", "./")
        .description("creates or configures a devicescript project")
        .action(dropReturn(init))

    addcmd
        .command("board")
        .description(
            "fork a board configuration for a custom microcontroller board"
        )
        .option("-B, --base <board-id>", "ID of a board to fork (required)")
        .option("-n, --name <board-name>", "new board name (required)")
        .option(
            "-b, --board <board-id>",
            "new board ID (auto-generated from name)"
        )
        .option("--force", "overwrite JSON config file")
        .action(dropReturn(addBoard))

    addCommand("sim")
        .description("add simulator support (using node.js and jacdac-ts)")
        .action(dropReturn(addSim))

    addCommand("service")
        .option(
            "-n, --name <service-name>",
            "name of new service (required, example 'Light Level')"
        )
        .description("add a custom Jacdac service")
        .action(dropReturn(addService))

    addCommand("npm")
        .option("--license <string>", "set the license", "MIT")
        .description("make current project into an NPM library")
        .action(dropReturn(addNpm))

    addCommand("test")
        .description("add tests to current project")
        .action(dropReturn(addTest))

    addCommand("settings")
        .description("add settings to current project")
        .action(dropReturn(addSettings))

    addCommand("i2c")
        .description("add I2C to current project")
        .action(dropReturn(addI2C))

    program
        .command("binpatch", { hidden: true })
        .description("patch an interpreter binary with board configuration")
        .option("--uf2 <file.uf2>", "interpreter binary in UF2 format")
        .option("--bin <file.bin>", "interpreter binary in BIN format")
        .option(
            "--esp <file.bin>",
            "interpreter binary as a combined ESP32 image (with bootloader and partition table)"
        )
        .option(
            "-o, --outdir <folder>",
            "specify output directory, default to 'dist'"
        )
        .option(
            "--generic",
            "copy the uf2/bin file and corresponding ELF file as 'generic' variant"
        )
        .option("--slug <string>", "repo slug (eg. microsoft/devicescript)")
        .option("--elf <file.elf>", "specify ELF file name")
        .arguments("<file.board.json...>")
        .action(binPatch)

    program.on("option:quiet", () => setQuiet(true))
    program.on("option:verbose", incVerbose)
    program.on("option:no-colors", () => setConsoleColors(false))
    program.on("option:dev", () => setDeveloperMode(true))

    program.hook("preAction", () => {
        // --quiet disables it
        logToConsole(
            LoggerPriority.Debug,
            `using ${cliVersion()} from ${__dirname}`
        )
    })

    program.parse(process.argv)
}

if (require.main === module) mainCli()
