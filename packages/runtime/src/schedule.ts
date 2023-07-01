import { AsyncVoid, millis } from "@devicescript/core"

/**
 * Schedules a handler to be called at a later time. Executes timeout before interval if combined.
 * If not specified, default to timeout 20ms and interval 60s.
 *
 * @param handler function to execute
 * @param options options to configure the scheduling
 * @returns clear timer function
 */
export function schedule(
    handler: (props: {
        /**
         * Number of times the handler has been called.
         */
        counter: number
        /**
         * Time in milliseconds since the first execution of the handler.
         */
        elapsed: number
        /**
         * Time in milliseconds since the last execution of the handler.
         */
        delta: number
    }) => AsyncVoid,
    options?: {
        /**
         * Time in milliseconds to wait before the first execution of the handler.
         */
        timeout?: number
        /**
         * Time in milliseconds to wait before executing the handler in an internval.
         */
        interval?: number
    }
) {
    let timerId: number
    let intervalId: number
    const unsub = () => {
        if (timerId) clearTimeout(timerId)
        if (intervalId) clearInterval(intervalId)
        timerId = intervalId = undefined
    }

    if (!handler) return unsub

    let start = millis()
    let last = millis()
    let counter = 0

    const run = async () => {
        const now = millis()
        const props = {
            counter: counter++,
            elapsed: now - start,
            delta: now - last,
        }
        last = now
        await handler(props)
    }

    let { interval, timeout } = options || {}
    if (interval === undefined && timeout === undefined) {
        timeout = 20
        interval = 60000
    }
    if (timeout >= 0 && interval >= 0) {
        timerId = setTimeout(async () => {
            await run()
            // check if cancelled or schedule
            if (timerId !== undefined) intervalId = setInterval(run, interval)
        }, 20)
    } else if (timeout) {
        timerId = setTimeout(run, timeout)
    } else if (interval) {
        intervalId = setInterval(run, interval)
    }
    return unsub
}
