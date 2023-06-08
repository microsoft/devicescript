import * as ds from "@devicescript/core"
import { readSetting } from "@devicescript/settings"

const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
const threshold = await readSetting("pressure")
// listen for pressure changes
sensor.reading.subscribe(async () => {
    // read sensor reading
    const pressure = await sensor.reading.read()
    console.log(pressure)
    // user blows in straw
    if (pressure > threshold) {
        // click!
        console.log(`click!`)
        await mouse.setButton(
            ds.HidMouseButton.Left,
            ds.HidMouseButtonEvent.Click
        )
        // debouncing
        await ds.sleep(50)
    }
})
