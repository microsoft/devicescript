import * as ds from "@devicescript/core"

console.log("starting")

const temp = new ds.Temperature()
const relay = new ds.Relay()
let target = 21 // deg C

setInterval(() => {
    const t = temp.temperature.read()
    console.log(`t: ${t}, s: ${target}`)
    if (t > target + 1) {
        relay.active.write(false)
        // wait 10000
        ds.sleep(10000)
    } else if (t < target - 1) {
        relay.active.write(true)
        // wait 10000
        ds.sleep(10000)
    } else {
        // do nothing
    }
}, 5000)
