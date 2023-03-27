import * as ds from "@devicescript/core"

const btn = new ds.MagneticFieldLevel()

btn.active.subscribe(async () => {
    console.log(`active`)
})
btn.inactive.subscribe(async () => {
    console.log(`inactive`)
})
btn.detected().subscribe(async v => {
    console.log(`detected: ${v}`)
})
