import {
    startBuzzer,
    startLightBulb,
    startPotentiometer,
    startRotaryEncoder,
} from "@devicescript/servers"
import { board, pins } from "@dsboard/esp32c3_rust_devkit"

console.log("Start!")

const bulb = startLightBulb({
    pin: pins.P20,
    dimmable: true,
})

const buzz = startBuzzer({
    pin: pins.P1,
})

const pot = startPotentiometer({
    pin: pins.P0,
})

const rot = startRotaryEncoder({
    pin0: pins.P5,
    pin1: pins.P6,
    inverted: true,
})

rot.position.subscribe(async p => {
    p = Math.abs(p)
    await bulb.brightness.write((p % 10) / 10)
})

let freq = 100
setInterval(async () => {
    let vol = (await pot.position.read()) / 4
    if (vol < 0.01) vol = 0
    await buzz.playNote(freq, vol, 100)
    freq += 100
    if (freq > 1000) freq = 100
}, 300)
