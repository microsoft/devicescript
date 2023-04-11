import * as ds from "@devicescript/core"

interface Timeout {
    id: number
    when: number
    callback: ds.Callback
    period?: number
}

let timeouts: Timeout[]
let timeoutId: number
let timeoutWorkerId: ds.Fiber

function insertTimeout(t: Timeout) {
    for (let i = 0; i < timeouts.length + 1; ++i) {
        if (i === timeouts.length || t.when < timeouts[i].when) {
            timeouts.insert(i, 1)
            timeouts[i] = t
            // if we're inserting at the head, wake the worker
            if (i === 0 && timeoutWorkerId.suspended)
                timeoutWorkerId.resume(null)
            return
        }
    }
}

async function timeoutWorker() {
    while (true) {
        let n = ds.millis()
        let d = 10000
        if (timeouts[0]) d = timeouts[0].when - n
        if (d > 0) {
            await ds.suspend(d)
            //
            // If you halted the program and ended up here, it may be difficult to step in.
            // Best to set breakpoints elsewhere.
            //
            n = ds.millis()
        }
        while (timeouts.length > 0 && timeouts[0].when <= n) {
            const t = timeouts.shift()
            if (t.period < 0) {
                // the timer is late
                t.when = Infinity
                timeouts.push(t)
                continue
            }
            t.callback.start()
            if (t.period !== undefined) {
                t.when = Math.max(n + 1, t.when + t.period)
                t.period = -t.period
                insertTimeout(t)
            }
        }
    }
}

function addTimeout(cb: ds.Callback, ms: number): Timeout {
    if (!timeouts) {
        timeouts = []
        timeoutId = 1
        timeoutWorkerId = timeoutWorker.start()
    }
    if (!ms || ms < 1) ms = 1
    const when = ds.millis() + ms
    const t: Timeout = {
        id: timeoutId++,
        when,
        callback: cb,
    }
    insertTimeout(t)
    return t
}

function _clearTimeout(id: number) {
    if (!timeouts || !id) return false
    for (let i = 0; i < timeouts.length; ++i) {
        if (timeouts[i].id === id) {
            timeouts.insert(i, -1)
            return true
        }
    }
    return false
}

;(ds as typeof ds).setInterval = function (cb, ms) {
    const t = addTimeout(cb2, ms)
    t.period = t.when - ds.millis()
    return t.id

    async function cb2() {
        while (true) {
            await cb()
            ds.assert(t.period < 0)
            if (t.when === Infinity) {
                // expired
                if (_clearTimeout(t.id)) {
                    t.when = ds.millis() - t.period
                    insertTimeout(t)
                }
            } else {
                // indicate we're done
                t.period = -t.period
                break
            }
        }
    }
}
;(ds as typeof ds).updateInterval = function (id, ms) {
    if (!timeouts || !id) return
    for (let i = 0; i < timeouts.length; ++i) {
        const t = timeouts[i]
        if (t.id === id && t.period !== undefined) {
            const d = ms - Math.abs(t.period)
            if (d === 0) return // nothing to change
            _clearTimeout(t.id)
            t.period = Math.sign(t.period) * ms
            t.when += d
            insertTimeout(t)
            break
        }
    }
}
;(ds as typeof ds).setTimeout = function (cb, ms) {
    return addTimeout(cb, ms).id
}
;(ds as typeof ds).clearTimeout = _clearTimeout
;(ds as typeof ds).clearInterval = _clearTimeout
