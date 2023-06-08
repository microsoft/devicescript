import { mcuTemperature } from "@devicescript/runtime"

setInterval(async () => {
    const temp = await mcuTemperature()
    console.log({ temp })
}, 1000)
