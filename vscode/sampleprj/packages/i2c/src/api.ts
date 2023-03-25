import { register, interval } from "@devicescript/observables"
import { i2c } from "./client"

/**
 * Creates an observable client-side I2C number register, that allows to emit new values.
 * @param value
 * @returns
 */
export function i2cRegisterWithPoll(
    devAddr: number,
    regAddr: number,
    pollInterval: number = 1000
) {
    return register<number>(
        async () => await i2c.readReg(devAddr, regAddr),
        interval(pollInterval)
    )
}
