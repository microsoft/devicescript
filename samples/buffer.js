var b = buffer(20)

// comment
function testBuffer() {
    // test cmt
    b.setAt(8, /* cmt */ "u22.10", 173.282)
    var z = b.getAt(4, "u32")
}

testBuffer()

var dotmatrix = roles.dotMatrix()
dotmatrix.dots.write(hex`00 ab 12 2f 00`)
