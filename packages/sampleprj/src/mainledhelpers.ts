import { delay } from "@devicescript/core";
import { startLed } from "@devicescript/drivers";
import { fillFade, fillGradient, fillSolid, schedule, fillPalette, Palette, fillPaletteCircular } from "@devicescript/runtime";

const led = await startLed({
    length: 32,
})
const pixels = await led.buffer()
const palette = new Palette(hex`ff0000 00ff00 0000ff`)

const show = async () => {
    await led.show()
    await delay(2000)
}

schedule(async () => {
    fillSolid(pixels, 0x00ff00)
    await show()


    fillGradient(pixels, 0xff0000, 0x0000ff)
    await show()

    fillFade(pixels, 0.5)
    await show()

    fillFade(pixels, 0.5)
    await show()

    fillPalette(pixels, palette)
    await show()

    fillPaletteCircular(pixels, palette)
    await show()
}, { timeout: 20, interval: 1000 })