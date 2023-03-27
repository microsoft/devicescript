import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

btnA.down.subscribe(async () => {
    console.log('down')
    await led.brightness.write(1)
    await ds.sleep(200)
    await led.brightness.write(0.3)
    await ds.sleep(1000)
    await led.brightness.write(0)
    console.log('end down')
})
