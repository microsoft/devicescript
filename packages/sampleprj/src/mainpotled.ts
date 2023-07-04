import { pins } from "@dsboard/pico"
import { startLightBulb, startPotentiometer } from "@devicescript/servers"

const slider = startPotentiometer({
    pin: pins.P26,
})
const led = startLightBulb({
    pin: pins.P2,
})
slider.reading.subscribe(async level => {
    await led.intensity.write(level)
})
