var g = 0
var r = roles.button()

function foo() {
    function bar() { } //! only top-level functions are supported

    r.down.subscribe(() => { //! top-level
    })
    r.onConnected(() => { //! top-level
    })
    r.pressure.onChange(0.1, () => {}) //! top-level
}

if (g > 0) {
    var q = 0
    function baz() { } //! only top-level functions are supported

    r.down.subscribe(() => { //! top-level
    })
}

function baz() {
    q = 1 //! can't find
}

