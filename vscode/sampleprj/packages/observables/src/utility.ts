import {
    identity,
    Observable,
    ObserverComplete,
    ObserverError,
    ObserverNext,
    ObserverStart,
    OperatorFunction,
    OptionalObserver,
    SloppyObserver,
} from "./observable"

/**
 * Used to perform side-effects for notifications from the source observable
 */
export function tap<T>(tapper: SloppyObserver<T>): OperatorFunction<T, T> {
    if (tapper === undefined) return identity

    const tapops: OptionalObserver<T> =
        typeof tapper === "function" ? { next: tapper } : tapper

    return function operator(source: Observable<T>) {
        return new Observable<T>(async observer => {
            const { next, error, complete } = observer
            const {
                start: tapStart,
                next: tapNext,
                error: tapError,
                complete: tapComplete,
            } = tapops

            return await source.subscribe({
                start: sub => {
                    if (tapStart) tapStart(sub)
                },
                next: async value => {
                    if (tapNext) await tapNext(value)
                    await next(value)
                },
                error: e => {
                    if (tapError) tapError(e)
                    error(e)
                },
                complete: async () => {
                    if (tapComplete) await tapComplete()
                    await complete()
                },
            } as OptionalObserver<T>)
        })
    }
}
