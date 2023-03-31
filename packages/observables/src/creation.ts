import { Observable } from "./observable"

/**
 * Converts an array into a sequence of values
 * @param values
 * @returns
 */
export function from<T>(values: T[]) {
    return new Observable<T>(observer => {
        const work = async () => {
            const { next, complete } = observer
            if (values) for (const value of values) await next(value)
            await complete()
        }
        work.start()
    })
}

/**
 * Creates an Observable that emits sequential numbers every specified interval of time.
 * @param millis milliseconds
 */
export function interval(millis: number): Observable<number> {
    return new Observable<number>(observer => {
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
    return new Observable<0>(observer => {
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

/**
 * Checks a boolean at subscription time, and chooses between one of two observable sources
 */
export function iif<T, F>(
    condition: () => boolean,
    trueResult: Observable<T>,
    falseResult: Observable<F>
): Observable<T | F> {
    return new Observable<T | F>(observer => {
        const c = condition()
        const obs = c ? trueResult : falseResult
        return obs.subscribe(observer)
    })
}
