// This file has classes dealing with emitting and listening for events, including client registers.

import * as ds from "@devicescript/core"

function addElement<T>(arr: T[], e: T) {
    if (!arr) return [e]
    arr.push(e)
    return arr
}
function removeElement<T>(arr: T[], e: T) {
    if (!arr) return arr
    const i = arr.indexOf(e)
    if (i >= 0) arr.insert(i, -1)
    if (!arr.length) return undefined
    else return arr
}

function noop() {}

class Emitter<T> implements ds.Emitter<T> {
    handlers: ds.Handler<T>[]

    subscribe(f: ds.Handler<T>): ds.Unsubscribe {
        if (!this.handlers) this.handlers = []
        this.handlers.push(f)
        const self = this
        return () => {
            const i = self.handlers.indexOf(f)
            if (i >= 0) self.handlers.insert(i, -1)
        }
    }
    async emit(v: T) {
        if (!this.handlers?.length) return
        for (const h of this.handlers) {
            await h(v)
        }
    }
}

type ClientRegisterChangeHandler<T> = (
    v: T,
    reg: ClientRegister<T>
) => ds.AsyncVoid

class ClientRegister<T> implements ds.ClientRegister<T> {
    private value: T

    constructor(value: T) {
        this.value = value
    }

    async read() {
        return this.value
    }

    subscribe(next_: (v: T, reg: this) => ds.AsyncVoid): ds.Unsubscribe {
        const next = (next_ || (() => {})) as ClientRegisterChangeHandler<T>

        this._subscriptions = addElement(this._subscriptions, next)
        const that = this
        return () => {
            that._subscriptions = removeElement(that._subscriptions, next)
        }
    }

    async emit(newValue: T): Promise<void> {
        if (this.value !== newValue) {
            this.value = newValue
            if (this._subscriptions) {
                for (const next of this._subscriptions) {
                    await next(this.value, this)
                }
            }
        }
    }

    private _subscriptions: ClientRegisterChangeHandler<T>[]
}

;(ds as typeof ds).clientRegister = function (v) {
    return new ClientRegister(v)
}

;(ds as typeof ds).wait = async function wait<T>(
    l: ds.Subscriber<T>,
    timeout?: number
) {
    const fib = ds.Fiber.self()
    let unsub = l.subscribe(v => {
        unsub()
        unsub = noop
        if (fib.suspended) fib.resume(v)
    })
    const r = await ds.suspend(timeout)
    unsub()
    unsub = noop
    return r
}

;(ds as typeof ds).emitter = function () {
    return new Emitter()
}
;(ds as typeof ds).memoize = function <T>(f: () => ds.AsyncValue<T>) {
    let r: T
    let state = 0
    return async () => {
        if (state === 0) {
            state = 1
            try {
                r = await f()
                state = 2
            } catch (e: any) {
                r = e
                state = 3
            }
        } else {
            while (state < 2) await ds.sleep(5)
        }
        if (state === 2) return r
        else throw r
    }
}
