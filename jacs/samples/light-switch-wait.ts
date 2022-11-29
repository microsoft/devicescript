const btnA = roles.button()
const led = roles.lightBulb()

every(0.1, () => {
    btnA.down.wait()
    if (led.brightness.read() > 0)
        led.brightness.write(0)
    else
        led.brightness.write(1)
})
