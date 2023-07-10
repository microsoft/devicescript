import { pins } from "@dsboard/pico"
import { startLightBulb, startPotentiometer } from "@devicescript/servers"

const slider = startPotentiometer({
    pin: pins.GP26,
})
const led = startLightBulb({
    pin: pins.GP2,
})
slider.reading.subscribe(async level => {
    await led.intensity.write(level)
})
