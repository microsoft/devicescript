import * as ds from "@devicescript/core"

const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
// listen for pressure changes
sensor.reading.subscribe(async pressure => {
    console.log(pressure)
    // user blows in straw
    if (pressure > 1400) {
        // click!
        await mouse.setButton(
            ds.HidMouseButton.Left,
            ds.HidMouseButtonEvent.Click
        )
        // debouncing
        await ds.sleep(50)
    }
})
