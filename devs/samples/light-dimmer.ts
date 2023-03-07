import * as ds from "@devicescript/core"

const pot = new ds.Potentiometer()
const led = new ds.LightBulb()
const relay = new ds.Relay()
let p

pot.position.subscribe(async p => {
    console.log("tick", p)
    await led.brightness.write(p)
})

led.brightness.subscribe(async b => {
    await relay.active.write(b < 0.2)
})

setInterval(async () => {
    console.log("lb", await led.brightness.read())
}, 200)
