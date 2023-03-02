import { gpio } from "@devicescript/core"
import * as servers from "@devicescript/servers"

const button = servers.startButton({
    pin: gpio(12),
})
const relay = servers.startRelay({
    pin: gpio(13),
    pinLed: gpio(14),
})

let active = false

button.down.subscribe(() => {
    active = !active
    console.log(`active ${active}`)
    relay.active.write(active)
})
