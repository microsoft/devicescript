import * as ds from "@devicescript/core"
import { _onStart, sleepMs } from "@devicescript/core"

_onStart(() => {
    console.log("3")
    sleepMs(500)
    console.log("4")
})
console.log("1")
_onStart(() => {
    console.log("5")
    sleepMs(500)
    console.log("6")
})
sleepMs(500)
console.log("2")
