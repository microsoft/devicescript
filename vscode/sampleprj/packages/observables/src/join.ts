import { interval } from "./creation"
import { Observable, Subscription, wrapSubscriptions } from "./observable"

/**
 * Collects the latest values of observables when the closing observable emits.
 * @param observables
 * @param closingObservable
 * @returns
 */
export function collect<
    TObservables extends Record<string, Observable<unknown>>
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
        async observer => {
            const { next, error, complete } = observer

            let values: Partial<Record<keyof TObservables, unknown>> = {}
            const assign = (name: string) => (v: unknown) => {
                values[name as keyof TObservables] = v
            }
            const unsubs: Subscription[] = []
            for (const name of Object.keys(observables)) {
                const unsub = await observables[name].subscribe({
                    error,
                    next: assign(name),
                })
                unsubs.push(unsub)
            }
            unsubs.push(
                await closingObservable.subscribe({
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
    TObservables extends Record<string, Observable<unknown>>
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
