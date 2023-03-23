import { Observable } from "./observable"
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

/**
 * Finite impulse response filter
 * @param coefficients array of filter coefficient
 * @param gain optional gain, otherwise computed from the coefficients
 */
export function fir(coefficients: number[], gain?: number) {
    const n = coefficients.length
    if (gain === undefined) {
        gain = 0
        for (let i = 0; i < n; ++i) gain += coefficients[i]
    }

    return function operator(source: Observable<number>) {
        return new Observable<number>(async observer => {
            const { error, next, complete } = observer

            const values: number[] = []
            let k = 0

            return await source.subscribe({
                error,
                complete,
                next: async value => {
                    // initial with first value
                    if (values.length === 0)
                        for (let i = 0; i < n; ++i) values.push(value)
                    // update new value
                    let output = 0
                    values[k] = value
                    for (let i = 0; i < n; ++i) {
                        const vi = (i + k) % n
                        output += coefficients[i] * values[vi]
                    }
                    k = (k + 1) % n
                    output = output / gain
                    await next(output)
                },
            })
        })
    }
}

/**
 * Rolling average filter (FIR filtering with all coefficients set to 1)
 * @param windowLength number of samples
 * @returns
 */
export function rollingAverage(windowLength: number) {
    const coefficients = []
    for (let i = 0; i < windowLength; ++i) coefficients[i] = 1
    return fir(coefficients)
}
