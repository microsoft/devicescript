import { SSD1306Driver } from "@devicescript/drivers"
import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"

const ssd = new SSD1306Driver({ width: 128, height: 64, devAddr: 0x3c })
await ssd.init()
ssd.image.print("Hello world!", 3, 10)
await ssd.show()
