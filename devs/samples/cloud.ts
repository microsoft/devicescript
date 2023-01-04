import * as ds from "@devicescript/core"
import { cloud } from "@devicescript/core"

let q = 0
        
// if (false)
    ds.every(5, () => {
        console.log("upl", q)
        cloud.upload("hello", q, 2 * q, q + 10000)
        q = q + 1
    })

cloud.onMethod("foo", (a, b) => {
    console.log("foo a=", a, "b=", b)
    return [a + 1, b * 2]
})

cloud.onMethod("bar", (a) => {
    console.log("bar a=", a)
    ds.wait(5)
    return [108]
})

cloud.onMethod("bar2", () => {
    return [108]
})
