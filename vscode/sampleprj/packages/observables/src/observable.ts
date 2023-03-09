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
export type ObserverComplete = () => AsyncVoid

export interface SubscriptionObserver<T> {
    closed: boolean
    error: ObserverError
    complete: ObserverComplete
    next: ObserverNext<T>
}

export interface OptionalObserver<T> {
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
        const { subscriber } = this
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
        const wrapClosedSync =
            (fn: (value: any) => void): (() => void) =>
            (v?: any) => {
                if (!closed && fn) fn(v)
            }
        const unsubscribeSync = wrapClosedSync(() => {
            closed = true
            if (cleanup) cleanup()
        })
        const wrapUnsubscribeSync =
            (fn: (value: any) => void): (() => void) =>
            (v?: any) => {
                unsubscribeSync()
                fn(v)
            }
        error = wrapClosedSync(wrapUnsubscribeSync(error))

        // next, complete async
        const wrapClosedAsync =
            (fn: (value: any) => Promise<void>): (() => Promise<void>) =>
            async (v?: any) => {
                if (!closed && fn) await fn(v)
            }
        const wrapUnsubscribeAsync =
            (fn: (value: any) => AsyncVoid): (() => void) =>
            async (v?: any) => {
                unsubscribeSync()
                await fn(v)
            }
        const wrapTryAsync =
            (fn: (value: T) => AsyncVoid): (() => Promise<void>) =>
            async (v?: T) => {
                try {
                    await fn(v)
                } catch (e) {
                    error(e as Error)
                }
            }
        complete = wrapClosedAsync(wrapTryAsync(wrapUnsubscribeAsync(complete)))
        next = wrapClosedAsync(wrapTryAsync(next))

        let subscription: Subscription = {
            closed,
            unsubscribe: unsubscribeSync,
        }
        if (start) start(subscription)
        if (closed) return subscription
        const sub = async () => {
            const wrappedObserver: SubscriptionObserver<T> = {
                closed,
                error,
                complete,
                next,
            }
            // might unwrap an async function
            const c = await subscriber(wrappedObserver)
            if (c && typeof c === "function") cleanup = c
            else if (
                c &&
                typeof c === "object" &&
                typeof c.unsubscribe === "function"
            ) {
                cleanup = c.unsubscribe
            }
        }
        const wrappedSub = await wrapTryAsync(sub)
        await wrappedSub()
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
        return operations.length ? pipeFromArray(operations)(this) : this
    }
}

/**
 * Wraps an existing subscriptions into a single subscription
 * @param subscription
 * @param cleanup
 */
export function wrapSubscriptions(subscriptions: Subscription[]): Subscription {
    return {
        unsubscribe: () =>
            subscriptions.filter(s => !s.closed).forEach(s => s.unsubscribe()),
    }
}

export type OperatorFunction<T, R> = (
    observable: Observable<T>
) => Observable<R>

export function identity<T>(x: T): T {
    return x
}

export function pipeFromArray<T, R>(
    fns: Array<UnaryFunction<T, R>>
): UnaryFunction<T, R> {
    if (!fns || !fns.length) {
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
