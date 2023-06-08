import { Control } from "@devicescript/core"

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
 * Sets the status light to the specified color, or brightness if monochrome LED.
 * The color may be overriden by internal DeviceScript status updated.
 * @param color RGB color
 */
export async function setStatusLight(color: number): Promise<void> {
    const ctrl = currentControl()
    const r = (color >> 16) & 0xff
    const g = (color >> 8) & 0xff
    const b = color & 0xff

    await ctrl.setStatusLight(r, g, b, 0)
}

/**
 * Uptime in microseconds (us).
 */
export async function uptime() {
    const ctrl = currentControl()
    return await ctrl.uptime.read()
}

/**
 * Reads the onboard temperature sensor if any.
 * @returns temperature in celcius (°C); undefined if sensor is not available.
 */
export async function mcuTemperature() {
    const ctrl = currentControl()
    return await ctrl.mcuTemperature.read()
}
