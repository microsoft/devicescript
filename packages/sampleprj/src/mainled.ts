import { delay, Led } from "@devicescript/core"
import { rgb } from "@devicescript/runtime"

const led = new Led()

setTimeout(async () => {
    await led.setAll(rgb(255, 0, 0))
    await delay(500)
    await led.setAll(0)
}, 500)
