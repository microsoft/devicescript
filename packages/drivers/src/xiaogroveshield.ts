import { configureHardware } from "@devicescript/servers"
import { pins } from "@dsboard/seeed_xiao_esp32c3"

/**
 *
 * Drivers for the {@link https://www.seeedstudio.com/Grove-Shield-for-Seeeduino-XIAO-p-4621.html | Grove Shield for Seeed Studio XIAO } for Raspberry Pi Pico.
 *
 * @devsPart Grove Shield for Seeed Studio XIAO
 * @devsWhenUsed
 */
export class XiaoGroveShield {
    constructor() {
        configureHardware({
            i2c: {
                pinSCL: pins.SCL_D5,
                pinSDA: pins.SDA_D4,
                kHz: 400,
            },
        })
    }
}
