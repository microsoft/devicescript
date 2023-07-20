import { pins, board } from "@dsboard/pico_bricks"
import { SSD1306Driver, startIndexedScreen } from "@devicescript/drivers"

const screen = await startIndexedScreen(
    new SSD1306Driver({ width: 64, height: 48 })
)
let i = 0
setInterval(async () => {
    console.log(i)
    screen.image.print(`Hello world! ${i++}`, 3, 10)
    await screen.show()
}, 1000)
