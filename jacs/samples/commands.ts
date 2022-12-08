import * as ds from "@devicescript/core"

const anled = new ds.LedSingle()
const btnA = new ds.Button()

btnA.down.subscribe(() => {
    anled.animate(255, 0, 255, 50)
    ds.wait(1)
    anled.animate(255, 255, 0, 50)
    ds.wait(1)
    anled.animate(0, 0, 0, 50)
})
