import * as ds from "@devicescript/core"

function foo() {
    let x = 1.5
    let y = x + 1
    let z = {
        x,
        y,
        q: [1, 2],
    }
    ;(z as any)["foo" + 12] = z
    // ;[x]=[1] // uncomment to trigger DS error
    console.log("hello")
    console.log(`x=${x} y=${y}`)
    console.log("world")
    z.q.map(e => {
        console.log(e)
        if (e == 2) debugger
    })
    console.log("past dbg")
}

function bar() {
    foo()
}

bar()
