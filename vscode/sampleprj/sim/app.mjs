import * as os from "os"
import { CONNECTION_STATE, createNodeWebSocketTransport, createWebSocketTransport, DEVICE_CHANGE, JDBus, SELF_ANNOUNCE } from "jacdac-ts"
import "websocket-polyfill"

console.log(os.platform())

const ws = createWebSocketTransport("ws://127.0.0.1:8081/")
const bus = new JDBus([ws], { disableRoleManager: true, client: false })
bus.autoConnect = true
bus.on([CONNECTION_STATE, DEVICE_CHANGE], () => {
    console.log(bus.describe())
})
bus.on(SELF_ANNOUNCE, () => {
    console.log('bus: alive...')
})
bus.connect(true)