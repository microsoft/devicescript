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

type Action = () => void

function msg(m: string) {
    console.log(m)
}

function runInBackground(f: Action) {
    f.start(1)
}

function inBg() {
    let k = 7
    let q = 14
    let rec: Testrec = {} as any
    glb1 = 0
    runInBackground(() => {
        glb1 = glb1 + 10 + (q - k)
        rec.str = "foo"
    })
    runInBackground(() => {
        glb1 = glb1 + 1
    })
    sleepMs(50)
    assert(glb1 == 18, "inbg0")
    assert(rec.str == "foo", "inbg1")
    glb1 = 0
}

function runTwice(fn: Action): void {
    msg("r2 start")
    fn()
    msg("r2 mid")
    fn()
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

function testAction(p: number): void {
    msg("testActionStart")
    let s = "hello" + "1"
    let coll = [] as number[]
    let p2 = p * 2
    x = 42
    runTwice(() => {
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

function testFunDecl() {
    msg("testFunDecl")
    let x = 12
    sum = 0
    function addX() {
        sum = sum + x
    }
    function add10() {
        sum = sum + 10
    }
    runTwice(addX)
    assert(sum == 24, "cap")
    msg("testAdd10")
    runTwice(add10)
    msg("end-testAdd10")
    assert(sum == 44, "nocap")
    runTwice(add7)
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
    let s = "foo" + "42"
    tot = ""
    saveAction(() => {
        tot = tot + s
    })
}

function testActionSave(): void {
    saveGlobalAction()
    msg("saveAct")
    runTwice(action)
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
    b("fo0" + "bAr")
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

    /* TODO
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

testComplexCallExpr()
testInline()

inBg()
testAction(1)
testAction(7)
testIter()
testActionSave()
testFunDecl()
testLoopScope()
testInnerLambdaCapture()
testLambdas()
testLambdaDecrCapture()
testNested()
runInl()


ds.reboot()
