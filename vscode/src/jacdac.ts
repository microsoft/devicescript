import { createNodeSocketTransport, Flags, JDBus } from "jacdac-ts"

export async function startJacdacBus() {
    try {
        const bus = new JDBus([createNodeSocketTransport()])
        Flags.diagnostics = true
        await bus.connect()
    } catch (err) {
        console.error(err.stack)
    }
}
