import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(m: string) {
    console.log(m)
}

let glb1 = 0

class A {
    v: number
    s: string
    foo() {
        glb1++
        this.v = 9
        this.s = ds._id("xx") + "z42z"
    }
    bar(v: number, i: string) {
        glb1 += v + this.v
    }
}

class B extends A {
    s2: string
    override foo() {
        glb1 += 2
        this.v = 10
        this.s2 = ds._id("xy") + "z42z"
    }
    override bar(v: number, i: string) {
        glb1 += v + parseInt(i) + this.v
    }
}

class C extends A {
    override foo() {
        glb1 += 3
        this.v = 7
    }
}

/* TODO super.calls
class D extends C {
    override bar(v: number, i: string) {
        glb1 = this.v
        this.v = 13
        super.bar(v, i)
    }
}
*/

class E {
    foo() {}
}

class F extends E {
    override foo() {}
}

function testACall(a: A, v0: number, v1: number) {
    glb1 = 0
    a.foo()
    //console.log("foo is " + glb1)
    assert(glb1 == v0, "v0")
    a.bar(32, ds._id("6") + "4")
    //console.log("bar is " + glb1)
    assert(glb1 == v1, "v1")
}

function run() {
    msg("ClassTest.run")
    let f = new F()
    testACall(new A(), 1, 42)
    testACall(new B(), 2, 108)
    testACall(new C(), 3, 42)
    // TODO super.calls
    // testACall(new D(), 3, 52)
}

class A1 {
    v: number
    s: string
    constructor(k = 12) {
        this.v = k
    }
}

class B1 extends A1 {
    q: number
    constructor() {
        super()
        this.q = 17
    }
}

class C1 extends B1 {}
class D1 extends A1 {}

function run1() {
    msg("Ctors.run")
    let a = new A1()
    assert(a.v == 12, "A12")
    a = new B1()
    assert(a.v == 12, "B12")
    // downcasts outlawed for now
    //assert((a as B).q == 17, "B17")
    a = new C1()
    assert(a.v == 12, "C12")
    // downcasts outlawed for now
    //assert((a as B).q == 17, "C17")
    let d = new D1(33)
    assert(d.v == 33, "D33")
    d = new D1()
    assert(d.v == 12, "D12")
}

class A2 {
    foo(a: number) {}
}
class B2 extends A2 {
    override foo(a: number) {}
}
function run2() {
    const b = new B2()
    b.foo(1)
}

interface IFoo {
    foo(): number
    bar(x: number): string
    twoArg(x: number, y: number): number
    baz: string
}

class A3 {
    constructor() {
        this.baz = ds._id("Q") + "A"
    }
    foo() {
        return 12
    }
    bar(v: number) {
        return v + ""
    }
    twoArg(x: number) {
        return x
    }
    baz: string
}
class B3 extends A3 {
    override foo() {
        return 13
    }
}

function foo(f: IFoo) {
    return f.foo() + f.baz + f.bar(42)
}

function run3() {
    msg("Ifaces.run")
    let a = new A3()
    assert(foo(a) + "X" == "12QA42X")
    assert((a as IFoo).twoArg(1, 2) == 1, "t")
    a = new B3()
    assert(foo(a) + "X" == "13QA42X", "b")
    let q = a as IFoo
    q.baz = "Z"
    assert(foo(q) + "X" == "13Z42X", "x")
    msg("Ifaces.runDONE")
}

run()
run1()
run2()
run3()


