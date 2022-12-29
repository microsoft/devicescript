import { readFileSync } from "node:fs"
import { BuildOptions, compileFile, devsFactory } from "./build"
import { CmdOptions, error } from "./command"

export interface RunOptions {
    test?: boolean
    wait?: boolean
    tcp?: boolean
    testTimeout?: string
}

export async function readCompiled(fn: string, options: BuildOptions = {}) {
    const buf = readFileSync(fn)
    if (buf.subarray(0, 8).toString("hex") == "446576530a7e6a9a") return buf
    if (buf.subarray(0, 16).toString("binary") == "446576530a7e6a9a")
        return Buffer.from(buf.toString("binary").replace(/\s*/g, ""), "hex")
    const res = await compileFile(fn, options)
    if (!res.success) process.exit(1)
    return res.binary
}

export async function runTest(fn: string, options: RunOptions = {}) {
    const prog = await readCompiled(fn)
    const inst = await devsFactory()

    const devid = "12abdd2289421234"

    return new Promise<void>((resolve, reject) => {
        inst.sendPacket = () => {}
        inst.panicHandler = panic_code => {
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
        inst.devsSetDeviceId(devid)
        inst.devsStart()
        inst.devsDeploy(prog)
        setTimeout(() => {
            if (resolve) {
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

export async function runScript(fn: string, options: RunOptions & CmdOptions) {
    if (options.test && options.wait)
        err("can't use --test and --wait together")
    if (options.test && !fn) err("--test require file name")
    if (!options.wait && !fn) err("need either --wait or file name")

    if (options.test)
        return await runTest(fn, options).then(
            () => process.exit(0),
            e => {
                err(e?.message)
            }
        )

    const inst = await devsFactory()
    if (options.test) inst.sendPacket = () => {}
    else if (options.tcp)
        await inst.setupNodeTcpSocketTransport(require, "127.0.0.1", 8082)
    else await inst.setupWebsocketTransport("ws://127.0.0.1:8081")
    inst.devsStart()

    if (fn) {
        const prog = await readCompiled(fn)
        const r = inst.devsDeploy(prog)
        if (r) throw new Error("deploy error: " + r)
        console.log(`self-deployed ${fn}`)
    }

    if (options.wait) console.log(`waiting for external deploy`)
}
