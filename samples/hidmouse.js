var btn = roles.button()
var rot = roles.rotaryEncoder()
var mouse = roles.hidMouse()

var scale = 5

btn.down.subscribe(() => {
    mouse.move(0, -5 * scale, 100)
})

var prevV = rot.position.read()
rot.position.onChange(1, () => {
    var v = rot.position.read()
    mouse.move(scale * (v - prevV), 0, 100)
    prevV = v
    wait(0.1)
})
