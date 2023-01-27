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
            watch: "devicescript build --watch",
            start: "yarn setup && yarn watch",
        },
    },
    "README.md": `# - project name -

This project uses [DeviceScript](https://microsoft.github.io/devicescript/).

## Local/container development

-  install node.js 16+ and dependencies

\`\`\`bash
yarn install
\`\`\`

- launch developer server

\`\`\`bash
yarn start
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

export default async function init(options: InitOptions & CmdOptions) {
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
    const gid = `${GENDIR}/\n`
    if (!pathExistsSync(GITIGNORE)) {
        debug(`write ${GITIGNORE}`)
        writeFileSync(GITIGNORE, gid, { encoding: "utf8" })
    } else {
        const gitignore = readFileSync(GITIGNORE, { encoding: "utf8" })
        if (gitignore.indexOf(gid) < 0) {
            debug(`update ${GITIGNORE}`)
            writeFileSync(GITIGNORE, `${gitignore}\n${gid}`, {
                encoding: "utf8",
            })
        }
    }

    // main.ts
    if (!pathExistsSync(MAIN)) {
        debug(`write ${MAIN}`)
        writeFileSync(MAIN, `${IMPORT_PREFIX}\n\n`, { encoding: "utf8" })
    }

    // help message
    log(`Your DeviceScript project is ready.`)
    log(`- to start the local development, run "yarn start"`)
}
