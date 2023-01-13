import { program, CommandOptions } from "commander"
import pkg from "../package.json"
import { annotate } from "./annotate"
import { build } from "./build"
import { crunScript } from "./crun"
import { ctool } from "./ctool"
import { deployScript } from "./deploy"
import { devtools } from "./devtools"
import { disasm } from "./disasm"
import init from "./init"
import { logParse } from "./logparse"
import { runScript } from "./run"
import { compileFlagHelp } from "@devicescript/compiler"

export async function mainCli() {
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
        .version(pkg.version)
        .option("-v, --verbose", "more logging")

    buildCommand("build", { isDefault: true })
        .description("build a DeviceScript file")
        .option("-w, --watch", "watch file changes and rebuild automatically")
        .option("--internet", "allow connections from non-localhost")
        .option(
            "--localhost",
            "use localhost:8000 instead of the internet dashboard"
        )
        .option("-t, --tcp", "open native TCP socket at 8082")
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
        .action(init)

    program
        .command("devtools")
        .description("launches a local development tools server")
        .option("--internet", "allow connections from non-localhost")
        .option(
            "--localhost",
            "use localhost:8000 instead of the internet dashboard"
        )
        .option("-t, --tcp", "open native TCP socket at 8082")
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
        .arguments("<file.ts|file.devs>")
        .action(disasm)

    program
        .command("annotate")
        .description("annotate stack frames in stdin")
        .action(annotate)

    program.parse(process.argv)
}

if (require.main === module) mainCli()
