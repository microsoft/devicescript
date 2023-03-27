import * as ds from "@devicescript/core"

const btnA = new ds.Button()
const color = new ds.Color()
const led = new ds.LightBulb()
const display = new ds.CharacterScreen()
let tint

btnA.down.subscribe(async () => {
    await led.brightness.write(1)
    await ds.sleep(100)
    let [r, g, b] = await color.color.read()
    r = r + (await led.brightness.read())
    tint = (r + g + 2.3 * b) / (r + 2 * g + b)
    //await ds.cloud.upload("color", r, g, b, tint)
    console.log(`t=${tint} ${r}`)
    await led.brightness.write(0)
})
