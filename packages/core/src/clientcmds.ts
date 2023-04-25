// This file contains implementation for actions/registers marked `client` in the spec,
// as well as additional functionality on different service clients (Roles)

import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Led {
        setAll(r: number, g: number, b: number): void
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

ds.Led.prototype.setAll = async function (r, g, b) {
    const buflen = (await this.numPixels.read()) * 3
    const buf = Buffer.alloc(buflen)
    let idx = 0
    while (idx < buflen) {
        buf.setAt(idx, "u0.8", r)
        buf.setAt(idx + 1, "u0.8", g)
        buf.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    await this.pixels.write(buf)
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
        this.down.subscribe(async () => await reg.emit(true))
        this.hold.subscribe(async () => await reg.emit(true))
        this.up.subscribe(async () => await reg.emit(false))
    }
    return reg
}

ds.MagneticFieldLevel.prototype.detected = function () {
    let reg: ds.ClientRegister<boolean> = (this as any).__detected
    if (!reg) {
        reg = ds.clientRegister(false)
        ;(this as any).__detected = reg
        this.active.subscribe(async () => await reg.emit(true))
        this.inactive.subscribe(async () => await reg.emit(false))
    }
    return reg
}

ds.RotaryEncoder.prototype.asPotentiometer = function (steps?: number) {
    const self = this as ds.RotaryEncoder
    const reg = ds.clientRegister(0)
    async function init() {
        if (!steps) steps = await self.clicksPerTurn.read()
        let p0 = await self.reading.read()
        self.reading.subscribe(async v => {
            const curr = Math.clamp(0, v - p0, steps)
            p0 = v - curr
            await reg.emit(curr / steps)
        })
    }
    init.start()
    return reg
}
