import * as ds from "@devicescript/core"

console.log("starting...")
const temp = new ds.Temperature()
const light = new ds.TrafficLight()
temp.temperature.subscribe(async t => {
    console.log(t)
    await light.green.write(false)
    await light.yellow.write(false)
    await light.red.write(false)
    if (t > 30) {
        await light.red.write(true)
    } else if (t > 20) {
        await light.yellow.write(true)
    } else {
        await light.green.write(true)
    }
})
