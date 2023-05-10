import { AsyncValue, Control, sleep } from "@devicescript/core"

let _ctrl: Control
/**
 * Return the control service for the current device.
 */
export function currentControl(): Control {
    if (!_ctrl) _ctrl = new Control("control[int:0]")
    return _ctrl
}

/**
 * Attempt to put devices into lowest power sleep mode for a specified time, most likely involving a full reset on wake-up.
 * @param duration - ms
 */
export async function standby(millis: number): Promise<void> {
    if (isNaN(millis) || millis < 0) return

    const ctrl = currentControl()
    await ctrl.standby(millis)
}

/**
 * Return a function that will run the argument at most once.
 */
export function memoize<T>(f: () => AsyncValue<T>): () => Promise<T> {
    let r: T
    let state = 0
    return async () => {
        if (state === 0) {
            state = 1
            try {
                r = await f()
                state = 2
            } catch (e: any) {
                r = e
                state = 3
            }
        } else {
            while (state < 2) await sleep(5)
        }
        if (state === 2) return r
        else throw r
    }
}
