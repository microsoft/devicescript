import * as ds from "@devicescript/core"
import { _onStart, sleepMs } from "@devicescript/core"

_onStart(async () => {
    console.log("3")
    await sleepMs(500)
    console.log("4")
})
console.log("1")
_onStart(async () => {
    console.log("5")
    await sleepMs(500)
    console.log("6")
})
await sleepMs(500)
console.log("2")
