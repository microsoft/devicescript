import { I2CDriver, I2CDriverError, I2CDriverOptions } from "@devicescript/i2c"
import { GPIOMode, InputPin, sleep } from "@devicescript/core"

const _STATUS_BASE = 0x00
const _GPIO_BASE = 0x01
const _SERCOM0_BASE = 0x02
const _TIMER_BASE = 0x08
const _ADC_BASE = 0x09
const _DAC_BASE = 0x0a
const _INTERRUPT_BASE = 0x0b
const _DAP_BASE = 0x0c
const _EEPROM_BASE = 0x0d
const _NEOPIXEL_BASE = 0x0e
const _TOUCH_BASE = 0x0f
const _GPIO_DIRSET_BULK = 0x02
const _GPIO_DIRCLR_BULK = 0x03
const _GPIO_BULK = 0x04
const _GPIO_BULK_SET = 0x05
const _GPIO_BULK_CLR = 0x06
const _GPIO_BULK_TOGGLE = 0x07
const _GPIO_INTENSET = 0x08
const _GPIO_INTENCLR = 0x09
const _GPIO_INTFLAG = 0x0a
const _GPIO_PULLENSET = 0x0b
const _GPIO_PULLENCLR = 0x0c
const _STATUS_HW_ID = 0x01
const _STATUS_VERSION = 0x02
const _STATUS_OPTIONS = 0x03
const _STATUS_SWRST = 0x7f
const _TIMER_STATUS = 0x00
const _TIMER_PWM = 0x01
const _TIMER_FREQ = 0x02
const _ADC_STATUS = 0x00
const _ADC_INTEN = 0x02
const _ADC_INTENCLR = 0x03
const _ADC_WINMODE = 0x04
const _ADC_WINTHRESH = 0x05
const _ADC_CHANNEL_OFFSET = 0x07
const _SERCOM_STATUS = 0x00
const _SERCOM_INTEN = 0x02
const _SERCOM_INTENCLR = 0x03
const _SERCOM_BAUD = 0x04
const _SERCOM_DATA = 0x05
const _NEOPIXEL_STATUS = 0x00
const _NEOPIXEL_PIN = 0x01
const _NEOPIXEL_SPEED = 0x02
const _NEOPIXEL_BUF_LENGTH = 0x03
const _NEOPIXEL_BUF = 0x04
const _NEOPIXEL_SHOW = 0x05
const _TOUCH_CHANNEL_OFFSET = 0x10
const _HW_ID_CODE = 0x55
const _EEPROM_I2C_ADDR = 0x3f

export const INPUT = 0x00
export const OUTPUT = 0x01
export const INPUT_PULLUP = 0x02
export const INPUT_PULLDOWN = 0x03

export interface SeesawDriverOptions extends I2CDriverOptions {
    flow?: InputPin
    reset?: boolean
}

/**
 * Adafruit Seesaw protocol driver.
 * @link from https://github.com/adafruit/Adafruit_Seesaw/blob/master/Adafruit_seesaw.cpp
 */
export class SeesawDriver {
    private readonly _driver: I2CDriver
    private readonly _flow?: InputPin
    private readonly _reset?: boolean

    private _hardwareID: number

    constructor(addr: number = 0x49, options?: SeesawDriverOptions) {
        this._driver = new I2CDriver(addr, options)
        this._flow = options?.flow
    }

    /**
     * Initializes the seesaw connection
     * @throws DriverError
     */
    async init(): Promise<void> {
        await this._driver.init()

        if (this._reset) {
            await this.softwareReset()
            await this._driver.init()
        }

        if (this._flow) this._flow.setMode(GPIOMode.Input)

        this._hardwareID = await this.read8(_STATUS_BASE, _STATUS_HW_ID)
    }

    /**
     * Triggers a software reset of the seesaw chip
     */
    private async softwareReset() {
        await this.write8(_STATUS_BASE, _STATUS_SWRST, 0xff)
    }

