import { identity, Observable, OperatorFunction } from "./observable"

/**
 * An operator that filters values
 * @param condition
 * @returns
 */
export function filter<T>(
    condition: (value: T, index: number) => boolean
): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(async observer => {
            const { next, error, complete } = observer
            let index = 0
            return await source.subscribe({
                error,
                complete,
                next: async v => {
                    if (condition(v, index++)) await next(v)
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
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            let timer: number
            const { unsubscribe } = await source.subscribe({
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
                unsubscribe()
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
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            let timer: number
            const { unsubscribe } = await source.subscribe({
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
                unsubscribe()
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
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            let lastKey: K
            let hasFirst = false
            const eq = comparator || equality
            return await source.subscribe({
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
