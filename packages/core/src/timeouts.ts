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
            t.callback.start()
            if (t.period !== undefined) {
                t.when = Math.max(n + 1, t.when + t.period)
                for (let i = 0; i < timeouts.length + 1; ++i) {
                    if (i === timeouts.length || t.when < timeouts[i].when) {
                        timeouts.insert(i, 1)
                        timeouts[i] = t
                        break
                    }
                }
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
    const r: Timeout = {
        id: timeoutId++,
        when,
        callback: cb,
    }
    for (let i = 0; i <= timeouts.length; i++) {
        if (i === timeouts.length || timeouts[i].when > when) {
            timeouts.insert(i, 1)
            timeouts[i] = r
            // if we're inserting at the head, wake the worker
            if (i === 0 && timeoutWorkerId.suspended)
                timeoutWorkerId.resume(null)
            return r
        }
    }
    throw new Error()
}

;(ds as typeof ds).setInterval = function (cb, ms) {
    const t = addTimeout(cb, ms)
    t.period = t.when - ds.millis()
    return t.id
}
;(ds as typeof ds).setTimeout = function (cb, ms) {
    return addTimeout(cb, ms).id
}

function _clearTimeout(id: number) {
    if (!timeouts || !id) return
    for (let i = 0; i < timeouts.length; ++i) {
        if (timeouts[i].id === id) {
            timeouts.insert(i, -1)
            return
        }
    }
}

;(ds as typeof ds).clearTimeout = _clearTimeout
;(ds as typeof ds).clearInterval = _clearTimeout
