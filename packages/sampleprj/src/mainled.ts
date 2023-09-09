import { delay, Led, LedVariant, LedStripLightType } from "@devicescript/core"
import { startLed } from "@devicescript/drivers"
import { startLedDisplay } from "@devicescript/runtime"
import { pins } from "@dsboard/adafruit_qt_py_c3"

const jdled = new Led()
const led = await startLed({
    length: 12,
    columns: 3,
    variant: LedVariant.Ring,
    hwConfig: { type: LedStripLightType.WS2812B_GRB, pin: pins.A0_D0 },
})
const led2 = await startLed({
    length: 256,
    variant: LedVariant.Strip,
    hwConfig: { type: LedStripLightType.WS2812B_GRB, pin: pins.A1_D1 },
})
const ledm = await startLed({
    columns: 16,
    length: 256,
    variant: LedVariant.Matrix,
    gamma: 2.7,
    hwConfig: { type: LedStripLightType.WS2812B_GRB, pin: pins.A2_D2 },
})
const display = await startLedDisplay(ledm)

let ci = 0
setInterval(async () => {
    ci = (ci + 1) % display.palette.length
    if (!ci) ci++
    await jdled.showAll(0x00ff00)
    await led.showAll(0xff0000)
    await led2.showAll(0x0000ff)
    display.image.fill(0)
    display.image.drawCircle(6, 6, 5, ci)
    await display.show()
    await delay(1000)

    await jdled.showAll(0x0f0fff)
    await led.showAll(0x00ff00)
    await led2.showAll(0x00ff00)
    display.image.fill(0)
    display.image.drawRect(2, 2, 10, 8, ci)
    await display.show()

    await delay(500)
}, 500)
