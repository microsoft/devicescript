import { delay } from "@devicescript/core"
import { setStatusLight } from "@devicescript/runtime"

setInterval(async () => {
    await setStatusLight(0)
    await delay(1000)
    await setStatusLight(0x0f0f0f)
    await delay(1000)
}, 10)
