import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

let lazyAcc: number

interface Testrec {
    num: number
}

function recordId(x: Testrec) {
    lazyAcc++
    return x
}

function postPreFix() {
    console.log("postPref")
    let x = { num: 0 }
    lazyAcc = 0
    recordId(x).num = 12
    assert(x.num === 12 && lazyAcc === 1, "X0-")
    let y = recordId(x).num++
    assert(x.num === 13 && lazyAcc === 2, "X1")
    assert(y === 12, "X2")
    y = ++recordId(x).num
    assert(y === 14 && x.num === 14 && lazyAcc === 3, "X2")

    recordId(x).num >>= 1
    assert(x.num === 7, "X3")
    assert(lazyAcc === 4, "X4")
    lazyAcc = 0
}

postPreFix()
