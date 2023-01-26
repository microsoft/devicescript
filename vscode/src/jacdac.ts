import { createWebSocketTransport, ERROR, JDBus, SIDE_DATA } from "jacdac-ts"
import * as vscode from "vscode"

let __bus: JDBus
export function startJacdacBus() {
    return __bus || (__bus = uncachedStartJacdacBus())
}

function uncachedStartJacdacBus() {
    try {
        const ws = createWebSocketTransport("ws://127.0.0.1:8081/")
        ws.on(SIDE_DATA, data => {
            console.log("SIDE", data)
        })
        const bus = new JDBus([ws], { client: false })
        bus.on(ERROR, err => {
            console.error("Bus error", err)
        })
        // connect in foreground, otherwise we'll have no clue why it failed
        bus.connect(false)
        return bus
    } catch (err) {
        console.error(err.stack)
        return undefined
    }
}

export async function stopJacdacBus() {
    const bus = __bus
    if (bus) {
        __bus = undefined
        await bus.disconnect()
        await bus.dispose()
    }
}
