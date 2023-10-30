import { pins } from "@dsboard/pico"
import { startLightBulb } from "@devicescript/servers"

// start a lightbulb server on pin GP1
// and store client in `led` variable
const led = startLightBulb({
    pin: pins.GP1,
})

// start interval timer every 1000ms
setInterval(async () => {
    // read current brightness
    const brightness = await led.intensity.read()
    // toggle on/off
    const newbrightness = brightness > 0 ? 0 : 1
    // apply new brightness
    await led.intensity.write(newbrightness)
}, 1000)
