import * as ds from "@devicescript/core"

interface WorkItem {
    when: number
    callback: () => Promise<void>
}

/**
 * A SequentialWorker executes queued tasks sequentially, without interleaving,
 * in given order (modulo specified delays).
 */
export class SequentialWorker {
    private timeouts: WorkItem[]
    private timeoutWorkerId: ds.Fiber

    /**
     * Queue a task to be executed.
     */
    queue(callback: () => Promise<void>, delay = 0) {
        if (!delay || delay < 0) delay = 0
        const when = ds.millis() + delay
        const t: WorkItem = {
            when,
            callback,
        }

        if (!this.timeouts) {
            this.timeouts = [t]
            this.timeoutWorkerId = this.timeoutWorker.start()
            return
        }

        for (let i = 0; i < this.timeouts.length + 1; ++i) {
            if (i === this.timeouts.length || t.when < this.timeouts[i].when) {
                this.timeouts.insert(i, 1)
                this.timeouts[i] = t
                // if we're inserting at the head, wake the worker
                if (i === 0 && this.timeoutWorkerId.suspended)
                    this.timeoutWorkerId.resume(null)
                return
            }
        }

        ds.assert(false)
    }

    private async timeoutWorker() {
        while (this.timeouts[0]) {
            let n = ds.millis()
            const d = this.timeouts[0].when - n
            if (d > 0) {
                await ds.suspend(d)
                n = ds.millis()
            }
            while (this.timeouts.length > 0 && this.timeouts[0].when <= n) {
                const t = this.timeouts.shift()
                await t.callback()
                n = ds.millis()
            }
        }
        // we're about to exit, clean up
        this.timeouts = null
        this.timeoutWorkerId = null
    }
}
