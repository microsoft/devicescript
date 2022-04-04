var btnA = roles.button()
var led = roles.lightBulb()

every(0.1, () => {
    btnA.down.wait()
    led.brightness.write(!led.brightness.read())
})
