import * as ds from "@devicescript/core"

const pot = new ds.Potentiometer()
const led = new ds.LightBulb()
const relay = new ds.Relay()
let p

pot.reading.subscribe(async p => {
    console.log("tick", p)
    await led.intensity.write(p)
})

led.intensity.subscribe(async b => {
    await relay.enabled.write(b < 0.2)
})

setInterval(async () => {
    console.log("lb", await led.intensity.read())
}, 200)
