import * as ds from "@devicescript/core"
import { assert, sleep } from "@devicescript/core"

type Action = () => void

function msg(m: string) {
    console.log(m)
}

class XFoo {
    pin: number
    buf: number[]

    constructor(k: number, l: number) {
        this.pin = k - l
    }

    setPin(p: number) {
        this.pin = p
    }

    getPin() {
        return this.pin
    }

    init() {
        this.buf = [1, 2]
    }

    asString() {
        return `Foo${this.getPin()}`
    }
}

function testClass() {
    let f = new XFoo(272, 100)
    assert(f.getPin() === 172, "ctor")
    f.setPin(42)
    assert(f.getPin() === 42, "getpin")
}

function testToString() {
    msg("testToString")
    let f = new XFoo(44, 2)
    let s = "" + f.asString()
    assert(s === "Foo42", "ts")
}

testToString()
testClass()

class CtorOptional {
    constructor(opts?: string) {}
}
function testCtorOptional() {
    let co = new CtorOptional()
    let co2 = new CtorOptional("")
}
testCtorOptional()

const seven = 7
class FooInit {
    baz: number
    qux = seven
    constructor(public foo: number, public bar: string) {
        this.baz = this.foo + 1
    }
    semicolonTest() {};
}

function classInit() {
    let f = new FooInit(13, ds._id("blah") + "baz")
    assert(f.foo === 13, "i0")
    assert(f.bar === "blahbaz", "i1")
    assert(f.baz === 14, "i2")
    assert(f.qux === 7, "i3")
}

classInit()

class Node<T> {
    v: T
    k: string
    next: Node<T>
}

class Map<T> {
    head: Node<T>

    getElt(k: string): T {
        return mapGet(this, k)
    }

    setElt(k: string, v: T) {
        mapSet(this, k, v)
    }
}

function mapSet<T>(m: Map<T>, k: string, v: T) {
    for (let p = m.head; p != null; p = p.next) {
        if (p.k === k) {
            p.v = v
            return
        }
    }
    let n = new Node<T>()
    n.next = m.head
    n.k = k
    n.v = v
    m.head = n
}

function mapGet<T>(m: Map<T>, k: string): T {
    for (let p = m.head; p != null; p = p.next) {
        if (p.k === k) {
            return p.v
        }
    }
    return null
}

function search_array<T>(a: T[], item: T): number {
    for (let i = 0; i < a.length; i++) {
        if (a[i] === item) {
            return i
        }
    }
    return -1 // NOT FOUND
}

class MyMap<K, V> {
    keys: K[]
    values: V[]

    constructor() {
        this.keys = []
        this.values = []
    }

    push(key: K, value: V) {
        this.keys.push(key)
        this.values.push(value)
    }

    value_for(key: K): V {
        let i = search_array(this.keys, key)
        if (i === -1) {
            return null
        }
        return this.values[i]
    }

    key_for(value: V): K {
        let i = search_array(this.values, value)
        if (i === -1) {
            return null
        }
        return this.keys[i]
    }
    set(key: K, value: V): void {
        let i = search_array(this.keys, key)
        if (i === -1) {
            this.keys.push(key)
            this.values.push(value)
        } else {
            this.values[i] = value
        }
    }

    has_key(key: K): boolean {
        return search_array(this.keys, key) !== -1
    }

    has_value(value: V): boolean {
        return search_array(this.values, value) !== -1
    }
}

function testMaps() {
    let m = new Map<number>()
    let q = new Map<string>()
    let r = new MyMap<number, string>()

    mapSet(q, "one", ds._id("foo") + "bar")
    assert(mapGet(q, "one").length === 6, "m0")

    mapSet(q, "one", ds._id("foo2") + "bar")
    assert(mapGet(q, "one").length === 7, "m1")
    q.setElt("two", ds._id("x") + "y")
    assert(q.getElt("two").length === 2, "m2")
    q.setElt("two", ds._id("x") + "yz")
    assert(q.getElt("two").length === 3, "thr")

    mapSet(m, "one", 1)
    assert(mapGet(m, "one") === 1, "1")

    mapSet(m, "two", 2)
    assert(m.getElt("two") === 2, "2")
}

testMaps()

class Foo {
    a: number
    private b: number
    bar() {
        return this.b
    }
    constructor(inp: number) {
        this.a = inp
        this.b = inp + 1
    }
}

function foo(f: { a: number }) {
    return f.a + 1
}
function testAnon() {
    msg("AnonymousTypes")
    let x = { a: 2, b: "bar" }
    let nested = { a: { b: { c: 3 } } }

    let bar = new Foo(42)
    let baz: { a: number } = bar
    assert(nested.a.b.c === 3)
    assert(x.a === 2)
    assert(x.b === "bar")
    assert(foo(x) === 3)
    assert(foo(bar) === 43)
    assert(bar.bar() === 43)
    assert(foo(baz) === 43)
    // HUH bar(40) - new (expects any)
}

testAnon()


