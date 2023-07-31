import * as ds from "@devicescript/core"
import { SPI } from "@devicescript/spi"
import { Image } from "./image"
import { Palette } from "@devicescript/runtime"

// sync with devs_objects.h
export enum SpiImageFlags {
    MODE_MASK = 0x000f,
    MODE_MONO = 0x0000,
    MODE_565 = 0x0001,
    MODE_MONO_REV = 0x0002,
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
     * Currently modes (in both BY_COL and BY_ROW modes):
     * - MODE_565 with bpp=4
     * - MODE_MONO and MODE_MONO_REV with bpp=1
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
