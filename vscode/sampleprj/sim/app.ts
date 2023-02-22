import {
    addServiceProvider,
    AnalogSensorServer,
    CONNECTION_STATE,
    DEVICE_CHANGE,
    SELF_ANNOUNCE,
} from "jacdac-ts"
import { SRV_PSYCHOMAGNOTHERIC_ENERGY } from "../.devicescript/ts/constants"
import { bus } from "./bus"

// simulator a customer service
const server = new AnalogSensorServer(SRV_PSYCHOMAGNOTHERIC_ENERGY, {
    readingValues: [0.5],
    readingError: [0.1],
})
addServiceProvider(bus, {
    name: "psycho_energy",
    serviceClasses: [SRV_PSYCHOMAGNOTHERIC_ENERGY],
    services: () => [server],
})
bus.on(SELF_ANNOUNCE, () => {
    server.reading.setValues([
        server.reading.values()[0] + (0.5 - Math.random()),
    ])
})

bus.on([CONNECTION_STATE, DEVICE_CHANGE], () => {
    console.log(bus.describe())
})
bus.connect(true)
