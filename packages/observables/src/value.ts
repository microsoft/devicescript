import * as ds from "@devicescript/core"
import {
    Observable,
    SubscriberFunction,
    SubscriptionObserver,
} from "./observable"

/**
 * An observable client-side register
 */
export class ObservableValue<T> extends Observable<T> {
    private _value: T
    private _subscriptions: ((value: T) => ds.AsyncVoid)[]

    /**
     * @deprecated
     */
    constructor(
        subscriber: SubscriberFunction<T>,
        subscriptions: ((value: T) => ds.AsyncVoid)[],
        value: T
    ) {
        super(subscriber)
        this._subscriptions = subscriptions
        this._value = value
    }

    /**
     * reads the current register value
     **/
    async read() {
        return this._value
    }

    /**
     * Emit a value and notify subscriptions
     * @param newValue updated value
     */
    async emit(newValue: T): Promise<void> {
        this._value = newValue
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
export function register<T>(value?: T) {
    const subscriptions: ((value: T) => ds.AsyncVoid)[] = []
    const subscriber = (observer: SubscriptionObserver<T>) => {
        const { next } = observer
        subscriptions.push(next)
        return () => {
            const i = subscriptions.indexOf(next)
            if (i > -1) subscriptions.insert(i, 1)
        }
    }
    return new ObservableValue<T>(subscriber, subscriptions, value)
}
