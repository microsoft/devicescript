import * as ds from "@devicescript/core"
import { panic } from "@devicescript/core"

function isClose(x: number, y: number): void {
    if (isNaN(x) && isNaN(y)) return
    const d = Math.abs(x - y)
    if (d < 0.00000001 || d / Math.abs(x + y) < 0.00001) return
    console.log(x, " != ", y, "!")
    panic(108)
}

function isEq(x: number, y: number): void {
    // console.log(x, " == ", y, "?")
    if (x != y) {
        console.log(ds.format("fail: {0} != {1}", x, y))
        panic(109)
    }
}

function strEq(a: string, b: string) {
    if (a != b) {
        console.log(`fail: '${a}' != '${b}'`)
        panic(110)
    }
}

let x = 0

function testFlow() {
    x = 1
    if (x != 1) panic(1)
    if (x !== 1) panic(1)
    if (x == 1) {
        x = 2
        if (x != 2) panic(3)
    } else {
        panic(2)
    }
    x = 1
    if (x < 1) panic(1)
    if (x > 1) panic(1)
    if (x >= 1) {
    } else panic(1)
    if (x <= 1) {
    } else panic(1)
    if (x < 0.5) panic(1)
    if (x > 1.5) panic(1)
    if (0 <= x && x <= 2) {
    } else panic(1)
    if (0 <= x || x < 1) {
    } else panic(1)
    if (x < 0 || x > 10) panic(1)
    x = -1
    if (Math.abs(x) != 1) panic(4)
    x = Math.random()
    if (x < 0 || x > 1 || isNaN(x)) panic(5)
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
        panic(11)
    }
    x = 0
}

function testLazy() {
    x = 0
    if (lazyX(0) || lazyX(1)) {
        checkX(3)
    } else {
        panic(10)
    }

    if (lazyX(0) && lazyX(1)) {
        panic(10)
    } else {
        checkX(1)
    }

    if (lazyX(NaN) && lazyX(1)) {
        panic(101)
    } else {
        if (!isNaN(x)) panic(12)
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
}

function testObj() {
  const obj: any = {
    bar: 13
  }
  obj.foo = 5
  isEq(obj.foo, 5)
  isEq(obj.bar, 13)
  obj.foo = 7
  isEq(obj.foo, 7)
  isEq(obj.bar, 13)
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

testFlow()
if (x != 42) panic(10)
testMath()
testLazy()
testBuffer()
testArray()
testObj()
testConsole()
testString()
testClosures1()
testClosures2()
testClosures3()

console.log("all OK")
ds.reboot()