    /**
     * Readfs the hardware id
     * @returns
     */
    public hardwareID() {
        return this._hardwareID
    }

    /**
     * Returns the available options compiled into the seesaw firmware.
     *  @return     the available options compiled into the seesaw firmware. If the
     * option is included, the corresponding bit is set. For example, if the ADC
     * module is compiled in then (ss.getOptions() & (1UL << SEESAW_ADC_BASE)) > 0
     */
    public async options(): Promise<number> {
        const buf = Buffer.alloc(4)
        await this.read(_STATUS_BASE, _STATUS_OPTIONS, buf)
        return buf.getAt(0, "u32")
    }

    /**
     * Returns the version of the seesaw
     *  @return The version code. Bits [31:16] will be a date code, [15:0] will
     * be the product id.
     */
    public async version(): Promise<number> {
        const buf = Buffer.alloc(4)
        await this.read(_STATUS_BASE, _STATUS_VERSION, buf)
        return buf.getAt(0, "u32")
    }

    /**
     * Write 1 byte to the specified seesaw register.
     * @param regHigh the module address register (ex. SEESAW_NEOPIXEL_BASE)
     * @param regLow the function address register (ex. SEESAW_NEOPIXEL_PIN)
     * @param value value the value between 0 and 255 to write
     */
    public async write8(
        regHigh: number,
        regLow: number,
        value: number
    ): Promise<void> {
        const buf = Buffer.alloc(1)
        buf[0] = value
        await this.write(regHigh, regLow, buf)
    }

    /**
     * Write 1 byte to the specified seesaw register.
     * @param regHigh the module address register (ex. SEESAW_NEOPIXEL_BASE)
     * @param regLow the function address register (ex. SEESAW_NEOPIXEL_PIN)
     * @param buf buffer to send
     */
    public async write(regHigh: number, regLow: number, buf: Buffer) {
        const fullBuf = Buffer.alloc(2 + buf.length)
        fullBuf[0] = regHigh
        fullBuf[1] = regLow
        fullBuf.blitAt(2, buf, 0, buf.length)

        await this._driver.xfer(fullBuf, 0)
    }

    /**
     * Read 1 byte from the specified seesaw register.
     * @param regHigh the module address register (ex. SEESAW_STATUS_BASE)
     * @param regLow the function address register (ex. SEESAW_STATUS_VERSION)
     * @param delayUs a number of microseconds to delay before reading out the data. Different delay values may be necessary to ensure the seesaw chip has time to process the requested data. Defaults to 125.
     * @return the value between 0 and 255 read from the passed register
     */
    public async read8(
        regHigh: number,
        regLow: number,
        delayUs?: number
    ): Promise<number> {
        const ret = Buffer.alloc(1)
        await this.read(regHigh, regLow, ret)
        return ret[0]
    }

    /**
     * Reads a buffer from the seesaw.
     * @param regHigh the module address register (ex. SEESAW_STATUS_BASE)
     * @param regLow the function address register (ex. SEESAW_STATUS_VERSION)
     * @param buf buffer to read into
     * @param num number of bytes to read. Default is length of buf.
     * @param delayUs a number of microseconds to delay before reading out the data. Different delay values may be necessary to ensure the seesaw chip has time to process the requested data. Defaults to 125.
     * @return number of bytes read
     */
    public async read(
        regHigh: number,
        regLow: number,
        buf: Buffer,
        num?: number,
        delay?: number
    ) {
        // defaults
        if (num === undefined) num = buf.length
        if (delay === undefined) delay = 125

        if (num <= 0) return 0
        await this.write(regHigh, regLow, Buffer.alloc(0))
        if (delay > 0) await sleep(delay / 1000) // todo: delayUs

        const res = await this._driver.readBuf(num)
        buf.blitAt(0, res, 0, res.length)

        return res.length
    }
}
