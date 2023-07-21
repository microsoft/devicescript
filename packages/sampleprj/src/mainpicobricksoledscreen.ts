import { pins, board } from "@dsboard/pico_w"
import { SSD1306Driver, startIndexedScreen } from "@devicescript/drivers"
import { delay } from "@devicescript/core"
import { configureHardware } from "@devicescript/servers"

configureHardware({
    scanI2C: false,
    i2c: {
        pinSCL: pins.GP5,
        pinSDA: pins.GP4,
        kHz: 200,
    },
})

const screen = await startIndexedScreen(
    new SSD1306Driver({ width: 128, height: 64, devAddr: 0x3c })
)
const image = screen.image
image.fill(0)
await screen.show()
for (let x = 0; x < image.width; x += 2) {
    for (let y = 0; y < image.height; y += 2) {
        image.set(x, y, 1)
        await screen.show()
        await delay(100)
    }
}
