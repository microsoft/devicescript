import { pins } from "@dsboard/seeed_xiao_esp32c3"
import { startButton, startLightBulb  } from "@devicescript/servers"

// configure LED and button
const lightBulb = startLightBulb({
    pin: pins.D1,
})
const button = startButton({
    pin: pins.D0,
})
// listen for button down events
button.down.subscribe(async () => {
    // toggle light on/off
    await lightBulb.toggle()
})