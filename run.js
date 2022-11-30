const fs = require("fs")
const path = require("path")
const child_process = require("child_process")

const ctest = "jacs/compiler-tests"
const samples = "jacs/samples"
const rtest = "jacs/run-tests"
const distPath = "built"
let verbose = false
let useC = false
let testMode = false
let doDeploy = false
let disassemble = false
let logParse = false
let serialPort = ""
let jacsFile = ""
let isLibrary = false

function jacsFactory() {
    d = require("devicescript-vm")
    try {
        require("websocket-polyfill")
        // @ts-ignore
        global.Blob = require("buffer").Blob
    } catch {
        console.log("can't load websocket-polyfill")
    }
    return d()
}

let jacsHost
async function getHost() {
    if (jacsHost) return jacsHost
    const inst = await jacsFactory()
    inst.jacsInit()
    const specs = JSON.parse(
        fs.readFileSync("runtime/jacdac-c/jacdac/dist/services.json", "utf8")
    )
    jacsHost = {
        write: (fn, cont) => {
            fs.writeFileSync(path.join(distPath, fn), cont)
            if (fn.endsWith(".jasm") && cont.indexOf("???oops") >= 0)
                throw new Error("bad disassembly")
        },
        log: msg => {
            if (verbose) console.log(msg)
        },
        mainFileName: () => jacsFile,
        getSpecs: () => specs,
        verifyBytecode: buf => {
            if (useC) return
            const res = inst.jacsDeploy(buf)
            if (res != 0) throw new Error("verification error: " + res)
        },
    }
    return jacsHost
}

async function compile(buf) {
    const compiler = require("./compiler/built/devicescript-compiler.node.cjs")
    const host = await getHost()
    const res = compiler.compile(buf.toString("utf8"), { host, isLibrary })
    if (!res.success) throw new Error("compilation failed")
    return res.binary
}

async function readCompiled(fn) {
    const buf = fs.readFileSync(fn)
    if (buf.slice(0, 8).toString("hex") == "4a6163530a7e6a9a") return buf
    if (buf.slice(0, 16).toString("binary") == "4a6163530a7e6a9a")
        return Buffer.from(buf.toString("binary").replace(/\s*/g, ""), "hex")
    jacsFile = fn
    return await compile(buf)
}

async function runTest(fn) {
    const prog = await readCompiled(fn)
    const inst = await jacsFactory()

    const devid = "12abdd2289421234"

    return new Promise((resolve, reject) => {
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
                    f()
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
        }, 2000)
    })
}

async function runServer(args) {
    const fn = args.shift()
    if (logParse) {
        const compiler = require("./compiler/built/devicescript-compiler.node.cjs")
        const fsp = require("node:fs/promises")
        const h = await fsp.open(fn, "r")
        const r = await compiler.parseLog((off, size) => {
            const r = Buffer.alloc(size)
            return h.read(r, 0, r.length, off).then(() => r)
        })
        console.log(await r.dump())
        const genidx = parseInt(args[0])
        if (genidx) {
            const gen = await r.generation(genidx)
            if (args[1] == "stats") console.log(await gen.computeStats())
            else await gen.forEachEvent()
        }
        return
    }
    if (useC) {
        const prog = await readCompiled(fn)
        const compfn = distPath + "/compiled.jacs"
        fs.writeFileSync(compfn, prog)
        const args = [compfn]
        if (testMode) args.unshift("-X")
        if (serialPort) args.unshift(serialPort)
        else if (!testMode) args.unshift("8082")
        console.log("run", args)
        const child = child_process.spawn("runtime/built/jdcli", args, {
            stdio: "inherit",
        })
        child.on("exit", (code, err) => {
            if (!code && err) code = 2
            process.exit(code)
        })
        testMode = false
        return
    }
    if (disassemble) {
        const prog = await readCompiled(fn)
        console.log(require("./compiler/built/devicescript-compiler.node.cjs").disassemble(prog))
        return
    }
    if (isLibrary) {
        const prog = await readCompiled(fn)
        return
    }
    const inst = await jacsFactory()
    if (testMode) inst.sendPacket = () => {}
    else await inst.setupNodeTcpSocketTransport(require, "127.0.0.1", 8082)
    inst.jacsStart()
    if (fn) {
        const prog = await readCompiled(fn)
        const r = doDeploy ? inst.jacsClientDeploy(prog) : inst.jacsDeploy(prog)
        if (r) throw new Error("deploy error: " + r)
        console.log(`deployed ${fn}`)
    } else {
        console.log(`waiting for external deploy`)
    }
}

function readdir(folder) {
    return fs.readdirSync(folder).map(bn => path.join(folder, bn))
}

async function main() {
    const args = process.argv.slice(2)

    try {
        fs.mkdirSync(distPath)
    } catch {}

    while (true) {
        if (args[0] == "-v") {
            args.shift()
            verbose = true
            continue
        }
        if (args[0] == "-c") {
            args.shift()
            useC = true
            continue
        }
        if (args[0] == "-t") {
            args.shift()
            testMode = true
            continue
        }
        if (args[0] == "-d") {
            args.shift()
            doDeploy = true
            continue
        }
        if (args[0] == "-D") {
            args.shift()
            disassemble = true
            continue
        }
        if (args[0] == "-p") {
            args.shift()
            logParse = true
            continue
        }
        if (args[0] == "-L") {
            args.shift()
            isLibrary = true
            continue
        }
        if (args[0] && args[0].startsWith("-s:")) {
            serialPort = args[0].slice(3)
            useC = true
            args.shift()
            continue
        }
        break
    }

    try {
        if (args[0] == "empty") {
            const buf = await compile(Buffer.from(""))
            let r = `__attribute__((aligned(sizeof(void *)))) static const uint8_t devs_empty_program[${buf.length}] = {`
            for (let i = 0; i < buf.length; ++i) {
                if ((i & 15) == 0) r += "\n"
                r += "0x" + ("0" + buf[i].toString(16)).slice(-2) + ", "
            }
            r += "\n};"
            console.log(r)
        } else if (args[0] == "test") {
            testMode = true

            const host = await getHost()
            const compiler = require("./compiler/built/devicescript-compiler.node.cjs")
            for (const fn of readdir(ctest).concat(readdir(samples))) {
                console.log(`*** test ${fn}`)
                jacsFile = fn
                compiler.testCompiler(host, fs.readFileSync(fn, "utf8"))
            }

            for (const fn of readdir(rtest)) {
                console.log(`*** run ${fn}`)
                await runTest(fn)
            }
        } else {
            await runServer(args)
        }
    } catch (e) {
        console.error(e.stack)
        process.exit(2)
    }

    if (testMode) process.exit(0)
}

main()
