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

inBg()
testAction(1)
testAction(7)
testIter()
testActionSave()
testFunDecl()
testLoopScope()

ds.reboot()