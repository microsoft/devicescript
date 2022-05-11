/**
 * @param {number} x
 * @param {number} y
 */
function isClose(x, y) {
    if (isNaN(x) && isNaN(y))
        return
    var d = Math.abs(x - y)
    if (d < 0.00000001 || d / Math.abs(x + y) < 0.00001)
        return
    console.log(x, " != ", y, "!")
    panic(108)
}

function isEq(x, y) {
    // console.log(x, " == ", y, "?")
    if (x != y) {
        console.log(format("fail: {0} != {1}", x, y))
        panic(109)
    }
}

var x = 0

function testFlow() {
    x = 1
    if (x != 1)
        panic(1)
    if (x !== 1)
        panic(1)
    if (x == 1) {
        x = 2
        if (x != 2)
            panic(3)
    } else {
        panic(2)
    }
    x = 1
    if (x < 1)
        panic(1)
    if (x > 1)
        panic(1)
    if (x >= 1) { }
    else panic(1)
    if (x <= 1) { }
    else panic(1)
    if (x < 0.5) panic(1)
    if (x > 1.5) panic(1)
    if (0 <= x && x <= 2) { }
    else panic(1)
    if (0 <= x || x < 1) { }
    else panic(1)
    if (x < 0 || x > 10) panic(1)
    x = -1
    if (Math.abs(x) != 1)
        panic(4)
    x = Math.random()
    if (x < 0 || x > 1 || isNaN(x))
        panic(5)
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
    isClose(Math.exp(10), 22026.46579480)
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
    isEq(~(-3), 2)
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

function lazyX(v) {
    x = x + 1 + v
    return v
}

function checkX(v) {
    if (x != v) {
        console.log(format("{0} != {1} !!", x, v))
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

function fib(k) {
    if (k < 2) return k
    var r = fib(k - 1) + fib(k - 2)
    return r
}

function fibx(k) {
    if (k < 2) return k
    return fibx(k - 1) + fibx(k - 2)
}


var buf = buffer(20)
function testBuffer() {
    buf.setAt(2, "u32", 0xf00d)
    isEq(buf.getAt(2, "u32"), 0xf00d)
    isEq(buf.getAt(2, "u16"), 0xf00d)
    isEq(buf.getAt(2, "u8"), 0x0d)
    isEq(buf.getAt(3, "u8"), 0xf0)
    
    buf.setAt(8, "u22.10", 123.8274)
    isClose(buf.getAt(8, "u22.10"), 123.8274)
    isEq(buf.getAt(8, "u32"), 126799)
}

testFlow()
if (x != 42) panic(10)
testMath()
testLazy()
testBuffer()
console.log("all OK")
reboot()
