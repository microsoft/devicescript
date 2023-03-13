import * as ds from "@devicescript/core"

console.log("starting...")
const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
// listen for pressure changes
sensor.pressure.subscribe(async () => {
    // read sensor reading
    const pressure = await sensor.pressure.read()
    console.log(pressure)
    // user blows in straw
    if (pressure > 1400) {
        // click!
        console.log(`click!`)
        mouse.setButton(ds.HidMouseButton.Left, ds.HidMouseButtonEvent.Click)
        // debouncing
        ds.sleep(50)
    }
})
