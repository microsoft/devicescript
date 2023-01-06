import * as ds from "@devicescript/core"

const b = Buffer.alloc(20)

const bufa = hex`00 01 02 03 04`

// comment
function testBuffer() {
    // test cmt
    b.setAt(8, /* cmt */ "u22.10", 173.282)
    const z = b.getAt(4, "u32")

    let idx = 0
    while (idx < 4) {
        b.blitAt(3, bufa, idx, 2)
        idx++
    }
}

testBuffer()

const dotmatrix = new ds.DotMatrix()
dotmatrix.dots.write(hex`00 ab 12 2f 00`)
const tmp = dotmatrix.dots.read() // read buffer
