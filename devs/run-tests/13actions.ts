import * as ds from "@devicescript/core"
import { assert, sleepMs } from "@devicescript/core"

interface Testrec {
    str: string
    num: number
    bool: boolean
    str2: string
}

let glb1 = 0
let sum = 0
let x = 0
let tot = ""
let action: Action

type Action = ds.Callback

function msg(m: string) {
    console.log(m)
}

function runInBackground(f: Action) {
    f.start(1)
}

async function inBg() {
    let k = 7
    let q = 14
    let rec: Testrec = {} as any
    glb1 = 0
    await sleepMs(1) // TODO there's some problem with fiber ordering when this is removed and all.ts is run
    runInBackground(() => {
        glb1 = glb1 + 10 + (q - k)
        rec.str = "foo"
    })
    runInBackground(() => {
        glb1 = glb1 + 1
    })
    await sleepMs(10)
    assert(glb1 == 18, "inbg0")
    assert(rec.str == "foo", "inbg1")
    glb1 = 0
}

async function runTwice(fn: Action) {
    msg("r2 start")
    await fn()
    msg("r2 mid")
    await fn()
    msg("r2 stop")
}

function iter(max: number, fn: (v: number) => void) {
    for (let i = 0; i < max; ++i) {
        fn(i)
    }
}

function testIter() {
    x = 0
    iter(10, v => {
        x = x + (v + 1)
    })
    assert(x == 55, "55")
    x = 0
}

async function testAction(p: number) {
    msg("testActionStart")
    let s = ds._id("hello") + "1"
    let coll = [] as number[]
    let p2 = p * 2
    x = 42
    await runTwice(() => {
        x = x + p + p2
        coll.push(x)
        msg(s + x)
    })
    assert(x == 42 + p * 6, "run2")
    assert(coll.length == 2, "run2")
    x = 0
    msg("testActionDone")
}

function add7() {
    sum = sum + 7
}

async function testFunDecl() {
    msg("testFunDecl")
    let x = 12
    sum = 0
    function addX() {
        sum = sum + x
    }
    function add10() {
        sum = sum + 10
    }
    await runTwice(addX)
    assert(sum == 24, "cap")
    msg("testAdd10")
    await runTwice(add10)
    msg("end-testAdd10")
    assert(sum == 44, "nocap")
    await runTwice(add7)
    assert(sum == 44 + 14, "glb")
    addX()
    add10()
    assert(sum == 44 + 14 + x + 10, "direct")
    sum = 0
}

function saveAction(fn: Action): void {
    action = fn
}

function saveGlobalAction(): void {
    let s = ds._id("foo") + "42"
    tot = ""
    saveAction(() => {
        tot = tot + s
    })
}

async function testActionSave() {
    saveGlobalAction()
    msg("saveAct")
    await runTwice(action)
    msg("saveActDONE")
    msg(tot)
    assert(tot == "foo42foo42", "")
    tot = ""
    action = null
}

function testLoopScope() {
    for (let i = 0; i < 3; ++i) {
        let val: number
        assert(val === undefined, "loopscope")
        val = i
    }
}

function testInnerLambdaCapture() {
    msg("testInnerLambdaCapture")
    glb1 = 0
    let a = 7
    let g = () => {
        let h = () => {
            glb1 += a
        }
        h()
    }
    g()
    assert(glb1 == 7, "7")
}

interface NestedFun {
    f: () => number
}

function testComplexCallExpr() {
    msg("testComplexCallExpr")
    let a = { f: () => 12 }

    function bar() {
        return () => 17
    }

    assert(a.f() == 12, "af")
    assert(bar()() == 17, "ff")
}

function inl0(a: number, b: number) {
    return a - b
}
function inl1(a: number, b: number) {
    return b - a
}
function inl2(a: number, b: number) {
    return a
}
function inl3(a: number, b: number) {
    return b
}

function testInline() {
    msg("testInline")
    let pos = 0
    const arg0 = () => {
        assert(pos == 0)
        pos = 1
        return 1
    }
    const arg1 = () => {
        assert(pos == 1)
        pos = 2
        return 2
    }

    pos = 0
    assert(inl0(arg0(), arg1()) == -1)
    pos = 0
    assert(inl1(arg0(), arg1()) == 1)
    pos = 0
    assert(inl2(arg0(), arg1()) == 1)
    pos = 0
    assert(inl3(arg0(), arg1()) == 2)
}

function doubleIt(f: (x: number) => number) {
    return f(1) - f(2)
}

function triple(f: (x: number, y: number, z: number) => number) {
    return f(5, 20, 8)
}

function checkLen(f: (x: string) => string, k: number) {
    // make sure strings are GCed
    f("baz")
    let s = f("foo")
    assert(s.length == k, "len")
}

function testLambdas() {
    let x = doubleIt(k => {
        return k * 108
    })
    assert(x == -108, "l0")
    x = triple((x, y, z) => {
        return x * y + z
    })
    assert(x == 108, "l1")
    checkLen(s => {
        return s + "XY1"
    }, 6)
    checkLen(s => s + "1212", 7)
}

function testLambdaDecrCapture() {
    let x = 6
    function b(s: string) {
        assert(s.length == x, "dc")
    }
    b(ds._id("fo0") + "bAr")
}

function testNested() {
    glb1 = 0

    const x = 7
    let y = 1
    bar(1)
    y++
    bar(2)
    bar2()
    assert(glb1 == 12)

    /* TODO nested closures
    glb1 = 0
    const arr = [1, 20, 300]
    for (let k of arr) {
        qux()
        function qux() {
            glb1 += k
        }
    }
    assert(glb1 == 321)

    const fns: any[] = []
    for (let k of arr) {
        const kk = k
        fns.push(qux2)
        function qux2() {
            glb1 += kk
        }
    }
    glb1 = 0
    for (let f of fns) f()
    assert(glb1 == 321)
    */

    function bar(v: number) {
        assert(x == 7 && y == v)
        glb1++
    }
    function bar2() {
        glb1 += 10
    }
}

function ignore(v: any) {}
function incr() {
    glb1++
}
function runInl() {
    glb1 = 0
    ignore(incr())
    assert(glb1 == 1)
}

function bar() {
    return "foo123"
}
function foo(): any {
    let x = bar()
    if (!x) return 12
}
function foo2(): any {
    let x = bar()
    if (x) return 12
}
function foo3(): any {
    let x = bar()
}
function foo4(): any {
    let x = bar()
    return
}
function foo5() {
    let x = bar()
}
function foo6() {
    let x = bar()
    return
}

function testUndef() {
    msg("testUndef")
    assert(foo() === undefined)
    assert(foo2() === 12)
    assert(foo3() === undefined)
    assert(foo4() === undefined)
    assert(foo5() === undefined)
    assert(foo6() === undefined)
}

class FooArc {
    public handlerxx: () => void
    run() {
        this.handlerxx()
    }
}

function endFn(win?: boolean) {
    assert(win === undefined, "lp1")
}

function testLambdasWithMoreParams() {
    function a(f: (x: number, v: string, y: number) => void) {
        f(1, ds._id("a") + "X12b", 7)
    }
    a(() => {})

    const f = new FooArc()
    f.handlerxx = endFn
    f.run()
}

testComplexCallExpr()
testInline()

await inBg()
await testAction(1)
await testAction(7)
testIter()
await testActionSave()
await testFunDecl()
testLoopScope()
testInnerLambdaCapture()
testLambdas()
testLambdaDecrCapture()
testNested()
runInl()

testUndef()
testLambdasWithMoreParams()


