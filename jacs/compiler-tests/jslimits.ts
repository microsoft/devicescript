import * as ds from "@devicescript/core"

const btnA = new ds.Button()
function foo() {
    let qq = 1
    qq += 2 //! unhandled operator
    qq-- //! unhandled
}

async function bar() { } //! async not supported
function* baz() { } //! async not supported

foo()
