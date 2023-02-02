import * as ds from "@devicescript/core"
import { _panic } from "@devicescript/core"

function isClose(x: number, y: number): void {
    if (isNaN(x) && isNaN(y)) return
    const d = Math.abs(x - y)
    if (d < 0.00000001 || d / Math.abs(x + y) < 0.00001) return
    console.log(x, " != ", y, "!")
    _panic(108)
}

function isEq(x: any, y: any): void {
    // console.log(x, " == ", y, "?")
    if (x != y) {
        console.log(ds.format("fail: {0} != {1}", x, y))
        _panic(109)
    }
}

function strEq(a: string, b: string) {
    if (a != b) {
        console.log(`fail: '${a}' != '${b}'`)
        _panic(110)
    }
}

let x = 0

function testFlow() {
    x = 1
    if (x != 1) _panic(1)
    if (x !== 1) _panic(1)
    if (x == 1) {
        x = 2
        if (x != 2) _panic(3)
    } else {
        _panic(2)
    }
    x = 1
    if (x < 1) _panic(1)
    if (x > 1) _panic(1)
    if (x >= 1) {
    } else _panic(1)
    if (x <= 1) {
    } else _panic(1)
    if (x < 0.5) _panic(1)
    if (x > 1.5) _panic(1)
    if (0 <= x && x <= 2) {
    } else _panic(1)
    if (0 <= x || x < 1) {
    } else _panic(1)
    if (x < 0 || x > 10) _panic(1)
    x = -1
    if (Math.abs(x) != 1) _panic(4)
    x = Math.random()
    if (x < 0 || x > 1 || isNaN(x)) _panic(5)
    x = 42
    console.log("rand=", Math.random())
}

function testMath() {
    isEq(2 + 2, 4)
    isEq(2 - 1, 1)
    isClose(3 * 4 + 3, 15.00001)
    isEq(Math.abs(10), 10)
    isEq(Math.abs(-10), 10)
    isEq(Math.abs(0), 0)
    isClose(Math.log(Math.E), 1)
    isClose(Math.log(1.23456), 0.21071463)
    isClose(Math.log(-1), NaN)
    isClose(0 / 0, NaN)
    isClose(Math.log2(Math.PI), 1.651496129)
    isClose(Math.log10(Math.PI), 0.49714987269)
    isClose(Math.pow(2, 0.5), Math.SQRT2)
    isClose(2 ** 0.5, Math.SQRT2)
    isClose(Math.sqrt(1 / 2), Math.SQRT1_2)
    isClose(Math.cbrt(27), 3)
    isClose(Math.exp(1), Math.E)
    isClose(Math.exp(10), 22026.4657948)
    isEq(Math.ceil(0.1), 1)
    isEq(Math.ceil(0.9), 1)
    isEq(Math.floor(1.1), 1)
    isEq(Math.floor(1.9), 1)
    isEq(Math.round(1.9), 2)
    isEq(Math.round(1.3), 1)
    isEq(Math.min(1, 7.1), 1)
    isEq(Math.min(1.2, 1.2), 1.2)
    isEq(Math.min(-1, -7), -7)
    isEq(Math.max(1, 7), 7)
    isEq(Math.max(1, 1), 1)
    isEq(Math.max(-1, -7), -1)

    isEq(fib(8), 21)
    isEq(fibx(8), 21)

    isEq(1 & 3, 1)
    isEq(1 & 0, 0)
    isEq(1 & 2, 0)
    isEq(1 | 3, 3)
    isEq(1 | 0, 1)
    isEq(1 | 2, 3)
    isEq(1 ^ 3, 2)
    isEq(1 ^ 0, 1)
    isEq(1 ^ 2, 3)
    isEq(~-3, 2)
    isEq(~100, -101)

    isEq(1 << 2, 4)
    isEq(16 >> 3, 2)
    isEq(16 >>> 3, 2)
    isEq(-16 >> 3, -2)
    isEq(-16 >>> 3, 536870910)
    isEq(10 << -1, 0)
    isEq(10 << 0, 10)
    isEq(10 << 0.5, 10)
    isEq(10 << 1.7, 20)
    isEq(10 << 2.1, 40)
    isEq(10 << 100, 160)
    isEq(10 << 20, 10485760)
    isEq(10 << 30, -2147483648)
    isEq(10 << 31, 0)
    isEq(10 << 32, 10)
    isEq(10 << 33, 20)
    isEq(10 << 34, 40)
    isEq(1 << -1, -2147483648)

    isEq(Math.imul(10, 30), 300)
    isEq(Math.imul(0xffff, 0xffff), -131071)
    isEq(Math.imul(0xffff, 0xffff1), -2031601)
    isEq(Math.imul(0xffff, 0xffff11), -32440081)
    isEq(Math.imul(0xffff, 0xffff111), -518975761)
    isEq(Math.imul(0xffff, 0x7fff1111), -1861095697)
    isEq(Math.imul(0x7ffff, 0x7fff1111), 143191791)
    isEq(Math.idiv(100, 10), 10)
    isEq(Math.idiv(102, 10), 10)
    isEq(Math.idiv(-102, 10), -10)
    isEq(Math.idiv(102, 7), 14)
    isEq(Math.idiv(-102, 7), -14)
}

