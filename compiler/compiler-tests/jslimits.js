var btnA = roles.button()
function foo() {
    var qq = 1
    qq += 2 //! only simple assignment supported
    qq-- //! unhandled
}

async function bar() { } //! async not supported
function* baz() { } //! async not supported

foo()
