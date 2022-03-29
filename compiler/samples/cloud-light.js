var led = roles.lightBulb()

cloud.onMethod("light", (a, b) => {
    led.brightness.write(a + b)
    return [1, a, b]
})

cloud.onTwinChange(() => {
    var l = cloud.twin("light")
    if (!isNaN(l))
        led.brightness.write(l)
})
