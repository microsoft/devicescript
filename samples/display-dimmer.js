var pot = roles.potentiometer()
var ledD = roles.led()
var p

pot.position.onChange(0.01, () => {
    p = pot.position.read()
    console.log("tick {0}", p)
    ledD.brightness.write(p * 0.3)
})
