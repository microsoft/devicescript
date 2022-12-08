import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

btnA.down.subscribe(() => {
    console.log('down')
    led.brightness.write(1)
    ds.wait(0.2)
    led.brightness.write(0.3)
    ds.wait(1)
    led.brightness.write(0)
    console.log('end down')
})
