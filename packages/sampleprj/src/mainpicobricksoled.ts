import { pins, board } from "@dsboard/pico_bricks"
import { SSD1306Driver } from "@devicescript/drivers"

const ssd = new SSD1306Driver({ width: 64, height: 48 })
await ssd.init()
ssd.image.print("Hello world!", 3, 10)
await ssd.show()
