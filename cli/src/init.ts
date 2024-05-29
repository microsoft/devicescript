import { debug, fatal, GENDIR, LIBDIR, log, verboseLog } from "./command"
import { basename, dirname, join, resolve } from "node:path"
import {
    pathExistsSync,
    writeFileSync,
    writeJSONSync,
    readFileSync,
    ensureDirSync,
    readdir,
    readFile,
    existsSync,
} from "fs-extra"
import { build } from "./build"
import { spawnSync } from "node:child_process"
import { assert, clone, randomUInt } from "jacdac-ts"
import { addReqHandler } from "./sidedata"
import type {
    SideAddBoardReq,
    SideAddBoardResp,
    SideAddNpmReq,
    SideAddNpmResp,
    SideAddServiceReq,
    SideAddServiceResp,
    SideAddSettingsReq,
    SideAddSettingsResp,
    SideAddSimReq,
    SideAddSimResp,
    SideAddTestReq,
    SideAddTestResp,
} from "./sideprotocol"
import { addBoard } from "./addboard"
import { readJSON5Sync } from "./jsonc"
import { MARKETPLACE_EXTENSION_ID } from "@devicescript/interop"
import { TSDOC_TAGS } from "@devicescript/compiler"
import { execCmd } from "./exec"

const MAIN = "src/main.ts"
const GITIGNORE = ".gitignore"
const IMPORT_PREFIX = `import * as ds from "@devicescript/core"`
const IS_PATCH = "__isPatch__"
const FORCE = "__force__"

type FileSet = Record<string, Object | string>

const serviceFiles: FileSet = {
    "services/README.md": `# Services

    Add custom service definition in this folder.
    
    -   [Read documentation](http://microsoft.github.io/devicescript/developer/custom-services)
    `,
}

const testFiles: FileSet = {
    "package.json": {
        [IS_PATCH]: true,
        devDependencies: {
            "@devicescript/test": "latest",
        },
    },
}

const npmFiles: FileSet = {
    "package.json": {
        [IS_PATCH]: true,
        main: "./src/index.ts",
        version: "0.0.0",
        license: "MIT",
        devicescript: {
            library: true,
        },
        files: ["src/*.ts", "devsconfig.json"],
        keywords: ["devicescript"],
        scripts: {
            "build:docs":
                "npx typedoc ./src/index.ts --tsconfig ./src/tsconfig.json",
        },
    },
    "src/index.ts": `${IMPORT_PREFIX}\n\n`,
    "src/tsdoc.json": {
        $schema:
            "https://developer.microsoft.com/en-us/json-schemas/tsdoc/v0/tsdoc.schema.json",
        extends: ["typedoc/tsdoc.json"],
        noStandardTags: false,
        tagDefinitions: TSDOC_TAGS.map(tag => ({
            tagName: `@${tag}`,
            syntaxKind: "modifier",
        })),
    },
    ".github/workflows/build.yml": `name: Build

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: lts/*
            - run: npm ci
            - run: npm run build
            - run: npm test
`,
}

const settingsFiles: FileSet = {
    ".env.defaults": `# Store common settings here.
# You can commit this file to source control, make sure there are no secrets.

`,
    ".env.local": `# Store your secrets here. Overrides values in .env
# Do not commit this file to source control

`,
}

