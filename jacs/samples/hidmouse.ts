import * as ds from "@devicescript/core"

const btn = new ds.Button()
const rot = new ds.RotaryEncoder()
const mouse = new ds.HidMouse()

const scale = 5

btn.down.subscribe(() => {
    mouse.move(0, -5 * scale, 100)
})

let prevV = rot.position.read()
rot.position.onChange(1, () => {
    const v = rot.position.read()
    mouse.move(scale * (v - prevV), 0, 100)
    prevV = v
    ds.wait(0.1)
})
