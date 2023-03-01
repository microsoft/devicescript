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

async function press(k: number) {
    await kbd.key(k, ds.HidKeyboardModifiers.None, ds.HidKeyboardAction.Down)
    await ds.sleepMs(20)
    await kbd.key(k, ds.HidKeyboardModifiers.None, ds.HidKeyboardAction.Up)
    await ds.sleepMs(20)
}

let prevV = await rot.position.read()
rot.position.onChange(1, async () => {
    const v = await rot.position.read()
    while (prevV < v) {
        prevV = prevV + 1
        await press(ds.HidKeyboardSelector.RightArrow)
    }
    while (prevV > v) {
        prevV = prevV - 1
        await press(ds.HidKeyboardSelector.LeftArrow)
    }
})
