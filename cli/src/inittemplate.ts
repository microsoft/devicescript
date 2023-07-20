import { existsSync, readFile, writeFileSync } from "fs-extra"
import { fatal, log } from "./command"
import { readJSON5Sync } from "./jsonc"
import { addNpm } from "./init"

function fail(msg: string): never {
    log(`
Expected usage of this command is for you to create a new GitHub repo based on template:

  https://github.com/microsoft/devicescript-package-template

Then in the fresh clone of you repo run:

   yarn
   yarn devs init-template
`)
    fatal(msg)
}

export async function initTemplate() {
    if (!existsSync("package.json")) fail("expecting package.json file")

    if (!existsSync(".git")) fail(`expecting to be in a git cloned folder`)

    let pkg: any = readJSON5Sync("package.json")
    if (pkg.name) fail(`package.json already patched?`)

    await addNpm({})

    pkg = readJSON5Sync("package.json")

    if (pkg.author) {
        const l = await readFile("LICENSE", "utf-8")
        writeFileSync("LICENSE", l.replace("The Author", pkg.author))
    }
}
