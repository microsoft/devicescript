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

class ClientRegister<T> implements ds.ClientRegister<T> {
    private value: T

    constructor(value: T) {
        this.value = value
    }

    async read() {
        return this.value
    }

    subscribe(next: ds.ClientRegisterChangeHandler<T>): ds.Unsubscribe {
        if (!next) return () => {}

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

    private _subscriptions: ds.ClientRegisterChangeHandler<T>[]
}

ds.Role.prototype.binding = function binding() {
    if (!this._binding) {
        this._binding = new ClientRegister<boolean>(false)
    }
    return this._binding
}

ds.Role.prototype.onPacket = async function (pkt: ds.Packet) {
    if (!pkt || pkt.serviceCommand === 0) {
        const conn = this.isConnected
        await this.binding().emit(conn)
        if (conn && this._changeHandlers) {
            const regs = Object.keys(this._changeHandlers)
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
    if (pkt.isReport && pkt.isRegGet && this._changeHandlers) {
        const handlers = this._changeHandlers[pkt.regCode + ""]
        if (handlers) {
            const val = pkt.decode()
            for (const h of handlers) {
                // TODO pass register
                await h(val, null)
            }
        }
    }
    if (pkt.isEvent && this._eventHandlers) {
        const hh = this._eventHandlers[pkt.eventCode + ""]
        // TODO pass event
        if (hh) for (const h of hh) await h(pkt.decode(), null)
    }
}

ds.Register.prototype.subscribe = function subscribe<T>(
    this: ds.Register<T>,
    handler: (v: T, reg: ds.Register<T>) => void
) {
    const role = this.role
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
    let eventHandlers = this.role._eventHandlers
    if (!eventHandlers) {
        eventHandlers = {}
        this.role._eventHandlers = eventHandlers
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

ds.Event.prototype.wait = async function () {
    while (true) {
        const pkt = await this.role.wait()
        if (pkt && pkt.eventCode === this.code) return
    }
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

Array.prototype.map = function (f) {
    const res: any[] = []
    const length = this.length
    for (let i = 0; i < length; ++i) {
        res.push(f(this[i], i, this))
    }
    return res
}

Array.prototype.forEach = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        f(this[i], i, this)
    }
}

Array.prototype.find = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) return this[i]
    }
    return undefined
}

Array.prototype.filter = function (f) {
    const res: any[] = []
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) res.push(this[i])
    }
    return res
}

Array.prototype.every = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (!f(this[i], i, this)) return false
    }
    return true
}

Array.prototype.some = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) return true
    }
    return false
}

Array.prototype.includes = function (el, fromIndex) {
    const length = this.length
    const start = fromIndex || 0
    for (let i = start; i < length; ++i) {
        if (el === this[i]) return true
    }
    return false
}

Array.prototype.pop = function () {
    const length = this.length - 1
    if (length < 0) return undefined
    const r = this[length]
    this.insert(length, -1)
    return r
}

Array.prototype.shift = function () {
    if (this.length === 0) return undefined
    const r = this[0]
    this.insert(0, -1)
    return r
}

Array.prototype.unshift = function (...elts: any[]) {
    this.insert(0, elts.length)
    for (let i = 0; i < elts.length; ++i) this[i] = elts[i]
    return this.length
}

Array.prototype.indexOf = function (elt, from) {
    const length = this.length
    if (from == undefined) from = 0
    while (from < length) {
        if (this[from] === elt) return from
        from++
    }
    return -1
}

Array.prototype.lastIndexOf = function (elt, from) {
    if (from == undefined) from = this.length - 1
    while (from >= 0) {
        if (this[from] === elt) return from
        from--
    }
    return -1
}

Array.prototype.reduce = function (callbackfn: any, initialValue: any) {
    const len = this.length
    for (let i = 0; i < len; ++i) {
        initialValue = callbackfn(initialValue, this[i], i)
    }
    return initialValue
}

declare module "@devicescript/core" {
    interface I2C {
        writeReg(devAddr: number, regAddr: number, byte: number): Promise<void>
        readReg(devAddr: number, regAddr: number): Promise<number>
    }
}

export class I2CError extends Error {}

ds.I2C.prototype.writeReg = async function (devAddr, regAddr, byte) {
    const b = Buffer.alloc(2)
    b[0] = regAddr
    b[1] = byte
    const [status, buffer] = await this.transaction(devAddr, 0, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(`error writing dev=${devAddr} at reg=${regAddr}`)
}

ds.I2C.prototype.readReg = async function (devAddr, regAddr) {
    const b = Buffer.alloc(1)
    b[0] = regAddr
    await this.transaction(devAddr, 1, b)
    const [status, buffer] = await this.transaction(devAddr, 0, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(`error reading dev=${devAddr} at reg=${regAddr}`)
    return buffer[0]
}
