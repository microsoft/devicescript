import { Observable, OperatorFunction } from "./observable"

/**
 * Applies an accumulator function over the source Observable,
 * and returns the accumulated result when the source completes,
 * given an optional seed value.
 */
export function reduce<T, A>(
    accumulator: (acc: A, value: T, index: number) => A,
    seed?: A
): OperatorFunction<T, A> {
    return function operator(source: Observable<T>) {
        return new Observable<A>(observer => {
            const { error, next, complete } = observer
            let prev: A = seed
            let index = 0
            return source.subscribe({
                error,
                complete: async () => {
                    await next(prev)
                    await complete()
                },
                next: async curr => {
                    prev = accumulator(prev, curr, index++)
                },
            })
        })
    }
}
