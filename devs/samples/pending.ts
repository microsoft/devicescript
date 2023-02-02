import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

btnA.down.subscribe(() => {
    console.log('down')
    led.brightness.write(1)
    ds.sleepMs(200)
    led.brightness.write(0.3)
    ds.sleepMs(1000)
    led.brightness.write(0)
    console.log('end down')
})
