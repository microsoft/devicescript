import * as ds from "@devicescript/core"
import { startButton, startRotaryEncoder } from "@devicescript/servers"

const btn = new ds.Button()
const encoder = new ds.RotaryEncoder()
btn.down.subscribe(() => {
    console.log('down')
})
encoder.position.onChange(1, () => {
    console.log(encoder.position.read())
})