import "./pins"
import {
    DigitalValue,
    GPIOMode,
    Handler,
    InputPin,
    OutputPin,
    PinBase,
    Unsubscribe,
} from "@devicescript/core"

/**
 * Set pin mode.
 * @param pin
 * @param mode
 */
export function pinMode(pin: PinBase, mode: GPIOMode) {
    pin.setMode(mode)
}

/**
 * Write a HIGH or a LOW value to a digital pin.
 * @param pin
 * @param value HIGH or LOW, 1 or 0, true or false
 * @throws RangeError pin is not an output pin or output mode
 */
export function digitalWrite(
    pin: OutputPin,
    value: DigitalValue | number | boolean
) {
    pin.write(value)
}

/**
 * Reads a digital pin.
 * @param pin
 * @returns HIGH (1) or LOW (0)
 * @throws RangeError pin is not an input pin or intput mode
 */
export function digitalRead(pin: InputPin): DigitalValue {
    return pin.value as DigitalValue
}

/**
 * Subscribe to changes on a digital pin.
 * @param pin
 * @param handler
 * @returns
 */
export function subscribeDigital(
    pin: InputPin,
    handler: Handler<DigitalValue>
): Unsubscribe {
    return pin.subscribe(handler)
}
