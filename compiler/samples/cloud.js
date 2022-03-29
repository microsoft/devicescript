var q = 0

if (false)
    every(10, () => {
        console.log("upl {0}", q)
        cloud.upload("hello", q, 2 * q, q + 10000)
        q = q + 1
    })

cloud.onTwinChange(() => {
    console.log("foo={0}", cloud.twin("foo"))
    console.log("bar.baz={0}", cloud.twin("bar.baz"))
    console.log("qux={0}", cloud.twin("qux"))
})

cloud.onMethod("foo", (a, b) => {
    console.log("foo a={0} b={1}", a, b)
    return [a + 1, b * 2]
})

cloud.onMethod("bar", (a) => {
    console.log("bar a={0}", a)
    wait(5)
    return [108]
})
