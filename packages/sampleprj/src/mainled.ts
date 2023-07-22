import { delay, Led, LedVariant } from "@devicescript/core"
import { rgb } from "@devicescript/runtime"
import { startLed } from "@devicescript/drivers"

const led = await startLed({
    length: 12,
    variant: LedVariant.Strip,
})
const pixels = await led.buffer()

const led2 = await startLed({
    length: 256,
    variant: LedVariant.Strip,
})
const pixels2 = await led.buffer()

setInterval(async () => {
    pixels.setAll(rgb(255, 0, 0))
    await led.show()

    pixels2.setAll(rgb(0, 0, 255))
    await led2.show()

    await delay(1000)

    pixels.setAll(0)
    await led.show()

    pixels2.setAll(0)
    await led2.show()

    await delay(500)
}, 500)
