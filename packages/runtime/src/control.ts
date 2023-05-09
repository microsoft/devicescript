import * as ds from "@devicescript/core"

/**
 * Argument: duration ms uint32_t. Attempt to put devices into lowest power sleep mode for a specified time - most likely involving a full reset on wake-up.
 * @param duration - ms
 */
export async function standby(millis: number): Promise<void> {
    if (isNaN(millis) || millis < 0) return

    const ctrl = ds.intControl()
    await ctrl.standby(millis)
}
