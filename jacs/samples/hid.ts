const btn = roles.button()
const rot = roles.rotaryEncoder()
const kbd = roles.hidKeyboard()

btn.down.subscribe(() => {
    // kbd.key(HidKeyboardSelector.UpArrow, HidKeyboardModifiers.None, HidKeyboardAction.Press)
    // kbd.key(HidKeyboardSelector.VolumeUp, HidKeyboardModifiers.None, HidKeyboardAction.Press)
    kbd.key(
        HidKeyboardSelector.V,
        HidKeyboardModifiers.LeftGUI,
        HidKeyboardAction.Press
    )
})

function press(k: number) {
    kbd.key(k, HidKeyboardModifiers.None, HidKeyboardAction.Down)
    wait(0.02)
    kbd.key(k, HidKeyboardModifiers.None, HidKeyboardAction.Up)
    wait(0.02)
}

let prevV = rot.position.read()
rot.position.onChange(1, () => {
    const v = rot.position.read()
    while (prevV < v) {
        prevV = prevV + 1
        press(HidKeyboardSelector.RightArrow)
    }
    while (prevV > v) {
        prevV = prevV - 1
        press(HidKeyboardSelector.LeftArrow)
    }
})

export {}
