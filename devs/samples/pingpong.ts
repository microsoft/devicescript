import * as ds from "@devicescript/core"

const condA = new ds.Condition()
const condB = new ds.Condition()
const btnA = new ds.Button()

setInterval(async () => {
    console.log("X2")
    await condB.wait()
    console.log("sig 2")
}, 50)

setInterval(async () => {
    console.log("X1")
    await condA.wait()
    console.log("sig 1")
    await ds.sleepMs(1000)
    condB.signal()
    await ds.sleepMs(1000)
}, 50)

btnA.down.subscribe(async () => {
    console.log("down")
    await condA.signal()
})
