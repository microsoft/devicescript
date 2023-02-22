import { CmdOptions, debug, GENDIR, LIBDIR, log } from "./command"
import { dirname, join, resolve } from "node:path"
import {
    pathExistsSync,
    writeFileSync,
    writeJSONSync,
    emptyDirSync,
    readFileSync,
    ensureDirSync,
} from "fs-extra"
import { saveLibFiles } from "./build"
import { spawnSync } from "node:child_process"
import { resolveBuildConfig } from "@devicescript/compiler"

const MAIN = "main.ts"
const GITIGNORE = ".gitignore"
const IMPORT_PREFIX = `import * as ds from "@devicescript/core"`

const optionalFiles: Record<string, Object | string> = {
    "tsconfig.json": {
        compilerOptions: {
            moduleResolution: "node",
            target: "es2022",
            module: "es2015",
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
            types: [],
        },
        include: ["**/*.ts", `${LIBDIR}/*.ts`],
        exclude: ["**/node_modules/*", "**/sim/*"],
    },
    ".prettierrc": {
        arrowParens: "avoid",
        semi: false,
        tabWidth: 4,
    },
    ".vscode/extensions.json": {
        recommendations: ["esbenp.prettier-vscode"],
    },
    "devsconfig.json": {},
    "package.json": {
        version: "0.0.0",
        private: true,
        dependencies: {},
        devDependencies: {
            "@devicescript/cli": "*",
            "ts-node-dev": "^2.0.0",
        },
        scripts: {
            setup: "devicescript init",
            "build:devicescript": "devicescript build",
            "build:sim": "cd sim && tsc --outDir ../.devicescript/sim",
            build: "yarn build:devicescript && yarn build:sim",
            "watch:devicescript": "devicescript devtools main.ts",
            "watch:sim":
                "cd sim && ts-node-dev --respawn --transpile-only app.ts",
            watch: "yarn watch:devicescript & yarn watch:sim",
            start: "yarn watch",
        },
    },
    "sim/runtime.ts": `
import "websocket-polyfill"
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
    "sim/app.ts": `import { bus } from "./runtime"

`,
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
    "README.md": `# - project name -

This project uses [DeviceScript](https://microsoft.github.io/devicescript/).

## Local/container development

-  install node.js 16+

\`\`\`bash
nvm install 18
nvm use 18
\`\`\`

-  install dependencies

\`\`\`bash
yarn install
\`\`\`

### Using Visual Studio Code

- open the project folder in code

\`\`\`bash
code .
\`\`\`

- install the [DeviceScript extension](https://microsoft.github.io/devicescript/getting-started/vscode)

- start debugging!

### Using the command line

- start the watch build and developer tools server

\`\`\`bash
yarn watch
\`\`\`

-  navigate to devtools page (see terminal output) 
to use the simulators or deploy to hardware.

-  open \`main.ts\` in your favorite TypeScript IDE and start editing.

`,
}
export interface InitOptions {
    force?: boolean
    spaces?: number
    install?: boolean
}

export async function init(
    dir: string | undefined,
    options: InitOptions & CmdOptions
) {
    const { force, spaces = 4, install } = options

    const cwd = resolve(dir || "./")
    log(`Configuring DeviceScript project`)

    ensureDirSync(cwd)

    Object.entries(optionalFiles).forEach(([fnr, data]) => {
        // tsconfig.json
        const fn = join(cwd, fnr)
        if (!pathExistsSync(fn) || force) {
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

    // typescript definitions
    const libdirn = join(cwd, LIBDIR)
    emptyDirSync(libdirn)
    debug(`write ${libdirn}/*`)
    await saveLibFiles(resolveBuildConfig(), {
        cwd,
    })

    // .gitignore
    const gids = ["node_modules", GENDIR]
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

    // main.ts
    const mainn = join(cwd, MAIN)
    if (!pathExistsSync(mainn)) {
        debug(`write ${mainn}`)
        writeFileSync(
            mainn,
            `${IMPORT_PREFIX}\n\nds.everyMs(1000, () => {\n    console.log(":)")\n})\n`,
            {
                encoding: "utf8",
            }
        )
    }

    if (install) {
        const npm = pathExistsSync(join(cwd, "package-lock.json"))
        const cmd = npm ? "npm" : "yarn"
        log(`install dependencies...`)
        spawnSync(cmd, ["install"], {
            shell: true,
            stdio: "inherit",
            cwd,
        })
    }

    // help message
    log(``)
    log(`Your DeviceScript project is initialized.`)
    log(
        `To get more help, https://microsoft.github.io/devicescript/getting-started/ .`
    )
    log(``)
}
