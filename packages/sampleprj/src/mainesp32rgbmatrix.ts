import { pins } from "@dsboard/esp32_c3fh4_rgb"
import { LedStripLightType, LedVariant } from "@devicescript/core"
import { startLed } from "@devicescript/drivers"
import { startLedDisplay } from "@devicescript/runtime"

const led = await startLed({
    length: 25,
    columns: 5,
    variant: LedVariant.Matrix,
    hwConfig: { type: LedStripLightType.WS2812B_GRB, pin: pins.LEDS },
})
const display = await startLedDisplay(led)

await display.image.fill(0x00ff00)
await display.show()