const simFiles: FileSet = {
    ".vscode/launch.json": {
        [IS_PATCH]: true,
        configurations: [
            {
                name: "Sim",
                request: "launch",
                runtimeArgs: ["-r", "ts-node/register"],
                args: ["${workspaceFolder}/sim/app.ts"],
                skipFiles: ["<node_internals>/**"],
                type: "node",
                env: {
                    TS_NODE_PROJECT: "${workspaceFolder}/sim/tsconfig.json",
                },
            },
        ],
        compounds: [
            {
                name: "DeviceScript+Sim",
                configurations: ["DeviceScript", "Sim"],
                stopAll: true,
            },
        ],
    },
    "package.json": {
        [IS_PATCH]: true,
        devDependencies: {
            nodemon: "^2.0.20",
            typescript: "^4.9.5",
            "ts-node": "^10.9.1",
        },
        scripts: {
            [FORCE]: true,
            "build:sim": "cd sim && tsc --outDir ../.devicescript/sim",
            build: "npm run build:devicescript && npm run build:sim",
            "watch:sim":
                "cd sim && nodemon --watch './**' --ext 'ts,json' --exec 'ts-node ./app.ts --project ./tsconfig.json'",
            watch: "npm run watch:devicescript & npm run watch:sim",
        },
    },
    "sim/runtime.ts": `import "websocket-polyfill"
import { Blob } from "buffer"
globalThis.Blob = Blob as any
import customServices from "../.devicescript/services.json"
import { createWebSocketBus } from "jacdac-ts"

/**
 * A Jacdac bus that will connect to the devicescript local server.
 * 
 * \`\`\`example
 * import { bus } from "./runtime"
 * \`\`\`
 */
export const bus = createWebSocketBus({
    busOptions: {
        services: customServices as jdspec.ServiceSpec[],
    },
})
`,
    "sim/README.md": `# Simulators (node.js)

This folder contains a Node.JS/TypeScript application that can be executed side-by-side with
the DeviceScript debugger and simulators. The application uses the [Jacdac TypeScript package](https://microsoft.github.io/jacdac-docs/clients/javascript/)
to communicate with DeviceScript.

The default entry point file is \`./sim/app.ts\`, which uses the Jacdac bus from \`./sim/runtime.ts\` to communicate
with the rest of the DeviceScript execution.

## Editing and using the sim

-  open a new terminal
-  launch the simulator in watch mode (restarts on every change)

    npm run watch:sim

-  edit the DeviceScript part of the application as usual. The sim process will automatically connect
to the VS Code extension
`,
    "sim/app.ts": `import { bus } from "./runtime"\n\n`,
    "sim/tsconfig.json": {
        type: "module",
        compilerOptions: {
            lib: ["es2022", "dom"],
            module: "commonjs",
            target: "es2022",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            moduleResolution: "node",
            resolveJsonModule: true,
        },
        include: ["./*.ts", "../node_modules/*"],
    },
}

const optionalFiles: FileSet = {
    ".devcontainer/devcontainer.json": {
        image: "mcr.microsoft.com/devcontainers/javascript-node:20",
        features: {
            "ghcr.io/devcontainers/features/node:1": {},
            "ghcr.io/devcontainers/features/github-cli:1": {},
        },
    },
    "src/tsconfig.json": {
        compilerOptions: {
            moduleResolution: "node",
            target: "es2022",
            module: "es2022",
            lib: [],
            strict: true,
            strictNullChecks: false,
            strictFunctionTypes: true,
            sourceMap: false,
            declaration: false,
            experimentalDecorators: true,
            preserveConstEnums: true,
            noImplicitThis: true,
            isolatedModules: true,
            noImplicitAny: true,
            moduleDetection: "force",
            forceConsistentCasingInFileNames: true,
            types: [],
            jsx: "preserve",
        },
        include: ["**/*.ts", "**/*.tsx", `../${LIBDIR}/core/src/*.ts`],
    },
    ".prettierrc": {
        arrowParens: "avoid",
        trailingComma: "es5",
        semi: false,
        tabWidth: 4,
    },
    ".vscode/extensions.json": {
        recommendations: [MARKETPLACE_EXTENSION_ID, "esbenp.prettier-vscode", "genaiscript.genaiscript-vscode"],
    },
    ".vscode/launch.json": {
        version: "0.2.0",
        configurations: [
            {
                name: "DeviceScript",
                type: "devicescript",
                request: "launch",
                program: "${workspaceFolder}/" + MAIN,
                deviceId: "${command:deviceScriptSimulator}",
                stopOnEntry: false,
            },
        ],
    },
    ".yarnrc.yml": `
# Force Yarn v2+ to use node_modules
nodeLinker: node-modules`,
    "devsconfig.json": {},
    "package.json": {
        version: "0.0.0",
        private:
            "Please use 'yarn devs add npm' to make this a publishable package",
        dependencies: {},
        devDependencies: {
            "@devicescript/cli": "latest",
        },
        scripts: {
            setup: "devicescript build --quiet", // generates node_modules/@devicescript/* files
            "build:devicescript": "devicescript build src/main.ts",
            postinstall: "npm run setup",
            build: "npm run build:devicescript",
            "watch:devicescript": `devicescript devtools ${MAIN}`,
            watch: "npm run watch:devicescript",
            "test:devicescript":
                "devicescript run src/main.ts --test --test-self-exit",
            test: "npm run test:devicescript",
            start: "npm run watch",
        },
    },
    [MAIN]: `${IMPORT_PREFIX}

setInterval(async () => {
    console.log(":)")
}, 1000)\n`,
    "README.md": `# - project name -

This project uses [DeviceScript](https://microsoft.github.io/devicescript/).

`,
    "CONTRIBUTING.md": `
# Contributing

This project uses [DeviceScript](https://microsoft.github.io/devicescript/)
which provides a TypeScript experience for micro-controllers. 

The best development experience is done through Visual Studio Cocde and the DeviceScript extension;
but a command line tool is also available.

Container development (Codespaces, CodeSandbox, ...)
is supported but connection to hardware (through Serial or USB) is not available.
Simulators and compilers will work.


## Local development

-  install [Node.js LTS](https://nodejs.org/en/download) using [nvm](https://github.com/nvm-sh/nvm)

\`\`\`bash
nvm install --lts
nvm use --lts
\`\`\`

-  install DeviceScript compiler and tools

\`\`\`bash
npm install
\`\`\`

- open the project folder in [Visual Studio Code](https://code.visualstudio.com/)

\`\`\`bash
code .
\`\`\`

- install the [DeviceScript extension](https://microsoft.github.io/devicescript/getting-started/vscode)

- open \`main.ts\` and click on the **play** icon to start the simulator

`,
}

