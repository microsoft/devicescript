import { pins, board } from "@dsboard/super_mini_esp32c3"
import { setStatusLight } from "@devicescript/runtime"
import { delay, millis } from "@devicescript/core"

setInterval(async () => {
    await setStatusLight(0)
    console.log(`${millis()}: off`)
    await delay(1000)
    await setStatusLight(0xff0000)
    console.log(`${millis()}: on`)
    await delay(1000)
}, 1)
