import { SSD1306Driver } from "@devicescript/drivers"
import {
    configureHardware,
    startButton,
    startBuzzer,
} from "@devicescript/servers"
import { pins } from "@dsboard/seeed_xiao_esp32c3"

/**
 *
 * Drivers for the {@link https://wiki.seeedstudio.com/Seeeduino-XIAO-Expansion-Board/ | Seeeduino XIAO Expansion Board } for Raspberry Pi Pico.
 *
 * @devsWhenUsed
 */
export class XiaoExpansionBoard {
    constructor() {
        configureHardware({
            i2c: {
                pinSCL: pins.SCL_D5,
                pinSDA: pins.SDA_D4,
                kHz: 400,
            },
        })
    }

    async startDisplay() {
        const disp = new SSD1306Driver({
            devAddr: 0x3c,
            width: 128,
            height: 64,
        })
        await disp.init()
        return disp
    }

    startBuzzer() {
        return startBuzzer({
            pin: pins.A3_D3,
        })
    }

    startButton() {
        return startButton({
            pin: pins.A1_D1,
        })
    }
}
