var condA = condition()
var condB = condition()
var btnA = roles.button()

every(0.05, () => {
    console.log("X2")
    condB.wait()
    console.log("sig 2")
})

every(0.05, () => {
    console.log("X1")
    condA.wait()
    console.log("sig 1")
    wait(1)
    condB.signal()
    wait(1)
})

btnA.down.subscribe(() => {
    console.log("down")
    condA.signal()
})
