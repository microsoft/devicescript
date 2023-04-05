import { AsyncValue } from "@devicescript/core"
import { Observable, OperatorFunction, unusbscribe } from "./observable"

/**
 * It only listens to the error channel and ignores notifications. Handles errors from the source observable, and maps them to a new observable.
 * The error may also be rethrown, or a new error can be thrown to emit an error from the result.
 */
export function catchError<T, R>(
    selector: (err: any, caught: Observable<T>) => Observable<R>
): OperatorFunction<T, T | R> {
    return function operator(source: Observable<T>) {
        return new Observable<T | R>(observer => {
            const { next, complete } = observer

            let unsub = source.subscribe({
                next,
                error: async e => {
                    unsub = unusbscribe(unsub)

                    // get follow-up observable
                    const errorSource = selector(e, source)

                    // wire up error source to the output
                    unsub = await errorSource.subscribe(observer)
                },
                complete,
            })

            return () => {
                unusbscribe(unsub)
            }
        })
    }
}
