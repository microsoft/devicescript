import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

ds.everyMs(100, () => {
    btnA.down.wait()
    if (led.brightness.read() > 0)
        led.brightness.write(0)
    else
        led.brightness.write(1)
})
