import * as ds from "@devicescript/core"

async function bar() { }
function* baz() { } //! modifier not supported

function foo() {
    for (const q of [1,2,3]) {
        function blah() {
            console.log(q) //! references to loop variables
        }
        const copy = 123 + q
        function blah2() {
            console.log(copy) //! references to loop variables
        }
    }
}

foo()
