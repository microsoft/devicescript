import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(m: string) {
    console.log(m)
}
let glb1 = 0

function testForOf() {
    let arr = [1, 7, 8]
    let sum = 0
    for (let e of arr) {
        msg("FO:" + e)
        sum += (e - 1)
    }
    assert(sum == 13, "fo1")
    msg("loop1 done")

    // make sure we incr reference count of the array during the loop execution
    for (let q of [3, 4, 12]) {
        sum += (q - 2)
    }
    assert(sum == 26, "fo2")

    // iteration over a string
    let s = "hello, world!"
    let s2 = ""
    for (let c of s) {
        s2 += c
    }
    assert(s == s2, "fo3")

    // mutation of array during iteration
    let fibs = [0, 1]
    for (let x of fibs) {
        if (fibs.length < 10) {
            fibs.push(fibs[fibs.length - 2] + fibs[fibs.length - 1])
        }
    }
    assert(fibs.length == 10, "fo4")

    // mutation of array during iteration
    let xs = [10, 9, 8]
    for (let x of xs) {
        const idx = xs.indexOf(x)
        assert(idx >= 0, "fo5")
        xs.insert(idx, -1)
    }

    // array concatenation
    let yss = [[1, 2, 3], [4, 5], [6, 7, 8], [9, 10]]
    let concat: number[] = []
    for (let ys of yss) {
        for (let y of ys) {
            concat.push(y)
        }
    }
    assert(concat.length == 10, "fo6")

    sum = 0
    for (let y of concat) {
        sum += y
    }
    assert(sum == 55, "fo7")


    /* TODO
    let f = []
    glb1 = 0
    for (const q of [1, 12]) {
        f.push(() => {
            glb1 += q
        })
    }
    f[0]()
    f[1]()
    assert(glb1 == 13, "foc")
    */

    msg("for of done")
}

testForOf()
ds.reboot()