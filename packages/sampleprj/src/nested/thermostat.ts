import * as ds from "@devicescript/core"

console.log("starting")

const temp = new ds.Temperature()
const relay = new ds.Relay()
let target = 21 // deg C

setInterval(async () => {
    const t = await temp.reading.read()
    console.log(`t: ${t}, s: ${target}`)
    if (t > target + 1) {
        await relay.enabled.write(false)
        // wait 10000
        await ds.sleep(10000)
    } else if (t < target - 1) {
        await relay.enabled.write(true)
        // wait 10000
        await ds.sleep(10000)
    } else {
        // do nothing
    }
}, 5000)
