import { AsyncValue } from "@devicescript/core"
import { Observable, OperatorFunction } from "./observable"

/**
 * Just errors and does nothing else
 * @param errorFactory a function to creates a new error instance
 * @returns
 */
export function throwError<T>(
    errorFactory: () => AsyncValue<any>
): OperatorFunction<T, never> {
    return function operator(source: Observable<T>) {
        return new Observable<never>(async observer => {
            const { error } = observer
            const e = await errorFactory()
            // populate stack
            try {
                throw e
            } catch {}
            // send upstream
            error(e)
        })
    }
}

/**
 * It only listens to the error channel and ignores notifications. Handles errors from the source observable, and maps them to a new observable.
 * The error may also be rethrown, or a new error can be thrown to emit an error from the result.
 */
export function catchError<T, R>(
    selector: (err: any, caught: Observable<T>) => Observable<R>
): OperatorFunction<T, T | R> {
    return function operator(source: Observable<T>) {
        return new Observable<T | R>(async observer => {
            const { next, error, complete } = observer

            let unsub = await source.subscribe({
                next,
                error: async e => {
                    // error occured: unsubscribe from source observable
                    unsub.unsubscribe()

                    // get follow-up observable
                    const errorSource = selector(e, source)

                    // wire up error source to the output
                    unsub = await errorSource.subscribe(observer)
                },
                complete,
            })

            return () => {
                unsub.unsubscribe()
            }
        })
    }
}
