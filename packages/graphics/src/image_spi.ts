import * as ds from "@devicescript/core"
import { SPI } from "@devicescript/spi"
import { Image } from "./image"
import { Palette } from "./palette"

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
        options.palette.buffer,
        options.flags
    )
}
