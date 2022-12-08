import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

ds.every(0.1, () => {
    btnA.down.wait()
    if (led.brightness.read() > 0)
        led.brightness.write(0)
    else
        led.brightness.write(1)
})
