const led = roles.lightBulb()

cloud.onMethod("light", (a, b) => {
    led.brightness.write(a + b)
    return [1, a, b]
})
