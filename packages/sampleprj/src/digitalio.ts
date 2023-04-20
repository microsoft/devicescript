import { gpio, GPIOMode } from "@devicescript/core"

// flip a pin in a loop
const p0 = gpio(0)
await p0.setMode(GPIOMode.Output)

let loop = 0
setInterval(async () => {
    p0.write(loop++ % 2 ? 1 : 0)
}, 1000)

// subscribe to a pin
const p1 = gpio(1)
await p1.setMode(GPIOMode.Input)
// polling a pin
setInterval(async () => {
    const v = await p1.read()
    console.log({ poll: v })
}, 1000)
// subscribe to changes
p1.subscribe(v => console.log({ sub: v }))
