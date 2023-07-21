import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Gamepad {
        /**
         * The thumbstick position register if any
         */
        axes(): ds.ClientRegister<{ x: number; y: number }>

        /**
         * Button (or combo) register
         */
        button(value: ds.GamepadButtons): ds.ClientRegister<boolean>
    }
}

ds.Gamepad.prototype.axes = function axes() {
    let r = (this as any).__axes as ds.ClientRegister<{ x: number; y: number }>
    if (!r) {
        ;(this as any).__axes = r = ds.clientRegister<{ x: number; y: number }>(
            { x: 0, y: 0 }
        )
        this.reading.subscribe(rv => r.emit({ x: rv[1], y: rv[2] }))
    }
    return r
}

ds.Gamepad.prototype.button = function button(value: ds.GamepadButtons) {
    const key = `__${value}`
    let r = (this as any)[key] as ds.ClientRegister<boolean>
    if (!r) {
        ;(this as any)[key] = r = ds.clientRegister(false)
        this.reading.subscribe(rv => r.emit((rv[0] & value) === value))
    }
    return r
}
