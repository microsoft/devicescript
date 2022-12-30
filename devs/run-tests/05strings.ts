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

testStrings()
ds.reboot()