var pot = roles.potentiometer()
var ledD = roles.led()
var btn = roles.button()
var p

pot.position.onChange(0.01, () => {
    p = pot.position.read()
    console.log("tick", p)
    ledD.brightness.write(p * 0.3)
})

declare interface LedRole {
    setAllColors(r: number, g: number, b: number): void
}
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
