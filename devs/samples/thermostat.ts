import * as ds from "@devicescript/core"

const thermometer = new ds.Temperature()
const heater = new ds.Relay()

heater.onConnected(() => {
    console.log("heater detected")
})

heater.onDisconnected(() => {
    console.log("heater lost")
})

thermometer.temperature.onChange(5, () => {
    const t = thermometer.temperature.read()
    if (t < 21) {
        heater.active.write(true)
    } else {
        heater.active.write(false)
    }
})
