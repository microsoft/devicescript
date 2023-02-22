import { AnalogSensorServer, CONNECTION_STATE, createWebSocketBus, DEVICE_CHANGE, SELF_ANNOUNCE, SRV_BUTTON, startServiceProviderFromServiceClass } from "jacdac-ts"
import { SRV_PSYCHOMAGNOTHERIC_ENERGY } from "../.devicescript/ts/constants"
import "websocket-polyfill"
import { Blob } from "buffer"
globalThis.Blob = Blob

const bus = createWebSocketBus()

// simulator a customer service
const server = new AnalogSensorServer(SRV_PSYCHOMAGNOTHERIC_ENERGY, {
    readingValues: [0.5],
    readingError: [0.1]
})
bus.on(SELF_ANNOUNCE, () => {
    server.reading.setValues([server.reading.values()[0] + (0.5 - Math.random())])
})

bus.on([CONNECTION_STATE, DEVICE_CHANGE], () => {
    console.log(bus.describe())
})
bus.connect(true)