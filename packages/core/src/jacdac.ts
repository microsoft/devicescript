// This file has DS-side implementation of generic Jacdac clients

import * as ds from "@devicescript/core"

ds.Role.prototype.binding = function binding(this: RoleData) {
    if (!this._binding) {
        this._binding = ds.clientRegister(false)
    }
    return this._binding
}

ds.Role.prototype.report = function report(this: RoleData) {
    if (!this._report) {
        this._report = ds.emitter<ds.Packet>()
    }
    return this._report
}

type RegisterChangeHandler = (v: any, reg: ds.Register<any>) => ds.AsyncVoid

type EventChangeHandler = (v: any, reg: ds.Event<any>) => ds.AsyncVoid

interface RoleData extends ds.Role {
    _binding: ds.ClientRegister<boolean>
    _changeHandlers: Record<string, RegisterChangeHandler[]>
    _eventHandlers: Record<string, EventChangeHandler[]>
    _reportHandlers: Record<string, ds.Fiber>
    _report: ds.Emitter<ds.Packet>
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
        if (pkt.spec && this._report) await this._report.emit(pkt)

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
    return await ds.wait(this, timeout)
}

