import { GPIOMode, OutputPin, assert, delay } from "@devicescript/core"
import { SPI, spi } from "@devicescript/spi"
import {
    Image,
    Palette,
    SpiImageFlags,
    spiSendImage,
} from "@devicescript/graphics"
import "@devicescript/gpio"
import { Display } from "./core"

const ST7735_NOP = 0x00
const ST7735_SWRESET = 0x01
const ST7735_RDDID = 0x04
const ST7735_RDDST = 0x09
const ST7735_SLPIN = 0x10
const ST7735_SLPOUT = 0x11
const ST7735_PTLON = 0x12
const ST7735_NORON = 0x13
const ST7735_INVOFF = 0x20
const ST7735_INVON = 0x21
const ST7735_DISPOFF = 0x28
const ST7735_DISPON = 0x29
const ST7735_CASET = 0x2a
const ST7735_RASET = 0x2b
const ST7735_RAMWR = 0x2c
const ST7735_RAMRD = 0x2e
const ST7735_PTLAR = 0x30
const ST7735_COLMOD = 0x3a
const ST7735_MADCTL = 0x36
const ST7735_FRMCTR1 = 0xb1
const ST7735_FRMCTR2 = 0xb2
const ST7735_FRMCTR3 = 0xb3
const ST7735_INVCTR = 0xb4
const ST7735_GMCTRP1 = 0xe0
const ST7735_GMCTRN1 = 0xe1
const MADCTL_MY = 0x80
const MADCTL_MX = 0x40
const MADCTL_MV = 0x20
const MADCTL_ML = 0x10
const MADCTL_RGB = 0x00
const MADCTL_BGR = 0x08
const MADCTL_MH = 0x04

export interface ST7735Options {
    /**
     * SPI CS pin
     */
    cs: OutputPin

    /**
     * Pin for switching between command and data (D/C or RS).
     */
    dc: OutputPin

    /**
     * Pin for resetting the display.
     * TODO use this
     */
    reset?: OutputPin

    /**
     * SPI bus instance to use
     */
    spi?: SPI

    /**
     * MADCTL display register setting.
     *
     * @default 0x40
     */
    madctl?: number

    /**
     * FRMCTR1 display register setting. Three bytes encoded as big endian number.
     *
     * @default 0x00_06_03
     */
    frmctr1?: number
}

export class ST7735Driver implements Display {
    public readonly palette: Palette

    constructor(public image: Image, public options: ST7735Options) {
        assert(image.bpp === 4)
        this.options = Object.assign({}, this.options)
        if (this.options.frmctr1 == undefined) this.options.frmctr1 = 0x000603
        if (this.options.madctl == undefined) this.options.madctl = 0x40
        if (this.options.spi == undefined) this.options.spi = spi

        this.palette = Palette.arcade()
    }

    private async cmdPrep(cmd: number) {
        const { spi, cs, dc } = this.options
        await dc.write(0)
        await cs.write(0)
        await spi.write(Buffer.from([cmd]))
        await dc.write(1)
    }

    private async sendCmd(cmd: number, ...args: number[]) {
        const { spi, cs } = this.options
        await this.cmdPrep(cmd)
        if (args.length) await spi.write(Buffer.from(args))
        await cs.write(1)
    }

    private async setAddrWindow(x: number, y: number, w: number, h: number) {
        await this.sendCmd(ST7735_RASET, 0, x, w >> 8, w & 0xff)
        await this.sendCmd(ST7735_CASET, 0, y, h >> 8, h & 0xff)
    }

    private async doInit() {
        const { cs, dc, reset } = this.options

        if (reset) {
            await reset.setMode(GPIOMode.OutputLow)
            await delay(20)
            await reset.setMode(GPIOMode.OutputHigh)
            await delay(20)
        }

        await dc.setMode(GPIOMode.OutputHigh)
        await cs.setMode(GPIOMode.OutputHigh)

        await this.sendCmd(ST7735_SWRESET)
        await delay(120)
        await this.sendCmd(ST7735_SLPOUT)
        await delay(120)
        await this.sendCmd(ST7735_INVOFF)
        await this.sendCmd(ST7735_COLMOD, 3) // 16-bit
        await this.sendCmd(ST7735_NORON)
        await delay(10)
        await this.sendCmd(ST7735_DISPON)
        await delay(10)

        await this.sendCmd(ST7735_MADCTL, this.options.madctl)
        const frmctr1 = [
            this.options.frmctr1 >> 16,
            (this.options.frmctr1 >> 8) & 0xff,
            this.options.frmctr1 & 0xff,
        ]
        if (frmctr1[2] === 0xff) frmctr1.pop()
        await this.sendCmd(ST7735_FRMCTR1, ...frmctr1)

        await this.setAddrWindow(0, 0, this.image.width, this.image.height)
    }

    async init() {
        await this.doInit()
    }

    async show() {
        const { spi, cs } = this.options
        await this.cmdPrep(ST7735_RAMWR)

        await spiSendImage({
            spi,
            image: this.image,
            palette: this.palette,
            flags: SpiImageFlags.BY_ROW | SpiImageFlags.MODE_565,
        })

        await cs.write(1)
    }
}
