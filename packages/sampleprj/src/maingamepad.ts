import { Gamepad, GamepadButtons } from "@devicescript/core"

const gamepad = new Gamepad()

const axes = gamepad.axes()
axes.subscribe(({ x, y }) => console.log({ x, y }))

const A = gamepad.button(GamepadButtons.A)
A.subscribe(a => console.log({ a }))
const B = gamepad.button(GamepadButtons.B)
B.subscribe(b => console.log({ b }))
