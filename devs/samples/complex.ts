import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const color = new ds.Color()
const led = new ds.LightBulb()
const display = new ds.CharacterScreen()
let tint

btnA.down.subscribe(async () => {
    await led.intensity.write(1)
    await ds.sleep(100)
    let [r, g, b] = await color.reading.read()
    r = r + (await led.intensity.read())
    tint = (r + g + 2.3 * b) / (r + 2 * g + b)
    //await ds.cloud.upload("color", r, g, b, tint)
    console.log(`t=${tint} ${r}`)
    await led.intensity.write(0)
})
