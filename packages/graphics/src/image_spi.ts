import * as ds from "@devicescript/core"
import { SPI } from "@devicescript/spi"
import { Image } from "./image"

// sync with devs_objects.h
export enum SpiImageFlags {
    MODE_MASK = 0x000f,
    MODE_MONO = 0x0000,
    MODE_565 = 0x0001,
    ORDER_MASK = 0x10000,
    BY_COL = 0x00000,
    BY_ROW = 0x10000,
}

type DsSpi = typeof ds & {
    spiSendImage(image: Image, palette: Buffer, flags: number): Promise<void>
}

export interface SpiImageOptions {
    /**
     * The SPI instance to use.
     */
    spi: SPI

    /**
     * The image to send; height has to be even; only bpp==4 currently supported.
     */
    image: Image

    /**
     * Palette for the image
     */
    palette: Palette

    /**
     * Currently only MODE_565 is supported (in both BY_COL and BY_ROW modes)
     */
    flags: SpiImageFlags
}

/**
 * Send the pixels of an image over SPI bus.
 */
export async function spiSendImage(options: SpiImageOptions) {
    await (ds as DsSpi).spiSendImage(
        options.image,
        options.palette.data,
        options.flags
    )
}

export class Palette {
    readonly data: Buffer
    numColors = 16

    static arcade() {
        return new Palette(hex`
            000000 ffffff ff2121 ff93c4 ff8135 fff609 249ca3 78dc52 
            003fad 87f2ff 8e2ec4 a4839f 5c406c e5cdc4 91463d 000000
        `)
    }

    constructor(init?: Buffer) {
        this.data = Buffer.alloc(this.numColors * 3)
        if (init) this.data.set(init)
    }

    color(idx: number) {
        if (idx < 0 || idx >= this.numColors) return 0
        return (
            (this.data[3 * idx + 0] << 16) |
            (this.data[3 * idx + 1] << 8) |
            (this.data[3 * idx + 2] << 0)
        )
    }

    setColor(idx: number, color: number) {
        this.data[3 * idx + 0] = color >> 16
        this.data[3 * idx + 1] = color >> 8
        this.data[3 * idx + 2] = color >> 0
    }
}
