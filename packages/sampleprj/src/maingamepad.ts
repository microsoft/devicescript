import { delay, Gamepad, GamepadButtons, Led } from "@devicescript/core"
import { rgb } from "@devicescript/runtime"

const gamepad = new Gamepad()

const axes = gamepad.axes()
axes.subscribe(pos => console.log({ x: pos[0], y: pos[1] }))

const down = gamepad.button(GamepadButtons.Down)
down.subscribe(down => console.log({ down }))
