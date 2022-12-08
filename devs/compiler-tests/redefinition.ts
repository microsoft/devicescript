import * as ds from "@devicescript/core"

var rx = new ds.Button()
var rx = new ds.Button() //! already defined

var btnA = new ds.Button()
var btnA = new ds.Button() //! already defined

const z = 1

function foo() {
    // no shadowing allowed
    const z = 1 //! already defined
}

const qq = 1 //! Duplicate identifier
function qq() { } //! Duplicate identifier

function baz() { } //! Duplicate function implementation
function baz() { } //! Duplicate function implementation

foo()