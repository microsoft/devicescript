import { Esp32C3FH4RGB } from "@devicescript/drivers"
import { startLedDisplay } from "@devicescript/runtime"

const board = new Esp32C3FH4RGB()
const led = await board.startLed()
await led.intensity.write(0.05)
const display = await startLedDisplay(led)
display.palette.setAt(1, 0xff0000)
display.palette.setAt(2, 0x00ff00)
display.palette.setAt(3, 0x0000ff)

for(let x = 0; x < 5; ++x)
for(let y = 0; y < 5; ++y)
    await display.image.set(x, y, (x + y) % 4)
await display.show()

