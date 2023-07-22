import { delay, Led, LedVariant } from "@devicescript/core"
import { rgb } from "@devicescript/runtime"
import { startLed } from "@devicescript/drivers"

const jdled = new Led()
const led = await startLed({
    length: 12,
    columns: 3,
    variant: LedVariant.Matrix,
})
const led2 = await startLed({
    length: 256,
    variant: LedVariant.Strip,
})

setInterval(async () => {
    await jdled.showAll(0x00ff00)
    await led.showAll(0xff0000)
    await led2.showAll(0x0000ff)
    await delay(1000)

    await jdled.showAll(0x0f0fff)
    await led.showAll(0x00ff00)
    await led2.showAll(0x00ff00)

    await delay(500)
}, 500)
