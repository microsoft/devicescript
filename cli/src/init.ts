import { CmdOptions, debug, GENDIR, LIBDIR, log } from "./command"
import { dirname, join } from "node:path"
import {
    pathExistsSync,
    writeFileSync,
    writeJSONSync,
    emptyDirSync,
    readFileSync,
    ensureDirSync,
} from "fs-extra"
import { saveLibFiles } from "./build"

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
        include: ["*.ts", `${LIBDIR}/*.ts`],
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
        },
        scripts: {
            setup: "devicescript init",
            build: "devicescript build",
            watch: "devicescript devtools main.ts",
            start: "yarn watch",
        },
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

- install the DeviceScript extension (it will be recommended by code)

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
}

export async function init(options: InitOptions & CmdOptions) {
    const { force, spaces = 4 } = options
    log(`Initializing files for DeviceScript project`)
    Object.keys(optionalFiles).forEach(fn => {
        // tsconfig.json
        if (!pathExistsSync(fn) || force) {
            const data = optionalFiles[fn]
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
    emptyDirSync(LIBDIR)
    debug(`write ${LIBDIR}/*`)
    await saveLibFiles({})

    // .gitignore
    const gids = ["node_modules", GENDIR]
    if (!pathExistsSync(GITIGNORE)) {
        debug(`write ${GITIGNORE}`)
        writeFileSync(GITIGNORE, gids.join("\n"), { encoding: "utf8" })
    } else {
        let gitignore = readFileSync(GITIGNORE, { encoding: "utf8" })
        let needsWrite = false
        gids.forEach(gid => {
            const k = `\n${gid}\n`
            if (gitignore.indexOf(k) < 0) {
                gitignore += k
            }
        })
        debug(`update ${GITIGNORE}`)
        writeFileSync(GITIGNORE, gitignore, {
            encoding: "utf8",
        })
    }

    // main.ts
    if (!pathExistsSync(MAIN)) {
        debug(`write ${MAIN}`)
        writeFileSync(MAIN, `${IMPORT_PREFIX}\n\nconsole.log(":)")\n`, {
            encoding: "utf8",
        })
    }

    // help message
    log(`Your DeviceScript project is create.`)
    log(`- install dependencies`)
    log(``)
    log(`    yarn install`)
    log(``)
    log(`- to start a watch build and development server`)
    log(``)
    log(`    yarn start`)
    log(``)
    log(
        `To get more help, https://microsoft.github.io/devicescript/getting-started/ .`
    )
    log(``)
}
