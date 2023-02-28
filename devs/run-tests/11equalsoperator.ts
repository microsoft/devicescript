import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function eqOp() {
    console.log("eqOp")
    let x = 12
    x += 10
    // assert(() == 22, "Y0")
    assert(x == 22, "Y1")
    x /= 2
    assert(x == 11, "Y2")

    let s = ds._id("fo") + 1
    let t = ds._id("ba") + 2
    s += t
    assert(s == ds._id("fo1b") + "a2", "fb")
}

function eqOpString() {
    console.log("eqOpStr")
    let x = "fo"
    x += "ba"
    // assert((x += "ba") == "foba", "SY0")
    assert(x == "foba", "SY1")
}

eqOp()
eqOpString()

function eq<A, B>(a: A, b: B) {
    return a === (b as any as A)
}

function eqG() {
    assert(eq(2, 2), "2")
    assert(eq("2", "2"), "2")
    assert(!eq("2", 2), "2")
    assert(!eq(2, "2"), "2'")
    assert(!eq("null", null), "=1")
    assert(!eq(null, "null"), "=2")
    assert(!eq("2", 3), "=3")
}

eqG()

ds.reboot()
