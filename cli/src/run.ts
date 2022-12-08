import { readFileSync } from "node:fs"
import { compileFile, jacsFactory } from "./build"
import { CmdOptions, error } from "./command"

export interface RunOptions {
    test?: boolean
    wait?: boolean
    tcp?: boolean
    testTimeout?: string
}

export async function readCompiled(fn: string) {
    const buf = readFileSync(fn)
    if (buf.subarray(0, 8).toString("hex") == "4a6163530a7e6a9a") return buf
    if (buf.subarray(0, 16).toString("binary") == "4a6163530a7e6a9a")
        return Buffer.from(buf.toString("binary").replace(/\s*/g, ""), "hex")
    return (await compileFile(fn)).binary
}

export async function runTest(fn: string, options: RunOptions = {}) {
    const prog = await readCompiled(fn)
    const inst = await jacsFactory()

    const devid = "12abdd2289421234"

    return new Promise<void>((resolve, reject) => {
        // both handlePacket and sendPacket take UInt8Array of the frame
        // addEventListener("message", ev => inst.handlePacket(ev.data))
        // inst.sendPacket = pkt => console.log("send", pkt)
        inst.sendPacket = pkt => {
            // only react to packets from our device
            if (!Buffer.from(devid, "hex").equals(pkt.slice(4, 4 + 8))) return

            const idx = pkt[13]
            const cmd = pkt[14] | (pkt[15] << 8)
            // see if it's "panic event"
            if (idx == 2 && cmd & 0x8000 && (cmd & 0xff) == 0x80) {
                const panic_code = pkt[16] | (pkt[16] << 8)
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
        }
        inst.jacsSetDeviceId(devid) // use 8-byte hex-encoded ID (used directly), or any string (hashed)
        inst.jacsStart()
        inst.jacsDeploy(prog)
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
            err => {
                err(err.message)
            }
        )

    const inst = await jacsFactory()
    if (options.test) inst.sendPacket = () => {}
    else if (options.tcp)
        await inst.setupNodeTcpSocketTransport(require, "127.0.0.1", 8082)
    else await inst.setupWebsocketTransport("ws://127.0.0.1:8081")
    inst.jacsStart()

    if (fn) {
        const prog = await readCompiled(fn)
        const r = inst.jacsDeploy(prog)
        if (r) throw new Error("deploy error: " + r)
        console.log(`self-deployed ${fn}`)
    }

    if (options.wait) console.log(`waiting for external deploy`)
}
