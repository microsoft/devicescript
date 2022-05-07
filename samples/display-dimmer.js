var pot = roles.potentiometer()
var ledD = roles.led()
var btn = roles.button()
var p

pot.position.onChange(0.01, () => {
    p = pot.position.read()
    console.log("tick {0}", p)
    ledD.brightness.write(p * 0.3)
})

function Led_setAll(/** @type LedRole */ ld, r, g, b) {
    var buflen = ledD.numPixels.read() * 3
    var idx = 0
    packet.setLength(buflen)
    while (idx < buflen) {
        packet.setAt(idx, "u0.8", r)
        packet.setAt(idx + 1, "u0.8", g)
        packet.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    ld.pixels.write(packet)
}

ledD.onConnected(() => {
    Led_setAll(ledD, 0.9, 1, 0)
})

btn.down.subscribe(() => {
    Led_setAll(ledD, 1, 0, 1)
})

btn.up.subscribe(() => {
    Led_setAll(ledD, 0, 0, 1)
})
