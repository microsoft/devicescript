import * as ds from "@devicescript/core"

function foo() {
    let x = 1
    let y = x + 1
    console.log(`x=${x} y=${y}`)
    debugger
}

function bar() {
    foo()
}

bar()
