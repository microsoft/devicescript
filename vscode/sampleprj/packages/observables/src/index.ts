import * as ds from "@devicescript/core"
import { AsyncVoid } from "@devicescript/core"

// https://github.com/keithamus/mini-observable
// + some rxjs

export interface Subscription {
    closed?: boolean
    unsubscribe: () => void
}
export type AsyncSubscription = Subscription | Promise<Subscription>
export type UnaryFunction<T, R> = (source: T) => R
export type ObserverStart = (subscription: Subscription) => void
/**
 * Promise.then is not supported in DeviceScript,
 * therefore we need to be able to avoid next
 */
export type ObserverNext<T> = (value: T) => AsyncVoid
export type ObserverError = (error: Error) => void
export type ObserverComplete = () => void

export interface SubscriptionObserver<T> {
    closed: boolean
    error: ObserverError
    complete: ObserverComplete
    next: ObserverNext<T>
}

interface OptionalObserver<T> {
    start?: ObserverStart
    error?: ObserverError
    complete?: ObserverComplete
    next?: ObserverNext<T>
}

export type SloppyObserver<T> = OptionalObserver<T> | ObserverNext<T>

export type SubscriberFunction<T> = (
    observer: SubscriptionObserver<T>
) => AsyncSubscription | ds.Unsubscribe | Promise<ds.Unsubscribe> | AsyncVoid

export class Observable<T> {
    constructor(readonly subscriber: SubscriberFunction<T>) {}

    async subscribe(observer: SloppyObserver<T>): Promise<Subscription> {
        let start: ObserverStart
        let next: ObserverNext<T>
        let error: ObserverError
        let complete: ObserverComplete

        if (typeof observer === "function") {
            next = observer
        } else {
            start = observer.start
            next = observer.next
            error = observer.error
            complete = observer.complete
        }
        let cleanup: () => void
        let closed = false
        let wrapClosedSync =
            (fn: (value: any) => void): (() => void) =>
            (v?: any) =>
                closed || (fn && fn(v))
        let unsubscribeSync = wrapClosedSync(() => {
            closed = true
            cleanup && cleanup()
        })
        let wrapUnsubscribeSync =
            (fn: (value: any) => void): (() => void) =>
            (v?: any) => {
                unsubscribeSync()
                fn(v)
            }
        error = wrapClosedSync(wrapUnsubscribeSync(error))
        let wrapTrySync =
            (fn: (value: T) => void): (() => void) =>
            (v?: T) => {
                try {
                    fn(v)
                } catch (e) {
                    error(e as Error)
                }
            }
        complete = wrapClosedSync(wrapTrySync(wrapUnsubscribeSync(complete)))

        // next, async
        let wrapClosedAsync =
            (fn: (value: any) => Promise<void>): (() => Promise<void>) =>
            async (v?: any) =>
                closed || (fn && (await fn(v)))
        let wrapTryAsync =
            (fn: (value: T) => AsyncVoid): (() => Promise<void>) =>
            async (v?: T) => {
                try {
                    await fn(v)
                } catch (e) {
                    error(e as Error)
                }
            }
        next = wrapClosedAsync(wrapTryAsync(next))

        let subscription: Subscription = {
            closed,
            unsubscribe: unsubscribeSync,
        }
        if (start) start(subscription)
        if (closed) return subscription
        await wrapTryAsync(async () => {
            let observer: SubscriptionObserver<T> = {
                closed,
                error,
                complete,
                next,
            }
            // might unwrap an async function
            const c = await this.subscriber(observer)
            if (c && typeof c === "function") cleanup = c
            else if (
                c &&
                typeof c === "object" &&
                typeof c.unsubscribe === "function"
            ) {
                cleanup = c.unsubscribe
            }
        })()
        return subscription
    }

