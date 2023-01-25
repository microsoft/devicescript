import {
    createNodeSocketTransport,
    Flags,
    JDBus,
    Packet,
    PACKET_RECEIVE,
    PACKET_RECEIVE_ANNOUNCE,
    PACKET_RECEIVE_NO_DEVICE,
    printPacket,
} from "jacdac-ts"
import * as vscode from "vscode"

export async function startJacdacBus() {
    try {
        const bus = new JDBus([createNodeSocketTransport()])
        Flags.diagnostics = true
        await bus.connect()

        // not sure how useful this is
        let logPackets = true
        if (logPackets) {
            const output = vscode.window.createOutputChannel("Jacdac Packets")
            const opts = {
                skipRepeatedAnnounce: true,
                showTime: true,
            }
            const logPkt = (pkt: Packet) => {
                const msg = printPacket(pkt, opts)
                if (msg) output.appendLine(msg)
            }
            bus.on(PACKET_RECEIVE, logPkt)
            bus.on(PACKET_RECEIVE_ANNOUNCE, logPkt)
            bus.on(PACKET_RECEIVE_NO_DEVICE, logPkt)
        }
    } catch (err) {
        console.error(err.stack)
    }
}
