import { LightLevelVariant, PotentiometerVariant } from "@devicescript/core"
import {
    configureHardware,
    startButton,
    startBuzzer,
    startLightBulb,
    startLightLevel,
    startMotor,
    startPotentiometer,
    startRelay,
    startServo,
} from "@devicescript/servers"
import { pins } from "@dsboard/pico_w"
import { SSD1306Driver } from "@devicescript/drivers"

/**
 * Drivers for the {@link https://shop.robotistan.com/products/pico-bricks | Pico Bricks } shield for Raspberry Pi Pico ({@link https://github.com/Robotistan/PicoBricks/tree/main/Documents | datasheets}).
 *
 * @devsPart Pico Bricks for Raspberry Pi Pico
 * @devsWhenUsed
 */
export class PicoBricks {
    constructor() {
        configureHardware({
            scanI2C: false,
            i2c: {
                pinSDA: pins.GP4,
                pinSCL: pins.GP5,
            },
        })
    }
    /**
     * Starts the driver for the BUTTON
     * @returns a button service client
     */
    startButton() {
        // GP10
        return startButton({
            pin: pins.GP10,
            activeHigh: true,
        })
    }

    /**
     * Starts the driver for the LED-BUTTON
     * @returns lightbulb service client
     */
    startLED() {
        return startLightBulb({
            pin: pins.GP7,
        })
    }

    /**
     * Starts the driver for the RELAY
     * @returns relay service client
     */
    startRelay() {
        return startRelay({
            pin: pins.GP12,
            maxCurrent: 5000,
        })
    }

    /**
     * Starts a motor on MOTOR1
     * @returns
     */
    startMotor1() {
        return startMotor({
            pin1: pins.GP21,
        })
    }

    /**
     * Starts a motor on MOTOR2
     * @returns
     */
    startMotor2() {
        return startMotor({
            pin1: pins.GP22,
        })
    }

    /**
     * Starts a servo on SV1
     * @param id
     * @returns
     */
    startServo1() {
        return startServo({
            pin: pins.GP21,
        })
    }

    /**
     * Starts a servo on SV2
     * @param id
     * @returns
     */
    startServo2() {
        return startServo({
            pin: pins.GP22,
        })
    }

    /**
     * Starts the buzzer driver
     * @returns buzzer client service
     */
    startBuzzer() {
        return startBuzzer({
            pin: pins.GP20,
        })
    }

    /**
     * Starts the light level sensor
     * @returns light level service client
     */
    startLightSensor() {
        return startLightLevel({
            pin: pins.GP27,
            variant: LightLevelVariant.PhotoResistor,
        })
    }

    /**
     * Start potentiometer driver
     * @returns potentiometer service driver
     */
    startPotentiometer() {
        return startPotentiometer({
            pin: pins.GP26,
            variant: PotentiometerVariant.Rotary,
        })
    }

    /**
     * Starts the OLED screen driver
     * @returns
     */
    async startOLED() {
        const oled = new SSD1306Driver({
            devAddr: 0x3c,
            width: 128,
            height: 64,
        })
        await oled.init()
        return oled
    }
}
