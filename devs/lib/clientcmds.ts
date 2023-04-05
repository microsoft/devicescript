import * as ds from "@devicescript/core"

declare var ds_impl: typeof ds

declare module "@devicescript/core" {
    /**
     * Wait for specified number of milliseconds.
     * @alias sleep
     */
    function delay(ms: number): Promise<void>
}

ds_impl.delay = ds.sleep

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

async function sendCommand(cmdpkt: ds.Packet) {
    await cmdpkt.role.sendCommand(cmdpkt.serviceCommand, cmdpkt.payload)
}

ds.Role.prototype._commandResponse = async function (
    this: RoleData,
    cmdpkt,
    fiber
) {
    if (!this._reportHandlers) this._reportHandlers = {}
    this._reportHandlers[cmdpkt.serviceCommand + ""] = fiber
    // note that cmdpkt has messed up deviceIdentifier etc; only role, serviceCommand and payload are reliable
    sendCommand.start(cmdpkt) // start it background, so we don't get a race with ds.suspend() below
    const res = await ds.suspend<ds.Packet>(500)
    if (res === undefined) throw new Error(`command ${cmdpkt} timeout`)
    return res.decode()
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

ds.Event.prototype.wait = async function (timeout) {
    const fib = ds.Fiber.self()
    const unsub = this.subscribe(v => {
        unsub()
        fib.resume(v)
    })
    return await ds.suspend(timeout)
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
        /**
         * Write a byte to a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @param byte the value to write
         * @throws I2CError
         */
        writeReg(devAddr: number, regAddr: number, byte: number): Promise<void>
        /**
         * read a byte from a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @returns a byte
         * @throws I2CError
         */
        readReg(devAddr: number, regAddr: number): Promise<number>
        /**
         * write a buffer to a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @param b a byte buffer
         * @throws I2CError
         */
        writeRegBuf(devAddr: number, regAddr: number, b: Buffer): Promise<void>
        /**
         * read a buffer from a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @param size the number of bytes to request
         * @returns a byte buffer
         * @throws I2CError
         */
        readRegBuf(
            devAddr: number,
            regAddr: number,
            size: number
        ): Promise<Buffer>
        /**
         * read a raw buffer
         * @param devAddr a 7 bit i2c address
         * @param size the number of bytes to request
         * @returns a byte buffer
         * @throws I2CError
         */
        readBuf(devAddr: number, size: number): Promise<Buffer>
        /**
         * write a raw buffer
         * @param devAddr a 7 bit i2c address
         * @param b a byte buffer
         * @throws I2CError
         */
        writeBuf(devAddr: number, b: Buffer): Promise<void>
    }
}

export class I2CError extends Error {
    readonly status: ds.I2CStatus
    constructor(message: string, status: ds.I2CStatus) {
        super(message)
        this.name = "I2CError"
        this.status = status
    }
}

ds.I2C.prototype.writeReg = async function (devAddr, regAddr, byte) {
    const b = Buffer.alloc(2)
    b[0] = regAddr
    b[1] = byte
    const [status, buffer] = await this.transaction(devAddr, 0, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error writing dev=${devAddr} at reg=${regAddr}`,
            status
        )
}

ds.I2C.prototype.readReg = async function (devAddr, regAddr) {
    const b = Buffer.alloc(1)
    b[0] = regAddr
    const [status, buffer] = await this.transaction(devAddr, 1, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error reading dev=${devAddr} at reg=${regAddr}`,
            status
        )
    return buffer[0]
}

ds.I2C.prototype.writeRegBuf = async function (devAddr, regAddr, b) {
    const nb = Buffer.alloc(1 + b.length)
    nb[0] = regAddr
    nb.blitAt(1, b, 0, b.length)
    const [status, buffer] = await this.transaction(devAddr, 0, nb)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error writing dev=${devAddr} at reg=${regAddr}`,
            status
        )
}

ds.I2C.prototype.readRegBuf = async function (devAddr, regAddr, size) {
    const b = Buffer.alloc(1)
    b[0] = regAddr
    const [status, buffer] = await this.transaction(devAddr, size, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error reading dev=${devAddr} at reg=${regAddr}`,
            status
        )
    return buffer
}

ds.I2C.prototype.readBuf = async function (devAddr, size) {
    const [status, buffer] = await this.transaction(
        devAddr,
        size,
        Buffer.alloc(0)
    )
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(`error reading buffer dev=${devAddr}`, status)
    return buffer
}

ds.I2C.prototype.writeBuf = async function (devAddr, b) {
    const [status, buffer] = await this.transaction(devAddr, 0, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error writing buffer ${b} to dev=${devAddr}`,
            status
        )
}
