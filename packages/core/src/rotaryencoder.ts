import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface RotaryEncoder {
        /**
         * Expose reading from the rotary encoder between 0-`steps` as number 0-1.
         * The value of encoder is always clamped between 0 and `steps` (which defaults to one full turn).
         */
        asPotentiometer(steps?: number): ClientRegister<number>
    }
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
