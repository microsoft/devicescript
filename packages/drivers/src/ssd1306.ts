import { Image } from "@devicescript/graphics"
import { I2CDriver } from "./driver"
import { I2CDriverOptions } from "./driver"
import { Display } from "./core"
import { isSimulator } from "@devicescript/core"

// inspired by https://github.com/adafruit/Adafruit_CircuitPython_SSD1306/blob/main/adafruit_ssd1306.py

const SET_CONTRAST = 0x81
const SET_ENTIRE_ON = 0xa4
const SET_NORM_INV = 0xa6
const SET_DISP = 0xae
const SET_MEM_ADDR = 0x20
const SET_COL_ADDR = 0x21
const SET_PAGE_ADDR = 0x22
const SET_DISP_START_LINE = 0x40
const SET_SEG_REMAP = 0xa0
const SET_MUX_RATIO = 0xa8
const SET_IREF_SELECT = 0xad
const SET_COM_OUT_DIR = 0xc0
const SET_DISP_OFFSET = 0xd3
const SET_COM_PIN_CFG = 0xda
const SET_DISP_CLK_DIV = 0xd5
const SET_PRECHARGE = 0xd9
const SET_VCOM_DESEL = 0xdb
const SET_CHARGE_PUMP = 0x8d

export interface SSD1306Options extends I2CDriverOptions {
    devAddr?: 0x3d | 0x3c
    externalVCC?: boolean
    width: 128 | 96 | 64
    height: 64 | 48 | 32 | 16
}

/**
 * Driver for SSD1306 OLED displays.
 *
 * @example
 * const ssd = new SSD1306Driver({ width: 64, height: 48 })
 * await ssd.init()
 * ssd.image.print("Hello world!", 3, 10)
 * await ssd.show()
 */
export class SSD1306Driver extends I2CDriver implements Display {
    externalVCC: boolean
    framebuffer: Buffer
    image: Image

    constructor(options: SSD1306Options) {
        super(options.devAddr || 0x3d, options)
        this.framebuffer = Buffer.alloc(options.width * (options.height >> 3))
        this.image = Image.alloc(
            options.width,
            options.height,
            1,
            this.framebuffer
        )
        if (options.externalVCC) this.externalVCC = true
    }

    private async writeCmd(...cmds: number[]) {
        if (isSimulator()) return
        for (const cmd of cmds) await this.writeReg(0x80, cmd)
    }

    async reInit() {
        if (isSimulator()) return
        await this.powerOff()
        await this.writeCmd(SET_MEM_ADDR, 0x01) // Vertical
        await this.rotate(true)
        await this.writeCmd(
            SET_DISP_START_LINE,
            SET_MUX_RATIO,
            this.image.height - 1,
            SET_DISP_OFFSET,
            0x00
        )

        await this.writeCmd(
            SET_COM_PIN_CFG,
            this.image.width > 2 * this.image.height ? 0x02 : 0x12,
            SET_DISP_CLK_DIV,
            0x80
        )

        await this.writeCmd(
            SET_PRECHARGE,
            this.externalVCC ? 0x22 : 0xf1,
            SET_CHARGE_PUMP,
            this.externalVCC ? 0x10 : 0x14,
            SET_VCOM_DESEL,
            0x30
        )

        await this.setContrast(0xff)
        await this.invert(false)
        await this.show()

        await this.writeCmd(
            SET_ENTIRE_ON,
            SET_IREF_SELECT,
            0x30,
            SET_DISP | 0x01
        )
    }

    protected async initDriver() {
        await this.reInit()
    }

    async powerOff() {
        await this.writeCmd(SET_DISP)
    }

    async setContrast(contrast: number) {
        await this.writeCmd(SET_CONTRAST, contrast)
    }

    async invert(invert: boolean) {
        await this.writeCmd(SET_NORM_INV | (invert ? 1 : 0))
    }

    async rotate(rotate: boolean) {
        const r = rotate ? 1 : 0
        await this.writeCmd(SET_COM_OUT_DIR | (r << 3), SET_SEG_REMAP | r)
    }

    async show() {
        if (isSimulator()) return

        const { width, height } = this.image
        let xStart = 0
        let xEnd = width - 1

        // narrow displays use centered columns
        const off = (128 - width) >> 1
        xStart += off
        xEnd += off

        const pages = height >> 3

        await this.writeCmd(
            SET_COL_ADDR,
            xStart,
            xEnd,
            SET_PAGE_ADDR,
            0,
            pages - 1
        )
        const fb = this.framebuffer
        await this.writeRegBuf(0x40, fb)
    }
}
