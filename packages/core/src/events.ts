// This file has classes dealing with emitting and listening for events, including client registers.

import * as ds from "@devicescript/core"

function noop() {}

type Fn<T> = (v: T) => void

enum Wrapper {
    Idle = 0,
    StartPending = 1,
    Running = 2,
}

function handlerWrapper<T>(handler: ds.Handler<T>) {
    let state = Wrapper.Idle
    let value: T

    async function emit() {
        try {
            while (state === Wrapper.StartPending) {
                state = Wrapper.Running
                await handler(value)
            }
        } finally {
            state = Wrapper.Idle
        }
    }

    return (v: T) => {
        value = v
        if (state === Wrapper.Idle) emit.start()
        state = Wrapper.StartPending
    }
}

// TODO move to C?
class Emitter<T> implements ds.Emitter<T> {
    handlers: Fn<T>[]

    subscribe(f: ds.Handler<T>): ds.Unsubscribe {
        if (!this.handlers) this.handlers = []
        const h = handlerWrapper(f)
        this.handlers.push(h)
        const self = this
        return () => {
            const i = self.handlers.indexOf(h)
            if (i >= 0) self.handlers.insert(i, -1)
        }
    }
    emit(v: T) {
        if (!this.handlers?.length) return
        for (const h of this.handlers) h(v)
    }
}

class ClientRegister<T> implements ds.ClientRegister<T> {
    private value: T
    private emitter: ds.Emitter<T>

    constructor(value: T) {
        this.value = value
    }

    async read() {
        return this.value
    }

    subscribe(handler: ds.Handler<T>): ds.Unsubscribe {
        if (!this.emitter) this.emitter = ds.emitter()
        return this.emitter.subscribe(handler)
    }

    emit(newValue: T) {
        this.value = newValue
        this.emitter?.emit(this.value)
    }
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
