import * as ds from "@devicescript/core"

const btn = new ds.Button()
const rot = new ds.RotaryEncoder()
const kbd = new ds.HidKeyboard()

btn.down.subscribe(() => {
    // kbd.key(HidKeyboardSelector.UpArrow, HidKeyboardModifiers.None, HidKeyboardAction.Press)
    // kbd.key(HidKeyboardSelector.VolumeUp, HidKeyboardModifiers.None, HidKeyboardAction.Press)
    kbd.key(
        ds.HidKeyboardSelector.V,
        ds.HidKeyboardModifiers.LeftGUI,
        ds.HidKeyboardAction.Press
    )
})

function press(k: number) {
    kbd.key(k, ds.HidKeyboardModifiers.None, ds.HidKeyboardAction.Down)
    ds.sleepMs(20)
    kbd.key(k, ds.HidKeyboardModifiers.None, ds.HidKeyboardAction.Up)
    ds.sleepMs(20)
}

let prevV = rot.position.read()
rot.position.onChange(1, () => {
    const v = rot.position.read()
    while (prevV < v) {
        prevV = prevV + 1
        press(ds.HidKeyboardSelector.RightArrow)
    }
    while (prevV > v) {
        prevV = prevV - 1
        press(ds.HidKeyboardSelector.LeftArrow)
    }
})
