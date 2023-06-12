import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import { startSsd1306DotMatrix } from "@devicescript/drivers"
import "@devicescript/graphics"

const width = 128
const height = 64
const rows = 8
const columns = 16
const dots = await startSsd1306DotMatrix({
    width,
    height,
    rows,
    columns,
    cellWidth: 6,
    devAddr: 0x3c,
})

const tic = await dots.readImage()
for(let row = 0; row < rows; row++) {
    for(let col = 0; col < columns; col++) {
        tic.set(col, row, ((row + col) % 2) ? 1 : 0)
    }
}
await dots.writeImage(tic)
