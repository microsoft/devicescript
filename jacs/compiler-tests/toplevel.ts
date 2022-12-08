import * as ds from "@devicescript/core"

const g = 0
const r = new ds.Button()

function foo() {
    function bar() { } //! only top-level functions are supported

    r.down.subscribe(() => { //! top-level
    })
    r.onConnected(() => { //! top-level
    })
    r.pressure.onChange(0.1, () => {}) //! top-level
}

if (g > 0) {
    const q = 0
    function bazz() { } //! only top-level functions are supported

    r.down.subscribe(() => { //! top-level
    })
}

function baz() {
    q = 1 //! Cannot find
}

foo()
baz()