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

/**
 * Send the pixels of an image over SPI bus.
 * 
 * @param spi the SPI instance to use
 * @param img the image to send; height has to be even; only bpp==4 currently supported
 * @param palette palette for the image - 3 bytes per color index
 * @param flags currently only MODE_565 is supported (in both BY_COL and BY_ROW modes)
 */
export async function spiSendImage(
    spi: SPI,
    img: Image,
    palette: Buffer,
    flags: SpiImageFlags
) {
    await (ds as DsSpi).spiSendImage(img, palette, flags)
}
