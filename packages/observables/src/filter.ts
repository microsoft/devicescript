import * as ds from "@devicescript/core"
import {
    identity,
    Observable,
    OperatorFunction,
    unusbscribe,
} from "./observable"

/**
 * An operator that filters values
 * @param condition
 * @returns
 */
export function filter<T>(
    condition: (value: T, index: number) => ds.AsyncBoolean
): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const { next, error, complete } = observer
            let index = 0
            return source.subscribe({
                error,
                complete,
                next: async v => {
                    const c = await condition(v, index++)
                    if (c) await next(v)
                },
            })
        })
    }
}

/**
 * Emits a notification from the source Observable
 * only after a particular time span has passed without another source emission.
 */
export function debounceTime<T>(duration: number): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const { error, next, complete } = observer
            let timer: number
            const unsub = source.subscribe({
                error,
                complete,
                next: value => {
                    // reset timer again
                    clearTimeout(timer)
                    timer = setTimeout(async () => {
                        // done waiting, pass it on
                        timer = undefined
                        await next(value)
                    }, duration)
                },
            })

            return () => {
                unusbscribe(unsub)
                clearTimeout(timer)
            }
        })
    }
}

/**
 * Emits a value from the source Observable,
 * then ignores subsequent source values for duration milliseconds, then repeats this process.
 */
export function throttleTime<T>(duration: number): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const { error, next, complete } = observer
            let timer: number
            const unsub = source.subscribe({
                error,
                complete,
                next: async value => {
                    // ignore while timer active
                    if (timer !== undefined) return
                    // start debounce timer
                    timer = setTimeout(async () => {
                        clearTimeout(timer)
                        timer = undefined
                    }, duration)
                    // pass value
                    await next(value)
                },
            })

            // clean up: stop timer
            return () => {
                unusbscribe(unsub)
                clearTimeout(timer)
            }
        })
    }
}

/**
 * Ignores source values for duration milliseconds,
 * then emits the most recent value from the source Observable, then repeats this process
 */
export function auditTime<T>(duration: number): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const { error, next, complete } = observer
            let timer: number
            let lastValue: T = undefined
            const unsub = source.subscribe({
                error,
                complete,
                next: async value => {
                    lastValue = value
                    // ignore while timer active
                    if (timer !== undefined) return
                    // start debounce timer
                    timer = setTimeout(async () => {
                        clearTimeout(timer)
                        timer = undefined
                        const lv = lastValue
                        lastValue = undefined
                        // pass last value
                        await next(lv)
                    }, duration)
                },
            })

            // clean up: stop timer
            return () => {
                unusbscribe(unsub)
                clearTimeout(timer)
            }
        })
    }
}

function equality<T>(l: T, r: T) {
    return l === r
}

/**
 * Returns a result Observable that emits all values pushed by the source observable
 * if they are distinct in comparison to the last value the result observable emitted.
 */
export function distinctUntilChanged<T, K = T>(
    comparator?: (left: K, right: K) => boolean,
    keySelector: (value: T) => K = identity as (value: T) => K
): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const { error, next, complete } = observer
            let lastKey: K
            let hasFirst = false
            const eq = comparator || equality
            return source.subscribe({
                error,
                complete,
                next: async value => {
                    const key = keySelector(value)
                    if (!hasFirst || !eq(lastKey, key)) {
                        hasFirst = true
                        lastKey = key
                        await next(value)
                    }
                },
            })
        })
    }
}

/**
 * Filters numerical data stream within change threshold
 * @param value
 * @returns
 */
export function threshold<T = number>(
    value: number,
    keySelector: (value: T) => number = identity as (value: T) => number
): OperatorFunction<T, T> {
    return distinctUntilChanged<T, number>(
        (l, r) => Math.abs(l - r) < value,
        keySelector
    )
}
