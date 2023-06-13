import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import { startSsd1306DotMatrix } from "@devicescript/drivers"
import { img } from "@devicescript/graphics"

const width = 128
const height = 64
const columns = 48
const rows = 16
const dots = await startSsd1306DotMatrix({
    width,
    height,
    rows,
    columns,
    devAddr: 0x3c,
})

const tic = img`# # . # #
# # . # #
. # # # .
. # # # .
# . # . .`
const i = await dots.readImage()
await i.printCenter("Hello", 0, 1)
await dots.writeImage(i)
