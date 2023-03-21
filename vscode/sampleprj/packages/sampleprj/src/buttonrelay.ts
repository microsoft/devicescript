import { gpio } from "@devicescript/core"
import { debounceTime } from "@devicescript/observables"
import * as servers from "@devicescript/servers"

const button = servers.startButton({
    pin: gpio(12),
})
const relay = servers.startRelay({
    pin: gpio(13),
    pinLed: gpio(14),
})

let active = false

await button.down.pipe(debounceTime(500)).subscribe(async () => {
    active = !active
    console.log(`active ${active}`)
    await relay.active.write(active)
})
