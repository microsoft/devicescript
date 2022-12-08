import { program } from "commander"
import pkg from "../package.json"
import { build } from "./build"
import { crunScript } from "./crun"
import { ctool } from "./ctool"
import { deployScript } from "./deploy"
import { devtools } from "./devtools"
import { disasm } from "./disasm"
import init from "./init"
import { logParse } from "./logparse"
import { runScript } from "./run"

export async function mainCli() {
    program
        .name("DeviceScript")
        .description(
            "build and run DeviceScript program https://aka.ms/devicescript"
        )
        .version(pkg.version)
        .option("-v, --verbose", "more logging")

    program
        .command("build", { isDefault: true })
        .description("build a DeviceScript file")
        .option("-s, --stats", "show additional size information")
        .option("-l, --library", "build library")
        .option("--no-verify", "don't verify resulting bytecode")
        .option("-o", "--out-dir", "output directory, default is 'built'")
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
        .command("init")
        .description("configures the current directory for devicescript")
        .option("-f, --force", "force overwrite existing files")
        .option("--spaces <number>", "number of spaces when generating JSON")
        .action(init)

    program
        .command("devtools")
        .description("launches a local deveplopement tools server")
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

    program
        .command("run")
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
        .command("crun", { hidden: true })
        .description("run a script using native runner")
        .option("-t, --test", "run in test mode (no sockets, no restarts)")
        .option(
            "-s, --serial <serial-port>",
            "connect to serial port, not 127.0.0.1:8082"
        )
        .arguments("<file.ts|file.devs>")
        .action(crunScript)

    program
        .command("disasm")
        .description("disassemble .jacs binary")
        .arguments("<file.ts|file.devs>")
        .action(disasm)

    program.parse(process.argv)
}

if (require.main === module) mainCli()
