import * as ds from "@devicescript/core"

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

async function callHandlers(hh: ds.Callback[]) {
    if (hh) for (const h of hh) await h()
}

ds.Role.prototype.onPacket = async function (pkt: ds.Packet) {
    if (!pkt || pkt.serviceCommand === 0) {
        const conn = this.isConnected
        if (this._connHandlers || this._disconHandlers) {
            if (conn !== this._wasConnected) {
                this._wasConnected = conn
                if (conn) await callHandlers(this._connHandlers)
                else await callHandlers(this._disconHandlers)
            }
        }
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

function addElement<T>(arr: T[], e: T) {
    if (!arr) return [e]
    arr.push(e)
    return arr
}

ds.Role.prototype.onConnected = function onConnected(
    this: ds.Role,
    h: ds.Callback
) {
    this._connHandlers = addElement(this._connHandlers, h)
}
ds.Role.prototype.onDisconnected = function onConnected(
    this: ds.Role,
    h: ds.Callback
) {
    this._disconHandlers = addElement(this._disconHandlers, h)
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

/* TODO: redo cloud
async function handleCloudCommand(pkt: ds.Packet) {
    const [seqNo, cmd, ...vals] = pkt.decode()
    const cloud = pkt.role as ds.CloudAdapter
    const h = cloud._cloudHandlers[cmd]
    if (h) {
        const r = await h(...vals)
        await cloud.ackCloudCommand(
            seqNo,
            ds.CloudAdapterCommandStatus.OK,
            ...r
        )
    } else {
        // TODO Busy? store fiber ref and possibly kill?
        await cloud.ackCloudCommand(
            seqNo,
            ds.CloudAdapterCommandStatus.NotFound
        )
    }
}

ds.CloudAdapter.prototype.onMethod = function onMethod(
    this: ds.CloudAdapter,
    name,
    handler
) {
    if (!this._cloudHandlers) {
        this.cloudCommand.subscribe(handleCloudCommand)
        this._cloudHandlers = {}
    }
    this._cloudHandlers[name] = handler
}
*/
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

Array.prototype.reduce = function (callbackfn: any, initialValue: any) {
    const len = this.length
    for (let i = 0; i < len; ++i) {
        initialValue = callbackfn(initialValue, this[i], i)
    }
    return initialValue
}
