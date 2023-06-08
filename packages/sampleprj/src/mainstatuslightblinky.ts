import { delay } from "@devicescript/core"
import { setStatusLight } from "@devicescript/runtime"

setInterval(async () => {
    // red
    await setStatusLight(0x100000)
    // wait 0.5s
    await delay(400)
    // blue
    await setStatusLight(0x000010)
    // wait 0.5s
    await delay(400)
}, 1)
