import * as ds from "@devicescript/core"
import { cloud } from "@devicescript/core"

let q = 0

setInterval(async () => {
    console.log("upl", q)
    await cloud.upload("hello", q, 2 * q, q + 10000)
    q = q + 1
}, 5000)

cloud.onMethod("foo", async (a, b) => {
    console.log("foo a=", a, "b=", b)
    return [a + 1, b * 2]
})

cloud.onMethod("bar", async a => {
    console.log("bar a=", a)
    await ds.sleepMs(5000)
    return [108]
})

cloud.onMethod("bar2", async () => {
    return [108]
})
