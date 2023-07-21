import { delay, Gamepad, GamepadButtons, Led } from "@devicescript/core"
import { rgb } from "@devicescript/runtime"

const gamepad = new Gamepad()

const axes = gamepad.axes()
axes.subscribe(([x, y]) => console.log({ x, y }))

const down = gamepad.button(GamepadButtons.Down)
down.subscribe(down => console.log({ down }))
