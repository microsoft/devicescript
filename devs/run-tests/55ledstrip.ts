import { ledStripEncode } from "@devicescript/core/src/ledstrip"

function testEncoded(format: string, ...args: (number | number[])[]) {
    const buffer = ledStripEncode(format, args)
}

function testLedStripEncode() {
    testEncoded("setall #000000")
    testEncoded("setall #", 0)
    testEncoded("fade # #", 0xff0000, 0x0000ff)
    testEncoded("fade #", [0xff0000, 0x0000ff])
    testEncoded("range 2 5 setall #ffffff")
    testEncoded("range % % setall #", 2, 5, 0xffffff)
}

testLedStripEncode()
// turn off all lights
