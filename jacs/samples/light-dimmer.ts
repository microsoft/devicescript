const pot = roles.potentiometer()
const led = roles.lightBulb()
const relay = roles.relay()
let p

pot.position.onChange(0.02, () => {
    p = pot.position.read()
    console.log("tick", p)
    led.brightness.write(p)
})

led.brightness.onChange(0.1, () => {
    relay.active.write(!relay.active.read())
})

every(0.2, () => {
    console.log("lb", led.brightness.read())
})
