import * as ds from "@devicescript/core"

const pot = new ds.Potentiometer()
const led = new ds.LightBulb()
const relay = new ds.Relay()
let p

pot.position.onChange(0.02, async () => {
    p = await pot.position.read()
    console.log("tick", p)
    await led.brightness.write(p)
})

led.brightness.onChange(0.1, async () => {
    await relay.active.write(!(await relay.active.read()))
})

ds.everyMs(200, async () => {
    console.log("lb", await led.brightness.read())
})
