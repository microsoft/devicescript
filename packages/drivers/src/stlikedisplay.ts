import {
    GPIOMode,
    OutputPin,
    assert,
    delay,
    isSimulator,
} from "@devicescript/core"
import { SPI, spi } from "@devicescript/spi"
import {
    Display,
    Image,
    SpiImageFlags,
    spiSendImage,
    Palette,
} from "@devicescript/graphics"
import "@devicescript/gpio"

const ST7735_CASET = 0x2a
const ST7735_RASET = 0x2b
const ST7735_RAMWR = 0x2c
const ST7735_MADCTL = 0x36
const ST7735_FRMCTR1 = 0xb1

export interface FourWireOptions {
    /**
     * SPI CS pin
     */
    cs: OutputPin

    /**
     * Pin for switching between command and data (D/C or RS).
     */
    dc: OutputPin

    /**
     * SPI bus instance to use
     */
    spi?: SPI

    /**
     * Pin for resetting the display.
     */
    reset?: OutputPin
}

export interface STLikeDisplayOptions extends FourWireOptions {
    /**
     * Flip the display 180 deg.
     * Without flipping, the connector ribbon of the screen should be on the top or left.
     */
    flip?: boolean

    /**
     * FRMCTR1 display register setting. Three bytes encoded as big endian number.
     *
     * @default 0x00_06_03
     */
    frmctr1?: number

    /**
     * X-offset of the matrix.
     *
     * @default 0
     */
    offX?: number

    /**
     * Y-offset of the matrix.
     *
     * @default 0
     */
    offY?: number
}

export class FourWireDriver<OPT extends FourWireOptions> {
    constructor(public options: OPT) {}

    protected async sendSeq(seq: Buffer) {
        let i = 0
        while (i < seq.length) {
            const cmd = seq[i++]
            const len = seq[i++]
            const args: number[] = []
            for (let j = 0; j < (len & 0x7f); ++j) args.push(seq[i++])
            let delayMS = 0
            if (len & 0x80) {
                delayMS = seq[i++]
                if (delayMS === 0xff) delayMS = 500
            }
            await this.sendCmd(cmd, ...args)
            if (delayMS) await delay(delayMS)
        }
    }

    protected async cmdPrep(cmd: number) {
        const { spi, cs, dc } = this.options
        dc.write(0)
        cs.write(0)
        await spi.write(Buffer.from([cmd]))
        dc.write(1)
    }

    protected async cmdFinish() {
        const { cs } = this.options
        cs.write(1)
    }

    protected async sendCmd(cmd: number, ...args: number[]) {
        if (isSimulator()) return
        const { spi } = this.options
        await this.cmdPrep(cmd)
        if (args.length) await spi.write(Buffer.from(args))
        await this.cmdFinish()
    }

    protected async initPins() {
        if (isSimulator()) return
        const { cs, dc, reset } = this.options

        if (reset) {
            reset.setMode(GPIOMode.OutputLow)
            await delay(20)
            reset.setMode(GPIOMode.OutputHigh)
            await delay(20)
        }

        dc.setMode(GPIOMode.OutputHigh)
        cs.setMode(GPIOMode.OutputHigh)
    }
}

export class STLikeDisplayDriver
    extends FourWireDriver<STLikeDisplayOptions>
    implements Display
{
    public readonly palette: Palette
    private rot = 0

    constructor(
        public image: Image,
        options: STLikeDisplayOptions,
        protected initSeq: Buffer
    ) {
        super(options)
        assert(image.bpp === 4)
        this.options = Object.assign({}, this.options)
        if (this.options.frmctr1 == undefined) this.options.frmctr1 = 0x000603
        if (this.options.spi == undefined) this.options.spi = spi

        this.palette = Palette.arcade()
        if (image.width > image.height) this.rot = 1
        if (this.options.flip) this.rot |= 2
    }

    private async setAddrWindow(x: number, y: number, w: number, h: number) {
        w += x - 1
        h += y - 1
        await this.sendCmd(ST7735_RASET, 0, x, w >> 8, w & 0xff)
        await this.sendCmd(ST7735_CASET, 0, y, h >> 8, h & 0xff)
    }

    private async doInit() {
        await this.initPins()
        await this.sendSeq(this.initSeq)

        await this.sendCmd(ST7735_MADCTL, hex`00 40 C0 80`[this.rot])
        const frmctr1 = [
            this.options.frmctr1 >> 16,
            (this.options.frmctr1 >> 8) & 0xff,
            this.options.frmctr1 & 0xff,
        ]
        if (frmctr1[2] === 0xff) frmctr1.pop()
        await this.sendCmd(ST7735_FRMCTR1, ...frmctr1)

        const offX = this.options.offX ?? 0
        const offY = this.options.offY ?? 0

        if (this.rot & 1)
            await this.setAddrWindow(
                offX,
                offY,
                this.image.width,
                this.image.height
            )
        else
            await this.setAddrWindow(
                offY,
                offX,
                this.image.height,
                this.image.width
            )
    }

    async init() {
        await this.doInit()
    }

    async show() {
        if (isSimulator()) return

        const { spi } = this.options
        await this.cmdPrep(ST7735_RAMWR)

        let flags = SpiImageFlags.MODE_565

        if (this.rot & 1) flags |= SpiImageFlags.BY_COL
        else flags |= SpiImageFlags.BY_ROW

        await spiSendImage({
            spi,
            image: this.image,
            palette: this.palette,
            flags,
        })

        await this.cmdFinish()
    }
}
