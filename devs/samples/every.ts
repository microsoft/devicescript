import * as ds from "@devicescript/core"

const lightBulb1 = new ds.LightBulb()
const button1 = new ds.Button()
button1.down.subscribe(async () => {
    console.log("down")
    await lightBulb1.brightness.write(1)
})
button1.up.subscribe(async () => {
    console.log("up")
    await lightBulb1.brightness.write(0)
})
setInterval(() => {
    console.log("5 second", ds.millis())
}, 5000)
