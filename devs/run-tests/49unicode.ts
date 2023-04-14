import { assert, sleep } from "@devicescript/core"

async function testUnicode() {
    let shortASCII = "hello world!"
    let shortUTF = "hęłłó world!"
    let longASCII = `
99 Bottles of beer on the wall!
Take one down
Pass it around
98 Bottles of beer on the wall!
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
    await sleep(1)
    testAllStr(longUTF + longASCII)
    await sleep(1)
    testAllStr(longUTF + shortUTF)
    await sleep(1)
}

function testAllStr(s: string) {
    console.log("utf8-t: " + s.length)
    testOneCh(s)
    testFromCh(s)
    testSliceR(s)
}

function testOneCh(s: string) {
    let r = ""
    for (let i = 0; i < s.length; ++i) r += s[i]
    assert(s.length === r.length, "1chL")
    assert(s === r, "1ch")
}

function testFromCh(s: string) {
    let r = ""
    for (let i = 0; i < s.length; ++i) r += String.fromCharCode(s.charCodeAt(i))
    assert(s === r, "1fch")
}

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

function codes2(s: string, codes: number[]) {
    assert(s.length === codes.length)
    for (let i = 0; i < s.length; ++i) {
        assert(s.charCodeAt(i) === codes[i])
    }
}

function codes(s: string, codes: number[]) {
    codes2(s, codes)
    codes.push(32)
    codes2(s + " ", codes)
}

function testAllCodes() {
    codes("wolność", [119, 111, 108, 110, 111, 347, 263])
    codes("вільність", [1074, 1110, 1083, 1100, 1085, 1110, 1089, 1090, 1100])
    codes("自由", [33258, 30001])
    codes("🗽", [0x1f5fd])
    codes("\uD83D\uDDFD", [0x1f5fd])
}

testAllCodes()
await testUnicode()
