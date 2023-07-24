import * as ds from "@devicescript/core"

ds.Buzzer.prototype.playNote = async function (frequency, volume, duration) {
    const p = 1000000 / frequency
    volume = Math.constrain(volume, 0, 1)
    await this.playTone(p, p * volume * 0.5, duration)
}
