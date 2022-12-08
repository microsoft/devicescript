import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

console.log("program start")
btnA.down.subscribe(() => {
    console.log('down')
    if (led.brightness.read() > 0)
        led.brightness.write(0)
    else
        led.brightness.write(1)
})
console.log("program stop")
