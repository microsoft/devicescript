import { assert } from "@devicescript/core"

function testUnicode() {
    let shortASCII = "hello world!"
    let shortUTF = "hęłłó world!"
    let longASCII = `
99 Bottles of beer on the wall!
Take one down
Pass it around
98 Bottles of beer on the wall!
Take one down
Pass it around
97 Bottles of beer on the wall
Take one down
Pass it around
`
    let longUTF = `
99 Bottlęs of beer on the wall! 💺
Take one down
Pass it around
98 Bottłeś of beer on the wall! 💃
Take one down
Pass it around
97 Bottles of beer on the wall! 😂
Take óne down
Pasś it around
`

    testAllStr(shortASCII)
    testAllStr(shortUTF)
    testAllStr(longASCII)
    testAllStr(longUTF)
    testAllStr(longUTF + longASCII)
    testAllStr(longUTF + shortUTF)
}

function testAllStr(s: string) {
    console.log("utf8-t: " + s.length)
    testOneCh(s)
    // testFromCh(s) // TODO String.fromCharCode
    testSliceR(s)
}

function testOneCh(s: string) {
    let r = ""
    for (let i = 0; i < s.length; ++i) r += s[i]
    assert(s.length === r.length, "1chL")
    assert(s === r, "1ch")
}

/*
function testFromCh(s: string) {
    let r = ""
    for (let i = 0; i < s.length; ++i) r += String.fromCharCode(s.charCodeAt(i))
    assert(s == r, "1fch")
}
*/

function testSliceR(s: string) {
    for (let rep = 0; rep < 20; ++rep) {
        let r = ""
        for (let i = 0; i < s.length; ) {
            let len = Math.randomInt(10)
            r += s.slice(i, i + len)
            i += len
        }
        assert(s === r, "1sl")
    }
}

testUnicode()
