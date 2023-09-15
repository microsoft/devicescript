import { startGamepad } from "@devicescript/servers"
import { spi } from "@devicescript/spi"
import { pins } from "@dsboard/pico_w"
import * as ds from "@devicescript/core"
import { ST7789Driver } from "@devicescript/drivers"
import { Image } from "@devicescript/graphics"

/**
 * Driver for WaveShare Pico-LCD-1.14 inch.
 *
 * @see https://www.waveshare.com/pico-lcd-1.14.htm
 * @devsPart WaveShare Pico LCD114 for Raspberry Pi Pico
 * @devsWhenUsed only start services which are used!
 */
export class WaveSharePicoLCD114 {
    constructor() {}

    startGamepad() {
        return startGamepad({
            pinA: pins.GP15,
            pinB: pins.GP17,
            pinDown: pins.GP18,
            pinLeft: pins.GP16,
            pinSelect: pins.GP3, // middle
            pinRight: pins.GP20,
            pinUp: pins.GP2,
        })
    }

    async startDisplay() {
        spi.configure({
            mosi: pins.GP11,
            sck: pins.GP10,
            hz: 8_000_000,
        })

        pins.GP13.setMode(ds.GPIOMode.OutputHigh) // BL

        const d = new ST7789Driver(Image.alloc(240, 136, 4), {
            dc: pins.GP8,
            cs: pins.GP9,
            reset: pins.GP12,
            // frmctr1: 0x0e_14_ff,
            flip: false,
            spi: spi,
            offX: 40,
            offY: 53,
        })
        await d.init()
        return d
    }
}
