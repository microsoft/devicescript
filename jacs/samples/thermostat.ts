var thermometer = roles.temperature()
var heater = roles.relay()
var t

heater.onConnected(() => {
    console.log("heater detected")
})

heater.onDisconnected(() => {
    console.log("heater lost")
})

thermometer.temperature.onChange(5, () => {
    t = thermometer.temperature.read()
    if (t < 21) {
        heater.active.write(1)
    } else {
        heater.active.write(0)
    }
})
