import * as ds from "@devicescript/core"

const pot = new ds.Potentiometer()
const led = new ds.LightBulb()
const relay = new ds.Relay()
let p

pot.position.onChange(0.02, () => {
    p = pot.position.read()
    console.log("tick", p)
    led.brightness.write(p)
})

led.brightness.onChange(0.1, () => {
    relay.active.write(!relay.active.read())
})

ds.everyMs(200, () => {
    console.log("lb", led.brightness.read())
})
