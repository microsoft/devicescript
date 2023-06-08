import { AsyncVoid } from "@devicescript/core"

/**
 * Schedules a handler to be called at a later time. Executes timeout before interval if combined.
 *
 * @param handler function to execute
 * @param options options to configure the scheduling
 * @returns clear timer function
 */
export function schedule(
    handler: () => AsyncVoid,
    options: {
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

    let { interval, timeout } = options
    if (interval === undefined && timeout === undefined) timeout = 20
    if (timeout >= 0 && interval >= 0) {
        timerId = setTimeout(async () => {
            await handler()
            // check if cancelled or schedule
            if (timerId !== undefined)
                intervalId = setInterval(handler, interval)
        }, 20)
    } else if (timeout) {
        timerId = setTimeout(handler, timeout)
    } else if (interval) {
        intervalId = setInterval(handler, interval)
    }
    return unsub
}
