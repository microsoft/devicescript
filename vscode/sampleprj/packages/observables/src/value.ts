import * as ds from "@devicescript/core"
import { Observable } from "./observable"

/**
 * An observable client-side register
 */
export class ObservableValue<T> extends Observable<T> {
    private _value: T
    private _subscriptions: ((value: T) => ds.AsyncVoid)[] = []

    constructor(value: T) {
        super(async observer => {
            const { next } = observer
            this._subscriptions.push(next)
            return () => {
                const i = this._subscriptions.indexOf(next)
                if (i > -1) this._subscriptions.insert(i, 1)
            }
        })
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
    return new ObservableValue<T>(value)
}
