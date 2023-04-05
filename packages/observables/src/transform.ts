import { interval } from "./creation"
import { Observable, OperatorFunction, wrapSubscriptions } from "./observable"

/**
 * An observable operator that contains streamed values.
 * @param converter function to converts the observed value into a new value
 * @returns observable operator to be used in pipe
 */
export function map<T, R>(
    converter: (value: T, index: number) => R | Promise<R>
): OperatorFunction<T, R> {
    return function operator(source: Observable<T>) {
        return new Observable<R>(observer => {
            const { next, error, complete } = observer
            let index = 0
            return source.subscribe({
                error,
                complete,
                next: async value => {
                    const r = await converter(value, index++)
                    await next(r)
                },
            })
        })
    }
}

/**
 * Applies an accumulator (or "reducer function") to each value from the source.
 */
export function scan<T, A>(
    accumulator: (acc: A, value: T, index: number) => A | Promise<A>,
    seed?: A
): OperatorFunction<T, A> {
    return function operator(source: Observable<T>) {
        return new Observable<A>(observer => {
            const { error, next, complete } = observer
            let prev: A = seed
            let index = 0
            return source.subscribe({
                error,
                complete,
                next: async curr => {
                    prev = await accumulator(prev, curr, index++)
                    await next(prev)
                },
            })
        })
    }
}

/**
 * An observable operator that collects samples in an array.
 * @param length
 * @returns
 */
export function buffer<T>(
    closingObservable: Observable<any>
): OperatorFunction<T, T[]> {
    return function operator(source: Observable<T>) {
        return new Observable<T[]>(observer => {
            const { next, error, complete } = observer
            let buffer: T[] = []

            const closingUnsub = closingObservable.subscribe(async () => {
                const res = buffer
                buffer = []
                await next(res)
            })
            const srcUnsub = source.subscribe({
                error,
                complete,
                next: (value: T) => {
                    buffer.push(value)
                },
            })
            return wrapSubscriptions([closingUnsub, srcUnsub])
        })
    }
}

/**
 * An observable operator that collects samples during a given duration
 * @param length
 * @returns
 */
export function bufferTime<T>(duration: number): OperatorFunction<T, T[]> {
    return buffer(interval(duration))
}
