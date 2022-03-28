const factory = require("./built/jdcli.js")

async function main() {
    const inst = await factory()
    await inst.setupNodeTcpSocketTransport("localhost", 8082)
    inst.jacsStart()
}

async function runScript(fn) {
    const inst = await factory()
    const fs = require("fs")

    const prog = fs.readFileSync(fn)

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
                process.exit(1)
            } else {
                console.log("test OK")
                process.exit(0)
            }
        }
    }
    inst.jacsSetDeviceId("1122334455667788") // use 8-byte hex-encoded ID (used directly), or any string (hashed)
    inst.jacsStart()
    inst.jacsDeploy(prog)
    setTimeout(() => {
        console.log("timeout")
        process.exit(2)
    }, 2000)
}

process.argv.shift()
process.argv.shift()
if (process.argv[0])
    runScript(process.argv[0])
else
    main()
