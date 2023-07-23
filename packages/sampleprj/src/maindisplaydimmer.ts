import * as ds from "@devicescript/core"
import "@devicescript/runtime"

const pot = new ds.Potentiometer()
const ledD = new ds.Led()
const btn = new ds.Button()

pot.reading.subscribe(async p => {
    console.log("tick", p)
    await ledD.intensity.write(p * 0.3)
})

ledD.binding().subscribe(async () => {
    await ledD.showAll(0xff0000)
})

btn.down.subscribe(async () => {
    await ledD.showAll(0xff00ff)
})

btn.up.subscribe(async () => {
    await ledD.showAll(0x0000ff)
})
