import { Temperature, TrafficLight } from "@devicescript/core"

const temp = new Temperature()
const light = new TrafficLight()
temp.reading.subscribe(async t => {
    if (t > 30) {
        await light.green.write(false)
        await light.yellow.write(false)
        await light.red.write(true)
    } else if (t > 20) {
        await light.green.write(false)
        await light.yellow.write(true)
        await light.red.write(false)
    } else {
        await light.green.write(true)
        await light.yellow.write(false)
        await light.red.write(false)
        }
})