function lazyX(v: number) {
    x = x + 1 + v
    return v
}

function checkX(v: number) {
    if (x != v) {
        console.log(ds.format("{0} != {1} !!", x, v))
        _panic(11)
    }
    x = 0
}

function testLazy() {
    x = 0
    if (lazyX(0) || lazyX(1)) {
        checkX(3)
    } else {
        _panic(10)
    }

    if (lazyX(0) && lazyX(1)) {
        _panic(10)
    } else {
        checkX(1)
    }

    if (lazyX(NaN) && lazyX(1)) {
        _panic(101)
    } else {
        if (!isNaN(x)) _panic(12)
    }
}

function fib(k: number): number {
    if (k < 2) return k
    const r = fib(k - 1) + fib(k - 2)
    return r
}

function fibx(k: number): number {
    if (k < 2) return k
    return fibx(k - 1) + fibx(k - 2)
}

function testBuffer() {
    const buf = Buffer.alloc(20)
    buf.setAt(2, "u32", 0xf00d)
    isEq(buf.getAt(2, "u32"), 0xf00d)
    isEq(buf.getAt(2, "u16"), 0xf00d)
    isEq(buf.getAt(2, "u8"), 0x0d)
    isEq(buf.getAt(3, "u8"), 0xf0)
    isEq(buf[3], 0xf0)

    buf.setAt(8, "u22.10", 123.8274)
    isClose(buf.getAt(8, "u22.10"), 123.8274)
    isEq(buf.getAt(8, "u32"), 126799)

    buf[2] = 7
    isEq(buf[2], 7)

    buf[4] = 0x13
    const b2 = hex`72 33 23 12`
    buf.blitAt(0, b2, 0, 10)
    isEq(buf[0], 0x72)
    isEq(buf[3], 0x12)
    isEq(buf[4], 0x13)
    buf.blitAt(2, b2, 1, 1)
    isEq(buf[0], 0x72)
    isEq(buf[1], 0x33)
    isEq(buf[2], 0x33)
    isEq(buf[3], 0x12)
    isEq(buf[4], 0x13)
}

function three(a: number, b: number, c: number) {
    return a / b + c
}

function testArray() {
    let arr = []
    isEq(arr.length, 0)
    arr = [1, 2, 3]
    isEq(arr.length, 3)
    isEq(arr[0], 1)
    isEq(arr[1], 2)
    isEq(arr[2], 3)
    isEq(arr[3], undefined)
    isEq(arr[-1], undefined)
    arr[4] = 12
    isEq(arr.length, 5)
    isEq(arr[3], undefined)
    isEq(arr[4], 12)

    arr = []
    arr.push(10)
    isEq(arr.length, 1)
    isEq(arr[0], 10)
    isEq(arr[1], null)
    isEq(arr.push(20), 2)
    isEq(arr[1], 20)

    const [a, b, c, ...rest] = arr
    isEq(a, 10)
    isEq(b, 20)
    isEq(c, null)
    isEq(rest.length, 0)
    const [aa, ...bb] = arr
    isEq(aa, 10)
    isEq(bb.length, 1)
    isEq(bb[0], 20)
}

function testObjInner(x: any) {
    const { foo: fo, bar } = x
    isEq(fo, 7)
    isEq(bar, 13)
}

function testObj() {
    const obj: any = {
        bar: 13,
    }
    obj.foo = 5
    isEq(obj.foo, 5)
    isEq(obj.bar, 13)
    obj.foo = 7
    isEq(obj.foo, 7)
    isEq(obj.bar, 13)

    testObjInner(obj)

    return obj
}

function objEq(a: any, b: any) {
    if (a == b) return
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    isEq(ka.length, kb.length)
    let i = 0
    while (i < ka.length) {
        const k = ka[i]
        isEq(a[k], b[k])
        i = i + 1
    }
}

function testSpread() {
    const obj: any = {
        bar: 13,
    }
    Object.assign(obj, { foo: 5 })
    isEq(obj.foo, 5)
    isEq(obj.bar, 13)
    const qq = { foo: 1, ...obj, bar: 3 }
    isEq(qq.foo, 5)
    isEq(qq.bar, 3)

    isEq(delete qq.bar2, false)
    isEq(delete qq.bar, true)
    isEq(delete qq.bar, false)
    isEq(Object.keys(qq).length, 1)
    isEq(qq.foo, 5)
    isEq(qq.bar, null)

    const o2 = { a: 1, b: 2, c: 3 }
    {
        const { a, ...r0 } = o2
        isEq(a, 1)
        objEq(r0, { b: 2, c: 3 })
    }
    {
        const { a, b, ...r0 } = o2
        isEq(a, 1)
        isEq(b, 2)
        objEq(r0, { c: 3 })
    }

    isEq(three(10, 2, 7), 12)
    const arr: [number, number, number] = [10, 2, 7]
    isEq(three(...arr), 12)
    const arr2: [number, number] = [2, 7]
    isEq(three(10, ...arr2), 12)
    const tmp1 = [1, 2]
    tmp1.pushRange(tmp1)
    isEq(tmp1.length, 4)
}

