import * as ds from "@devicescript/core"
import { Control } from "@devicescript/core"

let _ctrl: ds.Control
/**
 * Return the control service for the current device.
 */
export function currentControl(): Control {
    if (!_ctrl) _ctrl = new ds.Control("control[int:0]")
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
