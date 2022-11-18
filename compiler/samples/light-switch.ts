var btnA = roles.button()
var led = roles.lightBulb()

console.log("program start")
btnA.down.subscribe(() => {
    console.log('down')
    if (led.brightness.read() > 0)
        led.brightness.write(0)
    else
        led.brightness.write(1)
})
console.log("program stop")
