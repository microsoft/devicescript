const jacsFactory = require("./built/jdcli.js")
const fs = require("fs")
const path = require("path")

const ctest = "compiler/compiler-tests"
const samples = "compiler/samples"
const rtest = "compiler/run-tests"
const distPath = "built"
let verbose = false

let jacsHost
async function getHost() {
    if (jacsHost) return jacsHost
    const inst = await jacsFactory()
    inst.jacsInit()
    const specs = JSON.parse(fs.readFileSync("jacdac/dist/services.json", "utf8"))
    jacsHost = {
        write: (fn, cont) =>
            fs.writeFileSync(path.join(distPath, fn), cont),
        log: msg => { if (verbose) console.log(msg) },
        getSpecs: () => specs,
        verifyBytecode: buf => {
            const res = inst.jacsDeploy(buf)
            if (res != 0)
                throw new Error("verification error: " + res)
        }
    }
    return jacsHost
}

async function compile(buf) {
    const jacscript = require("./compiler")
    const res = jacscript.compile(await getHost(), buf.toString("utf8"))
    return res.binary
}

async function readCompiled(fn) {
    const buf = fs.readFileSync(fn)
    if (buf.slice(0, 8).toString("hex") == "4a6163530a7e6a9a")
        return buf
    return await compile(buf)
}

async function runTest(fn) {
    const prog = await readCompiled(fn)
    const inst = await jacsFactory()

    return new Promise((resolve, reject) => {
        // both handlePacket and sendPacket take UInt8Array of the frame
        // addEventListener("message", ev => inst.handlePacket(ev.data))
        // inst.sendPacket = pkt => console.log("send", pkt)
        inst.sendPacket = pkt => {
            // only react to packets from our device
            for (let i = 0; i < 8; ++i)
                if (pkt[4 + i] != (i + 1) * 0x11)
                    return

            const idx = pkt[13]
            const cmd = pkt[14] | (pkt[15] << 8)
            // see if it's "panic event"
            if (idx == 2 && (cmd & 0x8000) && (cmd & 0xff) == 0x80) {
                const panic_code = pkt[16] | (pkt[16] << 8)
                if (panic_code) {
                    console.log("test failed")
                    resolve = null
                    reject(new Error("test failed"))
                } else {
                    console.log("test OK")
                    const f = resolve
                    resolve = null
                    f()
                }
            }
        }
        inst.jacsSetDeviceId("1122334455667788") // use 8-byte hex-encoded ID (used directly), or any string (hashed)
        inst.jacsStart()
        inst.jacsDeploy(prog)
        setTimeout(() => {
            if (resolve) {
                console.log("timeout")
                reject(new Error("timeout"))
            }
        }, 2000)
    })
}

async function runServer(fn) {
    const inst = await jacsFactory()
    await inst.setupNodeTcpSocketTransport("localhost", 8082)
    inst.jacsStart()
    if (fn) {
        const prog = await readCompiled(fn)
        const r = inst.jacsDeploy(prog)
        if (r) throw new Error("deploy error: " + r)
        console.log(`deployed ${fn}`)
    } else {
        console.log(`waiting for external deploy ${fn}`)
    }
}

function readdir(folder) {
    return fs.readdirSync(folder).map(bn => path.join(folder, bn))
}

async function main() {
    const args = process.argv.slice(2)
    if (args[0] == "-v") {
        args.shift()
        verbose = true
    }

    try {
        if (args[0] == "test") {
            const host = await getHost()
            const jacscript = require("./compiler")
            for (const fn of readdir(ctest).concat(readdir(samples))) {
                console.log(`*** test ${fn}`)
                jacscript.testCompiler(host, fs.readFileSync(fn, "utf8"))
            }

            for (const fn of readdir(rtest)) {
                console.log(`*** run ${fn}`)
                await runTest(fn)
            }
        } else {
            await runServer(args[0])
        }
    } catch (e) {
        console.error(e.stack)
        process.exit(2)
    }

    process.exit(0)
}

main()