export interface InitOptions {
    yarn?: boolean
    force?: boolean
    spaces?: number
    install?: boolean
    board?: string
}

function patchJSON(fn: string, data: any) {
    debug(`patch ${fn}`)
    const existing = readJSON5Sync(fn)
    const isObj = (o: any) => o && typeof o == "object" && !Array.isArray(o)
    const doPatch = (trg: any, src: any) => {
        const force = !!src[FORCE]
        for (const k of Object.keys(src)) {
            if (k == IS_PATCH || k == FORCE) continue
            if (trg[k] === undefined || trg[k] === "" || force) trg[k] = src[k]
            else if (
                Array.isArray(src[k]) &&
                Array.isArray(trg[k]) &&
                src[k][0]?.name
            ) {
                for (const elt of src[k]) {
                    assert(!!elt.name)
                    if (!trg[k].find((e: any) => e.name == elt.name))
                        trg[k].push(elt)
                }
            } else if (isObj(trg[k]) && isObj(src[k])) {
                doPatch(trg[k], src[k])
            }
        }
    }
    doPatch(existing, data)
    return existing
}

function writeFiles(dir: string, options: InitOptions, files: FileSet) {
    const { spaces = 4 } = options

    const cwd = resolve(dir || "./")
    ensureDirSync(cwd)
    process.chdir(cwd) // just in case

    Object.entries(files).forEach(([fnr, data]) => {
        // tsconfig.json
        const fn = join(cwd, fnr)
        const isPatch = typeof data == "object" && (data as any)[IS_PATCH]
        if (isPatch) data = patchJSON(fn, data)
        if (isPatch || !pathExistsSync(fn) || options.force) {
            debug(`write ${fn}`)
            const dn = dirname(fn)
            if (dn) ensureDirSync(dn)
            if (typeof data === "string")
                writeFileSync(fn, data, { encoding: "utf8" })
            else writeJSONSync(fn, data, { spaces })
        } else {
            debug(`skip ${fn}, already exists`)
        }
    })

    return cwd
}

function isYarn(cwd: string, options: InitOptions) {
    const yarnlock = pathExistsSync(join(cwd, "yarn.lock"))
    return yarnlock || options.yarn
}

async function runInstall(cwd: string, options: InitOptions) {
    if (options.install) {
        const cmd = isYarn(cwd, options) ? "yarn" : "npm"
        log(`install dependencies using ${cmd}...`)
        spawnSync(cmd, ["install"], {
            shell: true,
            stdio: "inherit",
            cwd,
        })
    }
}

function finishAdd(message: string, files: string[] = []) {
    log(``)
    log(message)
    if (files.length) {
        const filesmsg = (files.length > 1 ? "one of " : "") + files.join(", ")
        log(`Start by editing ${filesmsg}`)
    }
    log(``)
    return {
        files,
    }
}

