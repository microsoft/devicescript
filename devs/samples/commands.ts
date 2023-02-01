import * as ds from "@devicescript/core"

const buzzer = new ds.Buzzer()
const btnA = new ds.Button()

btnA.down.subscribe(() => {
    buzzer.playNote(440, 0.5, 50)
    ds.sleepMs(1000)
    buzzer.playNote(800, 1, 50)
    ds.sleepMs(1000)
    buzzer.playNote(600, 0.5, 50)
})
