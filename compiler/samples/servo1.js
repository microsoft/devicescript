var x
var servo1 = roles.servo()
var button1 = roles.button()
var airPressure1 = roles.airPressure()
servo1.onConnected(() => {
    servo1.enabled.write(true)
})
button1.down.subscribe(() => {
    x = (x + 1)
    servo1.angle.write(50)
})
airPressure1.pressure.onChange(1, () => {
    x = 0
    servo1.angle.write(-35)
})
button1.up.subscribe(() => {
    servo1.angle.write(0)
})