import { pins, board } from "@dsboard/pico_bricks"
import { SSD1306Driver, startIndexedScreen } from "@devicescript/drivers"

const screen = await startIndexedScreen(
    new SSD1306Driver({ width: 64, height: 48 })
)
screen.display.image.print("Hello world!", 3, 10)
await screen.show()
