import * as ds from "@devicescript/core"

const condA = new ds.Condition()
const condB = new ds.Condition()
const btnA = new ds.Button()

ds.everyMs(50, async () => {
    console.log("X2")
    await condB.wait()
    console.log("sig 2")
})

ds.everyMs(50, async () => {
    console.log("X1")
    await condA.wait()
    console.log("sig 1")
    await ds.sleepMs(1000)
    condB.signal()
    await ds.sleepMs(1000)
})

btnA.down.subscribe(async () => {
    console.log("down")
    await condA.signal()
})
