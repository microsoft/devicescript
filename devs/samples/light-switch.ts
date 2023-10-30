import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

console.log("program start")
btnA.down.subscribe(async () => {
    console.log("down")
    if ((await led.intensity.read()) > 0) await led.intensity.write(0)
    else await led.intensity.write(1)
})
console.log("program stop")
