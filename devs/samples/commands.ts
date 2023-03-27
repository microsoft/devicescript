import * as ds from "@devicescript/core"

const buzzer = new ds.Buzzer()
const btnA = new ds.Button()

btnA.down.subscribe(async () => {
    await buzzer.playNote(440, 0.5, 50)
    await ds.sleep(1000)
    await buzzer.playNote(800, 1, 50)
    await ds.sleep(1000)
    await buzzer.playNote(600, 0.5, 50)
})
