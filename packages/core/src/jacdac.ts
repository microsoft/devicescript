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

interface RoleData extends ds.Role {
    _binding: ds.ClientRegister<boolean>
    _changeHandlers: Record<string, ds.Emitter<any>>
    _eventHandlers: Record<string, ds.Emitter<any>>
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
        this._binding?.emit(conn)
        if (conn && changeHandlers) {
            const regs = Object.keys(changeHandlers)
            for (let i = 0; i < regs.length; ++i) {
                const rg = regs[i]
                if (rg === "reading") {
                    const b = Buffer.alloc(1)
                    b[0] = 199
                    await this.sendCommand(0x2003, b)
                } else {
                    // refresh
                    // TODO don't refresh const registers
                    await this.sendCommand(this.spec.lookup(rg).code)
                }
            }
        }
    }
    if (!pkt || !pkt.spec) return

    if (pkt.isReport) {
        this._report?.emit(pkt)

        if (pkt.isRegGet && changeHandlers) {
            const handlers = changeHandlers[pkt.spec.name]
            handlers?.emit(pkt.decode())
        }

        if (pkt.isAction && this._reportHandlers) {
            const key = pkt.spec.name
            const fib = this._reportHandlers[key]
            if (fib) {
                delete this._reportHandlers[key]
                fib.resume(pkt)
            }
        }

        if (pkt.isEvent && this._eventHandlers) {
            const hh = this._eventHandlers[pkt.spec.name]
            hh?.emit(pkt.decode())
        }
    }
}

function subscribe(
    emitterSet: Record<string, ds.Emitter<any>>,
    name: string,
    handler: ds.Handler<any>
) {
    if (!emitterSet[name]) emitterSet[name] = ds.emitter()
    return emitterSet[name].subscribe(handler)
}

ds.Register.prototype.subscribe = function <T>(
    this: ds.Register<T>,
    handler: (v: T) => void
) {
    const role = this.role as RoleData
    if (!role._changeHandlers) role._changeHandlers = {}
    return subscribe(role._changeHandlers, this.name, handler)
}

ds.Event.prototype.subscribe = function <T>(
    this: ds.Event<T>,
    handler: (v: T) => void
) {
    const role = this.role as RoleData
    if (!role._eventHandlers) role._eventHandlers = {}
    return subscribe(role._eventHandlers, this.name, handler)
}

ds.Event.prototype.wait = async function (timeout) {
    return await ds.wait(this, timeout)
}
