import { startHidKeyboard } from "@devicescript/servers"
import * as ds from "@devicescript/core"

const kbd = startHidKeyboard({})
const btn = new ds.Button()
btn.down.subscribe(async () => {
    await kbd.key(
        ds.HidKeyboardSelector.C,
        ds.HidKeyboardModifiers.None,
        ds.HidKeyboardAction.Press
    )
})

setInterval(() => {
// console.log("alive", btn.isBound)
}, 1000)