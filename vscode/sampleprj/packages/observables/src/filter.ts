import { Observable, OperatorFunction } from "./observable"

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

export function debounceTime<T>(duration: number): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            let timer: number
            const { unsubscribe } = await source.subscribe({
                error,
                complete,
                next: value => {
                    clearTimeout(timer)
                    timer = setTimeout(async () => {
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

function equality<T>(l: T, r: T) {
    return l === r
}

export function skipRepeats<T>(
    equals?: (left: T, right: T) => boolean
): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            let lastValue: any
            let hasValue = false
            const eq = equals || equality
            return await source.subscribe({
                error,
                complete,
                next: async value => {
                    if (!hasValue || !eq(lastValue, value)) {
                        hasValue = true
                        lastValue = value
                        await next(value)
                    }
                },
            })
        })
    }
}

export function threshold(value: number): OperatorFunction<number, number> {
    return skipRepeats((l, r) => Math.abs(l - r) < value)
}
