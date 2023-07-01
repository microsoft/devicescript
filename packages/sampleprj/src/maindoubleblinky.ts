import { pins } from "@dsboard/esp32c3_bare"
import { startLightBulb } from "@devicescript/servers"

// start a lightbulb drivers on pin GP1 and GP2
const led1 = startLightBulb({
    pin: pins.P1,
})
const led2 = startLightBulb({
    pin: pins.P2,
})

// start interval timer every 1000ms
setInterval(async () => {
    // toggle on/off    
    await led1.toggle()
}, 1000)

// start interval timer every 250ms
setInterval(async () => {
    // toggle on/off    
    await led2.toggle()
}, 250)