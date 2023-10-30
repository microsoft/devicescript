import * as ds from "@devicescript/core"
import { assert, sleep } from "@devicescript/core"

class Foo {
    x: number
    y: string
    bar() {
        return this.x
    }
}

class Bar extends Foo {}
class Baz extends Foo {}
class Bar2 extends Bar {}
class Bar3 extends Bar {}

function testNot(v: any) {
    assert(!(v instanceof Foo), "tn")
}

function run() {
    assert(new Bar2() instanceof Foo, "if")
    assert(new Bar2() instanceof Bar, "ib")
    assert(new Bar2() instanceof Bar2, "ib2")
    assert(new Bar3() instanceof Bar, "ib")
    assert(!(new Bar2() instanceof Baz), "!ib")
    assert(!(new Foo() instanceof Baz), "!ib2")
    assert(!(new Foo() instanceof Bar), "!ib2")

    testNot(undefined)
    testNot(null)
    testNot(1)
    testNot(1.5)
    let z3 = 0.3
    testNot(1.5 + z3)
    testNot("ell")
    testNot(ds._id("ell") + "world")
    testNot({})

    new Foo().bar()
    new Bar3().bar()
}

run()
