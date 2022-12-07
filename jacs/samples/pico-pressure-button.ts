const sensor = roles.airPressure()
const mouse = roles.hidMouse()
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    const pressure = sensor.pressure.read()
    console.log(pressure)
    // user blows in straw
    if (pressure > 1400) {
        // click!
        mouse.setButton(HidMouseButton.Left, HidMouseButtonEvent.Click)
        // debouncing
        wait(0.05)
    }
})