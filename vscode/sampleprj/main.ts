import * as ds from "@devicescript/core"

function foo() {
    let x = 1.5
    let y = x + 1
    let z = {
        x,
        y,
        q: [1, 2],
    }
    console.log(`x=${x} y=${y}`)
    debugger
    console.log("past dbg")
}

function bar() {
    foo()
}

bar()