    pipe<A>(op1: OperatorFunction<T, A>): Observable<A>
    pipe<A, B>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>
    ): Observable<B>
    pipe<A, B, C>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>
    ): Observable<C>
    pipe<A, B, C, D>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>
    ): Observable<D>
    pipe<A, B, C, D, E>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>
    ): Observable<E>
    pipe<A, B, C, D, E, F>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>
    ): Observable<F>
    pipe<A, B, C, D, E, F, G>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>
    ): Observable<G>
    pipe<A, B, C, D, E, F, G, H>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>
    ): Observable<H>
    pipe<A, B, C, D, E, F, G, H, I>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>,
        op9: OperatorFunction<H, I>
    ): Observable<I>
    pipe<A, B, C, D, E, F, G, H, I>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>,
        op9: OperatorFunction<H, I>,
        ...operations: OperatorFunction<any, any>[]
    ): Observable<unknown>

    pipe(...operations: OperatorFunction<any, any>[]): Observable<any> {
        return operations?.length ? pipeFromArray(operations)(this) : this
    }
}

export type OperatorFunction<T, R> = (
    observable: Observable<T>
) => Observable<R>

declare module "@devicescript/core" {
    interface Register<T> {
        pipe<A>(op1: OperatorFunction<T, A>): Observable<A>
        pipe<A, B>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>
        ): Observable<B>
        pipe<A, B, C>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>
        ): Observable<C>
        pipe<A, B, C, D>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>
        ): Observable<D>
        pipe<A, B, C, D, E>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>
        ): Observable<E>
        pipe<A, B, C, D, E, F>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>
        ): Observable<F>
        pipe<A, B, C, D, E, F, G>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>
        ): Observable<G>
        pipe<A, B, C, D, E, F, G, H>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>,
            op8: OperatorFunction<G, H>
        ): Observable<H>
        pipe<A, B, C, D, E, F, G, H, I>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>,
            op8: OperatorFunction<G, H>,
            op9: OperatorFunction<H, I>
        ): Observable<I>
        pipe<A, B, C, D, E, F, G, H, I>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>,
            op8: OperatorFunction<G, H>,
            op9: OperatorFunction<H, I>,
            ...operations: OperatorFunction<any, any>[]
        ): Observable<unknown>
        pipe(...operations: OperatorFunction<any, any>[]): Observable<any>
    }
}

ds.Register.prototype.pipe = function pipe<T>(
    ...operations: OperatorFunction<any, any>[]
): Observable<any> {
    const obs = fromRegister(this)
    return operations?.length ? pipeFromArray(operations)(obs) : obs
}

declare module "@devicescript/core" {
    interface Event<T = void> {
        pipe<A>(op1: OperatorFunction<T, A>): Observable<A>
        pipe<A, B>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>
        ): Observable<B>
        pipe<A, B, C>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>
        ): Observable<C>
        pipe<A, B, C, D>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>
        ): Observable<D>
        pipe<A, B, C, D, E>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>
        ): Observable<E>
        pipe<A, B, C, D, E, F>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>
        ): Observable<F>
        pipe<A, B, C, D, E, F, G>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>
        ): Observable<G>
        pipe<A, B, C, D, E, F, G, H>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>,
            op8: OperatorFunction<G, H>
        ): Observable<H>
        pipe<A, B, C, D, E, F, G, H, I>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>,
            op8: OperatorFunction<G, H>,
            op9: OperatorFunction<H, I>
        ): Observable<I>
        pipe<A, B, C, D, E, F, G, H, I>(
            op1: OperatorFunction<T, A>,
            op2: OperatorFunction<A, B>,
            op3: OperatorFunction<B, C>,
            op4: OperatorFunction<C, D>,
            op5: OperatorFunction<D, E>,
            op6: OperatorFunction<E, F>,
            op7: OperatorFunction<F, G>,
            op8: OperatorFunction<G, H>,
            op9: OperatorFunction<H, I>,
            ...operations: OperatorFunction<any, any>[]
        ): Observable<unknown>
        pipe(...operations: OperatorFunction<any, any>[]): Observable<any>
    }
}

ds.Event.prototype.pipe = function pipe<T>(
    ...operations: OperatorFunction<any, any>[]
): Observable<any> {
    const obs = fromEvent(this)
    return operations?.length ? pipeFromArray(operations)(obs) : obs
}

export function of<T>(values: T[]) {
    return new Observable<T>(async observer => {
        const { next, complete } = observer
        for (const value of values) await next(value)
        complete()
    })
}

