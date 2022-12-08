import { readdirSync, readFileSync } from "node:fs"
import { compileBuf, compileFile, getHost, devsFactory } from "./build"
import { CmdOptions } from "./command"
import * as path from "node:path"
import { testCompiler } from "@devicescript/compiler"
import { runTest } from "./run"

export interface CToolOptions {
    empty?: boolean
    test?: boolean
}

function readdir(folder: string) {
    return readdirSync(folder).map(bn => path.join(folder, bn))
}

const ctest = "devs/compiler-tests"
const samples = "devs/samples"
const rtest = "devs/run-tests"


export async function ctool(options: CToolOptions & CmdOptions) {
    if (options.empty) {
        const res = await compileBuf(Buffer.from(""))
        const buf = res.binary
        let r = `__attribute__((aligned(sizeof(void *)))) static const uint8_t devs_empty_program[${buf.length}] = {`
        for (let i = 0; i < buf.length; ++i) {
            if ((i & 15) == 0) r += "\n"
            r += "0x" + ("0" + buf[i].toString(16)).slice(-2) + ", "
        }
        r += "\n};"
        console.log(r)
    }

    if (options.test) {
        for (const fn of readdir(ctest).concat(readdir(samples))) {
            const host = await getHost({
                mainFileName: fn,
            })
            console.log(`*** test ${fn}`)
            testCompiler(host, readFileSync(fn, "utf8"))
        }

        for (const fn of readdir(rtest)) {
            console.log(`*** run ${fn}`)
            await runTest(fn)
        }

        process.exit(0)
    }
}
