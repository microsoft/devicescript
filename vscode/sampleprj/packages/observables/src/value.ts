import * as ds from "@devicescript/core"
import {
    Observable,
    SubscriberFunction,
    Subscription,
    SubscriptionObserver,
} from "./observable"

/**
 * An observable client-side register
 */
export class ObservableValue<T> extends Observable<T> {
    private _valueReader: () => ds.AsyncValue<T>
    private _subscriptions: ((value: T) => ds.AsyncVoid)[]

    /**
     * @deprecated
     */
    constructor(
        subscriber: SubscriberFunction<T>,
        subscriptions: ((value: T) => ds.AsyncVoid)[],
        valueReader: () => ds.AsyncValue<T>
    ) {
        super(subscriber)
        this._subscriptions = subscriptions
        this._valueReader = valueReader
    }

    /**
     * reads the current register value
     **/
    async read() {
        return await this._valueReader()
    }

    /**
     * Emit a value and notify subscriptions
     * @param newValue updated value
     */
    async emit(): Promise<void> {
        const newValue = await this.read()
        for (let i = 0; i < this._subscriptions.length; ++i) {
            const next = this._subscriptions[i]
            await next(newValue)
        }
    }
}

/**
 * Creates an observable client-side register, that allows to emit new values.
 * @param value
 * @returns
 */
export function register<T>(
    valueReader: () => ds.AsyncValue<T>,
    emitObservable?: Observable<any>
) {
    let unsub: Subscription
    const subscriptions: ((value: T) => ds.AsyncVoid)[] = []
    const subscriber = async (observer: SubscriptionObserver<T>) => {
        const { next } = observer
        subscriptions.push(next)
        if (subscriptions.length === 1 && emitObservable)
            unsub = await emitObservable.subscribe(async () => await obs.emit())
        return () => {
            const i = subscriptions.indexOf(next)
            if (i > -1) subscriptions.insert(i, 1)
            if (subscriptions.length === 0 && unsub) {
                unsub.unsubscribe()
                unsub = undefined
            }
        }
    }
    const obs = new ObservableValue<T>(subscriber, subscriptions, valueReader)
    return obs
}
