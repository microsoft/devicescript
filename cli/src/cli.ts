
import { Command } from "commander"
import { build } from "./build"

export async function mainCli() {
    const pkg = require("../package.json")
    const program = new Command()
    program
        .name("jacscript")
        .description("build and run Jacscript program https://aka.ms/jacscript")
        .version(pkg.version)
        .option("-v, --verbose", "more logging")

    program
        .command("build", { isDefault: true })
        .description("build a jacscript file")
        .option("-l, --library", "build library")
        .option("--no-verify", "don't verify resulting bytecode")
        .option("-o", "--out-dir", "output directory, default is 'built'")
        .arguments("<file.ts>")
        .action(build)

    program.parse(process.argv)
}

if (require.main === module) mainCli()
