import * as servers from "@devicescript/servers"

const button = servers.startButton({
    pin: 12,
})
const relay = servers.startRelay({
    pin: 13,
    pinLed: 14,
})

let active = false

button.down.subscribe(() => {
    active = !active
    console.log(`active ${active}`)
    relay.active.write(active)
})
