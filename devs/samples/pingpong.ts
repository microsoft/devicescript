import * as ds from "@devicescript/core"

const condA = new ds.Condition()
const condB = new ds.Condition()
const btnA = new ds.Button()

ds.everyMs(50, () => {
    console.log("X2")
    condB.wait()
    console.log("sig 2")
})

ds.everyMs(50, () => {
    console.log("X1")
    condA.wait()
    console.log("sig 1")
    ds.sleepMs(1000)
    condB.signal()
    ds.sleepMs(1000)
})

btnA.down.subscribe(() => {
    console.log("down")
    condA.signal()
})