export async function init(dir: string | undefined, options: InitOptions) {
    log(`Configuring DeviceScript project...`)

    const files = { ...optionalFiles }
    if (isYarn(".", options)) patchYarnFiles(files)

    // write template files
    const cwd = writeFiles(dir, options, files)

    // ok, soft patch applied, now we apply more stuff that always has to be set
    // in case the project already had a package.json
    const pkg = readJSON5Sync("package.json") as PackageManifest

    // name needed in worspace for install to work
    if (!pkg.name)
        pkg.name = dir && dir !== "./" ? dir : basename(process.cwd())
    if (pkg.name === "./") pkg.name = "devicescript-demo"

    // ensure cli is added
    addCliDependency(pkg)
    // write down
    writePackage(pkg, options.spaces)

    // patch .gitignore
    const gids = ["node_modules", GENDIR, ".env.local", ".env.*.local"]
    const gitignoren = join(cwd, GITIGNORE)
    if (!pathExistsSync(gitignoren)) {
        debug(`write ${gitignoren}`)
        writeFileSync(gitignoren, gids.join("\n"), {
            encoding: "utf8",
        })
    } else {
        let gitignore = readFileSync(gitignoren, { encoding: "utf8" })
        let needsWrite = false
        gids.forEach(gid => {
            if (gitignore.indexOf(gid) < 0) {
                needsWrite = true
                gitignore += `\n${gid}/`
            }
        })
        if (needsWrite) {
            debug(`update ${GITIGNORE}`)
            writeFileSync(gitignoren, gitignore, {
                encoding: "utf8",
            })
        }
    }

    await runInstall(cwd, options)

    // patch main.ts with board info
    if (options.board) {
        const mainFn = join(cwd, MAIN)
        if (pathExistsSync(mainFn)) {
            const main = readFileSync(mainFn, { encoding: "utf8" })
            if (!main.includes(`from "@dsboard/${options.board}"`)) {
                const importStmt = `import { pins, board } from "@dsboard/${options.board}"\n`
                const newMain = importStmt + main
                writeFileSync(mainFn, newMain, { encoding: "utf8" })
            }
        }
    }

    // build to get node_modules/@devicescript/* files etc
    await build(MAIN, {})

    return finishAdd(
        `Your DeviceScript project is initialized.\n` +
            `To get more help, https://microsoft.github.io/devicescript/getting-started/`,
        ["package.json", MAIN]
    )
}

export interface AddSimOptions extends InitOptions {}

export async function addSim(options: AddSimOptions) {
    log(`Adding simulator support`)

    const cwd = writeFiles(".", options, simFiles)

    await runInstall(cwd, options)

    return finishAdd(`Simulator support added.`, ["sim/app.ts"])
}

export interface AddServiceOptions extends InitOptions {
    name: string
}

export async function addService(options: AddServiceOptions) {
    const { name } = options
    if (!name) fatal("--name argument required; example: --name 'Light Level'")

    const id = options.name.toLowerCase().replace(/\s+/g, "")

    log(`Adding service "${name}"`)

    const num = randomUInt(0xfff_ffff) | 0x1000_0000

    const serviceFile = "services/" + id + ".md"

    const files = Object.assign(
        {
            [serviceFile]: `# ${name}

    identifier: 0x${num.toString(16)}
    extends: _sensor

Measures ${name}.

## Registers

    ro level: u0.16 / @ reading

A measure of ${name}.
`,
        },
        serviceFiles
    )

    const cwd = writeFiles(".", options, files)

    await runInstall(cwd, options)

    return finishAdd(`Added service ${name}`, [serviceFile])
}

export interface AddNpmOptions extends InitOptions {
    license?: string
    name?: string
}

export interface AddSettingsOptions extends InitOptions {}

export async function addSettings(options: AddSettingsOptions) {
    const files = clone(settingsFiles)
    const cwd = writeFiles(".", options, files)
    return finishAdd(
        `Prepared .env.* files, please add device settings in those files.`,
        Object.keys(files)
    )
}

// enforce nicer order on package.json fields
function sortPkgJson(pkg: any) {
    const jsonFields: string[] = [
        "name",
        "description",
        "version",
        "author",
        "license",
        "main",
        "devicescript",
    ]
    const p2: any = {}
    for (const f of jsonFields.concat(Object.keys(pkg))) {
        p2[f] = pkg[f]
    }
    return p2
}

