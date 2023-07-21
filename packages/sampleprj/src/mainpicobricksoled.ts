import { pins, board } from "@dsboard/pico_w"
import { SSD1306Driver } from "@devicescript/drivers"
import { configureHardware } from "@devicescript/servers"

configureHardware({
    scanI2C: false,
    i2c: {
        pinSCL: pins.GP5,
        pinSDA: pins.GP4,
        kHz: 200,
    },
})

const ssd = new SSD1306Driver({ width: 128, height: 64, devAddr: 0x3c })
await ssd.init()
ssd.image.print("Hello world!", 3, 10)
await ssd.show()