function testConsole() {
    // note that we don't really test the output ...
    const n = 8
    const q = 12
    console.log("text" + n)
    console.log("text" + n + q)
    console.log("text" + n + "blah" + q)
    console.log("text" + (n + q))
    console.log(`text ${n + q}`)
    console.log(`text ${n} x ${q}`)
    console.log(`text ${n} + ${q} is`, n + q)
}

function testString() {
    strEq("a" + "b", "ab")
    strEq("a" + 1, "a1")
    strEq(1 + "a", "1a")
    strEq(":" + true, ":true")
    strEq(":" + false, ":false")
    strEq(":" + null, ":null")
    strEq(":" + 1.4, ":1.4")
    strEq(":" + NaN, ":NaN")

    const b = Buffer.alloc(3)
    b[0] = 0x42
    b[1] = 0x6c
    strEq(":" + b, ":[Buffer[3] 426c00]")

    strEq(`x${1}`, "x1")
    strEq(`x${true}x`, "xtruex")
    strEq(`x ${null} x`, "x null x")
}

let gl = 0
function testClo(b: (one?: number) => () => void) {
    gl = 0
    isEq(gl, 0)
    const q = b(1)
    isEq(gl, 4)
    q()
    isEq(gl, 5)
    q()
    isEq(gl, 6)
}

function testClosures1() {
    const foo = function foo() {
        let q = 1
        const bar = () => {
            gl = q
            q = q + 1
        }
        isEq(gl, 0)
        bar()
        isEq(gl, 1)
        q = q + q
        bar()
        isEq(gl, 4)
        return bar
    }
    testClo(foo)
}

function testClosures2() {
    const foo = function foo() {
        let q = 1
        const qux = () => {
            const bar = () => {
                gl = q
                q = q + 1
            }
            return bar
        }
        const bar = qux()
        isEq(gl, 0)
        bar()
        isEq(gl, 1)
        q = q + q
        bar()
        isEq(gl, 4)
        return bar
    }
    testClo(foo)
}

function testClosures3() {
    const foo = function foo(q: number) {
        const bar = () => {
            gl = q
            q = q + 1
        }
        isEq(gl, 0)
        bar()
        isEq(gl, 1)
        q = q + q
        bar()
        isEq(gl, 4)
        return bar
    }
    testClo(foo)
}

function testForOf() {
    let coll2 = [1, 2]
    if (coll2) {
    } else _panic(111)
    let tmp = coll2
    let sum = 0
    for (const e of coll2) {
        if (coll2 != null) coll2.push(17)
        coll2 = null
        sum += e
    }
    isEq(sum, 20)
    isEq(tmp.length, 3)
}

function testInstanceOf() {
    const err = new Error()
    const tperr = new TypeError()

    isEq(err instanceof Error, true)
    isEq(err instanceof TypeError, false)
    isEq(tperr instanceof TypeError, true)
    isEq(tperr instanceof Error, true)
    isEq(tperr instanceof RangeError, false)
    isEq(err instanceof RangeError, false)

    isEq(err instanceof Object, true)
    isEq(tperr instanceof Object, true)

    const obj = {}
    isEq(obj instanceof Object, true)
    isEq(obj instanceof Error, false)
}

class Foo {
    str: string

    constructor(public num: number) {
        this.str = "blah"
    }

    stringify() {
        return `${this.num}/${this.str}`
    }

    unused() {}
}

class Bar extends Foo {
    override stringify(): string {
        return `hello ${this.num} ${this.str}`
    }
}

class Baz extends Foo {
    constructor() {
        super(77)
    }
}

function callStr(q: Foo) {
    return q.stringify()
}

function testClass() {
    const f = new Foo(12)
    isEq(callStr(f), "12/blah")
    f.str = "bb"
    isEq(callStr(f), "12/bb")
    isEq(callStr(new Bar(13)), "hello 13 blah")
    isEq(callStr(new Baz()), "77/blah")
}

function testFunName() {
    const b = new Bar(12)
    isEq(ds.reboot.name, "reboot")
    isEq(b.constructor.name, "Bar")
    isEq(b.stringify.name, "stringify")
    isEq(qq.name, "qq")
    isEq(testFunName.name, "testFunName")

    let e = new TypeError("blah")
    // isEq(e.constructor, TypeError) TODO
    isEq(e.constructor.name, "TypeError")
    isEq(e.name, "TypeError")

    e = new Error("blah")
    // isEq(e.constructor, Error) TODO
    isEq(e.constructor.name, "Error")
    isEq(e.name, "Error")

    function qq() {}
}

testFlow()
if (x != 42) _panic(10)
testMath()
testLazy()
testBuffer()
testArray()

// top-level const assignment
const { foo, bar } = testObj()
isEq(foo, 7)
isEq(bar, 13)

testSpread()
testConsole()
testString()
testClosures1()
testClosures2()
testClosures3()
testForOf()
testInstanceOf()
testClass()
testFunName()

console.log("all OK")
ds.reboot()
