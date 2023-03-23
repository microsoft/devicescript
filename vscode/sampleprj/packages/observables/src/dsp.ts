import { scan } from "./transform"

/**
 * Exponentially weighted moving average
 * @param gain The parameter decides how important the current observation is in the calculation of the EWMA. The higher the value of alpha, the more closely the EWMA tracks the original time series.
 * @param seed starting value if any
 * @returns
 */
export function ewma(gain: number = 0.2, seed: number = undefined) {
    gain = Math.max(0, Math.min(1, gain))
    const onegain = 1 - gain
    return scan<number, number>(
        (prev, curr) =>
            prev === undefined ? curr : prev * onegain + curr * gain,
        seed
    )
}
