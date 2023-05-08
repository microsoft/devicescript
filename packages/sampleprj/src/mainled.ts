import { delay, Led, rgb } from "@devicescript/core"

const led = new Led()

setTimeout(async () => {
    await led.setAll(rgb(255, 0, 0))
    await delay(500)
    await led.setAll(0)
}, 500)
