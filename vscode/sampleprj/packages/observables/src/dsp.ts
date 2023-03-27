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
export class FIR {
    private readonly values: number[] = []
    private k: number = 0

    constructor(
        private readonly coefficients: number[],
        private readonly gain: number
    ) {
        if (this.gain === undefined) {
            this.gain = 0
            const n = this.coefficients.length
            for (let i = 0; i < n; ++i) this.gain += this.coefficients[i]
        }
    }

    /**
     * Applies the value in the filter
     * @param value new value
     * @returns filtered value
     */
    process(value: number) {
        // initial with first value
        const n = this.coefficients.length
        if (this.values.length === 0)
            for (let i = 0; i < n; ++i) this.values.push(value)
        // update new value
        let output = 0
        this.values[this.k] = value
        for (let i = 0; i < n; ++i) {
            const vi = (i + this.k) % n
            output += this.coefficients[i] * this.values[vi]
        }
        this.k = (this.k + 1) % n
        output = output / this.gain
        return output
    }
}

/**
 * Finite impulse response filter
 * @param coefficients array of filter coefficient
 * @param gain optional gain, otherwise computed from the coefficients
 */
export function fir(coefficients: number[], gain?: number) {
    return function operator(source: Observable<number>) {
        return new Observable<number>(async observer => {
            const { error, next, complete } = observer
            const filter = new FIR(coefficients, gain)
            return await source.subscribe({
                error,
                complete,
                next: async value => await next(filter.process(value)),
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
