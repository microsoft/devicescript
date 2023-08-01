import { delay } from "@devicescript/core";
import { startLed } from "@devicescript/drivers";
import { fillFade, fillGradient, fillSolid, schedule, fillPalette, Palette, fillPaletteCircular } from "@devicescript/runtime";

const led = await startLed({
    length: 16,
})
const pixels = await led.buffer()
const palette = Palette.arcade()

const show = async () => {
    await led.show()
    await delay(1000)
}

schedule(async () => {
    fillSolid(pixels, 0x00ff00)
    await show()


    fillGradient(pixels, 0xff0000, 0x0000ff)
    await show()

    fillFade(pixels, 0.9)
    await show()

    fillFade(pixels, 0.5)
    await show()

    fillPalette(pixels, palette)
    await show()

    fillPaletteCircular(pixels, palette)
    await show()
}, { timeout: 20, interval: 1000 })