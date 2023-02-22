import {
    addServer,
    AnalogSensorServer,
    CONNECTION_STATE,
    DEVICE_CHANGE,
    SELF_ANNOUNCE,
} from "jacdac-ts"
import { SRV_PSYCHOMAGNOTHERIC_ENERGY } from "../.devicescript/ts/constants"
import { bus } from "./runtime"

// simulator a customer service
const server = new AnalogSensorServer(SRV_PSYCHOMAGNOTHERIC_ENERGY, {
    readingValues: [0.5],
    readingError: [0.1],
    streamingInterval: 500,
})
addServer(bus, "psycho_energy", server)
bus.on(SELF_ANNOUNCE, () => {
    const newValue = server.reading.values()[0] + (0.5 - Math.random()) / 10
    server.reading.setValues([newValue])
    console.debug(`psycho: ${newValue}`)
})

bus.on([CONNECTION_STATE, DEVICE_CHANGE], () => {
    console.log(bus.describe())
})
bus.connect(true)
