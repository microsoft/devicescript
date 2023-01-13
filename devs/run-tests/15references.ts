import * as ds from "@devicescript/core"
import { assert, sleepMs } from "@devicescript/core"

interface Testrec {
    str: string
    num: number
    bool: boolean
    str2: string
}

let sum = 0
type Action = () => void

function newTestrec() {
    return {} as Testrec
}

function msg(m: string) {
    console.log(m)
}

function runInBackground(f: Action) {
    f.start(1)
}

function testRefLocals(): void {
    /* TODO nested closures
    msg("start test ref locals")
    let s = ""
    for (let i of [3, 2, 1]) {
        let copy = i
        runInBackground(() => {
            sleepMs(10 * i)
            copy = copy + 10
        })
        runInBackground(() => {
            sleepMs(20 * i)
            s = s + copy
        })
    }
    sleepMs(200)
    assert(s == "111213", "reflocals")
    */
}

function byRefParam_0(p: number): void {
    runInBackground(() => {
        sleepMs(1)
        sum = sum + p
    })
    p = p + 1
}

function byRefParam_2(pxx: number): void {
    pxx = pxx + 1
    runInBackground(() => {
        sleepMs(1)
        sum = sum + pxx
    })
}

function testByRefParams(): void {
    msg("testByRefParams")
    refparamWrite("a" + "b")
    refparamWrite2(newTestrec())
    sleepMs(10)
    refparamWrite3(newTestrec())
    sum = 0
    let x = 1
    runInBackground(() => {
        sleepMs(1)
        sum = sum + x
    })
    x = 2
    byRefParam_0(4)
    byRefParam_2(10)
    sleepMs(330)
    assert(sum == 18, "by ref")
    sum = 0
    msg("byref done")
}

function refparamWrite(s: string): void {
    s = s + "c"
    assert(s == "abc", "abc")
}

function refparamWrite2(testrec: Testrec): void {
    testrec = newTestrec()
    assert(testrec.bool === undefined, "rw2f")
}

function refparamWrite3(testrecX: Testrec): void {
    runInBackground(() => {
        sleepMs(1)
        assert(testrecX.str == "foo", "ff")
        testrecX.str = testrecX.str + "x"
    })
    testrecX = newTestrec()
    testrecX.str = "foo"
    sleepMs(30)
    assert(testrecX.str == "foox", "ff2")
}

function allocImage(): void {
    let tmp = createObj()
}

function runOnce(fn: Action): void {
    fn()
}

function createObj() {
    return newTestrec()
}

function testMemoryFreeHOF(): void {
    msg("testMemoryFreeHOF")
    for (let i = 0; i < 1000; i++) {
        runOnce(() => {
            let tmp = createObj()
        })
    }
}

testMemoryFreeHOF()

function testMemoryFree(): void {
    msg("testMemoryFree")
    for (let i = 0; i < 1000; i++) {
        allocImage()
    }
}

function testLazyRef() {
    msg("testLazyRef")
    let x = "x" + "Y" || "foo"
    let y = "" || "bXr" + "2"
    assert(x.length == 2, "two")
    assert(y.length == 4, "emp")
    y = null || "foo"
    assert(y == "foo", "ln")

    x = "x" + "12x" && "7" + "xx"
    assert(x.length == 3, "and")

    x = "" && "blah"
    assert(x == "", "andemp")
    x = "foo" && "x" + "Y"
    assert(x.length == 2, "twoand")
    x = "x" + "Y" && "bar"
    assert(x.length == 3, "threeand")

    let tw = 12
    let z = 0 || tw
    assert(z == 12, "12")
    z = tw || 13
    assert(z == 12, "12.2")
    z = tw && 13
    assert(z == 13, "13")

    let q = newTestrec()
    let r: Testrec = null
    let qq = q && r
    assert(qq == null, "&n")
    qq = r && q
    assert(qq == null, "&r")
}

function initUndef() {
    let x: string
    const f = () => {
        if (1 > 1) x = "foo"
    }
    f()
    assert(x === undefined, "init undef")
}

interface V {
    foo: number
    bar: string
}

class Blah {
    foo: number
    bar: string
}

function check(v: V) {
    return `${v.foo + 1}/${v.bar}`
}

function checkA(v: any) {
    return `${v.foo + 1}/${v.bar}`
}

function upd(v: V) {
    v.foo += 1
    v.bar += "a"
}

function updA(v: any) {
    v.foo = v.foo + 1
    v.bar = v.bar + "a"
}

function updI(v: any) {
    v["foo"] = v["foo"] + 1
    v["bar"] = v["bar"] + "a"
}

function updIP(v: any, foo: string, bar: string) {
    v[foo] = v[foo] + 1
    v[bar] = v[bar] + "a"
}

function allChecks(v: V) {
    assert(check(v) == "2/foo", ".v")

    msg(checkA(v))
    msg(check(v))

    assert(checkA(v) == check(v), ".z2")
    upd(v)
    assert(check(v) == "3/fooa", ".v2")
    updA(v)
    assert(check(v) == "4/fooaa", ".v3")
    updI(v)
    assert(check(v) == "5/fooaaa", ".v4")
    updIP(v, "foo", "bar")
    assert(check(v) == "6/fooaaaa", ".v6")
    assert(checkA(v) == check(v), ".z3")
}

function testDynamicMaps() {
    msg("dynamicMaps")

    let v: any = {
        foo: 1,
        bar: "foo",
    }

    let z = new Blah()
    z.foo = 12
    z.bar = "blah"

    assert(check(z) == "13/blah", ".z")

    z.foo = 1
    z.bar = "foo"
    msg("dynamic class")
    allChecks(z)

    allChecks(v)
}

testDynamicMaps()

testLazyRef()
testRefLocals()
testByRefParams()
testMemoryFree()
initUndef()

ds.reboot()
