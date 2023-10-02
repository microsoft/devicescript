import { pins, board } from "@dsboard/waveshare_pico_matrix"
import { Led, LedStripLightType, LedVariant } from "@devicescript/core"
import { startLed } from "@devicescript/drivers"
import { configureHardware } from "@devicescript/servers"
import { startLedDisplay } from "@devicescript/runtime"
import { font5 } from "@devicescript/graphics"

/**
 * Driver for the WaveShare RP2040 Matrix board
 *
 * @devsWhenUsed
 */
export class WaveShareRP2040Matrix {
    constructor() {
        configureHardware({
            scanI2C: false
        })
    }

    /**
     * Gets the pin mappings
     */
    pins() {
        return pins
    }

    /**
     * Starts the LED service for the 5x5 matrix
     * @returns
     */
    async startLed() {
        return await startLed({
            length: 25,
            columns: 5,
            intensity: 0.2,
            variant: LedVariant.Matrix,
            hwConfig: {
                type: LedStripLightType.WS2812B_GRB,
                pin: pins.LEDS,
            },
            roleName: "LEDS",
        })
    }
}

const b = new WaveShareRP2040Matrix()
const leds = await b.startLed()
const pixels = await leds.buffer()
const display = await startLedDisplay(leds)
const font = font5()
display.image.print("0", 0, 0, 3, font)
await display.show()
