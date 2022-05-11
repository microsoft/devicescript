var q = 0

if (false)
    every(10, () => {
        console.log("upl", q)
        cloud.upload("hello", q, 2 * q, q + 10000)
        q = q + 1
    })

cloud.onTwinChange(() => {
    console.log("foo=", cloud.twin("foo"))
    console.log("bar.baz=", cloud.twin("bar.baz"))
    console.log("qux=", cloud.twin("qux"))
})

cloud.onMethod("foo", (a, b) => {
    console.log("foo a=", a, "b=", b)
    return [a + 1, b * 2]
})

cloud.onMethod("bar", (a) => {
    console.log("bar a=", a)
    wait(5)
    return [108]
})
