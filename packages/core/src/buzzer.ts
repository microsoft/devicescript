import * as ds from "@devicescript/core"

ds.Buzzer.prototype.playNote = async function (frequency, volume, duration) {
    const p = 1000000 / frequency
    volume = Math.clamp(0, volume, 1)
    await this.playTone(p, p * volume * 0.5, duration)
}
