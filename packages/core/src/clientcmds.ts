// This file contains implementation for actions/registers marked `client` in the spec,
// as well as additional functionality on different service clients (Roles)

import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Led {
        setAll(r: number, g: number, b: number): Promise<void>
    }

    interface LightBulb {
        /**
         * Toggle light between off and full brightness
         * @param lowerThreshold if specified, the light will be turned off if the current brightness is above this threshold
         */
        toggle(lowerThreshold?: number): Promise<void>
    }

    interface RotaryEncoder {
        /**
         * Expose reading from the rotary encoder between 0-`steps` as number 0-1.
         * The value of encoder is always clamped between 0 and `steps` (which defaults to one full turn).
         */
        asPotentiometer(steps?: number): ClientRegister<number>
    }
}

ds.Buzzer.prototype.playNote = async function (frequency, volume, duration) {
    const p = 1000000 / frequency
    volume = Math.clamp(0, volume, 1)
    await this.playTone(p, p * volume * 0.5, duration)
}

ds.LightBulb.prototype.toggle = async function (lowerThreshold?: number) {
    const value = await this.intensity.read()
    const on = value > (lowerThreshold || 0)
    await this.intensity.write(on ? 0 : 1)
}

ds.Button.prototype.pressed = function pressed() {
    let reg: ds.ClientRegister<boolean> = (this as any).__pressed
    if (!reg) {
        reg = ds.clientRegister(false)
        ;(this as any).__pressed = reg
        this.down.subscribe(() => reg.emit(true))
        this.hold.subscribe(() => reg.emit(true))
        this.up.subscribe(() => reg.emit(false))
    }
    return reg
}

ds.MagneticFieldLevel.prototype.detected = function () {
    let reg: ds.ClientRegister<boolean> = (this as any).__detected
    if (!reg) {
        reg = ds.clientRegister(false)
        ;(this as any).__detected = reg
        this.active.subscribe(() => reg.emit(true))
        this.inactive.subscribe(() => reg.emit(false))
    }
    return reg
}

ds.RotaryEncoder.prototype.asPotentiometer = function (steps?: number) {
    const self = this as ds.RotaryEncoder
    const reg = ds.clientRegister(0)
    async function init() {
        if (!steps) steps = await self.clicksPerTurn.read()
        let p0 = await self.reading.read()
        self.reading.subscribe(v => {
            const curr = Math.clamp(0, v - p0, steps)
            p0 = v - curr
            reg.emit(curr / steps)
        })
    }
    init.start()
    return reg
}

let _ctrl: ds.Control
;(ds as typeof ds).intControl = function () {
    if (!_ctrl) _ctrl = new ds.Control("intControl[int:0]")
    return _ctrl
}
;(ds as typeof ds).standby = async function (millis: number) {
    if (isNaN(millis) || millis < 0) return

    const ctrl = ds.intControl()
    await ctrl.standby(millis)
}
