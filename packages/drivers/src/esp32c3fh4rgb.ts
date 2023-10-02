import { pins, board } from "@dsboard/esp32_c3fh4_rgb"
import { Led, LedStripLightType, LedVariant } from "@devicescript/core"
import { startLed } from "@devicescript/drivers"
import { configureHardware } from "@devicescript/servers"

/**
 * Driver for the ESP32-C3FH4-RGB board
 *
 * @devsWhenUsed
 */
export class Esp32C3FH4RGB {
    constructor() {
        configureHardware({
            scanI2C: false,
        })
    }

    /**
     * Gets the pin mappings
     */
    pins() {
        return pins
    }

    private _led: Led
    /**
     * Starts the LED service for the 5x5 matrix
     * @returns
     */
    async startLed(roleName?: string) {
        return (
            this._led ||
            (this._led = await startLed({
                length: 25,
                columns: 5,
                intensity: 0.1,
                variant: LedVariant.Matrix,
                hwConfig: {
                    type: LedStripLightType.WS2812B_GRB,
                    pin: pins.LEDS,
                },
                roleName,
            }))
        )
    }

    /**
     * Start built-in ButtonBOOT
     */
    startButtonBOOT() {
        return board.startButtonBOOT("BOOT")
    }
}
