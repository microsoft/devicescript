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
    let idx = 0
    ds.packet.setLength(buflen)
    while (idx < buflen) {
        ds.packet.setAt(idx, "u0.8", r)
        ds.packet.setAt(idx + 1, "u0.8", g)
        ds.packet.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    this.pixels.write(ds.packet)
}

interface ChangeHandler {
    handler: (v: any) => void
    threshold?: number // TODO add logic
}

function callHandlers(h: ds.Handler[]) {
    if (!h) return
    for (let i = 0; i < h.length; ++i) h()
}

function roleOnPacket(this: ds.Role, pkt: ds.Packet) {
    if (!pkt || pkt.serviceCommand == 0) {
        if (this._connHandlers || this._disconHandlers) {
            const conn = this.isConnected
            if (conn != this._wasConnected) {
                this._wasConnected = conn
                if (conn) callHandlers(this._connHandlers)
                else callHandlers(this._disconHandlers)
            }
        }
    }
    if (!pkt) return
    if (pkt.isReport && pkt.isRegGet && this._changeHandlers) {
        const handlers: ChangeHandler[] = this._changeHandlers[pkt.regCode + ""]
        if (handlers) {
            const val = pkt.decode()
            for (let i = 0; i < handlers.length; ++i) {
                handlers[i].handler(val)
            }
        }
    }
}

function addElement<T>(arr: T[], e: T) {
    if (!arr) return [e]
    arr.push(e)
    return arr
}

;(ds.Role.prototype as any).onConnected = function onConnected(
    this: ds.Role,
    h: ds.Handler
) {
    this.onPacket = roleOnPacket
    this._connHandlers = addElement(this._connHandlers, h)
}
;(ds.Role.prototype as any).onDisconnected = function onConnected(
    this: ds.Role,
    h: ds.Handler
) {
    this.onPacket = roleOnPacket
    this._disconHandlers = addElement(this._disconHandlers, h)
}
;(ds.Register.prototype as any).onChange = function onChange(
    this: ds.Register,
    threshold: number,
    handler: (v: any) => void
) {
    if (!handler && typeof threshold == "function") {
        handler = threshold
        threshold = undefined
    }

    const role = this.role
    role.onPacket = roleOnPacket
    if (!role._changeHandlers) role._changeHandlers = {}
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

Array.prototype.push = function push<T>(this: T[], item: T) {
    this[this.length] = item
    return this.length
}
