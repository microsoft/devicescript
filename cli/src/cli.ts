import { program, CommandOptions } from "commander"
import { annotate } from "./annotate"
import { build } from "./build"
import { crunScript } from "./crun"
import { ctool } from "./ctool"
import { deployScript } from "./deploy"
import { devtools } from "./devtools"
import { disasm } from "./disasm"
import { init } from "./init"
import { logParse } from "./logparse"
import { runScript } from "./run"
import { compileFlagHelp, runtimeVersion } from "@devicescript/compiler"
import { startVm } from "./vm"
import { cliVersion } from "./version"
import { dcfg } from "./dcfg"
import { setConsoleColors, setVerbose } from "./command"
import { binPatch } from "./binpatch"
import { flash } from "./flash"

export async function mainCli() {
    Error.stackTraceLimit = 30

    function buildCommand(nameAndArgs: string, opts?: CommandOptions) {
        return program
            .command(nameAndArgs, opts)
            .option("-s, --stats", "show additional size information")
            .option("-o, --out-dir", "output directory, default is 'built'")
            .option("--no-verify", "don't verify resulting bytecode")
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
        .option("-v, --verbose", "more logging")
        .option("--no-colors", "disable color output")

    buildCommand("build", { isDefault: true })
        .description("build a DeviceScript file")
        .arguments("[file.ts]")
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
        .command("init")
        .description("configures the current directory for devicescript")
        .option("-f, --force", "force overwrite existing files")
        .option("--spaces <number>", "number of spaces when generating JSON")
        .option(
            "--install",
            "Run npm install or yarn install after creating files"
        )
        .action(init)

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

    program
        .command("flash", { hidden: true })
        .description("flash DeviceScript runtime (interpreter/VM) to a board")
        .option("--all-serial", "do not filter serial ports by vendor")
        .option(
            "--baud <rate>",
            "specify speed of serial port (default: 1500000)"
        )
        .option("--port <path>", "specify port")
        .action(flash)

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
        .option("--elf <file.elf>", "specify ELF file name")
        .arguments("<file.board.json...>")
        .action(binPatch)

    program.on("option:verbose", () => setVerbose(true))
    program.on("option:no-colors", () => setConsoleColors(false))

    program.parse(process.argv)
}

if (require.main === module) mainCli()
