import { UC8151Driver } from "@devicescript/drivers"
import { Image } from "@devicescript/graphics"
import {
    configureHardware,
    startGamepad,
    startLightBulb,
} from "@devicescript/servers"
import { spi } from "@devicescript/spi"
import { pins } from "@dsboard/pico_w"

/**
 * Support for Badger 2040 W (Pico W Aboard)
 *
 * @url https://shop.pimoroni.com/products/badger-2040-w
 * @devsPart Pimoroni Pico Badger
 * @devsWhenUsed
 */
export class PimoroniBadger2040W {
    // PCF85063A I2C:0x51, RTC-ALARM on GP8
    constructor() {
        configureHardware({
            i2c: {
                pinSDA: pins.GP4,
                pinSCL: pins.GP5,
            },
            log: {
                pinTX: pins.GP0,
            },
        })
    }

    startGamepad() {
        return startGamepad({
            activeHigh: true,
            pinA: pins.GP12,
            pinB: pins.GP13,
            pinDown: pins.GP11,
            pinX: pins.GP14, // C
            pinUp: pins.GP15,
        })
    }

    startLED() {
        return startLightBulb({
            pin: pins.GP22,
            dimmable: true,
        })
    }

    async startDisplay() {
        spi.configure({
            miso: pins.GP16,
            mosi: pins.GP19,
            sck: pins.GP18,
            hz: 8_000_000,
        })

        const d = new UC8151Driver(Image.alloc(296, 128, 1), {
            cs: pins.GP17,
            dc: pins.GP20,
            reset: pins.GP21,
            busy: pins.GP26,

            flip: false,
            spi: spi,
        })
        await d.init()
        return d
    }
}
