import { addServer, AnalogSensorServer } from "jacdac-ts"
import { SRV_PSYCHOMAGNOTHERIC_ENERGY } from "../.devicescript/ts/constants"
import { bus } from "./runtime"

// simulator a customer service
const server = new AnalogSensorServer(SRV_PSYCHOMAGNOTHERIC_ENERGY, {
    readingValues: [0.5],
    readingError: [0.1],
    streamingInterval: 500,
})
// randomly change the reading value
setInterval(() => {
    const value = server.reading.values()[0]
    const newValue = value + (0.5 - Math.random()) / 10
    server.reading.setValues([newValue])
    console.debug(`psycho value: ${newValue}`)
}, 100)

// mount server on bus to make it visible
// to DeviceScript
addServer(bus, "aurascope", server)
