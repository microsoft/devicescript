import { delay } from "@devicescript/core";
import { startLed } from "@devicescript/drivers";
import { Palette } from "@devicescript/graphics";
import { fillFade, fillGradient, fillSolid, schedule, fillPalette, fillRainbow } from "@devicescript/runtime";

const led = await startLed({
    length: 32,
})
const pixels = await led.buffer()
const palette = new Palette(hex`ff0000 00ff00 0000ff ffff00 00ff00`)

const show = async () => {
    await led.show()
    await delay(1000)
}

schedule(async () => {
    fillSolid(pixels, 0x00ff00)
    await show()

    fillGradient(pixels, 0xff0000, 0x0000ff)
    await show()

    fillGradient(pixels, 0xff0000, 0x0000ff, { reversed: true })
    await show()

    fillGradient(pixels, 0xff0000, 0x0000ff, { circular: true })
    await show()

    fillGradient(pixels, 0xff0000, 0x0000ff, { circular: true, reversed: true })
    await show()

    fillRainbow(pixels,)
    await show()

    fillRainbow(pixels, { circular: true })
    await show()

    fillFade(pixels, 0.2)
    await show()

    fillPalette(pixels, palette)
    await show()

    fillPalette(pixels, palette, { reversed: true })
    await show()

}, { timeout: 20, interval: 1000 })