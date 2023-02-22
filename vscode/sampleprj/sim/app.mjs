import { CONNECTION_STATE, createWebSocketBus, DEVICE_CHANGE, SELF_ANNOUNCE, SRV_BUTTON, startServiceProviderFromServiceClass } from "jacdac-ts"

import "websocket-polyfill"
import { Blob } from "buffer"
globalThis.Blob = Blob

const bus = createWebSocketBus()
bus.on([CONNECTION_STATE, DEVICE_CHANGE], () => {
    console.log(bus.describe())
})
bus.on(SELF_ANNOUNCE, () => {
    console.log('bus: alive...')
})
bus.connect(true)