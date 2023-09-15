import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

let glb1: number

function msg(s: string): void {
    console.log(s)
}

function testIf(): void {
    let b = false
    if (!b) {
        glb1 = 7
    } else {
        assert(false, "b0")
    }
    assert(glb1 === 7, "glb3")
    if (b) {
        assert(false, "b1")
    } else {
        glb1 = 8
    }
    assert(glb1 === 8, "glb3")
}

function testRight(a: number, b: number, c: number) {
    assert(a >> b === c, "f>>0")
    assert(a >> (b + 32) === c, "f>>")
    assert(a >> (b - 32) === c, "f>>")
    assert(a >> (b + 0x80000000) === c, "f>>")
}
function testLeft(a: number, b: number, c: number) {
    assert(a << b === c, "f<<0")
    assert(a << (b + 32) === c, "f<<")
    assert(a << (b - 32) === c, "f<<")
    assert(a << (b + 0x80000000) === c, "f<<")
}
function testZ(a: number) {
    assert(a >> 0 === a, "z>>")
    assert(a << 0 === a, "z<<")
    assert(a >> 32 === a, "z>>")
    assert(a >> 0x80000000 === a, "z>>")
    assert(a >> -32 === a, "z>>")
    assert(a << 32 === a, "z<<")
    assert(a << -32 === a, "z<<")
}
function testRightU(a: number, b: number, c: number) {
    assert(a >>> b === c, "f>>>0")
    assert(a >>> (b + 32) === c, "f>>>")
    assert(a >>> (b - 32) === c, "f>>>")
    assert(a >>> (b + 0x80000000) === c, "f>>>")
}

function testNums(): void {
    msg("TN")
    let z = 12
    msg("ZZ" + z)
    let tt = 2
    let x = 40 + tt
    assert(x === 42, "add")
    x = 40 / tt
    assert(x === 20, "div")
    let x3 = doStuff(x, 2)
    msg("nums#0")
    assert(x3 === 10, "call order")
    glb1 = 5
    incrBy_2()
    assert(glb1 === 7, "glb1")
    incrBy_2()
    msg("nums#1")
    assert(glb1 === 9, "glb2")
    assert(Math.abs(-42) === 42, "abs")
    assert(Math.abs(42) === 42, "abs")
    // assert(Math.sign(42) === 1, "abs")
    msg("nums#3")
    testIf()

    tt = 3

    assert((tt & 6) === 2, "&")
    assert((tt | 6) === 7, "|")
    assert((tt ^ 6) === 5, "^")
    assert(~1 === -2, "~")
    let k1 = 1
    assert(~k1 === -2, "~")
    tt = 10
    assert(-tt >> 2 === -3, ">>")
    assert(-tt >>> 20 === 4095, ">>>")
    assert(-tt << 2 === -40, "<<")
    assert(tt << 2 === 40, "<<+")
    assert(tt >> 2 === 2, ">>+")
    assert(tt >>> 2 === 2, ">>>+")

    testZ(0)
    testZ(30)
    testZ(-30)
    testZ(0x3fffffff)
    testZ(0x7fffffff)
    testZ(-0x7fffffff)
    testZ(-0x3fffffff)
    testZ(-0x80000000)
    testLeft(0x80000001, 1, 2)
    testLeft(0x40000001, 2, 4)
    testLeft(0x20000001, 3, 8)
    testLeft(0x7003, 16, 0x70030000)
    testLeft(0x3003, 16, 0x30030000)
    testLeft(0x8003, 16, -0x7ffd0000)
    testRightU(0x80000002, 1, 0x40000001)
    testRightU(0x80000004, 2, 0x20000001)
    testRightU(0xf0000002, 1, 0x78000001)
    testRightU(0xf0000004, 2, 0x3c000001)
    testRight(0x80000002, 1, -0x3fffffff)
    testRight(0xf0000004, 2, -0x3ffffff)
    testRightU(0xf0000004, 0, 0xf0000004)
    testRightU(0x70000004, 0, 0x70000004)
    testRightU(0x30000004, 0, 0x30000004)
    testLeft(1, 29, 0x20000000)
    testLeft(1, 30, 0x40000000)
    testLeft(1, 31, 0x80000000 >> 0)
    testLeft(1, 32, 1)

    tt = 2
    assert(-tt * -3 === 6, "-2*-3")
    assert(-tt * 3 === -6, "-2*3")
    assert(tt * 3 === 6, "2*3")
    assert(tt * -3 === -6, "2*-3")
    msg("nums#4")

    tt = 100
    assert(105 % tt === 5, "perc")

    assert(2 ** 3 === 8, "**")
    let ke = 3
    assert(ke ** 3 === ke * ke * ke, "**")

    // test number->bool conversion, #1057
    // x==20 here
    if (!x) {
        assert(false, "wrong bang")
    }

    let r = fib(15)
    msg("FB")
    msg("FIB" + r)
    assert(r === 987, "fib")

    msg("nums#5")

    tt = 1

    assert(tt > 0.5, "<")
    assert(tt < 1.5, "<")
}

function fib(p: number): number {
    if (p <= 2) {
        return p
    }
    let p2 = p - 1
    return fib(p2) + fib(p - 2)
}

function doStuff(x: number, x2: number): number {
    let x3 = x / x2
    return x3
}

function incrBy_2(): void {
    glb1 = glb1 + 2
}

function testComma() {
    glb1 = 0
    let x = (incrBy_2(), 77)
    assert(x === 77, "x")
    assert(glb1 === 2, "g")
    // make sure there are no leaks
    //@ts-ignore
    let y = (ds._id("aaa") + "zz", ds._id("x") + "yyy")
    assert(y.length === 4, "y")
}

function isnan(x: number) {
    return typeof x === "number" && x !== x
}

function mydiv(x: number, y: number) {
    return x / y
}

function testNaN() {
    assert(isnan(mydiv(0, 0)))
    assert(isnan(0 / 0))
    assert(isnan(parseFloat("foobar")))
    assert(isnan(NaN))
    assert(!isnan(0))
    assert(!isnan(Infinity))
    let inf = Infinity
    assert(1 / Infinity === 0)
    assert(1 / inf === 0)
}

function testUnaryPlus() {
    function testOne(v: any) {
        assert(+v + 1 === 2, "t1")
    }
    function testZero(v: any) {
        msg("v:" + v)
        assert(+v + 1 === 1, "t0")
    }
    function test35(v: any) {
        assert(+v + 1 === 4.5, "t35")
    }
    testOne(1)
    testOne("1")
    testOne(" 1 ")
    testOne(true)
    testZero(0)
    testZero(" 0")
    testZero("0")
    testZero(null)
    testZero(false)
    test35(3.5)
    test35("3.5")
    // let qq: any = undefined
    // assert(isNaN(+qq))
}

function getABoolean() {
    return !!true
}

enum SomeEnum {
    One = 1,
    Two = 2,
}

function testEnumToString() {
    let enumTest = getABoolean() ? SomeEnum.One : SomeEnum.Two

    assert(`${enumTest}` === "1", "enum tostring in template")
    assert(enumTest + "" === "1", "enum tostring in concatenation")
}

function testToFixed() {
    const numObj = 12345.6789;

    assert(numObj.toFixed(5) === '12346') // '12346'; rounding, no fractional part
}

testComma()
testNums()
testNaN()
testUnaryPlus()
testEnumToString()
testToFixed()

