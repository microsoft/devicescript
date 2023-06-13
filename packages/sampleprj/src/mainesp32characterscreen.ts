import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import { startSsd1306CharacterScreen } from "@devicescript/drivers"
import "@devicescript/graphics"

const screen = await startSsd1306CharacterScreen({
    width: 128,
    height: 64,
    devAddr: 0x3c,
})

await screen.message.write(`hello
workd`)
