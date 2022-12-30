import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(s: string): void {
    console.log(s)
}

let s2 = ""
function testStrings(): void {
    msg("testStrings")
    // assert((42).toString() == "42", "42") TODO?

    msg("ts0x")
    let s = "live"
    assert(s == "live", "hello eq")
    msg("ts0y")

    s = s + "4OK"
    s2 = s
    msg("ts0")
    assert(s.charCodeAt(4) == 52, "hello eq2")
    assert(s.charAt(4) == "4", "hello eq2X")
    assert(s[4] == "4", "hello eq2X")
    assert(s.length == 7, "len7")
    msg("ts0")
    s = ""

    for (let i = 0; i < 10; i++) {
        msg("Y")
        s = s + i
        msg(s)
    }
    assert(s == "0123456789", "for")
    let x = 10
    s = ""
    while (x >= 0) {
        msg("X")
        s = s + x
        x = x - 1
    }
    assert(s == "109876543210", "while")
    msg(s)
    msg(s2)

    s2 = ""
    // don't leak ref

    x = 21
    s = "foo"
    s = `a${x * 2}X${s}X${s}Z`
    assert(s == "a42XfooXfoo" + "Z", "`")

    msg("X" + true)

    assert("X" + true == "Xt" + "rue", "boolStr")
    msg("testStrings DONE")
}

function consStringTest() {
    msg("consStringTest")
    const s = "0123456789abcdef"
    let s0 = ""
    let s1 = ""
    for (let i = 0; i < 100; ++i) {
        s0 = s0 + s[i & 0xf]
        s1 = s[(99 - i) & 0xf] + s1
    }
    assert(s0 == s1, "c0")
    assert(s0.length == 100, "c1")
}

function testStringOps(): void {
    assert("foo" + ("bar") == "foobar", "concat")
    assert("xAb".charCodeAt(1) == 65, "code at")
    assert("B".charCodeAt(0) == 66, "tcc")
    assert(parseInt("-123") == -123, "tonum")
    assert("fo"[1] == "o", "at")
    assert("fo".length == 2, "count")
    assert(!"fo".charCodeAt(17), "nan")
}

testStrings()
testStringOps()
consStringTest()

ds.reboot()
