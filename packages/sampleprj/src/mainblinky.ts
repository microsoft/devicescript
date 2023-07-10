import { delay } from "@devicescript/core"
import { setStatusLight } from "@devicescript/runtime"

setInterval(async () => {
    console.log('off')
    await setStatusLight(0)
    await delay(1000)
    console.log('on')
    await setStatusLight(0x0f0f0f)
    await delay(1000)
}, 10)
