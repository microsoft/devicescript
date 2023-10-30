import { Esp32C3FH4RGB } from "@devicescript/drivers"
import { startLedDisplay } from "@devicescript/runtime"

const board = new Esp32C3FH4RGB()
const led = await board.startLed()
await led.intensity.write(0.05)
const display = await startLedDisplay(led)

const n = display.palette.length
let k = 0
for (let y = 0; y < 5; ++y)
    for (let x = 0; x < 5; ++x) await display.image.set(x, y, k++ % n)
await display.show()
