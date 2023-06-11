import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import { startSsd1306DotMatrix } from "@devicescript/drivers"

const dots = await startSsd1306DotMatrix({
    width: 128,
    height: 64,
    rows: 8,
    columns: 16,
    cellWidth: 6,
})
await dots.dots.write(hex`12345512e3`)