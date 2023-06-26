import { AsyncValue, millis } from "@devicescript/core"
import { interval } from "./creation"
import {
    Observable,
    OperatorFunction,
    Subscription,
    wrapSubscriptions,
} from "./observable"

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
 * Expands value with timestamp and last timestamp.
 * @param converter
 * @returns an observable operator to be used in pipe
 */
export function timestamp<T>(): OperatorFunction<
    T,
    {
        /**
         * Observable value
         */
        value: T
        /**
         * Current time in milliseconds
         */
        time: number
        /**
         * Time of the last value in milliseconds
         */
        lastTime: number
    }
> {
    let lastTime: number = undefined
    return map<T, { value: T; time: number; lastTime: number }>(async value => {
        const time = millis()
        if (lastTime === undefined) lastTime = time
        const res = { value, time, lastTime }
        lastTime = time
        return res
    })
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

/**
 * Takes a source Observable<T> and calls transform(T) for each emitted value.
 * Immediately subscribe to any Observable<U> coming from transform(T),
 * but in addition to this, will unsubscribe() from any prior Observable<U>s -
 * so that there is only ever one Observable<U> subscribed at any one time.
 * @param transform
 * @returns
 */
export function switchMap<T, A>(
    transform: (item: T) => Observable<A>
): OperatorFunction<T, A> {
    let remaining = 0
    return function operator(source: Observable<T>) {
        return new Observable<A>(observer => {
            const { next, error, complete } = observer
            let oldSubscription: Subscription
            const unsub = source.subscribe({
                error,
                next: value => {
                    remaining += 1
                    // cancel previous observable
                    if (oldSubscription) {
                        remaining -= 1
                        oldSubscription.unsubscribe()
                    }
                    // register to next observable
                    oldSubscription = transform(value)?.subscribe({
                        error,
                        next,
                        complete: () => {
                            remaining -= 1
                            if (remaining === 0) {
                                complete()
                                if (unsub) unsub?.unsubscribe()
                            }
                        },
                    })
                },
            })
            return wrapSubscriptions([unsub, oldSubscription])
        })
    }
}
