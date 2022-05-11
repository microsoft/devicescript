var pot = roles.potentiometer()
var ledD = roles.led()
var btn = roles.button()
var p

pot.position.onChange(0.01, () => {
    p = pot.position.read()
    console.log("tick {0}", p)
    ledD.brightness.write(p * 0.3)
})


LedRole.prototype.setAllColors = function (r, g, b) {
    this.setAll(r, g, b)
}

ledD.onConnected(() => {
    ledD.setAllColors(0.9, 1, 0)
})

btn.down.subscribe(() => {
    ledD.setAll(1, 0, 1)
})

btn.up.subscribe(() => {
    ledD.setAll(0, 0, 1)
})
