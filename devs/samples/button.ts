import * as ds from "@devicescript/core"

const btn = new ds.Button()

btn.down.subscribe(async () => {
    console.log(`down`)
})
btn.up.subscribe(async () => {
    console.log(`up`)
})
btn.pressed().subscribe(async v => {
    console.log(`pressed: ${v}`)
})
