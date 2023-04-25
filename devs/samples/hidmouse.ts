import * as ds from "@devicescript/core"

const btn = new ds.Button()
const rot = new ds.RotaryEncoder()
const mouse = new ds.HidMouse()

const scale = 5

btn.down.subscribe(async () => {
    await mouse.move(0, -5 * scale, 100)
})

let prevV = await rot.reading.read()
rot.reading.subscribe(async () => {
    const v = await rot.reading.read()
    await mouse.move(scale * (v - prevV), 0, 100)
    prevV = v
    await ds.sleep(100)
})
