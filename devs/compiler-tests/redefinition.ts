import * as ds from "@devicescript/core"

const rx = new ds.Button() //! Cannot redeclare
const rx = new ds.Button() //! Cannot redeclare

const btnA = new ds.Button() //! Cannot redeclare
const btnA = new ds.Button() //! Cannot redeclare

const z = 1

function foo() {
    // shadowing allowed
    const z = 1
}

const qq = 1 //! Duplicate identifier
function qq() {} //! Duplicate identifier

function baz() {} //! Duplicate function implementation
function baz() {} //! Duplicate function implementation

foo()
