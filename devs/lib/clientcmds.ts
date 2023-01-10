import * as ds from "@devicescript/core"

ds.Buzzer.prototype.playNote = function (frequency, volume, duration) {
    const p = 1000000 / frequency
    volume = Math.clamp(0, volume, 1)
    this.playTone(p, p * volume * 0.5, duration)
}

declare module "@devicescript/core" {
    interface Led {
        setAll(r: number, g: number, b: number): void
    }
}

ds.Led.prototype.setAll = function (r, g, b) {
    const buflen = this.numPixels.read() * 3
    const buf = Buffer.alloc(buflen)
    let idx = 0
    while (idx < buflen) {
        buf.setAt(idx, "u0.8", r)
        buf.setAt(idx + 1, "u0.8", g)
        buf.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    this.pixels.write(buf)
}

interface ChangeHandler {
    handler: (v: any) => void
    threshold?: number
    prev?: any
}

function callHandlers(hh: ds.Handler[]) {
    if (hh) for (const h of hh) h()
}

function roleOnPacket(this: ds.Role, pkt: ds.Packet) {
    if (!pkt || pkt.serviceCommand == 0) {
        const conn = this.isConnected
        if (this._connHandlers || this._disconHandlers) {
            if (conn != this._wasConnected) {
                this._wasConnected = conn
                if (conn) callHandlers(this._connHandlers)
                else callHandlers(this._disconHandlers)
            }
        }
        if (conn && this._changeHandlers) {
            const regs = Object.keys(this._changeHandlers)
            for (let i = 0; i < regs.length; ++i) {
                const rg = parseInt(regs[i])
                if (rg == 0x0101) {
                    const b = Buffer.alloc(1)
                    b[0] = 199
                    this.sendCommand(0x2003, b)
                } else {
                    this.sendCommand(0x1000 | rg)
                }
            }
        }
    }
    if (!pkt) return
    if (pkt.isReport && pkt.isRegGet && this._changeHandlers) {
        const handlers: ChangeHandler[] = this._changeHandlers[pkt.regCode + ""]
        if (handlers) {
            const val = pkt.decode()
            for (const h of handlers) {
                if (typeof val == "number" && h.threshold != null) {
                    if (h.prev != null && Math.abs(val - h.prev) < h.threshold)
                        continue
                    h.prev = val
                }
                if (typeof val == "boolean") {
                    if (val === h.prev) continue
                    h.prev = val
                }
                h.handler(val)
            }
        }
    }
    if (pkt.isEvent && this._eventHandlers) {
        const hh = this._eventHandlers[pkt.eventCode + ""]
        if (hh) for (const h of hh) h(pkt)
    }
}

function addElement<T>(arr: T[], e: T) {
    if (!arr) return [e]
    arr.push(e)
    return arr
}

ds.Role.prototype.onConnected = function onConnected(
    this: ds.Role,
    h: ds.Handler
) {
    this.onPacket = roleOnPacket
    this._connHandlers = addElement(this._connHandlers, h)
}
ds.Role.prototype.onDisconnected = function onConnected(
    this: ds.Role,
    h: ds.Handler
) {
    this.onPacket = roleOnPacket
    this._disconHandlers = addElement(this._disconHandlers, h)
}

ds.RegisterNumber.prototype.onChange = function onChange(
    this: ds.Register,
    threshold: number,
    handler: (v: any) => void
) {
    if (!handler && typeof threshold == "function") {
        handler = threshold
        threshold = undefined
    }

    const role = this.role
    if (!role._changeHandlers) {
        role._changeHandlers = {}
        role.onPacket = roleOnPacket
    }
    const key = this.code + ""
    let lst: ChangeHandler[] = role._changeHandlers[key]
    if (!lst) {
        lst = []
        role._changeHandlers[key] = lst
    }
    const obj: ChangeHandler = { handler }
    if (threshold != null) obj.threshold = threshold
    lst[lst.length] = obj
}

function handleCloudCommand(pkt: ds.Packet) {
    const [seqNo, cmd, ...vals] = pkt.decode()
    const cloud = pkt.role as ds.CloudAdapter
    const h = cloud._cloudHandlers[cmd]
    if (h) {
        const r = h(...vals)
        cloud.ackCloudCommand(seqNo, ds.CloudAdapterCommandStatus.OK, ...r)
    } else {
        // TODO Busy? store fiber ref and possibly kill?
        cloud.ackCloudCommand(seqNo, ds.CloudAdapterCommandStatus.NotFound)
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

ds.Event.prototype.subscribe = function (handler) {
    let m = this.role._eventHandlers
    if (!m) {
        m = {}
        this.role._eventHandlers = m
        this.role.onPacket = roleOnPacket
    }
    const k = this.code + ""
    if (!m[k]) m[k] = []
    m[k].push(handler)
}

ds.Event.prototype.wait = function () {
    while (true) {
        const pkt = this.role.wait()
        if (pkt && pkt.eventCode == this.code) return
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
