import { interval } from "./creation"
import {
    Observable,
    Subscription,
    unusbscribe,
    wrapSubscriptions,
} from "./observable"

/**
 * Collects the latest values of observables when the closing observable emits.
 * @param observables
 * @param closingObservable
 * @returns
 */
export function collect<
    TObservables extends Record<string, Observable<unknown>>,
>(
    observables: TObservables,
    closingObservable: Observable<unknown>,
    options?: {
        /**
         * Clears the accumulated values after emitting
         */
        clearValuesOnEmit?: boolean
    }
): Observable<Partial<Record<keyof TObservables, unknown>>> {
    const { clearValuesOnEmit } = options || {}
    return new Observable<Partial<Record<keyof TObservables, unknown>>>(
        observer => {
            const { next, error, complete } = observer

            let values: Partial<Record<keyof TObservables, unknown>> = {}
            const assign = (name: string) => (v: unknown) => {
                values[name as keyof TObservables] = v
            }
            const unsubs: Subscription[] = []
            for (const name of Object.keys(observables)) {
                const unsub = observables[name].subscribe({
                    error,
                    next: assign(name),
                })
                unsubs.push(unsub)
            }
            unsubs.push(
                closingObservable.subscribe({
                    error,
                    complete,
                    next: async () => {
                        const res = values
                        if (clearValuesOnEmit) values = {}
                        await next(res)
                    },
                })
            )
            return wrapSubscriptions(unsubs)
        }
    )
}

/**
 * Collects the latest values of observables when the closing observable emits.
 * @param observables
 * @param closingObservable
 * @returns
 */
export function collectTime<
    TObservables extends Record<string, Observable<unknown>>,
>(
    observables: TObservables,
    duration: number,
    options?: {
        /**
         * Clears the accumulated values after emitting
         */
        clearValuesOnEmit?: boolean
    }
): Observable<Partial<Record<keyof TObservables, unknown>>> {
    return collect<TObservables>(observables, interval(duration), options)
}

/**
 * Returns an observable that mirrors the first source observable to emit an item.
 */
export function race<T>(...sources: Observable<T>[]) {
    if (sources?.length === 1) return sources[0]

    return new Observable<T>(observer => {
        const { next, error, complete } = observer

        const unsubs: Subscription[] = []
        sources.forEach(src => {
            const unsub = src.subscribe({
                error,
                complete,
                next: async value => {
                    // cancel all other sources
                    if (unsubs.length > 1) {
                        let j = 0
                        while (j < unsubs.length) {
                            if (unsubs[j] !== unsub) {
                                unusbscribe(unsubs[j])
                                unsubs.insert(j, -1)
                            } else j++
                        }
                    }
                    // send next value
                    await next(value)
                },
            })
            unsubs.push(unsub)
        })
        return wrapSubscriptions(unsubs)
    })
}
