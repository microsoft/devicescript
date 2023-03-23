import * as ds from "@devicescript/core"
import { startPotentiometer, startRotaryEncoder } from "@devicescript/servers"
import { pins } from "@dsboard/esp32c3_rust_devkit"

console.log("prog2")

const rot = startRotaryEncoder({
    pin0: pins.P5,
    pin1: pins.P6,
    inverted: true,
    clicksPerTurn: 12,
})

const pot = startPotentiometer({
    pin: pins.P0,
})
