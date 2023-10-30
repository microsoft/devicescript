import { Display, Image, Palette } from "@devicescript/graphics"
import { I2CDriver, I2CDriverOptions } from "./driver"
import { delay, isSimulator } from "@devicescript/core"

// inspired by https://github.com/adafruit/Adafruit_SH110x
// Datasheet: https://www.pololu.com/file/0J1813/SH1106.pdf

const DEFAULT_ADDRESS = 0x3c
const SH110X_MEMORYMODE = 0x20
const SH110X_SETCONTRAST = 0x81
const SH110X_SEGREMAP = 0xa0
const SH110X_DISPLAYALLON_RESUME = 0xa4
const SH110X_NORMALDISPLAY = 0xa6
const SH110X_SETMULTIPLEX = 0xa8
const SH110X_DCDC = 0xad
const SH110X_DISPLAYOFF = 0xae
const SH110X_DISPLAYON = 0xaf
const SH110X_SETPAGEADDR = 0xb0
const SH110X_COM_SCAN_DIR = 0xc0
const SH110X_COMSCANDEC = 0xc8
const SH110X_SETDISPLAYOFFSET = 0xd3
const SH110X_SETDISPLAYCLOCKDIV = 0xd5
const SH110X_SETPRECHARGE = 0xd9
const SH110X_SETCOMPINS = 0xda
const SH110X_SETVCOMDETECT = 0xdb

const SH110X_SETHIGHCOLUMN = 0x10 //< Column address, higher 4 bits
const SH110X_SETLOWCOLUMN = 0x02 //< Column address, lower 4 bits, offset by 2 px
const SH110X_SETSTARTLINE = 0x40

export interface SH110XOptions extends I2CDriverOptions {
    devAddr?: 0x3d | 0x3c
    externalVCC?: boolean
    width: 128 | 96 | 64
    height: 128 | 64 | 48 | 32 | 16 // SH1107 has a height of 128 px
}

/**
 * Driver for SH1106 and SH1107 OLED displays.
 *
 * @example
 * const sh = new SH110XDriver({ width: 128, height: 64 })
 * await sh.init()
 * sh.image.print("Hello world!", 3, 10)
 * await sh.show()
 */
export class SH110XDriver extends I2CDriver implements Display {
    externalVCC: boolean
    palette: Palette
    image: Image

    constructor(options: SH110XOptions) {
        super(options.devAddr || DEFAULT_ADDRESS, options)
        this.palette = Palette.monochrome()
        const framebuffer = Buffer.alloc(options.width * (options.height >> 3)) // Right shift height 3x as each page uses a byte per column to represent it's 8 pixels in height. See datasheet P16
        this.image = Image.alloc(options.width, options.height, 1, framebuffer)
        if (options.externalVCC) {
            this.externalVCC = true
        }
    }

    private async writeCmd(c: number) {
        await this.writeReg(0x00, c) //  0x00: data byte(s) to follow, interpret as command(s). Datasheet P14, Co and D/C bits.
    }

    private async writeCmdList(c: number[]) {
        await this.writeRegBuf(0x00, Buffer.from(c))
    }

    async reInit() {
        if (isSimulator()) return

        await this.writeCmdList([
            SH110X_DISPLAYOFF,
            SH110X_SETDISPLAYCLOCKDIV,
            0x80,
            SH110X_SETMULTIPLEX,
            0x3f,
            SH110X_SETDISPLAYOFFSET,
            0x00,
            SH110X_SETSTARTLINE,
            SH110X_DCDC,
            0x8b,
            SH110X_SEGREMAP + 1,
            SH110X_COM_SCAN_DIR | (1 << 3),
            SH110X_COMSCANDEC,
            SH110X_SETCOMPINS,
            0x12,
            SH110X_SETCONTRAST,
            0xff,
            SH110X_SETPRECHARGE,
            0x1f,
            SH110X_SETVCOMDETECT,
            0x40,
            0x33,
            SH110X_NORMALDISPLAY,
            SH110X_MEMORYMODE,
            0x10,
            SH110X_DISPLAYALLON_RESUME,
        ])
        await delay(100)
        await this.writeCmd(SH110X_DISPLAYON)
    }

    protected async initDriver() {
        await this.reInit()
    }

    async powerOff() {
        await this.writeCmd(SH110X_DISPLAYOFF)
    }

    /**
     *
     * @param contrast 0 to 255
     */
    async setContrast(contrast: number) {
        await this.writeCmdList([SH110X_SETCONTRAST, contrast])
    }

    /**
     * @description Invert light and dark pixels
     *
     */
    async invert(invert: boolean) {
        const i = invert ? 1 : 0
        await this.writeCmd(SH110X_NORMALDISPLAY | i)
    }

    /**
     * @description Rotate screen content by 180 degrees. Fully effective on next show()
     *
     */
    async rotate(rotate: boolean) {
        const r = rotate ? 0 : 1
        await this.writeCmdList([
            SH110X_SEGREMAP | r, // in effect on next show()
            SH110X_COM_SCAN_DIR | (r << 3), // immediate effect once received
        ])
    }

    /**
     *  @description Show changes made to the image buffer on the screen.
     */
    async show() {
        if (isSimulator()) return

        for (let p = 0; p < 8; p++) {
            await this.writeCmdList([
                SH110X_SETPAGEADDR + p,
                SH110X_SETHIGHCOLUMN,
                SH110X_SETLOWCOLUMN,
            ])

            // Remap Vertical Addressing Mode used by the image buffer (and the SSD1306), to Page Addressing Mode used by SH110X
            // Vertical addressing explanation on page 34: https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf
            // Page Addressing explanation on page 35: https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf
            let pageBytes: number[] = []
            for (let i = 0; i < 128; i++) {
                pageBytes.push(this.image.buffer[i * 8 + p])
            }
            await this.writeRegBuf(0x40, Buffer.from(pageBytes)) // 0x40: Last control byte, only data bytes to follow. Interpret data bytes as RAM operations
        }
    }
}
