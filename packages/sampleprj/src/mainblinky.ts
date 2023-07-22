/**
 * @file Blinks the status light using setInterval
 *
 * @remarks
 *
 * `setStatusLight` is a generic API to control the on-board status LED of a device.
 * It can be used to provide visual feedback about the state of a program.
 * Just remember that DeviceScript may also use the status light to inform about states
 * of the device.
 */
import { delay } from "@devicescript/core"
import { setStatusLight } from "@devicescript/runtime"

setInterval(async () => {
    // turn off
    await setStatusLight(0)
    await delay(1000)
    // turn on
    await setStatusLight(0x0f0f0f)
    await delay(1000)
}, 10)
