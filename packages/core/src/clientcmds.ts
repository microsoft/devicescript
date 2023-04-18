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

ds.Buzzer.prototype.playNote = async function (frequency, volume, duration) {
    const p = 1000000 / frequency
    volume = Math.clamp(0, volume, 1)
    await this.playTone(p, p * volume * 0.5, duration)
}

declare module "@devicescript/core" {
    interface Led {
        setAll(r: number, g: number, b: number): void
    }
}

ds.Led.prototype.setAll = async function (r, g, b) {
    const buflen = (await this.numPixels.read()) * 3
    const buf = Buffer.alloc(buflen)
    let idx = 0
    while (idx < buflen) {
        buf.setAt(idx, "u0.8", r)
        buf.setAt(idx + 1, "u0.8", g)
        buf.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    await this.pixels.write(buf)
}

declare module "@devicescript/core" {
    interface LightBulb {
        /**
         * Toggle light between off and full brightness
         * @param lowerThreshold if specified, the light will be turned off if the current brightness is above this threshold
         */
        toggle(lowerThreshold?: number): Promise<void>
    }
}

ds.LightBulb.prototype.toggle = async function (lowerThreshold?: number) {
    const value = await this.brightness.read()
    const on = value > (lowerThreshold || 0)
    await this.brightness.write(on ? 0 : 1)
}

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

ds.Role.prototype.binding = function binding(this: RoleData) {
    if (!this._binding) {
        this._binding = new ClientRegister<boolean>(false)
    }
    return this._binding
}

type RegisterChangeHandler = (v: any, reg: ds.Register<any>) => ds.AsyncVoid

type EventChangeHandler = (v: any, reg: ds.Event<any>) => ds.AsyncVoid

type ClientRegisterChangeHandler<T> = (
    v: T,
    reg: ClientRegister<T>
) => ds.AsyncVoid

interface RoleData extends ds.Role {
    /**
     * @internal
     * @deprecated internal field for runtime support
     */
    _binding: ClientRegister<boolean>

    /**
     * @internal
     * @deprecated internal field for runtime support
     */
    _changeHandlers: Record<string, RegisterChangeHandler[]>

    /**
     * @internal
     * @deprecated internal field for runtime support
     */
    _eventHandlers: Record<string, EventChangeHandler[]>

    /**
     * @internal
     * @deprecated internal field for runtime support
     */
    _reportHandlers: Record<string, ds.Fiber>
}

ds.Role.prototype._onPacket = async function (this: RoleData, pkt: ds.Packet) {
    //
    // If you halted the program and ended up here, it may be difficult to step in.
    // Best to set breakpoints elsewhere.
    //
    const changeHandlers = this._changeHandlers
    if (!pkt || pkt.serviceCommand === 0) {
        const conn = this.isBound
        await this.binding().emit(conn)
        if (conn && changeHandlers) {
            const regs = Object.keys(changeHandlers)
            for (let i = 0; i < regs.length; ++i) {
                const rg = parseInt(regs[i])
                if (rg === 0x0101) {
                    const b = Buffer.alloc(1)
                    b[0] = 199
                    await this.sendCommand(0x2003, b)
                } else {
                    await this.sendCommand(0x1000 | rg)
                }
            }
        }
    }
    if (!pkt) return

    if (pkt.isReport) {
        if (pkt.isRegGet && changeHandlers) {
            const handlers = changeHandlers[pkt.regCode + ""]
            if (handlers) {
                const val = pkt.decode()
                for (const h of handlers) {
                    // TODO pass register
                    await h(val, null)
                }
            }
        }

        if (pkt.isAction && this._reportHandlers) {
            const key = pkt.serviceCommand + ""
            const fib = this._reportHandlers[key]
            if (fib) {
                delete this._reportHandlers[key]
                fib.resume(pkt)
            }
        }

        if (pkt.isEvent && this._eventHandlers) {
            const hh = this._eventHandlers[pkt.eventCode + ""]
            // TODO pass event
            if (hh) for (const h of hh) await h(pkt.decode(), null)
        }
    }
}

ds.Register.prototype.subscribe = function subscribe<T>(
    this: ds.Register<T>,
    handler: (v: T, reg: ds.Register<T>) => void
) {
    const role = this.role as RoleData
    if (!role._changeHandlers) role._changeHandlers = {}
    const key = this.code + ""
    let handlers = role._changeHandlers[key]
    if (!handlers) {
        handlers = []
        role._changeHandlers[key] = handlers
    }
    handlers.push(handler)
    return () => {
        const idx = handlers.indexOf(handler)
        if (idx >= 0) {
            handlers.insert(idx, -1)
            if (!handlers.length) delete role._changeHandlers[key]
        }
    }
}

ds.Event.prototype.subscribe = function subscribe<T>(
    this: ds.Event<T>,
    handler: (v: T, reg: ds.Event<T>) => void
) {
    const role = this.role as RoleData
    let eventHandlers = role._eventHandlers
    if (!eventHandlers) {
        eventHandlers = {}
        role._eventHandlers = eventHandlers
    }
    const k = this.code + ""
    let handlers = eventHandlers[k]
    if (!handlers) {
        handlers = []
        eventHandlers[k] = handlers
    }
    handlers.push(handler)
    return () => {
        const idx = handlers.indexOf(handler)
        if (idx >= 0) {
            handlers.insert(idx, -1)
            if (!handlers.length) delete eventHandlers[k]
        }
    }
}

function noop() {}

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

ds.Event.prototype.wait = async function (timeout) {
    return await ds.wait(this, timeout)
}

ds.Button.prototype.pressed = function pressed() {
    let reg: ClientRegister<boolean> = (this as any).__pressed
    if (!reg) {
        reg = new ClientRegister<boolean>(false)
        ;(this as any).__pressed = reg
        this.down.subscribe(async () => await reg.emit(true))
        this.hold.subscribe(async () => await reg.emit(true))
        this.up.subscribe(async () => await reg.emit(false))
    }
    return reg
}

ds.MagneticFieldLevel.prototype.detected = function pressed() {
    let reg: ClientRegister<boolean> = (this as any).__detected
    if (!reg) {
        reg = new ClientRegister<boolean>(false)
        ;(this as any).__detected = reg
        this.active.subscribe(async () => await reg.emit(true))
        this.inactive.subscribe(async () => await reg.emit(false))
    }
    return reg
}
