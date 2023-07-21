import { pins } from "@dsboard/pico_w"
import { Temperature } from "@devicescript/core"
import { startTrafficLight } from "@devicescript/drivers"

const temp = new Temperature()
const light = await startTrafficLight({
    red: pins.GP10,
    yellow: pins.GP11,
    green: pins.GP12,
})
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
