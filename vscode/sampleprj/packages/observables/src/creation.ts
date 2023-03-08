import { Register, Event } from "@devicescript/core"
import { Observable } from "./observable"

/**
 * Converts an array into a sequence of values
 * @param values
 * @returns
 */
export function from<T>(values: T[]) {
    return new Observable<T>(async observer => {
        const { next, complete } = observer
        if (values) for (const value of values) await next(value)
        await complete()
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

export function fromEvent<T>(event: Event<T>) {
    return new Observable<{ value: T; event: Event<T> }>(async observer => {
        const { next } = observer
        await event.subscribe(async value => await next({ value, event }))
    })
}

export function fromRegister<T>(register: Register<T>) {
    return new Observable<{ value: T; register: Register<T> }>(
        async observer => {
            const { next } = observer
            await register.subscribe(
                async value => await next({ value, register })
            )
        }
    )
}

/**
 * Creates an Observable that emits sequential numbers every specified interval of time.
 * @param millis milliseconds
 */
export function interval(millis: number): Observable<number> {
    return new Observable<number>(async observer => {
        const { next } = observer
        let count = 0
        const timer = setInterval(async () => {
            await next(count++)
        }, millis)
        return () => {
            clearInterval(timer)
        }
    })
}

/**
 * Creates an observable that will wait for a specified time period before emitting the number 0.
 * @param millis milliseconds
 */
export function timer(millis: number): Observable<0> {
    return new Observable<0>(async observer => {
        const { next, complete } = observer
        const timer = setTimeout(async () => {
            await next(0)
            await complete()
        }, millis)
        return () => {
            clearTimeout(timer)
        }
    })
}
