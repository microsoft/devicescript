import * as ds from "@devicescript/core"
import { onStart, wait } from "@devicescript/core"

onStart(() => {
    console.log("3")
    wait(0.5)
    console.log("4")
})
console.log("1")
onStart(() => {
    console.log("5")
    wait(0.5)
    console.log("6")
})
wait(0.5)
console.log("2")
