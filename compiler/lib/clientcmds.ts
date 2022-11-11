BuzzerRole.prototype.playNote = function (frequency, volume, duration) {
    var p = 1000000 / frequency
    volume = clamp(0, volume, 1)
    this.playTone(p, p * volume * 0.5, duration)
}

interface LedRole {
    setAll(r: number, g: number, b: number): void
}
LedRole.prototype.setAll = function (r, g, b) {
    var buflen = this.numPixels.read() * 3
    var idx = 0
    packet.setLength(buflen)
    while (idx < buflen) {
        packet.setAt(idx, "u0.8", r)
        packet.setAt(idx + 1, "u0.8", g)
        packet.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    this.pixels.write(packet)
}
