import { delay, Led, LedVariant } from "@devicescript/core"
import { rgb } from "@devicescript/runtime"
import { startLed } from "@devicescript/drivers"

const led = await startLed({
    length: 12,
    variant: LedVariant.Strip
})
const pixels = await led.buffer()

setTimeout(async () => {
    pixels.setAll(rgb(255, 0, 0))
    await led.show()
    await delay(500)
    pixels.setAll(0)
    await led.show()
}, 500)
