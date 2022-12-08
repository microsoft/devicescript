import * as ds from "@devicescript/core"

const condA = new ds.Condition()
const condB = new ds.Condition()
const btnA = new ds.Button()

ds.every(0.05, () => {
    console.log("X2")
    condB.wait()
    console.log("sig 2")
})

ds.every(0.05, () => {
    console.log("X1")
    condA.wait()
    console.log("sig 1")
    ds.wait(1)
    condB.signal()
    ds.wait(1)
})

btnA.down.subscribe(() => {
    console.log("down")
    condA.signal()
})
