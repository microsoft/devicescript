import * as ds from "@devicescript/core"
import { AsyncVoid } from "@devicescript/core"
import { interval } from "./creation"
import {
    Observable,
    OperatorFunction,
    Subscription,
    wrapSubscriptions,
} from "./observable"

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
                    complete: async () => {
                        sourceCompleted = true
                        if (!remaining) await complete()
                    },
                    next: async (o: Observable<T>) => {
                        remaining++
                        subscriptions.push(
                            await o.subscribe({
                                error,
                                complete: async () => {
                                    remaining--
                                    if (sourceCompleted && !remaining)
                                        await complete()
                                },
                                next,
                            })
                        )
                    },
                })
            )
            return wrapSubscriptions(subscriptions)
        })
    }
}
