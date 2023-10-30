import { pins } from "@dsboard/esp32c3_bare"
import { startLightBulb, startButton } from "@devicescript/servers"

// List of pins: https://microsoft.github.io/devicescript/devices/esp32/esp32c3-bare
const led = startLightBulb({
    pin: pins.P2,
})
const button = startButton({
    pin: pins.P5,
})
console.log(`press button to toggle light`)
// listen for button down events
button.down.subscribe(async () => {
    // toggle light on/off
    console.log(`toggle`)
    await led.toggle()
})
