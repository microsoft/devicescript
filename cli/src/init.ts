import { CmdOptions } from "./command"
import { join } from "node:path"
import {
    pathExistsSync,
    writeFileSync,
    writeJSONSync,
    readJSONSync,
    ensureDirSync,
    readFileSync,
} from "fs-extra"

const log = console.log
const debug = console.debug

const tsConfig: any = {
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
        types: [],
    },
}

export interface InitOptions {
    force?: boolean
}

const GENDIR = ".devicescript"
const TSCONFIG = "tsconfig.json"
const MAIN = "main.ts"
const GITIGNORE = ".gitignore"

export default function init(options: InitOptions & CmdOptions) {
    const { force } = options
    log(`init files for DeviceScript`)
    // tsconfig.json
    if (!pathExistsSync(TSCONFIG) || force) {
        debug(`write ${TSCONFIG}`)
        writeJSONSync(TSCONFIG, tsConfig)
    } else {
        debug(`skip ${TSCONFIG}, already exists`)
    }

    // typescript definitions
    ensureDirSync(GENDIR)

    // todo: copy prelude, ...
    // make sure it' in
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
        writeFileSync(
            MAIN,
            `
`,
            { encoding: "utf8" }
        )
    }
}
