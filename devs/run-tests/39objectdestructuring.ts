import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(m: string) {
    console.log(m)
}

let glb1 = 0

interface X {
    a: number
    b: string
    c: boolean
    d: Y
}

interface Y {
    e: number
    f: number
}

function testFunction(callBack: (x: X) => void) {
    const test = {} as X
    test.a = 17
    test.b = "okay"
    test.c = true

    const subTest = {} as Y
    subTest.e = 18
    subTest.f = 19

    test.d = subTest

    callBack(test)
}

function arrayAssignment() {
    let [a, b, c] = [1, "foo", 3]
    assert(a == 1, "[]")
    assert(c == 3, "[]")
    assert(b == "foo", "[1]")
    
    /* TODO
    ;[a, c] = [c, a]
    assert(a == 3, "[2]")
    assert(c == 1, "[]")

    const q = [4, 7]
    let p = 0
    ;[a, c, p] = q
    assert(a == 4, "[]")
    assert(c == 7, "[]")
    assert(p === undefined, "[]")

    let [aa, [bb, cc]] = [4, [3, [1]]]
    assert(aa == 4, "[[]]")
    assert(bb == 3, "[[]]")
    assert(cc.length == 1, "[[]]")
    */

    msg("arrayAssignment done")
}

/* TODO
class ObjF {
    constructor(public x: number, public y: string) {}
}
*/

function objectAssignment() {
    //let {aa,bb} = {aa:10,bb:20}
    //console.log(aa + bb)

    let {
        aa,
        bb: { q, r },
    } = { aa: 10, bb: { q: 1, r: 2 } }
    assert(aa == 10, "{}")
    assert(q == 1, "{}")
    assert(r == 2, "{}")

    /* TODO
    let { x, y } = new ObjF(1, "foo")
    assert(x == 1, "{}")
    assert(y == "foo", "{}")
    */

    msg("objectAssignment done")
}

function runObjDestruct() {
    /* TODO
    glb1 = 0

    testFunction(({}) => {
        glb1 = 1
    })

    assert(glb1 === 1)

    testFunction(({ a }) => {
        assert(a === 17)
        glb1 = 2
    })

    assert(glb1 === 2)

    testFunction(({ a: hello }) => {
        assert(hello === 17)
        glb1 = 3
    })

    assert(glb1 === 3)

    testFunction(({ a, b, c }) => {
        assert(a === 17)
        assert(b === "okay")
        assert(c)
        glb1 = 4
    })

    assert(glb1 === 4)

    testFunction(({ d: { e, f } }) => {
        assert(e === 18)
        assert(f === 19)
        glb1 = 5
    })

    assert(glb1 === 5)
    */

    arrayAssignment()
    objectAssignment()
}

runObjDestruct()

ds.reboot()
