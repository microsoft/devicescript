import {
    createNodeSocketTransport,
    Flags,
    JDBus,
} from "jacdac-ts"
import * as vscode from "vscode"

let __bus: JDBus
export function startJacdacBus() {
    return __bus || (__bus = uncachedStartJacdacBus())
}

function uncachedStartJacdacBus() {
    try {
        const bus = new JDBus([createNodeSocketTransport()])
        // connect in background
        bus.connect(true)
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