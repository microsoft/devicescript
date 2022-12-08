import * as ds from "@devicescript/core"

const lightBulb1 = new ds.LightBulb()
const button1 = new ds.Button()
button1.down.subscribe(() => {
    console.log("down")
    lightBulb1.brightness.write(1)
})
button1.up.subscribe(() => {
    console.log("up")
    lightBulb1.brightness.write(0)
})
ds.every(5, () => {
    console.log("5 second", Date.now())
})
