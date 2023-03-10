import { DebugInfo } from "@devicescript/compiler"
import { delay } from "jacdac-ts"
import { readFileSync } from "node:fs"
import {
    BuildOptions,
    compileFile,
    devsFactory,
    devsStartWithNetwork,
} from "./build"
import { error } from "./command"

export interface RunOptions {
    test?: boolean
    wait?: boolean
    tcp?: boolean
    testTimeout?: string
    testSelfExit?: boolean
}

export async function readCompiled(
    fn: string,
    options: BuildOptions = {}
): Promise<{ binary: Uint8Array; dbg?: DebugInfo }> {
    const buf = readFileSync(fn)
    if (buf.subarray(0, 8).toString("hex") == "446576530a7e6a9a")
        return { binary: buf }
    if (buf.subarray(0, 16).toString("binary") == "446576530a7e6a9a")
        return {
            binary: Buffer.from(
                buf.toString("binary").replace(/\s*/g, ""),
                "hex"
            ),
        }
    if (buf[0] == 0x7b) {
        const dbg = JSON.parse(buf.toString("utf-8")) as DebugInfo
        return { dbg, binary: Buffer.from(dbg.binary.hex, "hex") }
    }
    const res = await compileFile(fn, options)
    if (!res.success) process.exit(1)
    return { binary: res.binary, dbg: res.dbg }
}

export async function runTest(
    fn: string,
    options: RunOptions & BuildOptions = {}
) {
    if (!options.flag) options.flag = {}
    if (!options.testSelfExit) options.flag.testHarness = true

    const prog = await readCompiled(fn, options)
    const inst = await devsFactory()

    const devid = "12abdd2289421234"

    return new Promise<void>((resolve, reject) => {
        inst.sendPacket = () => {}
        inst.panicHandler = panic_code => {
            inst.devsStop()
            if (panic_code) {
                console.log("test failed")
                resolve = null
                reject(new Error("test failed"))
            } else {
                console.log("test OK")
                const f = resolve
                resolve = null
                if (f) f()
            }
        }
        inst.devsStop()
        inst.devsGcStress(true)
        inst.devsSetDeviceId(devid)
        inst.devsStart()
        inst.devsDeploy(prog.binary)
        inst.error = (...data) => {
            error(...data)
            process.exit(1)
        }
        setTimeout(() => {
            if (resolve) {
                inst.devsStop()
                console.log("timeout")
                reject(new Error("timeout"))
            }
        }, parseInt(options.testTimeout) || 2000)
    })
}

function err(msg: string) {
    error("Error: " + msg)
    process.exit(1)
}

export async function runScript(
    fn: string,
    options: RunOptions & BuildOptions
) {
    if (options.test && options.wait)
        err("can't use --test and --wait together")
    if (options.test && !fn) err("--test require file name")
    if (!options.wait && !fn) err("need either --wait or file name")

    if (options.test) {
        try {
            await runTest(fn, options)
            process.exit(0)
        } catch (e) {
            err(e?.message)
        }
    }

    const inst = await devsStartWithNetwork(options)

    if (fn) {
        const prog = await readCompiled(fn, options)
        const r = inst.devsDeploy(prog.binary)
        if (r) throw new Error("deploy error: " + r)
        console.log(`self-deployed ${fn}`)
    }

    if (options.wait) console.log(`waiting for external deploy`)
}
