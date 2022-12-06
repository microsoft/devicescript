import * as ds from "@devicescript/core"

ds.Buzzer.prototype.playNote = function (frequency, volume, duration) {
    var p = 1000000 / frequency
    volume = Math.clamp(0, volume, 1)
    this.playTone(p, p * volume * 0.5, duration)
}

declare module "@devicescript/core" {
    interface Led {
        setAll(r: number, g: number, b: number): void
    }
}

ds.Led.prototype.setAll = function (r, g, b) {
    var buflen = this.numPixels.read() * 3
    var idx = 0
    ds.packet.setLength(buflen)
    while (idx < buflen) {
        ds.packet.setAt(idx, "u0.8", r)
        ds.packet.setAt(idx + 1, "u0.8", g)
        ds.packet.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    this.pixels.write(ds.packet)
}
