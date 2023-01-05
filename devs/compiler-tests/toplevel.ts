import * as ds from "@devicescript/core"

const g = 0
const r = new ds.Button()

function foo() {
    function bar() { }

    r.down.subscribe(() => {
    })
    r.onConnected(() => {
    })
    r.pressure.onChange(0.1, () => {})
}

if (g > 0) {
    const q = 0
    function bazz() { }

    r.down.subscribe(() => {
    })
}

function baz() {
    q = 1 //! Cannot find
}

foo()
baz()