var rx = roles.button()
var rx = roles.button() //! already defined

var btnA = roles.button()
var btnA = roles.button() //! already defined

var z = 1

function foo() {
    // no shadowing allowed
    var z = 1 //! already defined
}

var qq = 1 //! Duplicate identifier
function qq() { } //! Duplicate identifier

function baz() { } //! Duplicate function implementation
function baz() { } //! Duplicate function implementation

foo()