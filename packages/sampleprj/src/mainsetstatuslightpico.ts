import "@dsboard/pico"
import { setStatusLight } from "@devicescript/runtime"
import { delay } from "@devicescript/core"

setInterval(async () => {
    console.log('.')
    await setStatusLight(0xff0000)
    await delay(100)
    await setStatusLight(0x0000ff)
}, 100)