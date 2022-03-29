var rx = roles.button()
var rx = roles.lightBulb() //! already defined

var btnA = roles.button()
var btnA = 1 //! already defined

var z = 1

function foo() {
    // no shadowing allowed
    var z = 1 //! already defined
}

var qq = 1
function qq() { } //! already defined

function baz() { }
function baz() { } //! already defined

