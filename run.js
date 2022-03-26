const factory = require("./built/jdcli.js")

async function main() {
    const inst = await factory()
    await inst.setupNodeTcpSocketTransport("localhost", 8082)
    inst.jacsStart()
}

async function altMain() {
    const inst = await factory()
    
    // both handlePacket and sendPacket take UInt8Array of the frame
    addEventListener("message", ev => inst.handlePacket(ev.data))
    inst.sendPacket = pkt => console.log("send", pkt)
    inst.jacsSetDeviceId("1122334455667788") // use 8-byte hex-encoded ID, or any string, which will be hashed
    inst.jacsStart()
}

main()
