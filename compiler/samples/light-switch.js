var btnA = roles.button()
var led = roles.lightBulb()

console.log("program start")
btnA.down.subscribe(() => {
    console.log('down')
    led.brightness.write(!led.brightness.read())
    //wait(1);
    //led.brightness.write(0)
})
console.log("program stop")
