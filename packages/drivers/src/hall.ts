import { PotentiometerVariant } from "@devicescript/core"
import { PotentiometerConfig, startPotentiometer } from "@devicescript/servers"

/**
 * Starts an analog Hall sensor
 * @param cfg configuration
 * @returns Hall sensor client
 * @devsPart Hall sensor
 * @devsServices potentiometer
 */
export function startHallSensor(cfg: PotentiometerConfig) {
    // todo Hall variant
    return startPotentiometer({ ...cfg })
}
