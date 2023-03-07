import * as ds from "@devicescript/core"

const g = 0
const r = new ds.Button()

async function foo() {
    function bar() { }

    await r.down.subscribe(() => {
    })
    r.onConnected(() => {
    })
    await r.pressure.subscribe(() => {})
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

await foo()
baz()