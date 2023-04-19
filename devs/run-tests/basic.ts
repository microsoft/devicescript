import * as ds from "@devicescript/core"
import { _panic } from "@devicescript/core"

function isClose(x: number, y: number): void {
    if (isNaN(x) && isNaN(y)) return
    const d = Math.abs(x - y)
    if (d < 0.00000001 || d / Math.abs(x + y) < 0.00001) return
    console.log(x, " !== ", y, "!")
    _panic(108)
}

function isEq(x: any, y: any): void {
    // console.log(x, " === ", y, "?")
    if (x !== y) {
        console.log(ds.format("fail: {0} !== {1}", x, y))
        _panic(109)
    }
}

function strEq(a: string, b: string) {
    if (a !== b) {
        console.log(`fail: '${a}' !== '${b}'`)
        _panic(110)
    }
}

let x = 0
let glb1 = 0

function testFlow() {
    x = 1
    if (x !== 1) _panic(1)
    if (x !== 1) _panic(1)
    if (x === 1) {
        x = 2
        if (x !== 2) _panic(3)
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
    if (Math.abs(x) !== 1) _panic(4)
    x = Math.random()
    if (x < 0 || x > 1 || isNaN(x)) _panic(5)
    x = 42
    console.log("rand=", Math.random())

    isEq(ds.SystemStatusCodes.CalibrationNeeded, 100)
}

function testMath() {
    // these are here to avoid constant folding
    let v0 = 0
    let v1 = 1
    let v2 = 2
    let v3 = 3
    let v7 = 7
    let v10 = 10
    let v100 = 100
    let vffff = 0xffff

    // TODO use let ... to avoid constant folding
    isEq(v2 + 2, 4)
    isEq(v2 - 1, 1)
    isClose(v3 * 4 + 3, 15.00001)
    isEq(Math.abs(v10), 10)
    isEq(Math.abs(-v10), 10)
    isEq(Math.abs(v0), 0)
    isClose(Math.log(Math.E), 1)
    isClose(Math.log(1.23456), 0.21071463)
    isClose(Math.log(-v1), NaN)
    isClose(v0 / 0, NaN)
    isClose(Math.log2(Math.PI), 1.651496129)
    isClose(Math.log10(Math.PI), 0.49714987269)
    isClose(Math.pow(v2, 0.5), Math.SQRT2)
    isClose(v2 ** 0.5, Math.SQRT2)
    isClose(Math.sqrt(v1 / 2), Math.SQRT1_2)
    isClose(Math.cbrt(27), 3)
    isClose(Math.exp(v1), Math.E)
    isClose(Math.exp(v10), 22026.4657948)
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

    isEq(v1 & 3, 1)
    isEq(v1 & 0, 0)
    isEq(v1 & 2, 0)
    isEq(v1 | 3, 3)
    isEq(v1 | 0, 1)
    isEq(v1 | 2, 3)
    isEq(v1 ^ 3, 2)
    isEq(v1 ^ 0, 1)
    isEq(v1 ^ 2, 3)
    isEq(~-v3, 2)
    isEq(~v100, -101)

    isEq(v1 << 2, 4)
    isEq(16 >> v3, 2)
    isEq(16 >>> v3, 2)
    isEq(-16 >> v3, -2)
    isEq(-16 >>> v3, 536870910)
    isEq(v10 << -1, 0)
    isEq(v10 << 0, 10)
    isEq(v10 << 0.5, 10)
    isEq(v10 << 1.7, 20)
    isEq(v10 << 2.1, 40)
    isEq(v10 << 100, 160)
    isEq(v10 << 20, 10485760)
    isEq(v10 << 30, -2147483648)
    isEq(v10 << 31, 0)
    isEq(v10 << 32, 10)
    isEq(v10 << 33, 20)
    isEq(v10 << 34, 40)
    isEq(v1 << -1, -2147483648)

    let v102 = 102
    let v7ffff = 0x7ffff

    isEq(Math.imul(v10, 30), 300)
    isEq(Math.imul(vffff, 0xffff), -131071)
    isEq(Math.imul(vffff, 0xffff1), -2031601)
    isEq(Math.imul(vffff, 0xffff11), -32440081)
    isEq(Math.imul(vffff, 0xffff111), -518975761)
    isEq(Math.imul(vffff, 0x7fff1111), -1861095697)
    isEq(Math.imul(v7ffff, 0x7fff1111), 143191791)
    isEq(Math.idiv(100, v10), 10)
    isEq(Math.idiv(102, v10), 10)
    isEq(Math.idiv(-102, v10), -10)
    isEq(Math.idiv(v102, 7), 14)
    isEq(Math.idiv(-v102, 7), -14)
}

function lazyX(v: number) {
    x = x + 1 + v
    return v
}

function checkX(v: number) {
    if (x !== v) {
        console.log(ds.format("{0} !== {1} !!", x, v))
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
    isEq(arr[1], undefined)
    isEq(arr.push(20), 2)
    isEq(arr[1], 20)

    const [a, b, c, ...rest] = arr
    isEq(a, 10)
    isEq(b, 20)
    isEq(c, undefined)
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
    if (a === b) return
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
    isEq(qq.bar, undefined)

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
    let n = 8
    let q = 12
    console.log("text" + n)
    console.log("text" + n + q)
    console.log("text" + n + "blah" + q)
    console.log("text" + (n + q))
    console.log(`text ${n + q}`)
    console.log(`text ${n} x ${q}`)
    console.log(`text ${n} + ${q} is`, n + q)
}

function testString() {
    let a = "a"
    let colon = ":"
    strEq(a + "b", "ab")
    strEq(a + 1, "a1")
    strEq(1 + a, "1a")
    strEq(colon + true, ":true")
    strEq(colon + false, ":false")
    strEq(colon + null, ":null")
    strEq(colon + 1.4, ":1.4")
    strEq(colon + NaN, ":NaN")

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
        if (coll2 !== null) coll2.push(17)
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

function expectErr(js: string) {
    try {
        JSON.parse(js)
    } catch {
        return
    }
    throw new Error(`expecting error on: ${js}`)
}
function jsonTest(js: string, indent?: number) {
    const o = JSON.parse(js)
    const str = JSON.stringify(o, null, indent)
    if (js !== str) {
        console.log(`orig:${js}`)
        console.log(`stri:${str}`)
        console.log(`stri2:${JSON.stringify(str)}`)
        throw new Error("failed JSON")
    }

    const o2 = JSON.parse(" " + js + " ")
    ds.assert(JSON.stringify(o2) === JSON.stringify(o))
    expectErr(js + "x")
    expectErr(js + "t")

    if (typeof o !== "number") {
        expectErr(js.slice(0, -1))
        expectErr(js.slice(0, -2))
        expectErr(js.slice(1))
    }
}

function testDeflUndefinedForNumber(f: number, g?: number) {
    isEq(f, 3)
    ds.assert(g == null, "n3")
    ds.assert(g === undefined, "n3")
}

function testJSON() {
    console.log("testJSON")
    jsonTest("null")
    jsonTest("true")
    jsonTest("false")
    jsonTest("12")
    jsonTest("-12")
    jsonTest("-12.5")
    jsonTest("{}")
    jsonTest("[]")
    jsonTest("[1]")
    jsonTest('{"x":1}')
    jsonTest('{"x":1,"y":[1,2,3]}')
    jsonTest('{"x":1,"y":[]}')
    jsonTest("[{}]")
    jsonTest("[{},{}]")
    jsonTest("[null,{}]")
    jsonTest('[{"foo":1,"a":[]}]')
    jsonTest("[]", 2)
    jsonTest("[\n  1\n]", 2)
    jsonTest("[\n  1,\n  3\n]", 2)
    jsonTest("{}", 2)
    jsonTest('{\n  "x": 1\n}', 2)
    jsonTest('{\n  "x": 1,\n  "y": [\n    1,\n    2,\n    3\n  ]\n}', 2)
    isEq(JSON.stringify({ x: 1, y: undefined }), '{"x":1}')
    isEq(JSON.stringify({ x: 1, y: () => {} }), '{"x":1}')

    testDeflUndefinedForNumber(3)

    let strings = ["foo", "foo\n", '"', "\b\t\r\n", ""]
    for (let s of strings) {
        ds.assert(JSON.parse(JSON.stringify(s)) === s, s)
    }

    ds.assert(JSON.parse('"\\u000A\\u0058\\u004C\\u004d"') === "\nXLM", "uni")

    let ss = ds._id("12") + "34"
    ds.assert(ss.slice(1) === "234", "sl0")
    ds.assert(ss.slice(1, 2) === "2", "sl1")
    ds.assert(ss.slice(-2) === "34", "sl2")
    ds.assert(ss.slice(1, 0) === "", "sl3")
    ds.assert(ss.slice(1, -1) === "23", "sl4")
}

function testAnySwitch() {
    function bar(x: number) {
        glb1 += x
        return x
    }
    function testIt(v: number) {
        glb1 = 0
        switch (v) {
            case bar(0):
                return 1
            default:
                return 7
            case bar(1):
                return 2
            case bar(2):
                return 3
        }
    }
    function ss() {
        return ds._id("f7") + "4n"
    }
    function testStr(s: string) {
        switch (s) {
            case "foo":
                return 0
            case ss():
                return 2
            case "bar":
                return 1
            default:
                return 7
        }
    }
    function testQuick(v: number) {
        switch (v) {
            default:
                return 7
            case 0:
                return 1
            case 1:
                return 2
            case bar(2):
                return 3
            case 3:
                return 4
            case 4:
                return 5
            case 5:
                return 6
        }
    }
    function testFallThrough(x: number) {
        let r = ""
        switch (x) {
            // @ts-ignore
            default:
                r += "q"
            // fallthrough
            case 6:
            // @ts-ignore
            case 7:
                r += "x"
            // fallthrough
            case 8:
                r += "y"
                break
            case 10:
                r += "z"
                break
        }
        return r
    }
    function switchLoop() {
        let r = ""
        for (let i = 0; i < 5; ++i) {
            switch (i) {
                case 0:
                case 1:
                    r += "x"
                    break
                case 2:
                    continue
            }
            r += i
        }
        isEq(r, "x0x134")
    }

    let v = testIt(2)
    isEq(v, 3)
    isEq(glb1, 3)
    v = testIt(0)
    isEq(v, 1)
    isEq(glb1, 0)

    isEq(testStr("foo"), 0)
    isEq(testStr("bar"), 1)
    isEq(testStr(ss()), 2)

    for (let i = 0; i <= 6; ++i) isEq(testQuick(i), i + 1)

    isEq(testFallThrough(100), "qxy")
    isEq(testFallThrough(6), "xy")
    isEq(testFallThrough(7), "xy")
    isEq(testFallThrough(8), "y")
    isEq(testFallThrough(10), "z")

    switchLoop()
}

class AssertionError extends RangeError {
    constructor(matcher: string, message: string) {
        super()
        this.name = "AssertionError"
        this.message = `${matcher}: ${message}`
    }
}

function testBuiltinExtends() {
    const a = new AssertionError("a", "b")
    ds.assert(a instanceof Error)
    ds.assert(a instanceof RangeError)
    ds.assert(a instanceof AssertionError)
    ds.assert(a.name === "AssertionError")
}

function testUndef() {
    ds.assert(console.log("foo") === undefined)
}

interface XYZ {
    x: number
    y: string
    z?: number
}

function testDestructArg() {
    function foo({ x, y, z }: XYZ) {
        ds.assert(x === 1)
        ds.assert(y === "foo")
        ds.assert(z === undefined)
    }

    function apply<T>(v: T, f: (v: T) => void) {
        f(v)
    }

    apply({ x: 1, y: 2 }, ({ x, y }) => {
        ds.assert(x === 1)
        ds.assert(y === 2)
    })
    foo({ x: 1, y: "foo" })
}

function testClosurePP() {
    let idx = 1
    function foo() {
        idx++
    }
    foo()
    foo()
    ds.assert(idx === 3)
}

async function testSetTimeout() {
    let q = 1
    let id = 0

    await ds.delay(1)

    setTimeout(() => {
        ds.assert(q === 1)
        console.log(`clear ${id}`)
        clearTimeout(id)
        q = 2
    }, 10)

    setTimeout(() => {
        ds.assert(q === 2)
        q = 3
    }, 31)

    id = setTimeout(() => {
        q = 17
    }, 32)

    await ds.delay(100)
    ds.assert(q === 3, `expected 3, got ${q}`)

    id = setInterval(() => {
        q = q + 1
        if (q === 5) clearInterval(id)
    }, 5)

    await ds.sleep(60)
    ds.assert(q === 5)
}

function testShift() {
    const arr = ["baz", ds._id("foo") + "bar"]
    ds.assert(arr.shift() === "baz")
    ds.assert(arr.shift() === "foobar")
    ds.assert(arr.shift() === undefined)
}

let numRestArgs = 0
function s0(...args: number[]) {
    isEq(args.length, numRestArgs)
    for (let i = 0; i < args.length; ++i) isEq(args[i], i + 1)
}

function s1(a0: number, ...args: number[]) {
    args.unshift(a0)
    isEq(args.length, numRestArgs)
    for (let i = 0; i < args.length; ++i) isEq(args[i], i + 1)
}

function testRest() {
    numRestArgs = 0
    s0()
    s0(...[])
    numRestArgs = 1
    s0(1)
    s0(...[1])
    s1(1)
    ;(s1 as any)(...[1])
    numRestArgs = 2
    s0(1, 2)
    s0(...[1, 2])
    s1(1, 2)
    s1(1, ...[2])
}

class Node {
    constructor() {}
}
class SuiteNode extends Node {
    children: string[] = []
    constructor() {
        super()
    }
}

async function testFibers() {
    let i = 0

    async function logloop() {
        while (true) {
            i++
            await ds.sleep(5)
        }
    }

    async function resumeMe(f: ds.Fiber) {
        await ds.sleep(10)
        f.resume(20)
    }

    await ds.sleep(10)
    const f0 = ds.Fiber.self()
    const f1 = logloop.start()
    ds.assert(f0 !== f1)
    await ds.sleep(50)
    f1.terminate()
    ds.assert(4 <= i && i <= 6)
    const i0 = i
    await ds.sleep(50)
    ds.assert(i === i0)
    resumeMe.start(f0)
    const r = await ds.suspend<number>(30)
    ds.assert(r === 20)

    console.log("fibers OK!")
}

class FooError extends Error {}

function testCtorError() {
    try {
        throw new FooError("blah")
    } catch (e: any) {
        ds.assert(e.message === "blah")
    }
}

function testIgnoredAnd() {
    let q = 0
    function foo() {
        q++
    }
    foo && foo()
    ds.assert(q === 1)
}

function expectTypeError(f: () => void) {
    let ok = false
    try {
        f()
    } catch (e) {
        ds.assert(e instanceof TypeError)
        ok = true
    }
    ds.assert(ok)
}

function testQDot() {
    let q: any = null
    let i = 0
    ds.assert(q?.foo === undefined)
    ds.assert(q?.foo[i++] === undefined)
    ds.assert(i === 0)

    ds.assert(q?.foo.bar === undefined)
    expectTypeError(() => {
        const tmp = (q?.foo).bar
    })

    q = {}
    ds.assert(q?.foo?.bar === undefined)

    expectTypeError(() => {
        const tmp = q?.foo.bar
    })

    q = () => {
        i = 7
    }
    q?.()
    ds.assert(i === 7)
    q = undefined
    i = 3
    q?.()[i++]
    ds.assert(i === 3)
}

function testHex() {
    ds.assert(Buffer.from("żółw").toString("hex") === "c5bcc3b3c58277")
    ds.assert(Buffer.from([1, 2]).toString("hex") === "0102")
    ds.assert(Buffer.from("aa").toString("hex") === "6161")
    expectTypeError(() => {
        console.log(Buffer.from("aa").toString("foobar" as any))
    })
}

function testAssignmentChaining() {
    let x = 0,
        y = 0
    const o = { x: 17 }
    glb1 = x = y = 1
    ds.assert(x === 1)
    ds.assert(y === 1)
    ds.assert(glb1 === 1)
    x = obj().x = 3
    ds.assert(x === 3)
    ds.assert(o.x === 3)
    ds.assert(glb1 === 2)

    x = obj().x = obj().x + 1
    ds.assert(x === 4)
    ds.assert(o.x === 4)
    ds.assert(glb1 === 4)

    x = obj().x += 3
    ds.assert(x === 7)
    ds.assert(o.x === 7)
    ds.assert(glb1 === 5)

    function obj() {
        glb1++
        return o
    }
}

testFlow()
if (x !== 42) _panic(10)
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
testJSON()
testAnySwitch()
testBuiltinExtends()
testUndef()
testDestructArg()
testClosurePP()
testShift()
await testSetTimeout()
testRest()
const s = new SuiteNode()
await testFibers()
testCtorError()
testIgnoredAnd()
testQDot()
testHex()
testAssignmentChaining()

console.log("all OK")
