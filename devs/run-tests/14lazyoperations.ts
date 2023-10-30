import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

let lazyAcc: number

function msg(s: string): void {
    console.log(s)
}

function testLazyOps(): void {
    msg("testing lazy")
    lazyAcc = 0
    if (incrLazyAcc(10, false) && incrLazyAcc(1, true)) {
        assert(false, "")
    } else {
        assert(lazyAcc === 10, "lazy1")
    }
    assert(lazyAcc === 10, "lazy2")
    if (incrLazyAcc(100, true) && incrLazyAcc(1, false)) {
        assert(false, "")
    } else {
        assert(lazyAcc === 111, "lazy4")
    }
    lazyAcc = 0
    if (incrLazyAcc(100, true) && incrLazyAcc(8, true)) {
        assert(lazyAcc === 108, "lazy5")
    } else {
        assert(false, "")
    }
    lazyAcc = 0
    if (incrLazyAcc(10, true) || incrLazyAcc(1, true)) {
        assert(lazyAcc === 10, "lazy1b")
    } else {
        assert(false, "")
    }
    assert(lazyAcc === 10, "lazy2xx")
    if (incrLazyAcc(100, false) || incrLazyAcc(1, false)) {
        assert(false, "")
    } else {
        assert(lazyAcc === 111, "lazy4x")
    }
    lazyAcc = 0
    if (incrLazyAcc(100, false) || incrLazyAcc(8, true)) {
        assert(lazyAcc === 108, "lazy5")
    } else {
        assert(false, "")
    }
    lazyAcc = 0
    if (
        incrLazyAcc(10, true) &&
        incrLazyAcc(1, true) &&
        incrLazyAcc(100, false)
    ) {
        assert(false, "")
    } else {
        assert(lazyAcc === 111, "lazy10")
    }
    lazyAcc = 0
    if (
        (incrLazyAcc(10, true) && incrLazyAcc(1, true)) ||
        incrLazyAcc(100, false)
    ) {
        assert(lazyAcc === 11, "lazy101")
    } else {
        assert(false, "")
    }

    lazyAcc = 0
    let cond = true
    assert((cond ? incrLazyNum(1, 42) : incrLazyNum(10, 36)) === 42, "?:")
    assert(lazyAcc === 1, "?:0")
    assert((!cond ? incrLazyNum(1, 42) : incrLazyNum(10, 36)) === 36, "?:1")
    assert(lazyAcc === 11, "?:2")
    lazyAcc = 0

    msg("testing lazy done")
}

function incrLazyAcc(delta: number, res: boolean): boolean {
    lazyAcc = lazyAcc + delta
    return res
}

function incrLazyNum(delta: number, res: number) {
    lazyAcc = lazyAcc + delta
    return res
}

function testBoolCasts() {
    msg("testBoolCast")
    function boolDie() {
        assert(false, "bool casts")
    }
    let x = ds._id("Xy") + "Z"

    if (x) {
    } else {
        boolDie()
    }

    if ("") {
        boolDie()
    }

    let v = {}
    if (v) {
    } else {
        boolDie()
    }
    if (!v) {
        boolDie()
    }
    v = null
    if (v) {
        boolDie()
    }
    if (!v) {
    } else {
        boolDie()
    }
}

testLazyOps()
testBoolCasts()
