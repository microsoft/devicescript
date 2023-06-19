import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import { SSD1306Driver, startDotMatrix } from "@devicescript/drivers"
import { img } from "@devicescript/graphics"

const width = 128
const height = 64
const columns = 48
const rows = 16
const dots = await startDotMatrix(
    new SSD1306Driver({
        width,
        height,
        devAddr: 0x3c,
    }),
    {
        rows,
        columns,
    }
)

const tic = img`# # . # #
# # . # #
. # # # .
. # # # .
# . # . .`
const i = await dots.readImage()
i.printCenter("Hello", 0, 1)
await dots.writeImage(i)