export function fromPromise<T>(promise: Promise<T>): Observable<T> {
    return new Observable(async ({ next, error, complete }) => {
        try {
            const v = await promise
            next(v)
        } catch (e) {
            error(e as Error)
        } finally {
            complete()
        }
    })
}

export function fromEvent<T>(event: ds.Event<T>) {
    return new Observable<T>(async observer => {
        const { next } = observer
        await event.subscribe(async v => await next(v))
    })
}

export function fromRegister<T>(register: ds.Register<T>) {
    return new Observable<T>(async observer => {
        const { next } = observer
        await register.subscribe(async v => await next(v))
    })
}

export function identity<T>(x: T): T {
    return x
}
function pipeFromArray<T, R>(
    fns: Array<UnaryFunction<T, R>>
): UnaryFunction<T, R> {
    if (!fns?.length) {
        return identity as UnaryFunction<any, any>
    }
    if (fns.length === 1) {
        return fns[0]
    }
    return function piped(input: T): R {
        return fns.reduce(
            (prev: any, fn: UnaryFunction<T, R>) => fn(prev),
            input as any
        )
    }
}

/**
 * An observable operator that contains streamed values.
 * @param converter function to converts the observed value into a new value
 * @returns observable operator to be used in pipe
 */
export function map<T, R>(
    converter: (value: T, index: number) => R | Promise<R>
): OperatorFunction<T, R> {
    return function operator(source: Observable<T>) {
        return new Observable<R>(async observer => {
            const { next } = observer
            let index = 0
            return await source.subscribe(async v => {
                const r = await converter(v, index++)
                await next(r)
            })
        })
    }
}
export function filter<T>(
    condition: (value: T, index: number) => boolean
): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(async observer => {
            const { next } = observer
            let index = 0
            return await source.subscribe(async v => {
                if (condition(v, index++)) await next(v)
            })
        })
    }
}

// TODO: michal
function setTimeout(fn: () => void, timeout: number): number {
    return 0
}
function clearTimeout(timeout: number): void {}

export function delay<T>(duration: number): OperatorFunction<T, T> {
    return function operator(source: Observable<T>) {
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            return await source.subscribe({
                error,
                complete,
                next: v => {
                    setTimeout(async () => {
                        await next(v)
                    }, duration)
                },
            })
        })
    }
}

export function span<T, A>(
    accumulator: (acc: A, value: T, index: number) => A | Promise<A>,
    seed: A
): OperatorFunction<T, A> {
    return function operator(source: Observable<T>) {
        return new Observable<A>(async observer => {
            const { error, next, complete } = observer
            let last: A = undefined
            let index = 0
            return await source.subscribe({
                error,
                complete,
                next: async v => {
                    if (index === 0) {
                        last = seed
                        index++
                        await next(last)
                    } else {
                        last = await accumulator(last, v, index++)
                        await next(last)
                    }
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
            source.subscribe({
                error,
                complete: () => setTimeout(complete, duration),
                next: value => {
                    clearTimeout(timer)
                    timer = setTimeout(async () => {
                        await next(value)
                    }, duration)
                },
            })
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
                        await next((lastValue = value))
                    }
                },
            })
        })
    }
}

export function threshold(value: number): OperatorFunction<number, number> {
    return skipRepeats((l, r) => Math.abs(l - r) < value)
}

export function mergeAll<T>(): OperatorFunction<Observable<T>, T> {
    return function operator(source: Observable<Observable<T>>) {
        return new Observable<T>(async observer => {
            const { error, next, complete } = observer
            let sourceCompleted = false
            let remaining = 0
            const subscriptions: Subscription[] = []
            subscriptions.push(
                await source.subscribe({
                    error,
                    complete: () => {
                        sourceCompleted = true
                        if (!remaining) complete()
                    },
                    next: async (o: Observable<T>) => {
                        remaining++
                        subscriptions.push(
                            await o.subscribe({
                                error,
                                complete: () => {
                                    remaining--
                                    if (sourceCompleted && !remaining)
                                        complete()
                                },
                                next,
                            })
                        )
                    },
                })
            )
            return () => {
                for (const subscription of subscriptions)
                    subscription.unsubscribe()
            }
        })
    }
}
