import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import {
    SSD1306Driver,
    startCharacterScreenDisplay,
} from "@devicescript/drivers"
import "@devicescript/graphics"

const screen = await startCharacterScreenDisplay(
    new SSD1306Driver({
        width: 128,
        height: 64,
        devAddr: 0x3c,
    })
)

await screen.message.write(`hello
workd`)
