var b = buffer(20)

function testBuffer() {
    b.setAt(8, "u22.10", 173.282)
    var z = b.getAt(4, "u32")
}

testBuffer()
