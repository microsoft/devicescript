import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(s: string): void {
    console.log(s)
}

let s2 = ""
function testStrings(): void {
    msg("testStrings")
    // assert((42).toString() === "42", "42") TODO?

    msg("ts0x")
    let s = "live"
    assert(s === "live", "hello eq")
    msg("ts0y")

    s = s + "4OK"
    s2 = s
    msg("ts0")
    assert(s.charCodeAt(4) === 52, "hello eq2")
    assert(s.charAt(4) === "4", "hello eq2X")
    assert(s[4] === "4", "hello eq2X")
    assert(s.length === 7, "len7")
    msg("ts0")
    s = ""

    for (let i = 0; i < 10; i++) {
        msg("Y")
        s = s + i
        msg(s)
    }
    assert(s === "0123456789", "for")
    let x = 10
    s = ""
    while (x >= 0) {
        msg("X")
        s = s + x
        x = x - 1
    }
    assert(s === "109876543210", "while")
    msg(s)
    msg(s2)

    s2 = ""
    // don't leak ref

    x = 21
    s = "foo"
    s = `a${x * 2}X${s}X${s}Z`
    assert(s === ds._id("a42XfooXfoo") + "Z", "`")

    msg("X" + true)

    assert(ds._id("X") + true === ds._id("Xt") + "rue", "boolStr")
    msg("testStrings DONE")
}

function consStringTest() {
    msg("consStringTest")
    const s = "0123456789abcdef"
    let s0 = ""
    let s1 = ""
    for (let i = 0; i < 100; ++i) {
        s0 = s0 + s[i & 0xf]
        s1 = s[(99 - i) & 0xf] + s1
    }
    assert(s0 === s1, "c0")
    assert(s0.length === 100, "c1")
}

function testStringOps(): void {
    assert(ds._id("foo") + "bar" === "foobar", "concat")
    assert("xAb".charCodeAt(1) === 65, "code at")
    assert("B".charCodeAt(0) === 66, "tcc")
    assert(parseInt("-123") === -123, "tonum")
    assert("fo"[1] === "o", "at")
    assert("fo".length === 2, "count")
    assert(!"fo".charCodeAt(17), "nan")
}

function isEq(x: any, y: any): void {
    if (x !== y) {
        console.log(ds.format("fail: {0} !== {1}", x, y))
        // throw { message: "failed eq" }
        throw new Error("failed EQ")
    }
}

function testSlice() {
    const s = "012"
    isEq(s.slice(0), "012")
    isEq(s.slice(1), "12")
    isEq(s.slice(2), "2")
    isEq(s.slice(3), "")
    isEq(s.slice(4), "")
    isEq(s.slice(4000), "")
    isEq(s.slice(-1), "2")
    isEq(s.slice(-2), "12")
    isEq(s.slice(-3), "012")
    isEq(s.slice(-4), "012")
    isEq(s.slice(-400), "012")

    const q = "012345"
    isEq(q.slice(0), q)
    isEq(q.slice(1, 3), "12")
    isEq(q.slice(1, -2), "123")
}

function testSplit() {
    const q = "a,b,c,d"
    const sq = q.split(",")
    isEq(sq.length, 4)
    isEq(sq[0], "a")
    isEq(sq[1], "b")
    isEq(sq[2], "c")
    isEq(sq[3], "d")

    const sq2 = q.split(",", 2)
    isEq(sq2.length, 2)
    isEq(sq2[0], "a")
    isEq(sq2[1], "b")

    const sq3 = "a,:b,:c,d".split(",:")
    isEq(sq3.length, 3)
    isEq(sq3[0], "a")
    isEq(sq3[1], "b")
    isEq(sq3[2], "c,d")
}

function testReplace() {
    const q = "a,b,c,d"
    const sq = q.replace(",", ":")
    isEq(sq, "a:b,c,d")
    const q2 = "a,b,c,d"
    const sq2 = q2.replace("c,d", "c,d,e,f")
    isEq(sq2, "a,b,c,d,e,f")
}

function testReplaceAll() {
    const q = "a,b,c,d"
    const sq = q.replaceAll(",", ":")
    isEq(sq, "a:b:c:d")
    const q2 = "a,b,c,d,c,d"
    const sq2 = q2.replaceAll("c,d", "c,d,e,f")
    isEq(sq2, "a,b,c,d,e,f,c,d,e,f")
}

testStrings()
testStringOps()
consStringTest()

testSlice()
testSplit()
testReplace()
testReplaceAll()
