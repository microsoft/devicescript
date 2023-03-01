import * as ds from "@devicescript/core"

let x: number
const servo1 = new ds.Servo()
const button1 = new ds.Button()
const airPressure1 = new ds.AirPressure()
servo1.onConnected(async () => {
    await servo1.enabled.write(true)
})
button1.down.subscribe(async () => {
    x = x + 1
    await servo1.angle.write(50)
})
airPressure1.pressure.onChange(1, async () => {
    x = 0
    await servo1.angle.write(-35)
})
button1.up.subscribe(async () => {
    await servo1.angle.write(0)
})
