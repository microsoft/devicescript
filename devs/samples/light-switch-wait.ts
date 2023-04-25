import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const led = new ds.LightBulb()

setInterval(async () => {
    await btnA.down.wait()
    if ((await led.intensity.read()) > 0) await led.intensity.write(0)
    else await led.intensity.write(1)
}, 100)
