import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Gamepad {
        /**
         * The thumbstick position register if any
         */
        axes(): ds.ClientRegister<[number, number]>

        /**
         * Button (or combo) register
         */
        button(value: ds.GamepadButtons): ds.ClientRegister<boolean>
    }
}

ds.Gamepad.prototype.axes = function axes() {
    let r = (this as any).__axes as ds.ClientRegister<[number, number]>
    if (!r) {
        ;(this as any).__axes = r = ds.clientRegister([0, 0])
        this.reading.subscribe(([, x, y]) => r.emit([x, y]))
    }
    return r
}

ds.Gamepad.prototype.button = function button(value: ds.GamepadButtons) {
    const key = `__${value}`
    let r = (this as any)[key] as ds.ClientRegister<boolean>
    if (!r) {
        ;(this as any)[key] = r = ds.clientRegister(false)
        this.reading.subscribe(([buttons]) =>
            r.emit((buttons & value) === value)
        )
    }
    return r
}
