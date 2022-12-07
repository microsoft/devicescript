const sensor = roles.airPressure()
const mouse = roles.hidMouse()
sensor.pressure.onChange(100, pressure => {
    if (pressure > 1400) {
        mouse.setButton(HidMouseButton.Left, HidMouseButtonEvent.Click)
        wait(0.05)
    }
})
