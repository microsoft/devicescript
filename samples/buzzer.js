var btn = roles.button()
var buzzer = roles.buzzer()

function clamp(low, v, hi) {
    if (v < low) return low
    if (v > hi) return hi
    return v
}

BuzzerRole.prototype.playNote = function (frequency, volume, duration) {
    var p = 1000000 / frequency
    volume = clamp(0, volume, 1)
    this.playTone(p, p * volume * 0.5, duration)
}

btn.down.subscribe(() => {
    buzzer.playNote(440, 0.1, 200)
})