function patchYarnCommands(content: string) {
    if (!content) return content
    return content
        .replace("npm ci", "yarn install --frozen-lockfile")
        .replace("npm install", "yarn install")
        .replace("npm run build", "yarn build")
        .replace("npm run watch", "yarn watch")
        .replace("npm test", "yarn test")
}

function patchYarnFiles(files: FileSet) {
    ;[".github/workflows/build.yml", "README.md", "CONTRIBUTING.md"]
        .filter(fn => !!files[fn])
        .forEach(fn => {
            files[fn] = patchYarnCommands(files[fn] as string)
        })
}

interface PackageManifest {
    author: string
    devDependencies?: Record<string, string>
    dependencies?: Record<string, string>
    repository?: {
        url: string
        type: "git"
    }
    name?: string
    private?: boolean
    license?: string
}

// ensure @devicescript/cli in in package json
function addCliDependency(pkg: PackageManifest) {
    // ensure @devicescript/cli in in package json
    if (!pkg.devDependencies) pkg.devDependencies = {}
    pkg.devDependencies["@devicescript/cli"] = "latest"
}

function writePackage(pkg: PackageManifest, spaces?: number) {
    writeJSONSync("./package.json", sortPkgJson(pkg), {
        spaces: spaces ?? 4,
    })
}

export async function addNpm(options: AddNpmOptions) {
    const files = clone(npmFiles)
    let pkg = files["package.json"] as PackageManifest

    // note that these operations are performed on the *patch* not on package.json
    // these fields apply *only* if given field is missing or set to ""

    let uname = execCmd("git config --get user.name")
    if (uname) {
        debug(`set author to ${uname}`)
        pkg.author = uname
    }

    let url = ""

    if (pathExistsSync(".git")) {
        url = execCmd("git remote get-url origin")
        if (url)
            pkg.repository = {
                type: "git",
                url: url,
            }
    }

    pkg.name = url ? url.replace(/.*\//, "") : basename(resolve("."))

    let lst = await readdir("src")
    lst = lst.filter(f => !f.startsWith("main") && f.endsWith(".ts"))
    for (const fn of lst) {
        files["src/index.ts"] += `export * from "./${fn.slice(0, -3)}"\n`
    }

    if (isYarn(".", options)) patchYarnFiles(files)

    const cwd = writeFiles(".", options, files)

    // ok, soft patch applied, now we apply more stuff that always has to be set
    pkg = readJSON5Sync("package.json") as PackageManifest

    // ensure cli is added
    addCliDependency(pkg)

    // npm is never private:
    delete pkg.private

    // if user specified, override
    if (options.license) pkg.license = options.license
    if (options.name) pkg.name = options.name

    // save
    writePackage(pkg, options.spaces)

    await runInstall(cwd, options)

    return finishAdd(`Prepared package.json for publishing, please review.`, [
        "package.json",
        "src/index.ts",
    ])
}

export async function addTest(options: AddTestOptions) {
    const files = clone(testFiles)
    if (existsSync("./src/main.ts")) {
        let main = await readFile("./src/main.ts", { encoding: "utf8" })
        if (!main.includes("@devicescript/test"))
            main =
                `import { describe, test, expect } from "@devicescript/test";\n` +
                main
        files["src/main.ts"] = main
    }
    const cwd = writeFiles(".", options, files)
    await runInstall(cwd, options)

    return finishAdd(
        `Added test package to package.json, added "runTest" to main.ts, please review.`,
        ["package.json", "src/main.ts"]
    )
}

export interface AddTestOptions extends InitOptions {}

export function initAddCmds() {
    addReqHandler<SideAddBoardReq, SideAddBoardResp>("addBoard", d =>
        addBoard(d.data)
    )
    addReqHandler<SideAddServiceReq, SideAddServiceResp>("addService", d =>
        addService(d.data)
    )
    addReqHandler<SideAddSimReq, SideAddSimResp>("addSim", d => addSim(d.data))
    addReqHandler<SideAddNpmReq, SideAddNpmResp>("addNpm", d => addNpm(d.data))
    addReqHandler<SideAddSettingsReq, SideAddSettingsResp>("addSettings", d =>
        addSettings(d.data)
    )
    addReqHandler<SideAddTestReq, SideAddTestResp>("addTest", d =>
        addTest(d.data)
    )
}
