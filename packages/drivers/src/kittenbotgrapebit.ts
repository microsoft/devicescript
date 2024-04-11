import { configureHardware } from "@devicescript/servers"
import { pins, board } from "@dsboard/kittenbot_grapebit_esp32c3"
import { startAccelerometer } from "./accelerometer"
import { DA213BDriver } from "./da213b"
/**
 * Support for KittenBot Grape:bit ESP32-C3
 *
 * @url https://www.kittenbot.cc/products/kittenbot-grapebit
 * @devsPart KittenBot Grape:bit ESP32-C3
 * @devsWhenUsed
 */
export class KittenBotGrapeBit {
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

    /**
     * Start built-in ButtonA
     * @returns button client
     */
    startButtonA() {
        return board.startButtonA("A")
    }

    /**
     * Start built-in ButtonB
     * @returns button client
     */
    startButtonB() {
        return board.startButtonB("B")
    }

    /**
     * Start built-in Motor 1 (M1)
     * @returns motor client
     */
    startMotor1() {
        return board.startM1("M1")
    }

    /**
     * Start built-in Motor 2 (M2)
     * @returns motor client
     */
    startMotor2() {
        return board.startM2("M2")
    }

    /**
     * Start built-in Buzzer
     * @returns buzzer client
     */
    startBuzzer() {
        return board.startMusic("Music")
    }

    /**
     * Starts the accelerometer
     * @returns accelerometer client
     */
    async startAccelerometer() {
        const driver = new DA213BDriver()
        await driver.init()
        const acc = await startAccelerometer(driver, {})
        return acc
    }
}
